"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Language } from "@/lib/curriculum";

interface PreTestProps {
  language: Language;
  onComplete: (results: { wpm: number; accuracy: number }) => void;
}

const PRE_TEST_SENTENCES: Record<Language, string[]> = {
  en: [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "Bright vixens jump; dozy fowl quack."
  ],
  ar: [
    "نص تجريبي لاختبار سرعة الكتابة في القاعة الدراسية.",
    "الطباعة السريعة مهارة أساسية في العصر الرقمي.",
    "العلم نور والجهل ظلام في كل زمان ومكان.",
    "تطورت التكنولوجيا بشكل مذهل في السنوات الأخيرة."
  ]
};

export function PreTest({ language, onComplete }: PreTestProps) {
  const [targetText] = useState(() => {
    const sentences = PRE_TEST_SENTENCES[language];
    return sentences[Math.floor(Math.random() * sentences.length)];
  });
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key.length === 1) {
      if (!startTime) setStartTime(Date.now());
      
      const char = e.key;
      const targetChar = targetText[typedText.length];
      
      if (char !== targetChar) {
        setErrors(prev => prev + 1);
      }
      
      const newTypedText = typedText + char;
      setTypedText(newTypedText);
      
      if (newTypedText.length === targetText.length) {
        const endTime = Date.now();
        const minutes = (endTime - (startTime || endTime)) / 60000;
        const wpm = Math.round((newTypedText.length / 5) / (minutes || 0.01));
        const accuracy = Math.round(((newTypedText.length - errors) / newTypedText.length) * 100);
        
        onComplete({ wpm, accuracy });
      }
    } else if (e.key === "Backspace") {
      setTypedText(prev => prev.slice(0, -1));
    }
  }, [typedText, targetText, startTime, errors, onComplete]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="font-mono text-2xl leading-relaxed relative" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Target Text (Ghost) */}
      <div className="text-slate-400 select-none">
        {targetText}
      </div>
      
      {/* Typed Text */}
      <div className="absolute top-0 left-0 right-0">
        {typedText.split("").map((char, i) => {
          const isCorrect = char === targetText[i];
          return (
            <span 
              key={i} 
              className={isCorrect ? "text-emerald-500" : "text-red-500 underline decoration-red-500"}
            >
              {char}
            </span>
          );
        })}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-0.5 h-8 bg-emerald-500 align-middle ml-0.5"
        />
      </div>
    </div>
  );
}
