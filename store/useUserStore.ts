import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface KeyStat {
  errors: number;
  hits: number;
  totalLatency: number; // in milliseconds
  transitions: Record<string, { totalLatency: number; count: number }>; // A->B: { totalLatency, count }
}

interface UserSettings {
  strictMode: boolean;
  soundEnabled: boolean;
  showKeyboard: boolean;
  deepWorkMode: boolean; // Added deepWorkMode
  uiLanguage: "en" | "ar";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

interface UserState {
  role: "student" | "trainer" | "admin";
  classId?: string; // Added classId
  xp: number;
  level: number;
  league: "bronze" | "silver" | "gold";
  leaguePoints: number;
  completedLessons: Record<string, { wpm: number; accuracy: number; xpEarned: number; date: string }>;
  keyStats: Record<string, KeyStat>;
  settings: UserSettings;
  streak: number;
  lastPracticeDate: string | null;
  achievements: Achievement[];
  
  setRole: (role: "student" | "trainer" | "admin") => void;
  setClassId: (classId: string) => void; // Added setClassId
  updateLeaguePoints: (amount: number) => void;
  addXp: (amount: number) => void;
  recordLessonCompletion: (lessonId: string, wpm: number, accuracy: number, xpEarned: number) => void;
  recordKeyStats: (stats: { key: string; nextKey?: string; isError: boolean; latency: number }[]) => void;
  clearKeyStats: () => void;
  getWeakKeys: (threshold?: number) => string[];
  updateSettings: (settings: Partial<UserSettings>) => void;
  getWeakTransitions: (threshold?: number) => string[];
  checkAchievements: (wpm: number, accuracy: number) => void;
  updateStreak: () => void;
}

const calculateLevel = (xp: number) => {
  return Math.floor((1 + Math.sqrt(1 + 8 * xp / 50)) / 2);
};

const ACHIEVEMENTS_LIST = [
  { id: 'first_lesson', title: 'First Step', description: 'Complete your first lesson', icon: '🎓' },
  { id: 'speed_30', title: 'Speed Demon', description: 'Reach 30 WPM', icon: '⚡' },
  { id: 'speed_60', title: 'Sonic Fingers', description: 'Reach 60 WPM', icon: '🚀' },
  { id: 'perfect', title: 'Sniper', description: '100% Accuracy in a lesson', icon: '🎯' },
  { id: 'streak_3', title: 'Consistent', description: '3-day practice streak', icon: '🔥' },
  { id: 'streak_7', title: 'Academy Regular', description: '7-day practice streak', icon: '🏛️' },
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      role: 'student', // Default to student
      classId: undefined,
      xp: 0,
      level: 1,
      league: 'bronze',
      leaguePoints: 0,
      completedLessons: {},
      keyStats: {},
      settings: {
        strictMode: false,
        soundEnabled: true,
        showKeyboard: true,
        deepWorkMode: false,
        uiLanguage: "en",
      },
      streak: 0,
      lastPracticeDate: null,
      achievements: [],

      setRole: (role) => set({ role }),
      setClassId: (classId) => set({ classId }),
      updateLeaguePoints: (amount) => set((state) => ({
        leaguePoints: Math.max(0, state.leaguePoints + amount),
      })),

      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        return {
          xp: newXp,
          level: calculateLevel(newXp),
        };
      }),

      updateStreak: () => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        if (state.lastPracticeDate === today) return state;

        const lastDate = state.lastPracticeDate ? new Date(state.lastPracticeDate) : null;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = state.streak;
        if (state.lastPracticeDate === yesterdayStr) {
          newStreak += 1;
        } else if (!state.lastPracticeDate || state.lastPracticeDate < yesterdayStr) {
          newStreak = 1;
        }

        return {
          streak: newStreak,
          lastPracticeDate: today,
        };
      }),

      checkAchievements: (wpm, accuracy) => set((state) => {
        const newAchievements = [...state.achievements];
        const unlockedIds = new Set(newAchievements.map(a => a.id));

        const checkAndAdd = (id: string) => {
          if (!unlockedIds.has(id)) {
            const template = ACHIEVEMENTS_LIST.find(a => a.id === id);
            if (template) {
              newAchievements.push({
                ...template,
                unlockedAt: new Date().toISOString()
              });
            }
          }
        };

        // Logic for unlocking
        checkAndAdd('first_lesson');
        if (wpm >= 30) checkAndAdd('speed_30');
        if (wpm >= 60) checkAndAdd('speed_60');
        if (accuracy === 100) checkAndAdd('perfect');
        if (state.streak >= 3) checkAndAdd('streak_3');
        if (state.streak >= 7) checkAndAdd('streak_7');

        return { achievements: newAchievements };
      }),

      recordLessonCompletion: (lessonId, wpm, accuracy, xpEarned) => {
        const { updateStreak, checkAchievements, addXp } = get();
        
        updateStreak();
        checkAchievements(wpm, accuracy);
        addXp(xpEarned);

        set((state) => {
          const existing = state.completedLessons[lessonId];
          const newLeaguePoints = state.leaguePoints + Math.round(xpEarned / 10);
          
          if (!existing || (wpm * accuracy) > (existing.wpm * existing.accuracy)) {
            return {
              leaguePoints: newLeaguePoints,
              completedLessons: {
                ...state.completedLessons,
                [lessonId]: { wpm, accuracy, xpEarned, date: new Date().toISOString() },
              },
            };
          }
          return { leaguePoints: newLeaguePoints };
        });
      },

      recordKeyStats: (stats) => set((state) => {
        const newKeyStats = { ...state.keyStats };
        
        stats.forEach(({ key, nextKey, isError, latency }) => {
          if (!key) return;
          // Normalize key (e.g., lowercase, handle space)
          const normalizedKey = key === ' ' ? 'Space' : key.toLowerCase();
          
          if (!newKeyStats[normalizedKey]) {
            newKeyStats[normalizedKey] = { errors: 0, hits: 0, totalLatency: 0, transitions: {} };
          } else if (!newKeyStats[normalizedKey].transitions) {
            newKeyStats[normalizedKey].transitions = {};
          }
          
          if (isError) {
            newKeyStats[normalizedKey].errors += 1;
          } else {
            newKeyStats[normalizedKey].hits += 1;
          }
          
          // Only add valid latency (ignore huge pauses > 5s)
          if (latency > 0 && latency < 5000) {
            newKeyStats[normalizedKey].totalLatency += latency;
            
            // Track transition latency
            if (nextKey) {
              const normalizedNextKey = nextKey === ' ' ? 'Space' : nextKey.toLowerCase();
              const transitionKey = `${normalizedKey}->${normalizedNextKey}`;
              
              if (!newKeyStats[normalizedKey].transitions[transitionKey]) {
                newKeyStats[normalizedKey].transitions[transitionKey] = { totalLatency: 0, count: 0 };
              }
              
              newKeyStats[normalizedKey].transitions[transitionKey].totalLatency += latency;
              newKeyStats[normalizedKey].transitions[transitionKey].count += 1;
            }
          }
        });

        return { keyStats: newKeyStats };
      }),

      clearKeyStats: () => set({ keyStats: {} }),
      
      getWeakKeys: (threshold = 0.15) => {
        const { keyStats } = get();
        return Object.entries(keyStats)
          .filter(([_, stat]) => {
            const total = stat.hits + stat.errors;
            if (total < 5) return false;
            return (stat.errors / total) > threshold;
          })
          .map(([key]) => key);
      },

      getWeakTransitions: (threshold = 400) => {
        const { keyStats } = get();
        const weakTransitions: string[] = [];
        Object.values(keyStats).forEach(stat => {
          if (stat.transitions) {
            Object.entries(stat.transitions).forEach(([trans, data]) => {
              const avgLatency = data.totalLatency / data.count;
              if (data.count >= 3 && avgLatency > threshold) {
                weakTransitions.push(trans);
              }
            });
          }
        });
        return weakTransitions;
      },

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
    }),
    {
      name: 'typing-user-storage',
    }
  )
);
