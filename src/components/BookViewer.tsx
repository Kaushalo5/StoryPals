import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Download, BookOpen, Loader2, Lock, Sparkles, CreditCard } from 'lucide-react';
import { Story } from '../types';
import { jsPDF } from 'jspdf';

interface BookViewerProps {
  story: Story;
  onReset: () => void;
  onBack: () => void;
  isPaid: boolean;
  onUnlock: () => void;
}

export default function BookViewer({ story, onReset, onBack, isPaid, onUnlock }: BookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const previewLimit = 3;
  const isLocked = !isPaid && currentPage >= previewLimit - 1;

  const nextPage = () => {
    if (isPaid) {
      if (currentPage < story.pages.length - 1) {
        setCurrentPage(currentPage + 1);
      }
    } else {
      if (currentPage < previewLimit - 1) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const exportToPDF = async () => {
    if (!isPaid) return;
    setIsExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1200, 900]
      });

      for (let i = 0; i < story.pages.length; i++) {
        if (i > 0) pdf.addPage([1200, 900], 'landscape');
        
        const page = story.pages[i];
        
        // Add image
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = page.imageUrl;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          
          pdf.addImage(img, 'PNG', 0, 0, 1200, 900);
          
          // Add a semi-transparent black overlay at the bottom
          // We use a GState for transparency if available in this version of jsPDF
          try {
            const gState = new (pdf as any).GState({ opacity: 0.5 });
            pdf.setGState(gState);
          } catch (e) {
            // Fallback if GState is not available
            pdf.setFillColor(0, 0, 0);
          }
          
          pdf.setFillColor(0, 0, 0);
          pdf.rect(0, 720, 1200, 180, 'F');
          
          // Reset opacity for text
          try {
            const resetGState = new (pdf as any).GState({ opacity: 1 });
            pdf.setGState(resetGState);
          } catch (e) {}
          
          pdf.setTextColor(255, 255, 255);
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(24);
          
          const splitText = pdf.splitTextToSize(page.text, 1000);
          
          if (i === 0) {
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(36);
            pdf.text(story.title, 100, 770);
            pdf.setFont('helvetica', 'italic');
            pdf.setFontSize(24);
            pdf.text(splitText, 100, 810);
          } else {
            pdf.text(splitText, 100, 800);
          }
        } catch (err) {
          console.error(`Failed to add page ${i} to PDF`, err);
        }
      }

      pdf.save(`${story.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('PDF Export failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] py-12 px-4 relative overflow-hidden">
      {/* Paper texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-30 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-3">
            <button
              onClick={onReset}
              className="flex items-center gap-2 text-brand-olive font-serif hover:underline bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm"
            >
              <RotateCcw className="w-4 h-4" /> Start Over
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-brand-olive font-serif hover:underline bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Edit
            </button>
          </div>
          <div className="bg-white/50 px-6 py-2 rounded-full backdrop-blur-sm text-brand-ink/60 font-serif text-lg flex items-center gap-3">
            <BookOpen className="w-5 h-5" />
            {isPaid ? `Page ${currentPage + 1} of ${story.pages.length}` : `Preview: Page ${currentPage + 1} of 3`}
          </div>
          <button
            onClick={exportToPDF}
            disabled={isExporting || !isPaid}
            className="flex items-center gap-2 text-brand-olive font-serif hover:underline bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> {isPaid ? 'Save PDF' : 'Locked'}
              </>
            )}
          </button>
        </div>

        <div className="relative aspect-[4/3] max-h-[80vh] mx-auto bg-white rounded-[2rem] book-shadow overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {/* Full-page Image */}
              <img
                src={story.pages[currentPage].imageUrl}
                alt={`Illustration for page ${currentPage + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Blended Text Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/60 via-black/20 to-transparent pt-32">
                <div className="max-w-3xl mx-auto">
                  {currentPage === 0 && (
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mb-6 drop-shadow-lg"
                    >
                      {story.title}
                    </motion.h1>
                  )}
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl md:text-3xl font-serif leading-relaxed text-white drop-shadow-md italic"
                  >
                    {story.pages[currentPage].text}
                  </motion.p>
                </div>
              </div>

              {/* Lock Overlay for Preview End */}
              {!isPaid && currentPage === previewLimit - 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-brand-olive/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">The Adventure Continues...</h2>
                  <p className="text-xl text-white/80 font-serif max-w-md mb-8">
                    Unlock the full 10-page story and download your personalized PDF to keep the magic forever.
                  </p>
                  <button
                    onClick={onUnlock}
                    className="flex items-center gap-3 px-8 py-4 bg-white text-brand-olive rounded-full text-xl font-serif font-bold shadow-2xl hover:scale-105 transition-all active:scale-95"
                  >
                    <Sparkles className="w-6 h-6" />
                    Magic Unlock (Demo)
                  </button>
                  <div className="mt-6 flex items-center gap-2 text-white/60 font-serif">
                    <Sparkles className="w-4 h-4" />
                    <span>7 more pages of magic waiting for you</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls - Floating */}
          <div className="absolute inset-y-0 left-0 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-brand-olive shadow-xl hover:bg-white disabled:opacity-0 transition-all"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={nextPage}
              disabled={(!isPaid && currentPage === previewLimit - 1) || currentPage === story.pages.length - 1}
              className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-brand-olive shadow-xl hover:bg-white disabled:opacity-0 transition-all"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 max-w-2xl mx-auto h-2 bg-brand-olive/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-brand-olive"
            initial={{ width: 0 }}
            animate={{ width: `${((currentPage + 1) / (isPaid ? story.pages.length : previewLimit)) * 100}%` }}
          />
        </div>

        {/* Page thumbnails */}
        <div className="mt-8 flex justify-center gap-3 overflow-x-auto py-4 px-2 no-scrollbar">
          {(isPaid ? story.pages : story.pages.slice(0, previewLimit)).map((page, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                currentPage === idx ? 'border-brand-olive scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'
              }`}
            >
              <img
                src={page.imageUrl}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
          {!isPaid && (
            <div className="w-16 h-12 rounded-lg bg-brand-olive/10 border-2 border-dashed border-brand-olive/20 flex items-center justify-center text-brand-olive/40 flex-shrink-0">
              <Lock className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
