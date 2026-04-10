/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Heart, Star, Wand2, Camera, Users, Smile, CreditCard } from 'lucide-react';
import BookCreator from './components/BookCreator';
import BookViewer from './components/BookViewer';
import { generateStoryText, generatePageImages } from './services/ai';
import { Story, ChildInfo } from './types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function App() {
  const [view, setView] = useState<'landing' | 'creator' | 'loading' | 'viewer'>('landing');
  const [story, setStory] = useState<Story | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Gathering magic dust...');
  const [isPaid, setIsPaid] = useState(false);
  const [pendingInfo, setPendingInfo] = useState<ChildInfo | null>(null);

  useEffect(() => {
    // Immediate cleanup of potentially large base64 data as requested
    localStorage.removeItem('pending_story');

    // Check for success from URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
      handlePaymentSuccess();
    }
  }, []);

  const handlePaymentSuccess = async (existingStory?: Story, existingInfo?: ChildInfo) => {
    setIsPaid(true);
    
    let currentStory = existingStory || story;
    let currentInfo = existingInfo || pendingInfo;

    // Recovery logic if state was lost (e.g. refresh)
    if (!currentInfo) {
      const savedInfo = localStorage.getItem('pending_info');
      if (savedInfo) currentInfo = JSON.parse(savedInfo);
    }

    if (!currentStory && currentInfo) {
      const savedData = localStorage.getItem('pending_story_data');
      if (savedData) {
        const storyData = JSON.parse(savedData);
        setView('loading');
        setLoadingMessage('Restoring your magic story...');
        
        try {
          // Regenerate the first 3 preview pages
          const previewPages = await generatePageImages(
            storyData.pages,
            currentInfo,
            0,
            3,
            (current) => setLoadingMessage(`Restoring preview page ${current} of 3...`)
          );

          currentStory = {
            title: storyData.title,
            pages: previewPages,
            category: currentInfo.category
          };
          setStory(currentStory);
        } catch (error) {
          console.error('Failed to restore story:', error);
        }
      }
    }

    if (currentStory && currentInfo) {
      setStory(currentStory);
      setPendingInfo(currentInfo);
      setView('loading');
      resumeGeneration(currentStory, currentInfo);
    }
    
    // Clean up URL
    window.history.replaceState({}, '', window.location.pathname);
  };

  const resumeGeneration = async (currentStory: Story, info: ChildInfo) => {
    setLoadingMessage('Unlocking the rest of your adventure...');
    try {
      // We need the original story text/prompts to generate remaining images
      const savedStoryData = localStorage.getItem('pending_story_data');
      if (!savedStoryData) throw new Error('Story data missing');
      
      const storyData = JSON.parse(savedStoryData);
      const remainingPages = await generatePageImages(
        storyData.pages,
        info,
        3, // Start from page 4
        7, // Generate the rest (10 total - 3 preview)
        (current, total) => {
          setLoadingMessage(`Painting page ${current} of ${total}...`);
        }
      );

      const fullStory = {
        ...currentStory,
        pages: [...currentStory.pages.slice(0, 3), ...remainingPages]
      };

      setStory(fullStory);
      setView('viewer');
      localStorage.removeItem('pending_story');
      localStorage.removeItem('pending_info');
      localStorage.removeItem('pending_story_data');
    } catch (error) {
      console.error(error);
      alert('Failed to resume generation. Please try again.');
      setView('viewer');
    }
  };

  const handleStart = () => setView('creator');

  const handleGenerate = async (info: ChildInfo) => {
    setView('loading');
    setLoadingMessage('Generating your story text...');
    
    try {
      const storyData = await generateStoryText(info);
      setLoadingMessage('Painting the first 3 pages for your preview...');
      
      const previewPages = await generatePageImages(
        storyData.pages,
        info,
        0,
        3,
        (current) => setLoadingMessage(`Painting preview page ${current} of 3...`)
      );

      const initialStory: Story = {
        title: storyData.title,
        pages: previewPages,
        category: info.category
      };

      setStory(initialStory);
      setPendingInfo(info);
      
      // Save only metadata and input info for potential recovery
      // We EXCLUDE the full story with base64 images to avoid localStorage limits
      localStorage.setItem('pending_info', JSON.stringify(info));
      localStorage.setItem('pending_story_data', JSON.stringify(storyData));

      setView('viewer');
    } catch (error) {
      console.error(error);
      alert('Oops! The magic failed. Please try again.');
      setView('creator');
    }
  };

  const handleUnlock = async () => {
    if (!story) return;
    
    // Gimmick: Directly trigger success without actual payment
    setLoadingMessage('Magic payment confirmed! Unlocking your story...');
    setTimeout(async () => {
      await handlePaymentSuccess();
    }, 1000);
  };

  const handleBackToCreator = () => {
    setView('creator');
  };

  const handleReset = () => {
    setStory(null);
    setIsPaid(false);
    setPendingInfo(null);
    setView('landing');
    localStorage.removeItem('pending_story');
    localStorage.removeItem('pending_info');
    localStorage.removeItem('pending_story_data');
  };

  return (
    <div className="min-h-screen selection:bg-brand-clay/30 bg-brand-cream">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden py-20">
              <div className="absolute top-20 left-10 text-brand-clay/20 animate-bounce delay-100">
                <Star className="w-12 h-12 fill-current" />
              </div>
              <div className="absolute bottom-20 right-10 text-brand-olive/20 animate-pulse">
                <Heart className="w-16 h-16 fill-current" />
              </div>

              <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-olive/5 text-brand-olive font-serif text-lg mb-8 border border-brand-olive/10">
                  <Sparkles className="w-5 h-5" />
                  <span>Magic in every page</span>
                </div>
                
                <h1 className="text-7xl md:text-9xl font-serif font-bold text-brand-olive leading-none mb-8 tracking-tight">
                  Story<span className="text-brand-clay italic">Pals</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-brand-ink/70 font-serif max-w-2xl mx-auto leading-relaxed mb-12">
                  Create a personalized adventure where your family members are the heroes. 
                  AI-generated stories and illustrations, made just for you.
                </p>

                <button
                  onClick={handleStart}
                  className="group relative inline-flex items-center gap-3 px-10 py-5 bg-brand-olive text-white rounded-full text-2xl font-serif shadow-2xl shadow-brand-olive/30 hover:scale-105 transition-all active:scale-95"
                >
                  Create Your Story
                  <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </section>

            {/* Motto Sections */}
            <section className="py-24 bg-white">
              <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-brand-olive/10 rounded-2xl flex items-center justify-center mx-auto text-brand-olive">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold">Choose Your Story</h3>
                    <p className="text-brand-ink/60 leading-relaxed">
                      Pick from our collection of heartwarming stories, each designed to celebrate love, connection, and everyday moments between families.
                    </p>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-brand-olive/10 rounded-2xl flex items-center justify-center mx-auto text-brand-olive">
                      <Camera className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold">Upload Photos</h3>
                    <p className="text-brand-ink/60 leading-relaxed">
                      Simply upload photos of your family members. We'll transform them into beautifully illustrated storybook characters.
                    </p>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-brand-olive/10 rounded-2xl flex items-center justify-center mx-auto text-brand-olive">
                      <Smile className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold">Enjoy Together</h3>
                    <p className="text-brand-ink/60 leading-relaxed">
                      Receive your personalized book and create magical memories reading together with your loved ones.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <footer className="py-12 border-t border-brand-olive/10 text-center text-brand-ink/40 font-serif text-sm">
              © 2026 StoryPals • Made with magic
            </footer>
          </motion.div>
        )}

        {view === 'creator' && (
          <motion.div
            key="creator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <BookCreator 
              onGenerate={handleGenerate} 
              onBackToLanding={() => setView('landing')}
            />
          </motion.div>
        )}

        {view === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-4 text-center"
          >
            <div className="relative w-32 h-32 mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-dashed border-brand-olive/20 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center text-brand-olive"
              >
                <Sparkles className="w-12 h-12" />
              </motion.div>
            </div>
            <h2 className="text-3xl font-serif font-bold text-brand-olive mb-2">Creating Your 10-Page Magic Book</h2>
            <p className="text-xl font-serif italic text-brand-ink/60 animate-pulse">{loadingMessage}</p>
          </motion.div>
        )}

        {view === 'viewer' && story && (
          <motion.div
            key="viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BookViewer 
              story={story} 
              onReset={handleReset} 
              onBack={handleBackToCreator}
              isPaid={isPaid}
              onUnlock={handleUnlock}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
