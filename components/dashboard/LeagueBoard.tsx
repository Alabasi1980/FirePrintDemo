"use client";

import React from "react";
import { useUserStore } from "@/store/useUserStore";
import { Trophy, Medal, ChevronUp, ChevronDown } from "lucide-react";

export const LeagueBoard = () => {
  const { league, leaguePoints } = useUserStore();

  const getLeagueColor = (l: string) => {
    switch (l) {
      case "gold": return "text-yellow-500";
      case "silver": return "text-slate-400";
      default: return "text-amber-700";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Weekly League
      </h3>

      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <Medal className={`w-10 h-10 ${getLeagueColor(league)}`} />
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Current League</p>
            <p className="text-xl font-bold text-slate-800 capitalize">{league}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-500 uppercase">League Points</p>
          <p className="text-2xl font-bold text-slate-800">{leaguePoints}</p>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-slate-400 text-center">
        {league === "gold" ? "Top 10% to stay in Gold!" : "Earn 500 points to promote to next league!"}
      </div>
    </div>
  );
};
