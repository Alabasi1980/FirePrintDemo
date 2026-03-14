"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useCurriculumStore } from '@/store/useCurriculumStore';
import { TypingArea } from "@/components/training/TypingArea";
import { MetricsPanel } from "@/components/training/MetricsPanel";
import { VirtualKeyboard } from "@/components/keyboard/VirtualKeyboard";
import { SessionHistory } from "@/components/training/SessionHistory";
import { useTypingStore } from "@/store/useTypingStore";
import { Upload, RefreshCw, Keyboard, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { Lesson } from '@/lib/curriculum';

export default function VisitorTypingPage() {
  const { lessons } = useCurriculumStore();
  const {
    startLesson,
    resetLesson,
    status,
    wpm,
    accuracy,
    errorKeys,
    calculateMetrics,
    activeContent,
    typedText,
    currentLesson
  } = useTypingStore();

  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [sessionHistory, setSessionHistory] = useState<{ wpm: number; accuracy: number; date: Date; title: string }[]>([]);
  const [isLessonSelected, setIsLessonSelected] = useState(false);
  
  const visitorLessons = useMemo(() => 
    lessons.filter(l => l.type === 'free-typing' && l.language === language),
    [lessons, language]
  );

  // Real-time metrics calculation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "typing") {
      interval = setInterval(() => {
        calculateMetrics();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, calculateMetrics]);

  // Handle completion and history
  useEffect(() => {
    if (status === "finished" && currentLesson) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionHistory(prev => [{ 
        wpm, 
        accuracy, 
        date: new Date(),
        title: currentLesson.title 
      }, ...prev].slice(0, 3));
    }
  }, [status, currentLesson, wpm, accuracy]);

  // Clean up on unmount
  useEffect(() => {
    return () => resetLesson();
  }, [resetLesson]);

  const handleStartLesson = (lesson: Lesson) => {
    startLesson(lesson, "standard");
    setIsLessonSelected(true);
  };

  const handleBackToSelection = () => {
    setIsLessonSelected(false);
    resetLesson();
  };

  const nextChar = activeContent[typedText.length] || null;

  return (
    <div className="min-h-screen bg-[#f4e4bc] text-slate-900 font-sans selection:bg-yellow-200">
      <header className="bg-[#4a3728] border-b border-[#3a2a1e] sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isLessonSelected ? (
              <button
                onClick={handleBackToSelection}
                className="p-2 hover:bg-white/10 rounded-full transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 text-white/80 group-hover:text-white" />
              </button>
            ) : (
              <Link
                href="/"
                className="p-2 hover:bg-white/10 rounded-full transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 text-white/80 group-hover:text-white" />
              </Link>
            )}
            <div className="flex items-center gap-2">
              <Keyboard className="w-6 h-6 text-yellow-400" />
              <h1 className="text-xl font-serif font-black text-white leading-tight uppercase tracking-tight">
                Visitor Lab
              </h1>
            </div>
          </div>
          
          {isLessonSelected && (
            <button
              onClick={resetLesson}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10"
            >
              <RefreshCw className="w-4 h-4" />
              Restart
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4">
        {!isLessonSelected ? (
          <div className="max-w-4xl mx-auto w-full">
            <div className="bg-white p-12 rounded-2xl shadow-xl border-t-[12px] border-emerald-500 relative overflow-hidden">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-4xl font-serif font-black text-slate-800 mb-4">
                    Free Practice Mode
                  </h2>
                  <p className="text-slate-500 font-serif italic text-lg">
                    &quot;Welcome to the lab. Choose a text to practice or upload your own. No pressure, just practice.&quot;
                  </p>
                </div>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setLanguage('en')} 
                    className={`px-6 py-2 rounded-lg font-black uppercase tracking-widest text-xs transition-all ${language === 'en' ? 'bg-white text-[#4a3728] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => setLanguage('ar')} 
                    className={`px-6 py-2 rounded-lg font-black uppercase tracking-widest text-xs transition-all ${language === 'ar' ? 'bg-white text-[#4a3728] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Arabic
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {visitorLessons.map(lesson => (
                  <button 
                    key={lesson.id} 
                    onClick={() => handleStartLesson(lesson)} 
                    className="p-6 bg-slate-50 rounded-xl border-2 border-slate-100 hover:border-yellow-400 text-left transition-all group"
                  >
                    <h3 className="font-bold text-[#4a3728] text-lg mb-2 group-hover:text-yellow-600">{lesson.title}</h3>
                    <p className="text-sm text-slate-500 italic">{lesson.description}</p>
                  </button>
                ))}
                
                <Link 
                  href="/studio"
                  className="p-6 bg-emerald-50 rounded-xl border-2 border-emerald-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-emerald-100 transition-all text-emerald-700"
                >
                  <FileText className="w-8 h-8" /> 
                  <span className="font-black uppercase tracking-widest text-sm">Custom Studio</span>
                  <span className="text-xs font-bold opacity-70">Paste Text or Upload .txt</span>
                </Link>
              </div>
            </div>
          </div>
        ) : status === "finished" ? (
          <div className="max-w-4xl mx-auto w-full">
            <div className="bg-white p-12 rounded-2xl shadow-xl border-t-[12px] border-yellow-400">
              <h2 className="text-4xl font-serif font-black text-[#4a3728] mb-8 text-center underline decoration-yellow-400 decoration-4 underline-offset-8">
                Session Summary
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-slate-50 p-8 rounded-xl border-2 border-slate-100 text-center">
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Speed</div>
                  <div className="text-6xl font-serif font-black text-[#4a3728]">{wpm} <span className="text-xl font-sans text-slate-400">WPM</span></div>
                </div>
                <div className="bg-slate-50 p-8 rounded-xl border-2 border-slate-100 text-center">
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Accuracy</div>
                  <div className="text-6xl font-serif font-black text-[#4a3728]">{accuracy}<span className="text-xl font-sans text-slate-400">%</span></div>
                </div>
              </div>

              {Object.keys(errorKeys).length > 0 && (
                <div className="mb-12">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Weak Keys Detected</h4>
                  <div className="flex flex-wrap justify-center gap-3">
                    {Object.entries(errorKeys)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([key, count]) => (
                        <div key={key} className="bg-red-50 border-2 border-red-100 px-4 py-2 rounded-lg text-lg font-mono text-red-700 shadow-sm">
                          {key === " " ? "Space" : key} <span className="font-black ml-2 opacity-50">x{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                <button 
                  onClick={resetLesson}
                  className="bg-emerald-600 text-white px-10 py-4 font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
                >
                  <RefreshCw className="w-5 h-5" />
                  Practice Again
                </button>
                <button 
                  onClick={handleBackToSelection}
                  className="bg-slate-200 text-slate-700 px-10 py-4 font-black uppercase tracking-widest rounded-xl hover:bg-slate-300 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Choose Another
                </button>
              </div>
              
              {sessionHistory.length > 0 && (
                <SessionHistory history={sessionHistory} />
              )}
            </div>
          </div>
        ) : (
          <>
            <MetricsPanel />
            <TypingArea />
            <div className="mt-4">
              <VirtualKeyboard
                language={currentLesson?.language || language}
                nextChar={nextChar}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
