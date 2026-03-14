"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurriculumStore } from '@/store/useCurriculumStore';
import { Lesson, Language, Domain } from '@/lib/curriculum';
import { ArrowLeft, FileText, Upload, Keyboard, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function CustomStudioPage() {
  const router = useRouter();
  const { addLesson, careerPaths, lessonTypes, addCareerPath, addLessonType } = useCurriculumStore();
  
  const [newPath, setNewPath] = useState('');
  const [newType, setNewType] = useState('');
  
  const [activeTab, setActiveTab] = useState<'paste' | 'upload' | 'manage'>('paste');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [domain, setDomain] = useState<Domain>(careerPaths[0] || 'general');
  const [type, setType] = useState<string>(lessonTypes[0] || 'exercise');
  const [error, setError] = useState('');

  const handleAddPath = () => {
    if (newPath.trim()) {
      addCareerPath(newPath.trim());
      setNewPath('');
    }
  };

  const handleAddType = () => {
    if (newType.trim()) {
      addLessonType(newType.trim());
      setNewType('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!title) setTitle(file.name.replace('.txt', ''));
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text);
      };
      reader.readAsText(file);
    }
  };

  const cleanText = (text: string) => {
    // Basic cleaning: remove multiple spaces, normalize newlines
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/ {2,}/g, ' ')
      .trim();
  };

  const handleCreateLesson = () => {
    setError('');
    const cleanedContent = cleanText(content);
    
    if (!title.trim()) {
      setError('Please provide a title for your lesson.');
      return;
    }
    if (!cleanedContent) {
      setError('Please provide some text content to practice.');
      return;
    }
    if (cleanedContent.length < 20) {
      setError('Content is too short. Please provide at least 20 characters.');
      return;
    }
    if (cleanedContent.length > 5000) {
      setError('Content is too long. Please limit to 5000 characters for optimal performance.');
      return;
    }

    const newLesson: Lesson = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      description: "Custom lesson created in the Studio.",
      language,
      level: 0,
      unit: 0,
      type,
      domain,
      contentVariations: [cleanedContent],
      targetWpm: 0, // No strict target for custom lessons
      targetAccuracy: 0,
      xpReward: 10, // Small base reward
    };

    addLesson(newLesson);
    router.push(`/training/${newLesson.id}`);
  };

  return (
    <div className="min-h-screen bg-[#f4e4bc] text-slate-900 font-sans selection:bg-yellow-200">
      <header className="bg-[#4a3728] border-b border-[#3a2a1e] sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-white/10 rounded-full transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 text-white/80 group-hover:text-white" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-[#4a3728] shadow-lg">
              <Keyboard className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-serif font-black text-white leading-tight uppercase tracking-tight">
              Custom Studio
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-black text-[#4a3728] mb-4">Create Your Own Lesson</h2>
          <p className="text-slate-600 text-lg">Paste an article, upload a document, and turn it into a personalized typing exercise.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border-2 border-yellow-400 overflow-hidden">
            <div className="flex border-b-2 border-slate-100">
            <button
              onClick={() => setActiveTab('paste')}
              className={`flex-1 py-4 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'paste' ? 'bg-yellow-50 text-[#4a3728] border-b-4 border-yellow-400' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              Paste Text
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-4 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'upload' ? 'bg-yellow-50 text-[#4a3728] border-b-4 border-yellow-400' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Upload className="w-5 h-5" />
              Upload .txt File
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 py-4 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'manage' ? 'bg-yellow-50 text-[#4a3728] border-b-4 border-yellow-400' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Keyboard className="w-5 h-5" />
              Manage Paths
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'manage' ? (
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Add Career Path</label>
                  <div className="flex gap-2">
                    <input type="text" value={newPath} onChange={(e) => setNewPath(e.target.value)} className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-yellow-400 focus:ring-0 outline-none transition-colors font-bold text-slate-700" placeholder="e.g., Medicine" />
                    <button onClick={handleAddPath} className="px-6 py-3 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-colors">Add</button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {careerPaths.map(path => <span key={path} className="px-3 py-1 bg-slate-100 rounded-lg text-sm font-bold text-slate-700">{path}</span>)}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Add Lesson Type</label>
                  <div className="flex gap-2">
                    <input type="text" value={newType} onChange={(e) => setNewType(e.target.value)} className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-yellow-400 focus:ring-0 outline-none transition-colors font-bold text-slate-700" placeholder="e.g., MedicalTerms" />
                    <button onClick={handleAddType} className="px-6 py-3 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-colors">Add</button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {lessonTypes.map(type => <span key={type} className="px-3 py-1 bg-slate-100 rounded-lg text-sm font-bold text-slate-700">{type}</span>)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="contents">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Lesson Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., My Favorite Article"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-yellow-400 focus:ring-0 outline-none transition-colors font-bold text-slate-700"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as Language)}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-yellow-400 focus:ring-0 outline-none transition-colors font-bold text-slate-700 appearance-none"
                    >
                      <option value="en">English</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Domain</label>
                    <select
                      value={domain}
                      onChange={(e) => setDomain(e.target.value as Domain)}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-yellow-400 focus:ring-0 outline-none transition-colors font-bold text-slate-700 appearance-none"
                    >
                      {careerPaths.map(path => <option key={path} value={path}>{path}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Lesson Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-yellow-400 focus:ring-0 outline-none transition-colors font-bold text-slate-700 appearance-none"
                    >
                      {lessonTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                {activeTab === 'paste' ? (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Text Content</label>
                  <span className={`text-xs font-bold ${content.length > 5000 ? 'text-red-500' : 'text-slate-400'}`}>
                    {content.length} / 5000
                  </span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your text here..."
                  className="w-full h-64 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-yellow-400 focus:ring-0 outline-none transition-colors text-slate-700 resize-none"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            ) : (
              <div className="mb-8">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Upload File</label>
                <label className="w-full h-64 border-4 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-50 hover:border-yellow-400 transition-all group">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-yellow-600" />
                  </div>
                  <div className="text-center">
                    <span className="font-black text-slate-700 block mb-1">Click to browse or drag and drop</span>
                    <span className="text-sm text-slate-400">Only .txt files are supported</span>
                  </div>
                  <input type="file" accept=".txt" className="hidden" onChange={handleFileUpload} />
                </label>
                {content && activeTab === 'upload' && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-sm">File loaded successfully! ({content.length} characters)</span>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleCreateLesson}
              className="w-full py-4 bg-[#4a3728] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#3a2a1e] transition-colors shadow-lg active:scale-[0.98]"
            >
              Create Lesson & Start Typing
            </button>
          </div>
        )}
        </div>
      </div>
      </main>
    </div>
  );
}
