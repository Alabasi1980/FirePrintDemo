'use client'

import { motion } from "motion/react";
import { Trophy, Medal, Star } from "lucide-react";

const MOCK_LEADERBOARD = [
  { name: "Ahmed", wpm: 85, accuracy: 99, level: 12 },
  { name: "Sara", wpm: 78, accuracy: 98, level: 10 },
  { name: "Yousef", wpm: 72, accuracy: 97, level: 9 },
  { name: "Layla", wpm: 65, accuracy: 99, level: 8 },
  { name: "Omar", wpm: 60, accuracy: 96, level: 7 },
];

export function HonorRoll() {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Trophy className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-slate-800">Honor Roll</h3>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Top Academy Students</p>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_LEADERBOARD.map((student, index) => (
          <motion.div
            key={student.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                index === 0 ? 'bg-yellow-400 text-white' :
                index === 1 ? 'bg-slate-300 text-white' :
                index === 2 ? 'bg-orange-300 text-white' :
                'bg-slate-100 text-slate-400'
              }`}>
                {index + 1}
              </div>
              <div>
                <p className="font-bold text-slate-700">{student.name}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Level {student.level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold text-emerald-600">{student.wpm} <span className="text-[10px] uppercase">WPM</span></p>
              <p className="text-[10px] text-slate-400 font-bold">{student.accuracy}% ACC</p>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold uppercase tracking-widest hover:border-emerald-400 hover:text-emerald-500 transition-all">
        View Full Rankings
      </button>
    </div>
  );
}
