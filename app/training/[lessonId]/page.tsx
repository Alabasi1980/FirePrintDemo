"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTypingStore } from "@/store/useTypingStore";
import { useUserStore } from "@/store/useUserStore";
import { useCurriculumStore } from "@/store/useCurriculumStore";
import { generateRemedialLesson } from "@/lib/curriculum";
import { TypingArea } from "@/components/training/TypingArea";
import { MetricsPanel } from "@/components/training/MetricsPanel";
import { PreTest } from "@/components/training/PreTest";
import { VirtualKeyboard } from "@/components/keyboard/VirtualKeyboard";
import { SessionHistory } from "@/components/training/SessionHistory";
import { motion } from "motion/react";
import { ArrowLeft, RefreshCw, CheckCircle2, Trophy } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function TrainingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const {
    startLesson,
    currentLesson,
    remedialLesson,
    activeContent,
    status,
    typedText,
    resetLesson,
    wpm,
    accuracy,
    errorKeys,
    earnedXp,
    keystrokes,
    calculateMetrics,
    backspacesUsed,
    clearRemedial,
  } = useTypingStore();
  const { addXp, recordLessonCompletion, recordKeyStats, settings, updateSettings } = useUserStore();
  const { getLessonById, addRemedialLesson } = useCurriculumStore();

  const [preTestStatus, setPreTestStatus] = useState<"pending" | "active" | "completed">("pending");
  const [preTestResult, setPreTestResult] = useState<{ wpm: number; accuracy: number } | null>(null);
  const [sessionHistory, setSessionHistory] = useState<{ wpm: number; accuracy: number; date: Date; title?: string }[]>([]);

  useEffect(() => {
    const lessonId = params.lessonId as string;
    const lesson = getLessonById(lessonId);

    if (lesson) {
      // Don't start lesson immediately, wait for pre-test
      // startLesson(lesson); 
    } else {
      router.push("/dashboard");
    }

    return () => resetLesson();
  }, [params.lessonId, router, resetLesson, getLessonById]);

  const handlePreTestComplete = (results: { wpm: number; accuracy: number }) => {
    setPreTestResult(results);
    setPreTestStatus("completed");
    
    const lessonId = params.lessonId as string;
    const lesson = getLessonById(lessonId);
    
    if (lesson) {
      // Determine difficulty
      let difficulty: "light" | "standard" | "intensive" = "standard";
      if (results.wpm > lesson.targetWpm * 1.2 && results.accuracy >= 98) {
        difficulty = "intensive";
      } else if (results.wpm < lesson.targetWpm * 0.6 || results.accuracy < 90) {
        difficulty = "light";
      }
      
      startLesson(lesson, difficulty);
    }
  };

  // Real-time metrics calculation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "typing" && preTestStatus === "completed") {
      interval = setInterval(() => {
        calculateMetrics();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, calculateMetrics, preTestStatus]);

  useEffect(() => {
    if (status === "finished" && preTestStatus === "completed") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      
      if (currentLesson && accuracy >= currentLesson.targetAccuracy && wpm >= currentLesson.targetWpm) {
        addXp(earnedXp);
        recordLessonCompletion(currentLesson.id, wpm, accuracy, earnedXp);
      }
      
      // Always record key stats regardless of pass/fail
      if (keystrokes.length > 0) {
        recordKeyStats(keystrokes);
      }
      
      // Add to history
      setSessionHistory(prev => [{ wpm, accuracy, date: new Date(), title: currentLesson?.title }, ...prev].slice(0, 3));
    }
  }, [status, currentLesson, accuracy, wpm, earnedXp, addXp, recordLessonCompletion, keystrokes, recordKeyStats, preTestStatus]);

  if (!getLessonById(params.lessonId as string)) return null;

  const lesson = getLessonById(params.lessonId as string)!;
  const nextChar = activeContent[typedText.length] || null;
  const isArabic = lesson.language === "ar";

  return (
    <div className="min-h-screen bg-[#f4e4bc] text-slate-900 font-sans selection:bg-yellow-200">
      <header className="bg-[#4a3728] border-b border-[#3a2a1e] sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-white/10 rounded-full transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-white/80 group-hover:text-white" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-yellow-400 text-[#4a3728] text-[10px] font-black rounded uppercase tracking-[0.1em]">
                  UNIT {lesson.unit} • LEVEL {lesson.level}
                </span>
              </div>
              <h1 className="text-xl font-serif font-black text-white leading-tight uppercase tracking-tight">
                {lesson.title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {preTestStatus === "completed" && (
              <div className="flex items-center gap-2 bg-yellow-400/10 px-3 py-1.5 rounded-xl border border-yellow-400/20">
                <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">
                  PATH: {useTypingStore.getState().difficulty}
                </span>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">STRICT MODE</span>
                <button
                  onClick={() => updateSettings({ strictMode: !settings.strictMode })}
                  className={`w-10 h-5 rounded-full transition-colors relative ${settings.strictMode ? 'bg-red-500' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.strictMode ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">DEEP WORK</span>
                <button
                  onClick={() => updateSettings({ deepWorkMode: !settings.deepWorkMode })}
                  className={`w-10 h-5 rounded-full transition-colors relative ${settings.deepWorkMode ? 'bg-emerald-500' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.deepWorkMode ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                resetLesson();
                setPreTestStatus("pending");
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10"
            >
              <RefreshCw className="w-4 h-4" />
              Restart
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4">
        {preTestStatus !== "completed" ? (
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 rounded-sm shadow-2xl border-t-[12px] border-yellow-400 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Trophy className="w-32 h-32" />
              </div>
              
              <div className="mb-12">
                <h2 className="text-4xl font-serif font-black text-slate-800 mb-4">
                  PLACEMENT DIAGNOSTIC
                </h2>
                <p className="text-slate-500 font-serif italic text-lg">
                  &quot;Before we begin the lesson, let&apos;s see how you handle this short passage. This will help me tailor the curriculum to your current skill level.&quot;
                </p>
              </div>

              <div className="bg-slate-50 p-8 rounded-xl border-2 border-slate-100 mb-8">
                <PreTest 
                  language={lesson.language} 
                  onComplete={handlePreTestComplete} 
                />
              </div>

              <div className="flex items-center gap-4 text-slate-400 font-mono text-xs uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  Fast & Accurate: Intensive Path
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  Steady: Standard Path
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  Learning: Light Path
                </div>
              </div>
            </motion.div>
          </div>
        ) : status === "finished" ? (
          <div className="bg-white p-12 rounded-2xl shadow-xl border-2 border-slate-200">
            <h2 className="text-3xl font-black text-[#4a3728] mb-8">Session Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-100">
                <div className="text-sm font-bold text-slate-400 uppercase">Speed</div>
                <div className="text-4xl font-black text-[#4a3728]">{wpm} WPM</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-100">
                <div className="text-sm font-bold text-slate-400 uppercase">Accuracy</div>
                <div className="text-4xl font-black text-[#4a3728]">{accuracy}%</div>
              </div>
              <button 
                onClick={resetLesson}
                className="bg-yellow-400 text-[#4a3728] font-black rounded-xl hover:bg-yellow-500 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-6 h-6" />
                Restart Session
              </button>
            </div>
            
            {sessionHistory.length > 0 && (
              <SessionHistory history={sessionHistory} />
            )}
          </div>
        ) : (
          <>
            {currentLesson?.explanation && status === "idle" && (
              <motion.div
                initial={{ opacity: 0, rotate: -1 }}
                animate={{ opacity: 1, rotate: 0 }}
                className={`bg-white shadow-xl p-8 rounded-sm border-l-8 border-yellow-400 max-w-4xl mx-auto w-full relative ${isArabic ? "text-right" : "text-left"}`}
                dir={isArabic ? "rtl" : "ltr"}
                style={{
                  backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px)',
                  backgroundSize: '100% 2rem',
                  lineHeight: '2rem'
                }}
              >
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-200/50 rounded-full blur-xl" />
                <h3 className="text-slate-400 font-bold mb-4 uppercase tracking-[0.2em] text-xs">Teacher&apos;s Note</h3>
                <p className="text-slate-800 text-xl font-serif italic">
                  &quot;{currentLesson.explanation}&quot;
                </p>
                <div className="mt-8 flex justify-end">
                  <span className="text-slate-400 font-mono text-xs">Press any key to start the lesson...</span>
                </div>
              </motion.div>
            )}

            {!settings.deepWorkMode && <MetricsPanel />}

            <TypingArea />

            {!settings.deepWorkMode && (
              <div className="mt-4">
                <VirtualKeyboard
                  language={currentLesson?.language || lesson.language}
                  nextChar={nextChar}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
