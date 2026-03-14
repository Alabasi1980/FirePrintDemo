"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDuel } from "@/components/duel/DuelProvider";
import { useUserStore } from "@/store/useUserStore";
import { Sword, Trophy, Timer, Zap, AlertCircle, Copy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

export const DuelArena = () => {
  const { duelId, socketId, status, text, opponentStats, sendUpdate, completeDuel, result, resetDuel } = useDuel();
  const { updateLeaguePoints } = useUserStore();
  
  const [typedText, setTypedText] = useState("");
  const startTimeRef = useRef<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [countdown, setCountdown] = useState(3);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Countdown logic
  useEffect(() => {
    if (status === 'starting') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status]);

  // Focus input when racing starts
  useEffect(() => {
    if (status === 'racing') {
      inputRef.current?.focus();
      startTimeRef.current = Date.now();
    }
  }, [status]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status !== 'racing') return;
    
    const value = e.target.value;
    if (value.length > text.length) return;
    
    setTypedText(value);
    
    // Calculate progress
    const progress = Math.round((value.length / text.length) * 100);
    
    // Calculate accuracy
    let errors = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) errors++;
    }
    const currentAccuracy = Math.round(((value.length - errors) / Math.max(1, value.length)) * 100);
    setAccuracy(currentAccuracy);
    
    // Calculate WPM
    if (startTimeRef.current) {
      const timeElapsed = (Date.now() - startTimeRef.current) / 60000; // in minutes
      const currentWpm = Math.round((value.length / 5) / Math.max(0.01, timeElapsed));
      setWpm(currentWpm);
      
      // Send update to opponent
      sendUpdate(currentWpm, currentAccuracy, progress);
    }
    
    // Check for completion
    if (value === text) {
      completeDuel(socketId || "me", 50);
    }
  };

  // Handle results
  useEffect(() => {
    if (status === 'finished' && result) {
      if (result.winnerId === socketId) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#f59e0b', '#ffffff']
        });
        updateLeaguePoints(result.betAmount);
      } else {
        updateLeaguePoints(-result.betAmount);
      }
    }
  }, [status, result, updateLeaguePoints, socketId]);

  if (status === 'starting') {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-2xl border-2 border-slate-100 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          key={countdown}
          className="text-9xl font-black text-red-500 relative z-10"
        >
          {countdown > 0 ? countdown : "GO!"}
        </motion.div>
        <p className="mt-8 text-xl font-serif font-black text-[#4a3728] uppercase tracking-widest relative z-10">Get Ready...</p>
      </div>
    );
  }

  if (status === 'finished') {
    const isWinner = result?.winnerId === socketId;
    return (
      <div className="bg-white p-12 rounded-2xl shadow-2xl border-2 border-slate-100 text-center">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ${isWinner ? 'bg-yellow-400 text-white' : 'bg-slate-100 text-slate-400'}`}>
          {isWinner ? <Trophy className="w-12 h-12" /> : <Sword className="w-12 h-12" />}
        </div>
        <h3 className="text-4xl font-serif font-black text-[#4a3728] mb-2 uppercase tracking-tight">
          {isWinner ? "Victory!" : "Defeat"}
        </h3>
        <p className="text-xl font-serif italic text-slate-500 mb-8">
          {isWinner ? `You won ${result?.betAmount} LP` : `You lost ${result?.betAmount} LP`}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Speed</p>
            <p className="text-3xl font-black text-[#4a3728]">{wpm} WPM</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Opponent Speed</p>
            <p className="text-3xl font-black text-[#4a3728]">{opponentStats?.wpm || 0} WPM</p>
          </div>
        </div>

        <button 
          onClick={resetDuel}
          className="w-full py-4 bg-[#4a3728] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#3a2a1e] transition-all shadow-lg"
        >
          Back to Lobby
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {(status === 'waiting' || status === 'ready') && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-indigo-200">
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 bg-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
              <Sword className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-black text-[#4a3728] mb-2 uppercase tracking-tight">Waiting for Challenger</h3>
            <div className="flex items-center justify-center gap-2 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-xs font-serif italic text-slate-500">Room ID: <span className="font-mono font-bold text-indigo-600 select-all">{duelId}</span></p>
              <button 
                onClick={() => {
                  if (duelId) {
                    navigator.clipboard.writeText(duelId);
                    alert("Duel ID copied to clipboard!");
                  }
                }}
                className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-indigo-600 shadow-sm"
                title="Copy ID"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex justify-center gap-2 mb-8">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            <button onClick={resetDuel} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">Cancel Battle</button>
          </div>
        </div>
      )}

      {/* Duel Header */}
      <div className="bg-[#4a3728] text-white p-6 rounded-2xl shadow-xl flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sword className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-black uppercase tracking-tight text-xl">Duel Arena</h3>
            <div className="flex items-center gap-2 text-[10px] font-black text-white/60 uppercase tracking-widest">
              <Zap className="w-3 h-3 text-yellow-400" />
              Live Battle
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">My Speed</p>
            <p className="text-2xl font-black text-white">{wpm} <span className="text-xs text-white/40">WPM</span></p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Opponent</p>
            <p className="text-2xl font-black text-red-400">{opponentStats?.wpm || 0} <span className="text-xs text-red-400/40">WPM</span></p>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-xl">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Progress</span>
            <span className="text-lg font-black text-indigo-600">{text.length > 0 ? Math.round((typedText.length / text.length) * 100) : 0}%</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${text.length > 0 ? (typedText.length / text.length) * 100 : 0}%` }}
              className="h-full bg-indigo-500 rounded-full shadow-inner"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-xl">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Opponent Progress</span>
            <span className="text-lg font-black text-red-500">{opponentStats?.progress || 0}%</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${opponentStats?.progress || 0}%` }}
              className="h-full bg-red-500 rounded-full shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Typing Area */}
      <div className="bg-white p-12 rounded-2xl border-2 border-slate-100 shadow-2xl relative">
        <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
          <AlertCircle className="w-4 h-4" />
          Accuracy: {accuracy}%
        </div>

        <div className="text-3xl font-serif leading-relaxed mb-12 select-none">
          {text.split("").map((char, i) => {
            let color = "text-slate-300";
            if (i < typedText.length) {
              color = typedText[i] === text[i] ? "text-indigo-600" : "text-red-500 bg-red-50";
            }
            return (
              <span key={i} className={`${color} transition-colors duration-100`}>
                {char}
              </span>
            );
          })}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={typedText}
          onChange={handleInput}
          disabled={status !== 'racing'}
          className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-xl font-serif text-2xl focus:border-indigo-400 focus:bg-white transition-all outline-none"
          placeholder={status === 'racing' ? "Type the text above..." : "Waiting for start..."}
        />
      </div>
    </div>
  );
};
