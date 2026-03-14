"use client";

import React from "react";
import { useUserStore } from "@/store/useUserStore";
import { motion } from "motion/react";
import { MessageSquare, AlertCircle } from "lucide-react";

export function TeacherNote() {
  const { keyStats } = useUserStore();
  
  // Find weak keys (keys with accuracy < 80% and at least 10 attempts)
  const weakKeys = Object.entries(keyStats)
    .filter(([_, stats]) => {
      const total = stats.hits + stats.errors;
      const accuracy = (stats.hits / total) * 100;
      return total >= 10 && accuracy < 80;
    })
    .sort((a, b) => {
      const accA = (a[1].hits / (a[1].hits + a[1].errors)) * 100;
      const accB = (b[1].hits / (b[1].hits + b[1].errors)) * 100;
      return accA - accB;
    })
    .slice(0, 3);

  if (weakKeys.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-50 border-l-4 border-emerald-400 p-6 rounded-r-xl shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-1">Teacher&apos;s Note</h3>
            <p className="text-emerald-700 font-serif italic">
              &quot;Excellent work! Your accuracy is consistent across all keys. Keep maintaining this precision as you increase your speed.&quot;
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-xl shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-amber-100 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-1">Personalized Advice</h3>
          <p className="text-amber-800 font-serif italic mb-4">
            &quot;I noticed you&apos;re struggling a bit with the 
            <span className="font-bold mx-1">
              {weakKeys.map(([key], i) => (
                <span key={key}>
                  {key === " " ? "Space" : key.toUpperCase()}
                  {i < weakKeys.length - 1 ? ", " : ""}
                </span>
              ))}
            </span> 
            keys. Try to slow down slightly during lessons that feature these characters to build better muscle memory.&quot;
          </p>
          <div className="flex gap-2">
            {weakKeys.map(([key, stats]) => {
              const total = stats.hits + stats.errors;
              const accuracy = Math.round((stats.hits / total) * 100);
              return (
                <div key={key} className="px-3 py-1 bg-white border border-amber-200 rounded-full text-[10px] font-bold text-amber-700 uppercase">
                  {key === " " ? "Space" : key.toUpperCase()}: {accuracy}% Acc
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
