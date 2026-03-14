"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/useUserStore';
import { ArrowLeft, Activity, Target, Zap, AlertTriangle, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

// Simple mapping of characters to fingers for English and Arabic
const FINGER_MAP: Record<string, string> = {
  // English
  'q': 'Left Pinky', 'a': 'Left Pinky', 'z': 'Left Pinky', '1': 'Left Pinky',
  'w': 'Left Ring', 's': 'Left Ring', 'x': 'Left Ring', '2': 'Left Ring',
  'e': 'Left Middle', 'd': 'Left Middle', 'c': 'Left Middle', '3': 'Left Middle',
  'r': 'Left Index', 'f': 'Left Index', 'v': 'Left Index', 't': 'Left Index', 'g': 'Left Index', 'b': 'Left Index', '4': 'Left Index', '5': 'Left Index',
  'y': 'Right Index', 'h': 'Right Index', 'n': 'Right Index', 'u': 'Right Index', 'j': 'Right Index', 'm': 'Right Index', '6': 'Right Index', '7': 'Right Index',
  'i': 'Right Middle', 'k': 'Right Middle', ',': 'Right Middle', '8': 'Right Middle',
  'o': 'Right Ring', 'l': 'Right Ring', '.': 'Right Ring', '9': 'Right Ring',
  'p': 'Right Pinky', ';': 'Right Pinky', '/': 'Right Pinky', '0': 'Right Pinky', '-': 'Right Pinky', '=': 'Right Pinky',
  'space': 'Thumbs',
  // Arabic (Standard mapping)
  'ض': 'Left Pinky', 'ش': 'Left Pinky', 'ئ': 'Left Pinky',
  'ص': 'Left Ring', 'س': 'Left Ring', 'ء': 'Left Ring',
  'ث': 'Left Middle', 'ي': 'Left Middle', 'ؤ': 'Left Middle',
  'ق': 'Left Index', 'ف': 'Left Index', 'ر': 'Left Index', 'غ': 'Left Index', 'ع': 'Left Index', 'لا': 'Left Index',
  'ه': 'Right Index', 'خ': 'Right Index', 'ح': 'Right Index', 'ج': 'Right Index', 'د': 'Right Index', 'ذ': 'Right Index', 'ط': 'Right Index', 'ك': 'Right Index', 'م': 'Right Index', 'ن': 'Right Index', 'ت': 'Right Index', 'ا': 'Right Index', 'ل': 'Right Index', 'ب': 'Right Index',
};

// Standard QWERTY layout for the heatmap
const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

const ARABIC_ROWS = [
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
  ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
  ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ']
];

export default function AnalyticsPage() {
  const { keyStats, clearKeyStats } = useUserStore();

  const { fingerStats, worstKeys, bestKeys, overallAccuracy } = useMemo(() => {
    let totalHits = 0;
    let totalErrors = 0;
    
    const fStats: Record<string, { hits: number, errors: number, latency: number }> = {};
    const keyArray = Object.entries(keyStats).map(([key, stat]) => {
      totalHits += stat.hits;
      totalErrors += stat.errors;
      
      const finger = FINGER_MAP[key] || 'Unknown';
      if (!fStats[finger]) fStats[finger] = { hits: 0, errors: 0, latency: 0 };
      fStats[finger].hits += stat.hits;
      fStats[finger].errors += stat.errors;
      fStats[finger].latency += stat.totalLatency;
      
      return {
        key,
        ...stat,
        errorRate: stat.hits + stat.errors > 0 ? stat.errors / (stat.hits + stat.errors) : 0,
        avgLatency: stat.hits + stat.errors > 0 ? stat.totalLatency / (stat.hits + stat.errors) : 0
      };
    }).filter(k => k.hits + k.errors >= 5); // Only consider keys with at least 5 attempts

    const sortedByError = [...keyArray].sort((a, b) => b.errorRate - a.errorRate);
    const sortedByLatency = [...keyArray].sort((a, b) => b.avgLatency - a.avgLatency);

    return {
      fingerStats: fStats,
      worstKeys: sortedByError.slice(0, 5),
      bestKeys: [...sortedByError].reverse().slice(0, 5),
      overallAccuracy: totalHits + totalErrors > 0 ? (totalHits / (totalHits + totalErrors)) * 100 : 0
    };
  }, [keyStats]);

  const getHeatmapColor = (key: string) => {
    const stat = keyStats[key];
    if (!stat || (stat.hits + stat.errors) < 3) return 'bg-slate-100 text-slate-400 border-slate-200'; // Not enough data
    
    const errorRate = stat.errors / (stat.hits + stat.errors);
    
    if (errorRate > 0.15) return 'bg-red-100 text-red-700 border-red-200 shadow-[0_0_10px_rgba(239,68,68,0.3)]'; // High error
    if (errorRate > 0.05) return 'bg-amber-100 text-amber-700 border-amber-200'; // Medium error
    return 'bg-emerald-100 text-emerald-700 border-emerald-200'; // Good
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2 flex-1">
            <Activity className="w-6 h-6 text-indigo-600" />
            Performance Analytics
          </h1>
          <button 
            onClick={() => {
              // Using a simple confirm since window.confirm isn't ideal in an iframe
              // but for this prototype, we'll just clear it directly or use a custom modal
              // For now, we'll just clear it to keep it simple and functional in the iframe
              clearKeyStats();
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear Data</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Overall Accuracy</p>
              <p className="text-2xl font-bold text-slate-800">{overallAccuracy.toFixed(1)}%</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Most Problematic Key</p>
              <p className="text-2xl font-bold text-slate-800 uppercase">{worstKeys[0]?.key || '-'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Strongest Key</p>
              <p className="text-2xl font-bold text-slate-800 uppercase">{bestKeys[0]?.key || '-'}</p>
            </div>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Keyboard Heatmap</h2>
              <p className="text-sm text-slate-500">Visualizing your accuracy across all lessons.</p>
            </div>
            <div className="flex gap-4 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-400"></div> Good</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Needs Practice</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-400"></div> Weak</div>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-center mb-8">
            <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">English Layout</h3>
            {KEYBOARD_ROWS.map((row, i) => (
              <div key={i} className="flex gap-2" style={{ marginLeft: `${i * 1.5}rem` }}>
                {row.map(key => (
                  <div 
                    key={key} 
                    className={`w-12 h-12 flex items-center justify-center rounded-xl border-b-4 font-mono text-lg uppercase transition-all ${getHeatmapColor(key)}`}
                  >
                    {key}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 items-center">
            <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Arabic Layout</h3>
            {ARABIC_ROWS.map((row, i) => (
              <div key={i} className="flex gap-2" style={{ marginLeft: `${i * 1.5}rem` }}>
                {row.map(key => (
                  <div 
                    key={key} 
                    className={`w-12 h-12 flex items-center justify-center rounded-xl border-b-4 font-arabic text-lg transition-all ${getHeatmapColor(key)}`}
                  >
                    {key}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Finger Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Finger Analytics</h2>
            <div className="space-y-4">
              {Object.entries(fingerStats)
                .filter(([name]) => name !== 'Unknown')
                .sort((a, b) => {
                  const errA = a[1].errors / (a[1].hits + a[1].errors);
                  const errB = b[1].errors / (b[1].hits + b[1].errors);
                  return errB - errA; // Sort by highest error rate
                })
                .map(([finger, stats]) => {
                  const total = stats.hits + stats.errors;
                  const errorRate = (stats.errors / total) * 100;
                  const avgLatency = stats.latency / total;
                  
                  return (
                    <div key={finger} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <p className="font-semibold text-slate-800">{finger}</p>
                        <p className="text-xs text-slate-500">{total} total keystrokes</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${errorRate > 10 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {errorRate.toFixed(1)}% Error Rate
                        </p>
                        <p className="text-xs text-slate-500">{Math.round(avgLatency)}ms avg speed</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Weakest Keys</h2>
            <div className="space-y-4">
              {worstKeys.length > 0 ? worstKeys.map((stat, idx) => (
                <div key={stat.key} className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                  <div className="w-10 h-10 bg-white text-red-600 font-bold text-lg rounded-xl flex items-center justify-center shadow-sm uppercase">
                    {stat.key}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold text-red-900">Error Rate</span>
                      <span className="text-sm font-bold text-red-700">{(stat.errorRate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${stat.errorRate * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-red-600 mt-2">
                      {FINGER_MAP[stat.key] || 'Unknown finger'} • {Math.round(stat.avgLatency)}ms avg latency
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center text-slate-500 py-8">
                  Not enough data yet. Keep practicing!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
