"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";

interface DuelContextType {
  duelId: string | null;
  socketId: string | null;
  isConnected: boolean;
  status: 'idle' | 'waiting' | 'ready' | 'starting' | 'racing' | 'finished';
  text: string;
  opponentStats: { wpm: number; accuracy: number; progress: number } | null;
  result: { winnerId: string; betAmount: number } | null;
  joinDuel: (duelId: string, betAmount: number) => void;
  sendUpdate: (wpm: number, accuracy: number, progress: number) => void;
  completeDuel: (winnerId: string, betAmount: number) => void;
  resetDuel: () => void;
}

const DuelContext = createContext<DuelContextType | undefined>(undefined);

export const DuelProvider = ({ children }: { children: React.ReactNode }) => {
  const [duelId, setDuelId] = useState<string | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [status, setStatus] = useState<'idle' | 'waiting' | 'ready' | 'starting' | 'racing' | 'finished'>('idle');
  const [text, setText] = useState("");
  const [opponentStats, setOpponentStats] = useState<{ wpm: number; accuracy: number; progress: number } | null>(null);
  const [result, setResult] = useState<{ winnerId: string; betAmount: number } | null>(null);

  const resetDuel = () => {
    setDuelId(null);
    setStatus('idle');
    setText("");
    setOpponentStats(null);
    setResult(null);
  };

  useEffect(() => {
    if (socket.connected) {
      setTimeout(() => {
        setSocketId(socket.id || null);
        setIsConnected(true);
      }, 0);
    }

    socket.on("connect", () => {
      console.log("Socket connected successfully:", socket.id);
      setSocketId(socket.id || null);
      setIsConnected(true);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error details:", err);
      setIsConnected(false);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected. Reason:", reason);
      setIsConnected(false);
    });

    socket.on("opponent-update", (data) => {
      setOpponentStats(data);
    });

    socket.on("duel-ready", (data) => {
      console.log("Duel ready event received:", data);
      setText(data.text);
      // If it's the creator and they are alone, show arena but waiting
      if (data.isCreator && data.players.length === 1) {
        setStatus('ready');
      } else {
        setStatus('starting');
      }
    });

    socket.on("duel-start", () => {
      setStatus('racing');
    });

    socket.on("duel-result", (data) => {
      setResult(data);
      setStatus('finished');
    });

    socket.on("opponent-disconnected", () => {
      if (status !== 'finished' && status !== 'idle') {
        alert("Opponent disconnected. Duel cancelled.");
        resetDuel();
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("opponent-update");
      socket.off("duel-ready");
      socket.off("duel-start");
      socket.off("duel-result");
      socket.off("opponent-disconnected");
    };
  }, [status]);

  const joinDuel = (id: string, betAmount: number) => {
    console.log(`Attempting to join duel: ${id} with bet: ${betAmount}`);
    setDuelId(id);
    setStatus('waiting');
    socket.emit("join-duel", { duelId: id, betAmount });
  };

  const sendUpdate = (wpm: number, accuracy: number, progress: number) => {
    if (duelId) {
      socket.emit("typing-update", { duelId, wpm, accuracy, progress });
    }
  };

  const completeDuel = (winnerId: string, betAmount: number) => {
    if (duelId) {
      socket.emit("duel-complete", { duelId });
    }
  };

  return (
    <DuelContext.Provider value={{ duelId, socketId, isConnected, status, text, opponentStats, result, joinDuel, sendUpdate, completeDuel, resetDuel }}>
      {children}
    </DuelContext.Provider>
  );
};

export const useDuel = () => {
  const context = useContext(DuelContext);
  if (!context) throw new Error("useDuel must be used within a DuelProvider");
  return context;
};
