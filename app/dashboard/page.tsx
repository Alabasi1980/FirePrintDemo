"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Language, Lesson, Domain } from "@/lib/curriculum";
import { generateAdaptiveLesson } from "@/lib/adaptiveGenerator";
import { useUserStore } from "@/store/useUserStore";
import { useCurriculumStore } from "@/store/useCurriculumStore";
import { useTranslation } from "@/hooks/useTranslation";
import {
  BookOpen,
  Trophy,
  Clock,
  Target,
  PlayCircle,
  Lock,
  CheckCircle2,
  Activity,
  Star,
  Settings,
  Flame,
  Shield,
  Briefcase,
  Code,
  Stethoscope,
  Scale,
  FileText,
} from "lucide-react";
import { motion } from "motion/react";

import { HonorRoll } from "@/components/dashboard/HonorRoll";
import { AchievementBadges } from "@/components/dashboard/AchievementBadges";
import { TeacherNote } from "@/components/dashboard/TeacherNote";
import { DiagnosticDashboard } from "@/components/dashboard/DiagnosticDashboard";
import { LeagueBoard } from "@/components/dashboard/LeagueBoard";
import { DuelComponent } from "@/components/duel/DuelComponent";
import { DailyChallenge } from "@/components/dashboard/DailyChallenge";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { CareerPathSelector } from "@/components/dashboard/CareerPathSelector";

