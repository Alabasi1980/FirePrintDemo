import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
}

export interface ClassRoom {
  id: string;
  name: string;
  students: Student[];
}

interface ClassState {
  classes: ClassRoom[];
  addClass: (name: string) => void;
  addStudentToClass: (classId: string, student: Student) => void;
}

export const useClassStore = create<ClassState>()(
  persist(
    (set) => ({
      classes: [],
      addClass: (name) => set((state) => ({
        classes: [...state.classes, { id: Math.random().toString(36).substr(2, 9), name, students: [] }]
      })),
      addStudentToClass: (classId, student) => set((state) => ({
        classes: state.classes.map(c => c.id === classId ? { ...c, students: [...c.students, student] } : c)
      })),
    }),
    { name: 'typing-class-storage' }
  )
);
