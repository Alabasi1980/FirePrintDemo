"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useUserStore } from '@/store/useUserStore';

export const ProgressChart = () => {
  const { completedLessons } = useUserStore();
  
  // Transform completedLessons into chart data
  const data = Object.values(completedLessons)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((session, index) => ({
      name: `L${index + 1}`,
      wpm: session.wpm,
      accuracy: session.accuracy,
    }))
    .slice(-10); // Show last 10 sessions

  if (data.length < 2) {
    return (
      <div className="bg-white rounded-2xl p-8 border-2 border-slate-100 shadow-xl flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="font-serif font-bold text-slate-400">Not enough data yet</h3>
        <p className="text-xs text-slate-300 uppercase tracking-widest mt-2">Complete more lessons to see your progress</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-slate-100 shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-serif font-black text-[#4a3728] text-xl uppercase tracking-tight">Performance Analytics</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your last 10 sessions</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">WPM</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accuracy</span>
          </div>
        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="wpm" 
              stroke="#6366f1" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorWpm)" 
            />
            <Area 
              type="monotone" 
              dataKey="accuracy" 
              stroke="#10b981" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorAcc)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
