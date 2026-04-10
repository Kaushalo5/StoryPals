import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import type { ChildInfo } from "./src/types";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per window

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimit.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

interface StoryData {
  title: string;
  pages: { text: string; imagePrompt: string }[];
}

interface StoryImagesRequest {
  pages: { text: string; imagePrompt: string }[];
  info: ChildInfo;
  startIndex: number;
  count: number;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function validateChildInfo(info: Partial<ChildInfo> | undefined): info is ChildInfo {
  if (!info?.name || !info?.gender || !info?.category) {
    return false;
  }

  // Validate name length
  if (info.name.length < 1 || info.name.length > 50) {
    return false;
  }

  // Validate adult name if provided
  if (info.adultName && (info.adultName.length < 1 || info.adultName.length > 50)) {
    return false;
  }

  // Validate photo data if provided
  if (info.childPhoto && !isValidBase64Image(info.childPhoto)) {
    return false;
  }

  if (info.adultPhoto && !isValidBase64Image(info.adultPhoto)) {
    return false;
  }

  return true;
}

function isValidBase64Image(data: string): boolean {
  // Check if it's a valid base64 data URL for images
  const maxSize = 5 * 1024 * 1024; // 5MB limit
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  try {
    if (!data.startsWith('data:image/')) {
      return false;
    }

    const [header, base64Data] = data.split(',');
    if (!header || !base64Data) {
      return false;
    }

    // Check MIME type
    const mimeType = header.split(':')[1]?.split(';')[0];
    if (!allowedTypes.includes(mimeType)) {
      return false;
    }

    // Check file size (rough estimate)
    const sizeInBytes = (base64Data.length * 3) / 4;
    if (sizeInBytes > maxSize) {
      return false;
    }

    // Validate base64 format
    return /^[A-Za-z0-9+/]*={0,2}$/.test(base64Data);
  } catch {
    return false;
  }
}

async function generateImageWithRetry(
  prompt: string,
  childPhoto?: string,
  adultPhoto?: string,
  retries = 5
): Promise<string> {
  const model = "gemini-2.5-flash-image";

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const parts: any[] = [
        {
          text: `A beautiful, full-bleed, whimsical children's book illustration. The style is soft, painterly, and heartwarming. Scene: ${prompt}`,
        },
      ];

      if (childPhoto) {
        parts.push({
          inlineData: {
            data: childPhoto.split(",")[1],
            mimeType: "image/jpeg",
          },
        });
      }

      if (adultPhoto) {
        parts.push({
          inlineData: {
            data: adultPhoto.split(",")[1],
            mimeType: "image/jpeg",
          },
        });
      }

      const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: "4:3",
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    } catch (error: any) {
      const errorStr = JSON.stringify(error);
      const isRateLimit =
        errorStr.includes("429") ||
        errorStr.includes("RESOURCE_EXHAUSTED") ||
        error?.status === "RESOURCE_EXHAUSTED";

      if (isRateLimit && attempt < retries - 1) {
        await wait(Math.pow(2, attempt) * 5000);
        continue;
      }

      console.error(`Image generation failed on attempt ${attempt + 1}:`, error);
      if (attempt === retries - 1) {
        break;
      }
    }
  }

  return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1200/900`;
}

async function describeCharactersFromPhotos(
  childPhoto?: string,
  adultPhoto?: string
): Promise<string> {
  if (!childPhoto && !adultPhoto) {
    return "a child and their family member";
  }

  const model = "gemini-1.5-pro";
  const parts: any[] = [
    {
      text: "Describe the people in these photos for a children's storybook. Focus on their appearance, relationship, and any unique features. Keep it short and whimsical.",
    },
  ];

  if (childPhoto) {
    parts.push({
      inlineData: {
        data: childPhoto.split(",")[1],
        mimeType: "image/jpeg",
      },
    });
  }

  if (adultPhoto) {
    parts.push({
      inlineData: {
        data: adultPhoto.split(",")[1],
        mimeType: "image/jpeg",
      },
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
  });

  return response.text || "a child and their family member";
}

async function generateStoryText(info: ChildInfo): Promise<StoryData> {
  const model = "gemini-1.5-pro";

  let characterContext = info.description || "";
  if (!characterContext || info.category === "surprise") {
    const photoDescription = await describeCharactersFromPhotos(info.childPhoto, info.adultPhoto);
    characterContext = `${characterContext}. ${photoDescription}`.trim();
  }

  const categoryPrompts = {
    "father-child": `a heartwarming story about a father and his ${info.gender} child named ${info.name}. The father's name is ${info.adultName || "Dad"}. Focus on their special bond and everyday moments.`,
    "grandma-child": `a sweet story about a grandmother and her ${info.gender} grandchild named ${info.name}. The grandmother's name is ${info.adultName || "Grandma"}. Focus on wisdom, love, and shared memories.`,
    siblings: `a fun and touching story about ${info.name} (a ${info.gender}) and their sibling ${info.adultName || "Buddy"} (a ${info.adultGender || "child"}). Focus on their friendship, playfulness, and growing up together.`,
    surprise: `a magical and heartwarming story about ${info.name} and their family member ${info.adultName || "Buddy"}. Let the story be a surprise adventure based on their relationship.`,
  };

  const prompt = `Create a personalized children's story for ${categoryPrompts[info.category]}.
  Character Description: ${characterContext}.
  
  CRITICAL INSTRUCTIONS:
  1. ONLY include the characters provided in the description and photos (${info.name} and ${info.adultName}).
  2. DO NOT introduce any other major characters or family members.
  3. The story should focus strictly on the interaction between these two characters.
  4. The story should have exactly 10 pages. Each page should be a short, poetic, or heartwarming sentence or two suitable for a high-quality children's book.
  5. Provide a title for the story.
  
  Return the story in JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          pages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "The story text for this page" },
                imagePrompt: {
                  type: Type.STRING,
                  description:
                    "A detailed descriptive prompt for an illustrator. Describe the scene, the characters' expressions, and the setting. Ensure the characters look consistent with the provided descriptions.",
                },
              },
              required: ["text", "imagePrompt"],
            },
          },
        },
        required: ["title", "pages"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

async function generatePageImages({
  pages,
  info,
  startIndex,
  count,
}: StoryImagesRequest): Promise<{ text: string; imageUrl: string }[]> {
  const pagesWithImages = [];
  const batchSize = 1;
  const endIndex = Math.min(startIndex + count, pages.length);
  const targetPages = pages.slice(startIndex, endIndex);

  for (let i = 0; i < targetPages.length; i += batchSize) {
    const batch = targetPages.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (page) => {
        const imageUrl = await generateImageWithRetry(
          page.imagePrompt,
          info.childPhoto,
          info.adultPhoto
        );
        return {
          text: page.text,
          imageUrl,
        };
      })
    );
    pagesWithImages.push(...batchResults);

    if (i + batchSize < targetPages.length) {
      await wait(3000);
    }
  }

  return pagesWithImages;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  let razorpay: Razorpay | null = null;
  const getRazorpay = () => {
    if (!razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    }
    return razorpay;
  };

  app.use(express.json({ limit: "50mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.post("/api/story-text", async (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress || "unknown";

    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        error: "Too many requests. Please try again later."
      });
    }

    const info = req.body?.info as Partial<ChildInfo> | undefined;
    if (!validateChildInfo(info)) {
      return res.status(400).json({ error: "Missing required child info" });
    }

    try {
      const story = await generateStoryText(info);
      res.json(story);
    } catch (error: any) {
      console.error("Story text generation failed:", error);
      res.status(500).json({ error: error?.message || "Failed to generate story text" });
    }
  });

  app.post("/api/story-images", async (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress || "unknown";

    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        error: "Too many requests. Please try again later."
      });
    }

    const body = req.body as Partial<StoryImagesRequest> | undefined;

    if (
      !body ||
      !Array.isArray(body.pages) ||
      !validateChildInfo(body.info) ||
      typeof body.startIndex !== "number" ||
      typeof body.count !== "number"
    ) {
      return res.status(400).json({ error: "Invalid story image request" });
    }

    try {
      const pages = await generatePageImages(body as StoryImagesRequest);
      res.json({ pages });
    } catch (error: any) {
      console.error("Story image generation failed:", error);
      res.status(500).json({ error: error?.message || "Failed to generate story images" });
    }
  });

  app.post("/api/create-order", async (req, res) => {
    const r = getRazorpay();
    if (!r) {
      return res.status(500).json({ error: "Razorpay is not configured" });
    }

    try {
      const { storyTitle } = req.body;
      const options = {
        amount: 79900,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          storyTitle,
          description: "Unlock all 10 pages and download the PDF",
        },
      };

      const order = await r.orders.create(options);
      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error: any) {
      console.error("Razorpay error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/verify-payment", async (req, res) => {
    const r = getRazorpay();
    if (!r) {
      return res.status(500).json({ error: "Razorpay is not configured" });
    }

    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({ error: "Missing payment verification data" });
      }

      // Verify payment signature
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(sign.toString())
        .digest("hex");

      if (razorpay_signature === expectedSign) {
        res.json({
          status: "success",
          message: "Payment verified successfully",
          paymentId: razorpay_payment_id
        });
      } else {
        res.status(400).json({
          status: "failed",
          message: "Payment verification failed"
        });
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
