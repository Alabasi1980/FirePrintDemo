"use client";

import React from "react";
import { useUserStore } from "@/store/useUserStore";
import { Activity, Zap, Target } from "lucide-react";
import { motion } from "motion/react";

export const DiagnosticDashboard = () => {
  const { keyStats, completedLessons } = useUserStore();

  // 1. Slowest Transitions
  const allTransitions = keyStats ? Object.entries(keyStats).flatMap(([key, stat]) =>
    stat.transitions ? Object.entries(stat.transitions).map(([trans, data]) => ({
      trans,
      avgLatency: data.count > 0 ? data.totalLatency / data.count : 0,
      count: data.count,
    })) : []
  ) : [];

  const slowestTransitions = allTransitions
    .filter((t) => t.count > 3) // Ignore rare transitions
    .sort((a, b) => b.avgLatency - a.avgLatency)
    .slice(0, 5);

  // 2. Performance Prediction (Simple Linear Regression on WPM)
  const lessonsArray = completedLessons ? Object.values(completedLessons) : [];
  let prediction = "Keep practicing!";
  if (lessonsArray.length >= 3) {
    const wpmValues = lessonsArray.map((l) => l.wpm);
    const x = lessonsArray.map((_, i) => i);
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = wpmValues.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * wpmValues[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    if (slope > 0) {
      const lessonsTo80 = Math.ceil((80 - intercept) / slope);
      prediction = `Estimated 80 WPM in ${Math.max(0, lessonsTo80 - lessonsArray.length)} more lessons.`;
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-yellow-500" />
        Diagnostic Insights
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slowest Transitions */}
        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="text-sm font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Slowest Transitions
          </h4>
          <ul className="space-y-2">
            {slowestTransitions.map((t, i) => (
              <li key={i} className="flex justify-between text-sm font-mono bg-white p-2 rounded border border-slate-100">
                <span>{t.trans}</span>
                <span className="text-red-500 font-bold">{Math.round(t.avgLatency)}ms</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prediction */}
        <div className="bg-slate-50 p-4 rounded-lg flex flex-col justify-center items-center text-center">
          <h4 className="text-sm font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Performance Prediction
          </h4>
          <p className="text-2xl font-serif font-bold text-slate-800">{prediction}</p>
        </div>
      </div>
    </div>
  );
};
