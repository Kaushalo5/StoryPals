import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, User, Heart, Camera, Upload, Trash2 } from 'lucide-react';
import { ChildInfo, StoryCategory } from '../types';

interface BookCreatorProps {
  onGenerate: (info: ChildInfo) => void;
  onBackToLanding: () => void;
}

const categories = [
  { id: 'father-child' as StoryCategory, name: 'Father & Child', icon: '👨‍👧', description: 'A heartwarming journey of love and guidance.' },
  { id: 'grandma-child' as StoryCategory, name: 'Grandma & Child', icon: '👵', description: 'Sweet memories and wisdom passed down.' },
  { id: 'siblings' as StoryCategory, name: 'Siblings', icon: '🧒🧒', description: 'Fun adventures and a bond for life.' },
  { id: 'surprise' as StoryCategory, name: 'Surprise Me!', icon: '✨', description: 'Let the magic decide the adventure.' },
];

export default function BookCreator({ onGenerate, onBackToLanding }: BookCreatorProps) {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState<ChildInfo>({
    name: '',
    gender: 'boy',
    category: 'father-child',
    adultName: '',
    description: '',
  });

  const childPhotoRef = useRef<HTMLInputElement>(null);
  const adultPhotoRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'child' | 'adult') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInfo(prev => ({
          ...prev,
          [type === 'child' ? 'childPhoto' : 'adultPhoto']: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(info);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-olive/10 text-brand-olive mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-4xl font-serif font-bold mb-2">Create Your Story</h2>
        <p className="text-brand-ink/60">Follow the steps to build your personalized family adventure.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <label className="block text-sm font-medium uppercase tracking-wider text-brand-ink/60">
                  Choose Your Story
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setInfo({ ...info, category: cat.id })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        info.category === cat.id
                          ? 'border-brand-olive bg-brand-olive/5 shadow-md'
                          : 'border-brand-olive/10 bg-white hover:border-brand-olive/30'
                      }`}
                    >
                      <span className="text-3xl mb-2 block">{cat.icon}</span>
                      <h3 className="font-serif font-bold text-lg mb-1">{cat.name}</h3>
                      <p className="text-xs text-brand-ink/60 leading-relaxed">{cat.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onBackToLanding}
                  className="flex-1 py-4 border-2 border-brand-olive/10 rounded-2xl font-serif text-xl flex items-center justify-center gap-2 hover:bg-brand-olive/5 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-[2] py-4 bg-brand-olive text-white rounded-2xl font-serif text-xl flex items-center justify-center gap-2 hover:bg-brand-olive/90 transition-colors"
                >
                  Next: Upload Photos <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Child Photo */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium uppercase tracking-wider text-brand-ink/60">
                    Child's Photo
                  </label>
                  <div 
                    onClick={() => childPhotoRef.current?.click()}
                    className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group ${
                      info.childPhoto ? 'border-brand-olive' : 'border-brand-olive/20 hover:border-brand-olive/40 bg-white'
                    }`}
                  >
                    {info.childPhoto ? (
                      <>
                        <img src={info.childPhoto} alt="Child" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="text-white w-8 h-8" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Camera className="w-10 h-10 text-brand-olive/30 mb-2" />
                        <span className="text-sm text-brand-ink/40">Click to upload</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={childPhotoRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handlePhotoUpload(e, 'child')} 
                  />
                </div>

                {/* Adult/Sibling Photo */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium uppercase tracking-wider text-brand-ink/60">
                    {info.category === 'siblings' ? "Sibling's Photo" : "Adult's Photo"}
                  </label>
                  <div 
                    onClick={() => adultPhotoRef.current?.click()}
                    className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group ${
                      info.adultPhoto ? 'border-brand-olive' : 'border-brand-olive/20 hover:border-brand-olive/40 bg-white'
                    }`}
                  >
                    {info.adultPhoto ? (
                      <>
                        <img src={info.adultPhoto} alt="Adult" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="text-white w-8 h-8" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Camera className="w-10 h-10 text-brand-olive/30 mb-2" />
                        <span className="text-sm text-brand-ink/40">Click to upload</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={adultPhotoRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handlePhotoUpload(e, 'adult')} 
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-4 border-2 border-brand-olive/10 rounded-2xl font-serif text-xl flex items-center justify-center gap-2 hover:bg-brand-olive/5 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-[2] py-4 bg-brand-olive text-white rounded-2xl font-serif text-xl flex items-center justify-center gap-2 hover:bg-brand-olive/90 transition-colors"
                >
                  Next: Details <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium uppercase tracking-wider text-brand-ink/60">
                    Child's Name
                  </label>
                  <input
                    type="text"
                    required
                    value={info.name}
                    onChange={e => setInfo({ ...info, name: e.target.value })}
                    className="w-full px-4 py-4 rounded-2xl border-2 border-brand-olive/10 focus:border-brand-olive outline-none transition-colors text-lg font-serif bg-white"
                    placeholder="e.g. Leo"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium uppercase tracking-wider text-brand-ink/60">
                    {info.category === 'siblings' ? "Sibling's Name" : "Adult's Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={info.adultName}
                    onChange={e => setInfo({ ...info, adultName: e.target.value })}
                    className="w-full px-4 py-4 rounded-2xl border-2 border-brand-olive/10 focus:border-brand-olive outline-none transition-colors text-lg font-serif bg-white"
                    placeholder="e.g. Dad, Grandma, or a name"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium uppercase tracking-wider text-brand-ink/60">
                  Gender of the Child ({info.name})
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['boy', 'girl'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setInfo({ ...info, gender: g })}
                      className={`py-4 rounded-2xl border-2 transition-all capitalize font-serif text-lg ${
                        info.gender === g
                          ? 'border-brand-olive bg-brand-olive text-white shadow-lg'
                          : 'border-brand-olive/10 bg-white hover:border-brand-olive/30'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {info.category === 'siblings' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium uppercase tracking-wider text-brand-ink/60">
                    Gender of the Sibling ({info.adultName})
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {['boy', 'girl'].map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setInfo({ ...info, adultGender: g })}
                        className={`py-4 rounded-2xl border-2 transition-all capitalize font-serif text-lg ${
                          info.adultGender === g
                            ? 'border-brand-olive bg-brand-olive text-white shadow-lg'
                            : 'border-brand-olive/10 bg-white hover:border-brand-olive/30'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="block text-sm font-medium uppercase tracking-wider text-brand-ink/60">
                  A little bit about them
                </label>
                <textarea
                  rows={3}
                  value={info.description}
                  onChange={e => setInfo({ ...info, description: e.target.value })}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-brand-olive/10 focus:border-brand-olive outline-none transition-colors text-lg font-serif bg-white"
                  placeholder="e.g. Leo loves dinosaurs and his red hat. Dad is always telling funny jokes..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-4 border-2 border-brand-olive/10 rounded-2xl font-serif text-xl flex items-center justify-center gap-2 hover:bg-brand-olive/5 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-brand-olive text-white rounded-2xl font-serif text-xl flex items-center justify-center gap-2 hover:bg-brand-olive/90 transition-colors shadow-lg shadow-brand-olive/20"
                >
                  Generate 10-Page Story <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
