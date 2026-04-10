import { Story, ChildInfo } from "../types";

export interface StoryData {
  title: string;
  pages: { text: string; imagePrompt: string }[];
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function generateStoryText(info: ChildInfo): Promise<StoryData> {
  return postJson<StoryData>("/api/story-text", { info });
}

export async function generatePageImages(
  pages: { text: string; imagePrompt: string }[],
  info: ChildInfo,
  startIndex: number,
  count: number,
  onProgress?: (current: number, total: number) => void
): Promise<{ text: string; imageUrl: string }[]> {
  const result = await postJson<{ pages: { text: string; imageUrl: string }[] }>("/api/story-images", {
    pages,
    info,
    startIndex,
    count,
  });

  if (onProgress) {
    const total = pages.length;
    result.pages.forEach((_, index) => {
      onProgress(startIndex + index + 1, total);
    });
  }

  return result.pages;
}

export async function generateStory(info: ChildInfo): Promise<Story> {
  const storyData = await generateStoryText(info);
  const pagesWithImages = await generatePageImages(storyData.pages, info, 0, storyData.pages.length);

  return {
    title: storyData.title,
    pages: pagesWithImages,
    category: info.category,
  };
}
