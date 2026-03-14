"use client";

import React, { useState } from "react";
import { useClassStore, Student } from "@/store/useClassStore";
import { motion } from "motion/react";
import { Plus, Users, BookOpen, Trash2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function TrainerDashboard() {
  const { classes, addClass, addStudentToClass } = useClassStore();
  const [newClassName, setNewClassName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [newStudentName, setNewStudentName] = useState("");

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassName.trim()) {
      addClass(newClassName);
      setNewClassName("");
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClassId && newStudentName.trim()) {
      addStudentToClass(selectedClassId, {
        id: Math.random().toString(36).substr(2, 9),
        name: newStudentName,
        email: `${newStudentName.toLowerCase().replace(/\s/g, '.')}@example.com`,
        progress: 0,
      });
      setNewStudentName("");
    }
  };

  const selectedClass = classes.find(c => c.id === selectedClassId);

  return (
    <div className="min-h-screen bg-[#f4e4bc] text-slate-900 font-sans p-8">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-black text-[#4a3728] uppercase tracking-tight">
            Trainer Dashboard
          </h1>
          <p className="text-slate-600 font-serif italic">Manage your classes and monitor student progress.</p>
        </div>
        <Link href="/dashboard" className="bg-[#4a3728] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#3a2a1e] transition-all">
          Back to Dashboard
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Class Form */}
        <div className="lg:col-span-1 space-y-8">
          <form onSubmit={handleAddClass} className="bg-white p-6 rounded-2xl shadow-lg border-2 border-slate-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-yellow-500" />
              Create New Class
            </h2>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Class Name (e.g., Grade 10A)"
              className="w-full p-3 mb-4 border-2 border-slate-200 rounded-lg focus:border-yellow-400 outline-none"
            />
            <button type="submit" className="w-full bg-yellow-400 text-[#4a3728] py-3 rounded-lg font-bold hover:bg-yellow-500 transition-all">
              Add Class
            </button>
          </form>

          {selectedClass && (
            <form onSubmit={handleAddStudent} className="bg-white p-6 rounded-2xl shadow-lg border-2 border-slate-200">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                Add Student to {selectedClass.name}
              </h2>
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Student Name"
                className="w-full p-3 mb-4 border-2 border-slate-200 rounded-lg focus:border-emerald-400 outline-none"
              />
              <button type="submit" className="w-full bg-emerald-500 text-white py-3 rounded-lg font-bold hover:bg-emerald-600 transition-all">
                Add Student
              </button>
            </form>
          )}
        </div>

        {/* Classes List & Students */}
        <div className="lg:col-span-2">
          {!selectedClass ? (
            <>
              <h2 className="text-2xl font-black text-[#4a3728] mb-6">Your Classes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {classes.map((cls) => (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedClassId(cls.id)}
                    className="bg-white p-6 rounded-2xl shadow-lg border-2 border-slate-200 hover:border-yellow-400 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-[#4a3728]">{cls.name}</h3>
                      <Users className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-slate-500 mb-4">{cls.students.length} Students</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: {cls.id}</span>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </motion.div>
                ))}
                {classes.length === 0 && (
                  <div className="col-span-2 text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-300">
                    <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">No classes created yet. Create your first class!</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <button onClick={() => setSelectedClassId(null)} className="mb-6 text-[#4a3728] font-bold flex items-center gap-2">
                &larr; Back to Classes
              </button>
              <h2 className="text-2xl font-black text-[#4a3728] mb-6">{selectedClass.name} - Students</h2>
              <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b-2 border-slate-100">
                    <tr>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-widest">Name</th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-widest">Email</th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-widest">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClass.students.map((student) => (
                      <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4 font-bold text-[#4a3728]">{student.name}</td>
                        <td className="p-4 text-slate-500">{student.email}</td>
                        <td className="p-4">
                          <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${student.progress}%` }}></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {selectedClass.students.length === 0 && (
                  <p className="p-8 text-center text-slate-500">No students in this class yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
