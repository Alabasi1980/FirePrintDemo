'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Medal, Star, Crown } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useLeaderboardStore } from '@/store/useLeaderboardStore';

export default function LeaderboardPage() {
  const { xp, level } = useUserStore();
  const { globalLeaderboard, updateUserScore } = useLeaderboardStore();

  useEffect(() => {
    updateUserScore({
      id: 'current-user',
      name: 'You',
      xp: xp,
      level: level,
      avatar: 'ME',
      isCurrentUser: true,
    });
  }, [xp, level, updateUserScore]);

  const topGlobal = globalLeaderboard.slice(0, 10).map((user, index) => ({
    ...user,
    rank: index + 1
  }));

  const topLesson = [
    { rank: 1, name: 'Omar K.', wpm: 85, accuracy: 100, avatar: 'OK' },
    { rank: 2, name: 'Sarah T.', wpm: 82, accuracy: 99, avatar: 'ST' },
    { rank: 3, name: 'Mike R.', wpm: 78, accuracy: 98, avatar: 'MR' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span className="font-semibold text-slate-800 tracking-tight">Leaderboard</span>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Hall of Fame</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Compete with typists worldwide. Earn XP by completing lessons with high accuracy and speed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Global Leaderboard */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  Global Top Typists
                </h2>
                <span className="text-slate-400 text-sm">By Total XP</span>
              </div>
              <div className="divide-y divide-slate-100">
                {topGlobal.map((user, i) => (
                  <div key={i} className={`flex items-center justify-between p-6 hover:bg-slate-50 transition-colors ${user.isCurrentUser ? 'bg-indigo-50/50' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-8 font-bold text-xl text-center ${
                        user.rank === 1 ? 'text-amber-500' :
                        user.rank === 2 ? 'text-slate-400' :
                        user.rank === 3 ? 'text-amber-700' : 'text-slate-300'
                      }`}>
                        #{user.rank}
                      </div>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${user.isCurrentUser ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-lg">
                          {user.name} {user.isCurrentUser && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full ml-2">You</span>}
                        </div>
                        <div className="text-sm text-slate-500 font-medium">Level {user.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-2xl font-bold text-indigo-600">{user.xp.toLocaleString()}</div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Lesson Leaderboard */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                  <Medal className="w-5 h-5 text-indigo-600" />
                  Lesson: Home Row Test
                </h2>
                <span className="text-indigo-600/80 text-sm">Top Scores</span>
              </div>
              <div className="divide-y divide-slate-100">
                {topLesson.map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                        {user.avatar}
                      </div>
                      <div className="font-semibold text-slate-800">{user.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-700">{user.wpm} <span className="text-xs text-slate-400 font-sans">WPM</span></div>
                      <div className="text-xs text-emerald-600 font-medium">{user.accuracy}% ACC</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <Link href="/training/en-l1-u1-5" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                  Try to beat them &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
