"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Zap, Trophy, ArrowRight, Clock, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurriculumStore } from '@/store/useCurriculumStore';
import { Lesson } from '@/lib/curriculum';

export const DailyChallenge = () => {
  const router = useRouter();
  const { lessons } = useCurriculumStore();
  
  // For demo purposes, we'll pick a lesson as the "Daily Challenge"
  // In a real app, this would be fetched from a server or based on the date
  const dailyLesson = lessons.find(l => l.type === 'test' && l.language === 'en') || lessons[0];

  const handleStart = () => {
    router.push(`/training/${dailyLesson.id}?challenge=daily`);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-500" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/10 rounded-full -ml-16 -mb-16 blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-indigo-900 shadow-lg animate-pulse">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 block mb-1">Limited Time</span>
            <h3 className="text-2xl font-serif font-black uppercase tracking-tight">Daily Challenge</h3>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-8">
          <h4 className="text-xl font-serif font-bold mb-2">{dailyLesson.title}</h4>
          <p className="text-indigo-100 text-sm italic mb-6 opacity-80">
            &quot;Push your limits today. Complete this challenge to earn double XP and a special badge.&quot;
          </p>
          
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-black uppercase tracking-widest">{dailyLesson.targetAccuracy}% Acc</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-black uppercase tracking-widest">{dailyLesson.targetWpm} WPM</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-black uppercase tracking-widest">2x XP</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleStart}
          className="w-full py-4 bg-yellow-400 text-indigo-900 font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-xl flex items-center justify-center gap-3 group/btn"
        >
          Accept Challenge
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
