'use client'

import { motion } from "motion/react";
import { useUserStore } from "@/store/useUserStore";
import { Award, Lock } from "lucide-react";

export function AchievementBadges() {
  const { achievements } = useUserStore();

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Award className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-slate-800">Medal Case</h3>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Your Achievements</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {achievements.length > 0 ? (
          achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, delay: index * 0.1 }}
              className="group relative flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-full border-2 border-yellow-200 flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform cursor-help">
                {achievement.icon}
              </div>
              <p className="mt-2 text-[10px] font-black text-slate-500 uppercase tracking-tighter text-center leading-tight">
                {achievement.title}
              </p>
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                <p className="font-bold mb-1">{achievement.title}</p>
                <p className="text-slate-300">{achievement.description}</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-3 py-8 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-xl">
            <Lock className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-[10px] font-bold uppercase tracking-widest">No medals earned yet</p>
          </div>
        )}
      </div>

      {achievements.length > 0 && (
        <p className="mt-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {achievements.length} Medals Collected
        </p>
      )}
    </div>
  );
}
