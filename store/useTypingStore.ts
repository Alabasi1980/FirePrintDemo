import { create } from "zustand";
import { Lesson, generateRemedialLesson } from "@/lib/curriculum";

interface TypingState {
  currentLesson: Lesson | null;
  remedialLesson: Lesson | null; // Added remedialLesson
  activeContent: string; // The specific variation chosen for this session
  typedText: string;
  startTime: number | null;
  endTime: number | null;
  errors: number;
  errorKeys: Record<string, number>; // Track which keys are missed most
  status: "idle" | "typing" | "finished";
  wpm: number;
  accuracy: number;
  earnedXp: number;
  rhythmScore: number;
  backspacesUsed: number;
  difficulty: "light" | "standard" | "intensive";
  keystrokes: { key: string; nextKey?: string; isError: boolean; latency: number }[];
  lastKeystrokeTime: number | null;

  // Actions
  startLesson: (lesson: Lesson, difficulty?: "light" | "standard" | "intensive") => void;
  typeChar: (char: string) => void;
  deleteChar: () => void;
  resetLesson: () => void;
  calculateMetrics: () => void;
  clearRemedial: () => void; // Added clearRemedial
}

export const useTypingStore = create<TypingState>((set, get) => ({
  currentLesson: null,
  remedialLesson: null, // Initialized
  activeContent: "",
  typedText: "",
  startTime: null,
  endTime: null,
  errors: 0,
  errorKeys: {},
  status: "idle",
  wpm: 0,
  accuracy: 100,
  earnedXp: 0,
  rhythmScore: 100,
  backspacesUsed: 0,
  difficulty: "standard",
  keystrokes: [],
  lastKeystrokeTime: null,

  startLesson: (lesson, difficulty = "standard") => {
    let content = lesson.contentVariations[0];
    if (difficulty === "standard" && lesson.contentVariations.length > 1) {
      content = lesson.contentVariations[1];
    } else if (difficulty === "intensive" && lesson.contentVariations.length > 2) {
      content = lesson.contentVariations[2];
    } else {
      content = lesson.contentVariations[Math.floor(Math.random() * lesson.contentVariations.length)];
    }

    set({
      currentLesson: lesson,
      remedialLesson: null, // Reset remedial
      activeContent: content,
      typedText: "",
      startTime: null,
      endTime: null,
      errors: 0,
      errorKeys: {},
      status: "idle",
      wpm: 0,
      accuracy: 100,
      earnedXp: 0,
      rhythmScore: 100,
      backspacesUsed: 0,
      difficulty,
      keystrokes: [],
      lastKeystrokeTime: null,
    });
  },

  typeChar: (char) => {
    const { currentLesson, activeContent, typedText, startTime, status, errorKeys, errors, keystrokes, lastKeystrokeTime } =
      get();
    if (!currentLesson || status === "finished") return;

    const newTypedText = typedText + char;
    const isFirstChar = typedText.length === 0;
    const targetChar = activeContent[typedText.length];
    if (targetChar === undefined) return;
    
    const now = Date.now();
    const latency = lastKeystrokeTime ? now - lastKeystrokeTime : 0;

    let newErrors = errors;
    const newErrorKeys = { ...errorKeys };
    const isError = char !== targetChar;

    if (isError) {
      newErrors++;
      newErrorKeys[targetChar] = (newErrorKeys[targetChar] || 0) + 1;
    }

    const newKeystrokes = [
      ...keystrokes,
      {
        key: targetChar,
        nextKey: activeContent[newTypedText.length],
        isError,
        latency,
      },
    ];
    const isFinished = newTypedText.length === activeContent.length;

    set({
      typedText: newTypedText,
      startTime: isFirstChar ? now : startTime,
      status: isFinished ? "finished" : "typing",
      endTime: isFinished ? now : null,
      errors: newErrors,
      errorKeys: newErrorKeys,
      keystrokes: newKeystrokes,
      lastKeystrokeTime: now,
    });

    if (isFinished) {
      get().calculateMetrics();
    }
  },

  deleteChar: () => {
    const { typedText, status, backspacesUsed } = get();
    if (status === "finished" || typedText.length === 0) return;

    set({
      typedText: typedText.slice(0, -1),
      backspacesUsed: backspacesUsed + 1,
    });
  },

  resetLesson: () => {
    const { currentLesson } = get();
    if (!currentLesson) return;
    const randomContent = currentLesson.contentVariations[Math.floor(Math.random() * currentLesson.contentVariations.length)];
    set({
      activeContent: randomContent,
      typedText: "",
      startTime: null,
      endTime: null,
      errors: 0,
      errorKeys: {},
      status: "idle",
      wpm: 0,
      accuracy: 100,
      earnedXp: 0,
      rhythmScore: 100,
      backspacesUsed: 0,
      keystrokes: [],
      lastKeystrokeTime: null,
    });
  },

  calculateMetrics: () => {
    const { typedText, startTime, endTime, errors, errorKeys, currentLesson, status, backspacesUsed } =
      get();
    if (!startTime || !currentLesson) return;

    const finalTime = status === "finished" && endTime ? endTime : Date.now();
    const minutes = (finalTime - startTime) / 60000;

    const wordsTyped = typedText.length / 5;
    const calculatedWpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;

    const calculatedAccuracy =
      typedText.length > 0
        ? Math.max(
            0,
            Math.round(((typedText.length - errors) / typedText.length) * 100),
          )
        : 100;

    let calculatedXp = 0;
    let remedialLesson = null;

    if (status === "finished") {
      const accuracyMultiplier = calculatedAccuracy / 100;
      const wpmBonus = calculatedWpm > currentLesson.targetWpm ? (calculatedWpm - currentLesson.targetWpm) * 2 : 0;
      const backspacePenalty = backspacesUsed;
      
      calculatedXp = Math.max(0, Math.round((currentLesson.xpReward * accuracyMultiplier) + wpmBonus - backspacePenalty));

      // Adaptive Logic: Trigger remedial if accuracy is low or WPM is significantly below target
      if (calculatedAccuracy < 90 || calculatedWpm < currentLesson.targetWpm * 0.8) {
        remedialLesson = generateRemedialLesson(currentLesson, errorKeys);
      }
    }

    let calculatedRhythm = 100;
    const { keystrokes } = get();
    if (keystrokes.length > 1) {
      const validLatencies = keystrokes.slice(1).map(k => k.latency);
      if (validLatencies.length > 0) {
        const avgLatency = validLatencies.reduce((a, b) => a + b, 0) / validLatencies.length;
        const variance = validLatencies.reduce((a, b) => a + Math.pow(b - avgLatency, 2), 0) / validLatencies.length;
        const stdDev = Math.sqrt(variance);
        const cv = avgLatency > 0 ? stdDev / avgLatency : 0;
        calculatedRhythm = Math.max(0, Math.min(100, Math.round(100 - (cv * 100))));
      }
    }

    set({
      wpm: calculatedWpm,
      accuracy: calculatedAccuracy,
      earnedXp: calculatedXp,
      rhythmScore: calculatedRhythm,
      remedialLesson, // Set the remedial lesson
    });
  },
  
  clearRemedial: () => set({ remedialLesson: null }),
}));
