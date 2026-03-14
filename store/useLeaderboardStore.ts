import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  level: number;
  avatar: string;
  isCurrentUser?: boolean;
}

interface LeaderboardState {
  globalLeaderboard: LeaderboardEntry[];
  updateUserScore: (userEntry: LeaderboardEntry) => void;
}

// Generate some mock competitors
const mockCompetitors: LeaderboardEntry[] = [
  { id: 'user-1', name: 'Sarah J.', xp: 12500, level: 15, avatar: 'SJ' },
  { id: 'user-2', name: 'Ahmed K.', xp: 11200, level: 14, avatar: 'AK' },
  { id: 'user-3', name: 'Mike T.', xp: 9800, level: 12, avatar: 'MT' },
  { id: 'user-4', name: 'Fatima R.', xp: 8500, level: 11, avatar: 'FR' },
  { id: 'user-5', name: 'David W.', xp: 7200, level: 10, avatar: 'DW' },
  { id: 'user-6', name: 'Omar M.', xp: 6100, level: 9, avatar: 'OM' },
  { id: 'user-7', name: 'Elena G.', xp: 5400, level: 8, avatar: 'EG' },
  { id: 'user-8', name: 'Ali S.', xp: 4800, level: 7, avatar: 'AS' },
  { id: 'user-9', name: 'Chen L.', xp: 3200, level: 5, avatar: 'CL' },
];

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set) => ({
      globalLeaderboard: mockCompetitors,
      updateUserScore: (userEntry) => set((state) => {
        const existingIndex = state.globalLeaderboard.findIndex(e => e.isCurrentUser);
        let newLeaderboard = [...state.globalLeaderboard];
        
        if (existingIndex >= 0) {
          newLeaderboard[existingIndex] = userEntry;
        } else {
          newLeaderboard.push(userEntry);
        }
        
        // Sort by XP descending
        newLeaderboard.sort((a, b) => b.xp - a.xp);
        
        return { globalLeaderboard: newLeaderboard };
      }),
    }),
    {
      name: 'typing-leaderboard-storage',
    }
  )
);