export default function DashboardPage() {
  const router = useRouter();
  const { t, lang: uiLang } = useTranslation();
  const [language, setLanguage] = useState<Language>("en");
  const { xp, level, completedLessons, streak, role, getWeakKeys, getWeakTransitions } = useUserStore();
  const { getLessonsByLanguageAndDomain, getCustomLessons, addWarmupLesson, selectedDomain, setSelectedDomain } = useCurriculumStore();
  const lessons = getLessonsByLanguageAndDomain(language, selectedDomain);
  const customLessons = getCustomLessons(language);

  const handleWarmup = () => {
    const weakKeys = getWeakKeys(0.15);
    const weakTransitions = getWeakTransitions(400);
    const lessonText = generateAdaptiveLesson(weakKeys, weakTransitions, 100);
    
    const warmupLesson: Lesson = {
      id: `adaptive-${Date.now()}`,
      title: "Adaptive Remedial Lesson",
      description: "Focusing on your weak keys and transitions.",
      language: language,
      level: 1,
      unit: 0,
      type: "remedial",
      domain: selectedDomain || "general",
      contentVariations: [lessonText],
      targetWpm: 20,
      targetAccuracy: 90,
      xpReward: 50,
    };
    
    addWarmupLesson(warmupLesson);
    router.push(`/training/${warmupLesson.id}`);
  };

  // Group lessons by unit
  const units = lessons.reduce(
    (acc, lesson) => {
      if (!acc[lesson.unit]) {
        acc[lesson.unit] = [];
      }
      acc[lesson.unit].push(lesson);
      return acc;
    },
    {} as Record<number, typeof lessons>,
  );

  return (
    <div className="min-h-screen bg-[#f4e4bc] text-slate-900 font-sans selection:bg-yellow-200">
      <header className="bg-[#4a3728] border-b border-[#3a2a1e] sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-[#4a3728] font-bold shadow-lg group-hover:bg-yellow-300 transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="font-serif font-black text-white block leading-none text-xl tracking-tighter">
                  {t.dashboard.title}
                </span>
                <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">{t.dashboard.welcome}</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-8">
            {role === 'admin' && (
              <Link 
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-yellow-400/10 rounded-full border border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/20 transition-all group"
              >
                <Shield className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Teacher&apos;s Lounge</span>
              </Link>
            )}

            {/* Streak */}
            <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full border border-white/10">
              <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-400 fill-orange-400' : 'text-white/20'}`} />
              <span className="font-black text-white text-sm uppercase tracking-widest">{streak} {t.common.streak}</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex bg-black/20 p-1 rounded-xl border border-white/10 gap-1">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all tracking-widest ${language === "en" ? "bg-yellow-400 text-[#4a3728]" : "text-white/60 hover:text-white"}`}
                >
                  ENGLISH
                </button>
                <button
                  onClick={() => setLanguage("ar")}
                  className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all tracking-widest ${language === "ar" ? "bg-yellow-400 text-[#4a3728]" : "text-white/60 hover:text-white"}`}
                >
                  العربية
                </button>
              </div>
              
              <Link 
                href="/settings"
                className="p-2 text-white/60 hover:text-yellow-400 transition-colors"
              >
                <Settings className="w-6 h-6" />
              </Link>

              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-[#4a3728] font-black border-2 border-white/20 shadow-lg">
                {xp > 0 ? level : "S"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Curriculum */}
          <div className="lg:col-span-8 space-y-12">
            <CareerPathSelector />
            <TeacherNote />
            <DiagnosticDashboard />
            
            <div className="mb-16">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                <div>
                  <h1 className="text-5xl font-serif font-black text-[#4a3728] mb-4">
                    Good Morning, <span className="text-[#4a3728] underline decoration-yellow-400 decoration-8 underline-offset-8">Student</span>
                  </h1>
                  <p className="text-slate-500 font-serif italic text-lg max-w-xl">
                    &quot;The classroom is ready for you. Choose a door to begin your daily practice. Remember, precision is the key to mastery.&quot;
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href="/studio"
                    className="bg-white border-2 border-[#4a3728]/10 text-[#4a3728] px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:border-emerald-400 hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <FileText className="w-5 h-5 text-emerald-500" />
                    Custom Studio
                  </Link>
                  <button 
                    onClick={handleWarmup}
                    className="bg-white border-2 border-[#4a3728]/10 text-[#4a3728] px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:border-yellow-400 hover:bg-yellow-50 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Flame className="w-5 h-5 text-orange-500" />
                    {t.dashboard.start_warmup}
                  </button>
                  <Link 
                    href="/placement"
                    className="bg-[#4a3728] text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#3a2a1e] transition-all flex items-center gap-2 shadow-lg shadow-black/10"
                  >
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Placement Exam
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-sm border-2 border-slate-100 shadow-xl flex flex-col items-center text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400" />
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-3 shadow-inner">
                    <Star className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-black text-[#4a3728]">{xp.toLocaleString()}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total XP</div>
                </div>
                <div className="bg-white p-6 rounded-sm border-2 border-slate-100 shadow-xl flex flex-col items-center text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400" />
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3 shadow-inner">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-black text-[#4a3728]">{Object.keys(completedLessons).length}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lessons Passed</div>
                </div>
                <div className="bg-white p-6 rounded-sm border-2 border-slate-100 shadow-xl flex flex-col items-center text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400" />
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 shadow-inner">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-black text-[#4a3728]">{level}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Grade</div>
                </div>
                <div className="bg-white p-6 rounded-sm border-2 border-slate-100 shadow-xl flex flex-col items-center text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400" />
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3 shadow-inner">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-black text-[#4a3728]">
                    {Object.values(completedLessons).reduce((acc, curr) => Math.max(acc, curr.wpm), 0)}
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Speed</div>
                </div>
              </div>
            </div>

            <div className="space-y-20">
              {Object.entries(units).map(([unitNum, unitLessons], index) => (
                <section key={unitNum} className="relative">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-16 h-16 bg-[#4a3728] text-yellow-400 rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl rotate-3 border-4 border-white">
                      {unitNum}
                    </div>
                    <div>
                      <h2 className="text-3xl font-serif font-black text-[#4a3728] uppercase tracking-tight">
                        Unit {unitNum}: {unitNum === "1" ? "The Foundation" : unitNum === "2" ? "Upper Reaches" : "Mastery"}
                      </h2>
                      <p className="text-slate-500 font-serif italic">Complete all lessons to unlock the next classroom.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {unitLessons.map((lesson, i) => {
                      const isCompleted = !!completedLessons[lesson.id];
                      const isLocked = i > 0 && !completedLessons[unitLessons[i - 1].id];

                      return (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Link
                            href={isLocked ? "#" : `/training/${lesson.id}`}
                            className={`
                              group relative block p-8 rounded-sm transition-all duration-300
                              ${
                                isLocked
                                  ? "bg-slate-100 border-2 border-slate-200 opacity-60 cursor-not-allowed"
                                  : "bg-white border-2 border-slate-200 hover:border-yellow-400 hover:shadow-[12px_12px_0px_rgba(250,204,21,0.1)] hover:-translate-y-1"
                              }
                            `}
                          >
                            {/* Door Handle decoration */}
                            {!isLocked && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-8 bg-slate-200 rounded-full group-hover:bg-yellow-200 transition-colors" />
                            )}

                            <div className="flex justify-between items-start mb-6">
                              <div
                                className={`
                                px-3 py-1 text-[10px] font-black rounded-md uppercase tracking-[0.2em]
                                ${lesson.type === "test" ? "bg-amber-100 text-amber-700" : "bg-yellow-50 text-yellow-600"}
                              `}
                              >
                                {lesson.type}
                              </div>
                              {isLocked ? (
                                <Lock className="w-6 h-6 text-slate-300" />
                              ) : isCompleted ? (
                                <div className="w-8 h-8 bg-yellow-400 text-[#4a3728] rounded-full flex items-center justify-center shadow-lg shadow-black/10">
                                  <CheckCircle2 className="w-5 h-5" />
                                </div>
                              ) : (
                                <PlayCircle className="w-8 h-8 text-yellow-500 group-hover:scale-110 transition-transform" />
                              )}
                            </div>

                            <h3 className="text-xl font-serif font-black text-[#4a3728] mb-2 uppercase tracking-tight group-hover:text-yellow-600 transition-colors">
                              {lesson.title}
                            </h3>
                            <p className="text-sm text-slate-500 font-serif italic mb-8 line-clamp-2">
                              &quot;{lesson.description}&quot;
                            </p>

                            <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-500" />
                                {lesson.targetAccuracy}% ACC
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-emerald-500" />
                                {lesson.targetWpm} WPM
                              </div>
                            </div>
                            
                            {isCompleted && (
                              <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
                                <div className="text-xs font-bold text-emerald-600">PASSED</div>
                                <div className="flex gap-3 text-[10px] font-bold text-slate-400">
                                  <span>{completedLessons[lesson.id].wpm} WPM</span>
                                  <span>{completedLessons[lesson.id].accuracy}%</span>
                                </div>
                              </div>
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              ))}

              {customLessons.length > 0 && (
                <section className="relative">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl -rotate-3 border-4 border-white">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-serif font-black text-[#4a3728] uppercase tracking-tight">
                        Custom Studio
                      </h2>
                      <p className="text-slate-500 font-serif italic">Your personalized typing exercises.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {customLessons.map((lesson, i) => {
                      const isCompleted = !!completedLessons[lesson.id];

                      return (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Link
                            href={`/training/${lesson.id}`}
                            className="group relative block p-8 rounded-sm transition-all duration-300 bg-white border-2 border-slate-200 hover:border-emerald-400 hover:shadow-[12px_12px_0px_rgba(16,185,129,0.1)] hover:-translate-y-1"
                          >
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-8 bg-slate-200 rounded-full group-hover:bg-emerald-200 transition-colors" />

                            <div className="flex justify-between items-start mb-6">
                              <div className="px-3 py-1 text-[10px] font-black rounded-md uppercase tracking-[0.2em] bg-emerald-50 text-emerald-600">
                                {lesson.type}
                              </div>
                              {isCompleted ? (
                                <div className="w-8 h-8 bg-emerald-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-black/10">
                                  <CheckCircle2 className="w-5 h-5" />
                                </div>
                              ) : (
                                <PlayCircle className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
                              )}
                            </div>

                            <h3 className="text-xl font-serif font-black text-[#4a3728] mb-2 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                              {lesson.title}
                            </h3>
                            <p className="text-sm text-slate-500 font-serif italic mb-8 line-clamp-2">
                              &quot;{lesson.description}&quot;
                            </p>

                            <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-emerald-500" />
                                {lesson.contentVariations[0].length} Chars
                              </div>
                            </div>
                            
                            {isCompleted && (
                              <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
                                <div className="text-xs font-bold text-emerald-600">PASSED</div>
                                <div className="flex gap-3 text-[10px] font-bold text-slate-400">
                                  <span>{completedLessons[lesson.id].wpm} WPM</span>
                                  <span>{completedLessons[lesson.id].accuracy}%</span>
                                </div>
                              </div>
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Right Column: Stats & Social */}
          <div className="lg:col-span-4 space-y-8">
            <DailyChallenge />
            <ProgressChart />
            <DuelComponent />
            <LeagueBoard />
            <HonorRoll />
            <AchievementBadges />
            
            <div className="bg-slate-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <h3 className="font-serif font-bold text-xl mb-6 relative z-10">Academy Progress</h3>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">
                    <span>Experience Points</span>
                    <span>{xp} XP</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(xp % 100)}%` }}
                      className="h-full bg-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lessons</p>
                    <p className="text-2xl font-serif font-bold">{Object.keys(completedLessons).length}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Speed</p>
                    <p className="text-2xl font-serif font-bold">
                      {Object.values(completedLessons).length > 0 
                        ? Math.round(Object.values(completedLessons).reduce((a, b) => a + b.wpm, 0) / Object.values(completedLessons).length)
                        : 0
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
