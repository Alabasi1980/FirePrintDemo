"use client";

import React from "react";
import { useTypingStore } from "@/store/useTypingStore";
import { Activity, Target, AlertTriangle, Music } from "lucide-react";

export function MetricsPanel() {
  const { wpm, accuracy, errors, rhythmScore } = useTypingStore();

  return (
    <div className="flex justify-center gap-4 sm:gap-8 p-2 sm:p-3 bg-white/50 backdrop-blur-sm rounded-full shadow-sm border border-slate-200 w-fit mx-auto">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-emerald-500" />
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-slate-800">{wpm}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">WPM</span>
        </div>
      </div>

      <div className="w-px bg-slate-200 h-6 self-center" />

      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-blue-500" />
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-slate-800">{accuracy}%</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden sm:inline">ACC</span>
        </div>
      </div>

      <div className="w-px bg-slate-200 h-6 self-center" />

      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-slate-800">{errors}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden sm:inline">ERR</span>
        </div>
      </div>

      <div className="w-px bg-slate-200 h-6 self-center" />

      <div className="flex items-center gap-2">
        <Music className="w-4 h-4 text-purple-500" />
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-slate-800">{rhythmScore}%</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden sm:inline">RHY</span>
        </div>
      </div>
    </div>
  );
}
