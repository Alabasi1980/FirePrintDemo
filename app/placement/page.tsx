'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { TypingArea } from '@/components/training/TypingArea';
import { MetricsPanel } from '@/components/training/MetricsPanel';
import { useTypingStore } from '@/store/useTypingStore';
import { motion } from 'motion/react';
import { Trophy, ArrowRight } from 'lucide-react';

const PLACEMENT_TEXT = "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet, making it perfect for a typing test. Focus on accuracy first, then let your speed naturally increase. Good luck!";

export default function PlacementTest() {
  const router = useRouter();
  const { addXp } = useUserStore();
  const { 
    status, 
    startLesson, 
    resetLesson, 
    wpm, 
    accuracy, 
    calculateMetrics 
  } = useTypingStore();
  
  const [testCompleted, setTestCompleted] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  // Calculate metrics in real-time while typing
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'typing') {
      interval = setInterval(() => {
        calculateMetrics();
      }, 1000); // Update every second
    }
    return () => clearInterval(interval);
  }, [status, calculateMetrics]);

  // Initialize the test
  React.useEffect(() => {
    resetLesson();
    startLesson({
      id: 'placement-test',
      title: 'Placement Test',
      description: 'Find your starting level',
      language: 'en',
      level: 1,
      unit: 1,
      type: 'test',
      domain: 'general',
      contentVariations: [PLACEMENT_TEXT],
      targetWpm: 0,
      targetAccuracy: 0,
      xpReward: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle completion
  React.useEffect(() => {
    if (status === 'finished' && !testCompleted) {
      calculateMetrics();
      
      // Calculate XP based on performance
      // Base XP for completing the test
      let calculatedXp = 500; 
      
      // Bonus for speed
      if (wpm > 20) calculatedXp += (wpm - 20) * 10;
      
      // Penalty for low accuracy
      if (accuracy < 90) calculatedXp -= (90 - accuracy) * 20;
      
      // Ensure positive XP
      calculatedXp = Math.max(100, Math.floor(calculatedXp));
      
      setEarnedXp(calculatedXp);
      addXp(calculatedXp);
      setTestCompleted(true);
    }
  }, [status, testCompleted, wpm, accuracy, calculateMetrics, addXp]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Placement Test</h1>
          <p className="text-slate-600">Type the text below to determine your starting level and earn bonus XP.</p>
        </div>

        {!testCompleted ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <MetricsPanel />
            <div className="mt-4">
              <TypingArea />
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center"
          >
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Test Completed!</h2>
            <p className="text-slate-600 mb-8">Here are your results:</p>
            
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-50 p-6 rounded-2xl">
                <div className="text-sm text-slate-500 font-medium mb-1">Speed</div>
                <div className="text-4xl font-bold text-slate-800">{wpm} <span className="text-lg text-slate-500">WPM</span></div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl">
                <div className="text-sm text-slate-500 font-medium mb-1">Accuracy</div>
                <div className="text-4xl font-bold text-slate-800">{accuracy}%</div>
              </div>
              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <div className="text-sm text-indigo-600 font-medium mb-1">Bonus XP</div>
                <div className="text-4xl font-bold text-indigo-700">+{earnedXp}</div>
              </div>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
