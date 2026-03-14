"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTypingStore } from "@/store/useTypingStore";
import { useUserStore } from "@/store/useUserStore";
import { motion } from "motion/react";

export function TypingArea() {
  const { currentLesson, activeContent, typedText, typeChar, deleteChar, status, startTime } =
    useTypingStore();
  const { settings } = useUserStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [ghostPosition, setGhostPosition] = useState(0);

  const currentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    
    const updateGhost = () => {
      if (status === "typing" && startTime && currentLesson) {
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        
        // Use best WPM if available, otherwise target Wpm
        const bestWpm = useUserStore.getState().completedLessons[currentLesson.id]?.wpm || currentLesson.targetWpm;
        const targetCps = (bestWpm * 5) / 60;
        
        const newGhostPos = Math.floor(elapsedSeconds * targetCps);
        setGhostPosition(Math.min(newGhostPos, activeContent.length));
      } else if (status === "idle") {
        setGhostPosition(0);
      }
      animationFrameId = requestAnimationFrame(updateGhost);
    };

    updateGhost();
    return () => cancelAnimationFrame(animationFrameId);
  }, [status, startTime, currentLesson, activeContent.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status === "finished") return;

      // Prevent default browser actions for typing keys
      if (e.key.length === 1 || e.key === "Backspace" || e.key === " ") {
        if (e.key === " ") e.preventDefault();
      }

      if (e.key === "Backspace") {
        if (!settings.strictMode) {
          deleteChar();
        }
      } else if (e.key.length === 1) {
        typeChar(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [typeChar, deleteChar, status, settings.strictMode]);

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [typedText.length]);

  if (!currentLesson) return null;

  const targetText = activeContent || "";
  const isArabic = currentLesson.language === "ar";
  const hasBestScore = !!useUserStore.getState().completedLessons[currentLesson.id];

  return (
    <div
      ref={containerRef}
      className={`
        relative w-full max-w-6xl mx-auto p-4 sm:p-6 bg-[#1a2f23] rounded-3xl shadow-2xl border-8 border-[#4a3728]
        ${isArabic ? "text-right" : "text-left"}
        h-[180px] overflow-hidden
      `}
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}
    >
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-white/10 rounded-full blur-sm" />
      
      {/* Ghost Legend */}
      <div className={`absolute top-4 ${isArabic ? 'right-4' : 'left-4'} flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 z-10`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full" />
          You
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white/20 rounded-full" />
          {hasBestScore ? "Your Best" : "Target"}
        </div>
      </div>

      <div className="h-full w-full overflow-y-hidden relative" id="typing-scroll-container">
        <div className="text-2xl sm:text-3xl font-mono leading-[1.8] tracking-wider text-white/30 break-words relative pt-4 pb-12">
          {targetText.split("").map((char, index) => {
            const typedChar = typedText[index];
            let colorClass = "text-white/20";
            let bgColorClass = "";

            if (typedChar !== undefined) {
              if (typedChar === char) {
                colorClass = "text-white shadow-[0_0_8px_rgba(255,255,255,0.5)]";
              } else {
                colorClass = "text-red-400";
                bgColorClass = "bg-red-500/20 rounded px-0.5";
              }
            }

            const isCurrent = index === typedText.length;
            const isGhost = index === ghostPosition;

            return (
              <span key={index} ref={isCurrent ? currentRef : null} className="relative inline-block">
                {isCurrent && (
                  <motion.span
                    layoutId="cursor"
                    className={`absolute top-0 bottom-0 w-1 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)] ${isArabic ? "right-0" : "left-0"}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ zIndex: 10 }}
                  />
                )}
                {isGhost && status === "typing" && (
                  <motion.span
                    layoutId="ghost-cursor"
                    className={`absolute top-0 bottom-0 w-1 bg-white/20 ${isArabic ? "right-0" : "left-0"}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-50">👻</div>
                  </motion.span>
                )}
                <span
                  className={`${colorClass} ${bgColorClass} ${char === " " && typedChar !== undefined && typedChar !== " " ? "bg-red-500/40" : ""}`}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
