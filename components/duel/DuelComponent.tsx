"use client";

import React, { useState } from "react";
import { useDuel } from "@/components/duel/DuelProvider";
import { socket } from "@/lib/socket";
import { Sword, Plus, LogIn, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { DuelArena } from "@/components/duel/DuelArena";

export const DuelComponent = () => {
  const { duelId, joinDuel, isConnected } = useDuel();
  const [inputDuelId, setInputDuelId] = useState("");
  const [mode, setMode] = useState<'lobby' | 'join' | 'create'>('lobby');

  const handleCreate = () => {
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    joinDuel(randomId, 50);
  };

  const handleJoin = () => {
    if (inputDuelId.trim()) {
      joinDuel(inputDuelId.trim().toUpperCase(), 50);
    }
  };

  if (duelId) {
    return <DuelArena />;
  }

  return (
    <div className="space-y-6">
      {!isConnected && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between gap-3 text-red-600">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 animate-pulse" />
            <p className="text-xs font-black uppercase tracking-widest">Disconnected from Battle Server. Reconnecting...</p>
          </div>
          <button 
            onClick={() => {
              socket.connect();
              console.log("Manual connection attempt triggered");
            }}
            className="px-4 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-600 transition-all shadow-md"
          >
            Reconnect Now
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl p-8 border-2 border-slate-100 shadow-xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg">
          <Sword className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-serif font-black text-[#4a3728] text-2xl uppercase tracking-tight">Duel Lobby</h3>
          <p className="text-slate-500 font-serif italic">Challenge other students in real-time typing battles.</p>
        </div>
      </div>

      {mode === 'lobby' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setMode('create')}
            className="p-8 rounded-xl border-2 border-slate-100 hover:border-red-400 hover:bg-red-50 transition-all text-center group"
          >
            <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <h4 className="font-black uppercase tracking-widest text-sm text-[#4a3728] mb-1">Create Duel</h4>
            <p className="text-xs text-slate-400 font-serif italic">Start a new room and invite a friend</p>
          </button>

          <button 
            onClick={() => setMode('join')}
            className="p-8 rounded-xl border-2 border-slate-100 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-center group"
          >
            <div className="w-16 h-16 bg-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <LogIn className="w-8 h-8" />
            </div>
            <h4 className="font-black uppercase tracking-widest text-sm text-[#4a3728] mb-1">Join Duel</h4>
            <p className="text-xs text-slate-400 font-serif italic">Enter a Duel ID to join an existing battle</p>
          </button>
        </div>
      )}

      {mode === 'create' && (
        <div className="text-center space-y-6">
          <div className="p-8 bg-red-50 rounded-xl border-2 border-red-100">
            <h4 className="text-red-900 font-black uppercase tracking-widest text-sm mb-4">Confirm New Duel</h4>
            <p className="text-red-700 text-sm italic mb-8">Creating a duel will cost 50 LP. You will get them back plus your opponent&apos;s bet if you win!</p>
            <button 
              onClick={handleCreate}
              className="w-full py-4 bg-red-500 text-white font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all shadow-lg"
            >
              Create Room (50 LP)
            </button>
          </div>
          <button onClick={() => setMode('lobby')} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">Back to Lobby</button>
        </div>
      )}

      {mode === 'join' && (
        <div className="space-y-6">
          <div className="p-8 bg-indigo-50 rounded-xl border-2 border-indigo-100">
            <h4 className="text-indigo-900 font-black uppercase tracking-widest text-sm mb-4">Enter Duel ID</h4>
            <input 
              type="text" 
              value={inputDuelId}
              onChange={(e) => setInputDuelId(e.target.value)}
              placeholder="e.g. XJ7K2P"
              className="w-full p-4 bg-white border-2 border-indigo-200 rounded-xl font-mono text-center text-2xl focus:border-indigo-500 outline-none mb-6 uppercase"
            />
            <button 
              onClick={handleJoin}
              className="w-full py-4 bg-indigo-500 text-white font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all shadow-lg"
            >
              Join Battle
            </button>
          </div>
          <button onClick={() => setMode('lobby')} className="text-center w-full block text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-500 transition-colors">Back to Lobby</button>
        </div>
      )}
      </div>
    </div>
  );
};
