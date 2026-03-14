import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { curriculum as defaultCurriculum, Lesson, Language, Domain, DEFAULT_LESSON_TYPES, DEFAULT_DOMAINS } from '@/lib/curriculum';

interface CurriculumState {
  lessons: Lesson[];
  careerPaths: Domain[];
  lessonTypes: string[];
  selectedDomain: Domain;
  setSelectedDomain: (domain: Domain) => void;
  addCareerPath: (path: Domain) => void;
  addLessonType: (type: string) => void;
  addLesson: (lesson: Lesson) => void;
  updateLesson: (id: string, lesson: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;
  getLessonById: (id: string) => Lesson | undefined;
  getLessonsByLanguageAndDomain: (language: Language, domain: Domain) => Lesson[];
  getCustomLessons: (language: Language) => Lesson[];
  addRemedialLesson: (lesson: Lesson) => void;
  addWarmupLesson: (lesson: Lesson) => void;
}

export const useCurriculumStore = create<CurriculumState>()(
  persist(
    (set, get) => ({
      lessons: defaultCurriculum,
      careerPaths: DEFAULT_DOMAINS,
      lessonTypes: DEFAULT_LESSON_TYPES,
      selectedDomain: 'general',
      setSelectedDomain: (domain) => set({ selectedDomain: domain }),
      addCareerPath: (path) => set((state) => ({ careerPaths: [...state.careerPaths, path] })),
      addLessonType: (type) => set((state) => ({ lessonTypes: [...state.lessonTypes, type] })),
      addLesson: (lesson) => set((state) => ({ lessons: [...state.lessons, lesson] })),
      updateLesson: (id, updatedFields) => set((state) => ({
        lessons: state.lessons.map(l => l.id === id ? { ...l, ...updatedFields } : l)
      })),
      deleteLesson: (id) => set((state) => ({
        lessons: state.lessons.filter(l => l.id !== id)
      })),
      getLessonById: (id) => get().lessons.find(l => l.id === id),
      // Filter out remedial, warmup, and custom lessons from the main dashboard view
      getLessonsByLanguageAndDomain: (language, domain) => get().lessons.filter(l => l.language === language && l.domain === domain && l.type !== 'remedial' && l.type !== 'warmup' && l.type !== 'free-typing'),
      getCustomLessons: (language) => get().lessons.filter(l => l.language === language && l.type === 'free-typing'),
      addRemedialLesson: (lesson) => set((state) => ({ lessons: [...state.lessons, lesson] })),
      addWarmupLesson: (lesson) => set((state) => ({ lessons: [...state.lessons, lesson] })),
    }),
    {
      name: 'typing-curriculum-storage',
      merge: (persistedState: any, currentState: CurriculumState) => {
        const persistedLessons = persistedState.lessons || [];
        const mergedLessons = [...defaultCurriculum, ...persistedLessons.filter((pl: Lesson) => !defaultCurriculum.find(dl => dl.id === pl.id))];
        return { ...currentState, ...persistedState, lessons: mergedLessons };
      }
    }
  )
);
