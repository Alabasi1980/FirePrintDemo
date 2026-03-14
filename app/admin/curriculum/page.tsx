"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Plus, Settings, Edit3, Trash2, Save } from 'lucide-react';
import { Lesson } from '@/lib/curriculum';
import { useCurriculumStore } from '@/store/useCurriculumStore';

export default function CurriculumManager() {
  const { lessons, updateLesson, addLesson, deleteLesson } = useCurriculumStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Local state for the currently edited lesson to avoid saving on every keystroke
  const [editedLesson, setEditedLesson] = useState<Lesson | null>(null);

  const handleSelectLesson = (id: string) => {
    setEditingId(id);
    const lesson = lessons.find(l => l.id === id);
    if (lesson) {
      setEditedLesson(JSON.parse(JSON.stringify(lesson))); // Deep copy
    }
  };

  const handleSave = () => {
    if (editedLesson) {
      updateLesson(editedLesson.id, editedLesson);
    }
  };

  const handleDelete = () => {
    if (editingId) {
      deleteLesson(editingId);
      setEditingId(null);
      setEditedLesson(null);
    }
  };

  const handleCreateNew = () => {
    const newLesson: Lesson = {
      id: `custom-lesson-${Date.now()}`,
      title: 'New Custom Lesson',
      description: 'Description of the lesson',
      language: 'en',
      level: 1,
      unit: 1,
      type: 'exercise',
      domain: 'general', // Added domain
      contentVariations: ['Type this content...'],
      targetWpm: 20,
      targetAccuracy: 95,
      xpReward: 100,
    };
    addLesson(newLesson);
    handleSelectLesson(newLesson.id);
  };

  return (
    <div className="min-h-screen bg-[#f4e4bc] text-slate-900 font-sans selection:bg-yellow-200">
      <header className="bg-[#4a3728] border-b border-[#3a2a1e] sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-yellow-400" />
            <div>
              <span className="font-serif font-black text-white block leading-none text-xl tracking-tighter uppercase">
                Curriculum Manager
              </span>
              <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Lesson Archives</span>
            </div>
          </div>
          <Link 
            href="/admin" 
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            Back to Admin
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-8">
        {/* Sidebar List */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-serif font-black text-[#4a3728] uppercase tracking-tight">Academy Lessons</h2>
            <button 
              onClick={handleCreateNew}
              className="p-2 bg-yellow-400 text-[#4a3728] rounded-lg hover:bg-yellow-300 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="bg-white border-2 border-slate-100 rounded-sm shadow-xl overflow-hidden flex flex-col h-[700px]">
            <div className="overflow-y-auto p-3 space-y-2">
              {lessons.map(lesson => (
                <button
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson.id)}
                  className={`w-full text-left px-5 py-4 rounded-xl transition-all ${
                    editingId === lesson.id 
                      ? 'bg-yellow-50 border-2 border-yellow-400 shadow-inner' 
                      : 'hover:bg-slate-50 border-2 border-transparent'
                  }`}
                >
                  <div className="font-bold text-[#4a3728] truncate flex items-center justify-between uppercase tracking-tight">
                    <span>{lesson.title}</span>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                      lesson.type === 'test' ? 'bg-amber-100 text-amber-700' :
                      lesson.type === 'remedial' ? 'bg-red-100 text-red-700' :
                      lesson.type === 'explanation' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {lesson.type}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 flex gap-2 font-black uppercase tracking-widest">
                    <span>{lesson.language}</span>
                    <span className="text-yellow-500">•</span>
                    <span>Level {lesson.level}</span>
                    <span className="text-yellow-500">•</span>
                    <span>Unit {lesson.unit}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="w-2/3">
          {editingId && editedLesson ? (
            <div className="bg-white border-2 border-slate-100 rounded-sm shadow-2xl p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400" />
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-3xl font-serif font-black text-[#4a3728] uppercase tracking-tight">Edit Lesson</h2>
                  <p className="text-xs text-slate-400 font-serif italic mt-1">Refining the student experience</p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={handleDelete}
                    className="px-6 py-2 text-[10px] font-black text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all uppercase tracking-widest flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-8 py-2 text-[10px] font-black text-white bg-[#4a3728] hover:bg-[#3a2a1e] rounded-lg transition-all uppercase tracking-widest flex items-center gap-2 shadow-lg"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Lesson Title</label>
                    <input 
                      type="text" 
                      value={editedLesson.title} 
                      onChange={(e) => setEditedLesson({...editedLesson, title: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-yellow-400 transition-all font-bold text-[#4a3728]" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Lesson ID (Immutable)</label>
                    <input type="text" value={editedLesson.id} disabled className="w-full px-5 py-3 bg-slate-100 border-2 border-slate-100 rounded-xl text-slate-400 font-mono text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Language</label>
                    <select 
                      value={editedLesson.language}
                      onChange={(e) => setEditedLesson({...editedLesson, language: e.target.value as any})}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-yellow-400 transition-all font-bold text-[#4a3728] appearance-none"
                    >
                      <option value="en">English</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Domain</label>
                    <select 
                      value={editedLesson.domain}
                      onChange={(e) => setEditedLesson({...editedLesson, domain: e.target.value as any})}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-yellow-400 transition-all font-bold text-[#4a3728] appearance-none"
                    >
                      <option value="general">General</option>
                      <option value="medical">Medical</option>
                      <option value="legal">Legal</option>
                      <option value="coding">Coding</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Level</label>
                    <input 
                      type="number" 
                      value={editedLesson.level} 
                      onChange={(e) => setEditedLesson({...editedLesson, level: parseInt(e.target.value) || 1})}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-yellow-400 transition-all font-bold text-[#4a3728]" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Unit</label>
                    <input 
                      type="number" 
                      value={editedLesson.unit} 
                      onChange={(e) => setEditedLesson({...editedLesson, unit: parseInt(e.target.value) || 1})}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-yellow-400 transition-all font-bold text-[#4a3728]" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Type</label>
                    <select 
                      value={editedLesson.type}
                      onChange={(e) => setEditedLesson({...editedLesson, type: e.target.value as any})}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-yellow-400 transition-all font-bold text-[#4a3728] appearance-none"
                    >
                      <option value="explanation">Explanation</option>
                      <option value="exercise">Exercise</option>
                      <option value="test">Test</option>
                      <option value="remedial">Remedial</option>
                    </select>
                  </div>
                </div>

                {editedLesson.type === 'remedial' && (
                  <div className="p-6 bg-red-50 border-2 border-red-100 rounded-2xl space-y-4">
                    <h3 className="text-xs font-black text-red-800 uppercase tracking-widest">Remedial Triggers</h3>
                    <p className="text-[10px] text-red-600 font-serif italic">This lesson will be triggered if a student fails a lesson and meets these conditions.</p>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-red-700 uppercase tracking-widest mb-2">Weak Keys</label>
                        <input 
                          type="text" 
                          placeholder="e.g. a,s,d,f"
                          value={editedLesson.remedialTriggers?.weakKeys?.join(',') || ''} 
                          onChange={(e) => setEditedLesson({
                            ...editedLesson, 
                            remedialTriggers: {
                              ...editedLesson.remedialTriggers,
                              weakKeys: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                            }
                          })}
                          className="w-full px-4 py-2 bg-white border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-bold" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-red-700 uppercase tracking-widest mb-2">Min Accuracy (%)</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 85"
                          value={editedLesson.remedialTriggers?.minAccuracy || ''} 
                          onChange={(e) => setEditedLesson({
                            ...editedLesson, 
                            remedialTriggers: {
                              ...editedLesson.remedialTriggers,
                              minAccuracy: parseInt(e.target.value) || undefined
                            }
                          })}
                          className="w-full px-4 py-2 bg-white border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-bold" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-red-700 uppercase tracking-widest mb-2">Min WPM</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 15"
                          value={editedLesson.remedialTriggers?.minWpm || ''} 
                          onChange={(e) => setEditedLesson({
                            ...editedLesson, 
                            remedialTriggers: {
                              ...editedLesson.remedialTriggers,
                              minWpm: parseInt(e.target.value) || undefined
                            }
                          })}
                          className="w-full px-4 py-2 bg-white border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-bold" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Lesson Description</label>
                  <textarea 
                    value={editedLesson.description} 
                    onChange={(e) => setEditedLesson({...editedLesson, description: e.target.value})}
                    rows={2} 
                    className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-yellow-400 transition-all font-serif italic text-[#4a3728]" 
                  />
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target WPM</label>
                    <input 
                      type="number" 
                      value={editedLesson.targetWpm} 
                      onChange={(e) => setEditedLesson({...editedLesson, targetWpm: parseInt(e.target.value) || 0})}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-yellow-400 transition-all font-bold text-[#4a3728]" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Accuracy (%)</label>
                    <input 
                      type="number" 
                      value={editedLesson.targetAccuracy} 
                      onChange={(e) => setEditedLesson({...editedLesson, targetAccuracy: parseInt(e.target.value) || 0})}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-yellow-400 transition-all font-bold text-[#4a3728]" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">XP Reward</label>
                    <input 
                      type="number" 
                      value={editedLesson.xpReward} 
                      onChange={(e) => setEditedLesson({...editedLesson, xpReward: parseInt(e.target.value) || 0})}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-yellow-400 transition-all font-bold text-[#4a3728]" 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Content Variations</label>
                    <button 
                      onClick={() => setEditedLesson({...editedLesson, contentVariations: [...editedLesson.contentVariations, 'New variation']})}
                      className="text-[10px] font-black text-[#4a3728] hover:text-yellow-600 flex items-center gap-1 uppercase tracking-widest"
                    >
                      <Plus className="w-3 h-3" /> Add Variation
                    </button>
                  </div>
                  <div className="space-y-4">
                    {editedLesson.contentVariations.map((content, idx) => (
                      <div key={idx} className="relative group">
                        <textarea 
                          value={content} 
                          onChange={(e) => {
                            const newVars = [...editedLesson.contentVariations];
                            newVars[idx] = e.target.value;
                            setEditedLesson({...editedLesson, contentVariations: newVars});
                          }}
                          rows={2} 
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-yellow-400 transition-all font-mono text-sm text-[#4a3728]" 
                        />
                        <button 
                          onClick={() => {
                            const newVars = editedLesson.contentVariations.filter((_, i) => i !== idx);
                            setEditedLesson({...editedLesson, contentVariations: newVars});
                          }}
                          className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-4 font-serif italic">The engine will randomly select one variation each time a student starts this lesson.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[700px] flex flex-col items-center justify-center text-slate-400 border-4 border-dashed border-slate-200 rounded-sm bg-white/50">
              <BookOpen className="w-16 h-16 mb-4 text-slate-200" />
              <p className="font-serif italic text-lg">Select a lesson from the archives to begin refinement.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
