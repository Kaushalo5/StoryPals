# 🎨 StoryPals - AI-Powered Children's Storybook Creator

<div align="center">
  <img src="https://img.shields.io/badge/React-19.0.0-blue.svg" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.8.2-blue.svg" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-24.14.1-green.svg" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-4.21.2-lightgrey.svg" alt="Express"/>
  <img src="https://img.shields.io/badge/Google%20Gemini-AI-orange.svg" alt="Google Gemini"/>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4.1.14-blue.svg" alt="Tailwind CSS"/>
</div>

<div align="center">
  <h3>Create personalized, AI-generated children's stories with beautiful illustrations</h3>
  <p>Transform family photos into magical adventures where your loved ones become the heroes!</p>
</div>

## ✨ Features

- 🎭 **Personalized Stories**: Create custom stories featuring your family members
- 🤖 **AI-Powered Content**: Google Gemini generates engaging narratives and illustrations
- 📸 **Photo Integration**: Upload family photos to make characters look authentic
- 🎨 **Beautiful Illustrations**: AI-generated artwork in whimsical children's book style
- 💳 **Premium Experience**: Unlock full 10-page stories with integrated payments
- 📱 **Responsive Design**: Works beautifully on desktop and mobile devices
- 🔒 **Secure**: Environment-based API key management

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Google Gemini API Key** (from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kaushalo5/StoryPals.git
   cd StoryPals
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📖 How It Works

### Story Creation Process

1. **Choose Story Type**: Select from Father-Child, Grandma-Child, Siblings, or Surprise Me
2. **Upload Photos**: Add photos of the child and family member
3. **Enter Details**: Provide names and any additional character descriptions
4. **AI Generation**: Watch as AI creates a personalized 10-page story with illustrations
5. **Preview & Unlock**: View the first 3 pages, then unlock the full story

### Story Categories

- 👨‍👧 **Father & Child**: Heartwarming stories about fathers and their children
- 👵‍👧 **Grandma & Child**: Sweet tales of grandmothers and grandchildren
- 🧒🧒 **Siblings**: Fun adventures between brothers and sisters
- ✨ **Surprise Me**: Let AI create a magical, unexpected adventure

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icons
- **React Markdown** - Rich text rendering

### Backend
- **Express.js** - Fast, unopinionated web framework
- **Google Gemini AI** - Advanced AI for story and image generation
- **Razorpay** - Payment processing (optional)
- **TypeScript** - Full-stack type safety

### Development Tools
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting
- **tsx** - TypeScript execution for development

## 📁 Project Structure

```
StoryPals/
├── src/
│   ├── components/
│   │   ├── BookCreator.tsx    # Story creation form
│   │   └── BookViewer.tsx     # Story display and navigation
│   ├── services/
│   │   └── ai.ts             # API communication layer
│   ├── types.ts              # TypeScript type definitions
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── server.ts                 # Express backend server
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Payment processing
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Optional: Production URL
APP_URL=http://localhost:3000
```

### API Endpoints

The backend provides the following REST endpoints:

- `GET /api/health` - Health check
- `POST /api/story-text` - Generate story text
- `POST /api/story-images` - Generate story illustrations
- `POST /api/create-order` - Create payment order (Razorpay)
- `POST /api/verify-payment` - Verify payment completion

## 🎨 Customization

### Styling
The app uses Tailwind CSS with custom brand colors defined in `tailwind.config.js`:

```javascript
colors: {
  brand: {
    cream: '#fef7ed',
    olive: '#6b7c6f',
    clay: '#d4a574',
    ink: '#2d3748'
  }
}
```

### AI Prompts
Story generation prompts can be customized in `server.ts` in the `generateStoryText` function.

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering the story and image generation
- **Tailwind CSS** for the beautiful styling system
- **Framer Motion** for smooth animations
- **Lucide** for the icon set

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Kaushalo5/StoryPals/issues) page
2. Create a new issue with detailed information
3. Include your Node.js version and error messages

---

<div align="center">
  <p>Made with ❤️ for families and magical storytelling</p>
  <p>
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>
