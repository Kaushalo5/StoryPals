# 🎨 StoryPals — AI-Powered Children's Storybook Creator

<div align="center">

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=20232A)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24.14.1-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21.2-000000?style=flat-square&logo=express&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=flat-square&logo=google&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.14-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Security](https://img.shields.io/badge/Security-Verified-4CAF50?style=flat-square&logo=security&logoColor=white)

**Transform family photos into personalized, AI-illustrated children's storybooks.**  
Upload a photo, enter some names, and watch as a 10-page adventure comes to life — starring your loved ones.

[✨ Features](#-features) • [🚀 Quick Start](#-quick-start) • [🛡️ Security](#-security) • [🛠️ Tech Stack](#%EF%B8%8F-tech-stack) • [⚙️ Configuration](#%EF%B8%8F-configuration) • [🤝 Contributing](#-contributing)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎭 **Personalized Characters** | Stories built around your actual family members, using their names and likenesses |
| 🖼️ **Photo-Based Illustrations** | Upload photos so the AI generates artwork that reflects the real people |
| 📖 **10-Page Story Arc** | Full narrative structure with a beginning, middle, and end — not just a one-pager |
| 🎨 **Children's Book Art Style** | Illustrations rendered in a warm, whimsical style suitable for all ages |
| 💳 **Secure Payment Flow** | Preview first 3 pages; unlock complete story via verified Razorpay payments |
| 📱 **Fully Responsive** | Smooth experience on phones, tablets, and desktops |
| 🛡️ **Enterprise Security** | Rate limiting, input validation, and secure API key management |
| ⚡ **Real-time Generation** | Fast AI-powered story and image creation |

---

## 🛡️ Security & Trust

**StoryPals takes security seriously:**

- 🔐 **Payment Verification** - All transactions verified with cryptographic signatures
- 🚦 **Rate Limiting** - 10 requests per 15 minutes prevents abuse and cost overrun
- ✅ **Input Validation** - Photo uploads validated for size (5MB), type, and format
- 🔑 **API Key Protection** - Keys never exposed to client-side code
- 🧹 **Data Sanitization** - All user inputs validated and sanitized

**Recent Security Updates (v1.1.0):**
- Fixed payment verification bypass vulnerability
- Corrected AI model references for reliable generation
- Added comprehensive rate limiting
- Enhanced photo upload validation

---

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- A **Google Gemini API key** — get one free at [Google AI Studio](https://makersuite.google.com/app/apikey)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/Kaushalo5/StoryPals.git
cd StoryPals

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
```

Open `.env` and fill in your key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

```bash
# 4. Start the dev server
npm run dev
```

Visit `http://localhost:3000` — you're ready to create your first story.

---

## 📖 How It Works

### Story Creation in 5 Steps

```
1. Choose a Story Type   →   2. Upload Photos   →   3. Enter Names & Details
         ↓
5. Preview & Unlock Full Story   ←   4. AI Generates Story + Illustrations
```

### Story Categories

| Category | Theme |
|---|---|
| 👨‍👧 **Father & Child** | Heartwarming adventures between dads and their kids |
| 👵 **Grandma & Child** | Tender tales of grandmothers sharing wisdom and wonder |
| 🧒🧒 **Siblings** | Fun, competitive, and loving journeys between brothers and sisters |
| ✨ **Surprise Me** | Let the AI invent something entirely unexpected |

---

## 🛠️ Tech Stack

### Frontend

- **[React 19](https://react.dev/)** — Modern React with hooks and concurrent rendering
- **[TypeScript](https://www.typescriptlang.org/)** — Full static typing across the codebase
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling with custom brand tokens
- **[Framer Motion](https://www.framer.com/motion/)** — Page transitions and micro-animations
- **[Lucide React](https://lucide.dev/)** — Clean, consistent icon set
- **[React Markdown](https://github.com/remarkjs/react-markdown)** — Renders AI-generated narrative text

### Backend

- **[Express.js](https://expressjs.com/)** — Lightweight REST API layer
- **[Google Gemini AI](https://ai.google.dev/)** — Drives both story text and image generation
- **[Razorpay](https://razorpay.com/)** — Payment order creation and verification *(optional)*
- **[TypeScript](https://www.typescriptlang.org/)** — Shared type safety between client and server

### Tooling

- **[Vite](https://vitejs.dev/)** — Fast dev server and production bundler
- **[tsx](https://github.com/privatenumber/tsx)** — TypeScript execution for the dev server
- **[ESLint](https://eslint.org/)** — Code quality and consistency

---

## 📁 Project Structure

```
StoryPals/
├── src/
│   ├── components/
│   │   ├── BookCreator.tsx     # Multi-step story creation form
│   │   └── BookViewer.tsx      # Page-by-page story reader with navigation
│   ├── services/
│   │   └── ai.ts               # HTTP client for backend API calls
│   ├── types.ts                # Shared TypeScript interfaces
│   ├── App.tsx                 # Root component and routing logic
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global base styles
├── server.ts                   # Express server — story generation & payments
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── .env.example                # Environment variable template
```

---

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# ✅ Required
GEMINI_API_KEY=your_gemini_api_key_here

# 💳 Optional — needed only for the payment unlock flow
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# 🌐 Optional — override for production deployments
APP_URL=http://localhost:3000
```

> **Note:** Never commit your `.env` file. It's already in `.gitignore` by default.

### Brand Colors (Tailwind)

The app's palette is defined in `tailwind.config.js`:

```js
colors: {
  brand: {
    cream: '#fef7ed',   // warm page background
    olive: '#6b7c6f',   // muted UI elements
    clay:  '#d4a574',   // warm accent / CTAs
    ink:   '#2d3748',   // body text
  }
}
```

### Customizing AI Story Prompts

The story generation prompt lives in `server.ts` inside the `generateStoryText` function. Modify the system instructions there to adjust tone, reading level, story length, or narrative style.

---

## 🔌 API Reference

The Express backend exposes these secure endpoints:

| Method | Endpoint | Description | Security |
|---|---|---|---|
| `GET` | `/api/health` | Server health check | None |
| `POST` | `/api/story-text` | Generate story narrative | Rate limited (10/15min) |
| `POST` | `/api/story-images` | Generate story illustrations | Rate limited (10/15min) |
| `POST` | `/api/create-order` | Create Razorpay payment order | Requires Razorpay keys |
| `POST` | `/api/verify-payment` | Verify payment with signature | Cryptographic verification |

**Rate Limiting:** All generation endpoints are protected with a 10-requests-per-15-minute limit per IP address to prevent abuse.

---

## 🚢 Deployment

### Development

```bash
npm run dev
```

### Production

```bash
npm run build   # Compile TypeScript + bundle React
npm run start   # Start the Express server
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 Contributing

Contributions are welcome! Here's the workflow:

```bash
# 1. Fork the repo and create a branch
git checkout -b feature/your-feature-name

# 2. Make your changes and commit
git commit -m "feat: describe what you added or fixed"

# 3. Push and open a Pull Request
git push origin feature/your-feature-name
```

Please keep PRs focused — one feature or fix per pull request makes review much easier.

---

## 🐛 Troubleshooting

**The server starts but story generation fails**  
→ Check that `GEMINI_API_KEY` is set correctly in `.env` and that your key has access to the Gemini 1.5 Pro model in Google AI Studio.

**Images aren't generating**  
→ Image generation uses the `gemini-2.5-flash-image` model. Ensure your API key has multimodal/vision capabilities enabled.

**Payment verification fails**  
→ The payment system now uses cryptographic signature verification. Ensure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correctly set in `.env`.

**Getting "Too many requests" error**  
→ The API includes rate limiting (10 requests per 15 minutes). Wait a bit before trying again, or contact support for higher limits.

**Photo uploads are rejected**  
→ Photos must be valid base64-encoded images under 5MB in JPEG, PNG, or WebP format. Check the browser console for validation details.

**Port 3000 already in use**  
→ Kill existing processes on port 3000, or change the port in your environment configuration.

For other issues, open a [GitHub Issue](https://github.com/Kaushalo5/StoryPals/issues) with your Node.js version and the full error message.

---

## � Changelog

### v1.1.0 - Security & Stability Update (2026-04-10)
- 🔒 **CRITICAL:** Fixed payment verification bypass - now uses proper cryptographic signature validation
- 🤖 **FIXED:** Corrected AI model names from non-existent `"gemini-3.1-pro-preview"` to working `"gemini-1.5-pro"`
- 🛡️ **ADDED:** Rate limiting (10 requests/15min) on all generation endpoints
- ✅ **ADDED:** Comprehensive input validation for photo uploads (size, type, format)
- 🔐 **ENHANCED:** Improved error handling and security logging

### v1.0.0 - Initial Release (2026-04-XX)
- ✨ Complete AI-powered storybook generation system
- 🎨 Photo-based character illustrations
- 💳 Integrated payment flow with preview/unlock
- 📱 Fully responsive React frontend
- 🚀 Production-ready Express backend

---

## �📝 License

MIT License — see the [LICENSE](LICENSE) file for details. Free to use, modify, and distribute.

---

<div align="center">
  <p>Made with ❤️ for families and magical storytelling</p>
</div>