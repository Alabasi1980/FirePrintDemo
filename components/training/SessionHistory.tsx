import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface HistoryItem {
  wpm: number;
  accuracy: number;
  date: Date;
  title?: string;
}

interface SessionHistoryProps {
  history: HistoryItem[];
}

export function SessionHistory({ history }: SessionHistoryProps) {
  if (!history || history.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Results</h3>
      <div className="space-y-3">
        {history.map((res, i) => {
          const prevRes = history[i + 1];
          const wpmDiff = prevRes ? res.wpm - prevRes.wpm : 0;
          const accDiff = prevRes ? res.accuracy - prevRes.accuracy : 0;
          
          let label = "";
          if (i === 0) label = "Current Session";
          else if (i === 1) label = "Previous Session";
          else label = "Older Session";

          return (
            <div key={i} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border-2 ${i === 0 ? 'bg-white border-yellow-400 shadow-md' : 'bg-slate-50 border-slate-100'}`}>
              <div className="mb-2 sm:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-200 text-slate-500'}`}>
                    {label}
                  </span>
                  <span className="font-mono text-xs text-slate-400">{res.date.toLocaleTimeString()}</span>
                </div>
                {res.title && <span className="font-bold text-[#4a3728] block">{res.title}</span>}
              </div>
              
              <div className="flex gap-4">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">{res.wpm} WPM</span>
                  </div>
                  {prevRes && (
                    <span className={`text-[10px] font-bold flex items-center gap-1 mt-1 ${wpmDiff > 0 ? 'text-emerald-500' : wpmDiff < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                      {wpmDiff > 0 ? <TrendingUp className="w-3 h-3" /> : wpmDiff < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      {wpmDiff > 0 ? '+' : ''}{wpmDiff} WPM vs previous
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{res.accuracy}% ACC</span>
                  </div>
                  {prevRes && (
                    <span className={`text-[10px] font-bold flex items-center gap-1 mt-1 ${accDiff > 0 ? 'text-emerald-500' : accDiff < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                      {accDiff > 0 ? <TrendingUp className="w-3 h-3" /> : accDiff < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      {accDiff > 0 ? '+' : ''}{accDiff}% vs previous
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
