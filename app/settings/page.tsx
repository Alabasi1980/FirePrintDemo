"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Keyboard, 
  ShieldCheck, 
  Trash2,
  Volume2,
  Languages,
  GraduationCap,
  Shield,
  BookOpen,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { t, lang } = useTranslation();
  const router = useRouter();
  const { settings, updateSettings, clearKeyStats, xp, level, role } = useUserStore();

  const handleToggleStrict = () => {
    updateSettings({ strictMode: !settings.strictMode });
  };

  const handleToggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const handleToggleKeyboard = () => {
    updateSettings({ showKeyboard: !settings.showKeyboard });
  };

  const handleLanguageToggle = () => {
    updateSettings({ uiLanguage: lang === "en" ? "ar" : "en" });
  };

  const handleResetStats = () => {
    if (confirm(t.settings.reset_stats_desc)) {
      clearKeyStats();
    }
  };

  return (
    <div className="min-h-screen bg-[#f4e4bc] text-slate-900 font-sans selection:bg-yellow-200">
      <header className="bg-[#4a3728] border-b border-[#3a2a1e] sticky top-0 z-20 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors group">
              <ArrowLeft className="w-5 h-5 text-white/80 group-hover:text-white" />
            </Link>
            <h1 className="font-serif font-black text-white flex items-center gap-2 uppercase tracking-tighter text-xl">
              <SettingsIcon className="w-5 h-5 text-yellow-400" />
              {t.settings.title}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-white p-8 rounded-sm border-t-[12px] border-yellow-400 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <GraduationCap className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-[#4a3728] rounded-full flex items-center justify-center text-3xl font-black text-yellow-400 border-4 border-white shadow-xl">
                {level}
              </div>
              <div>
                <h2 className="text-3xl font-serif font-black text-slate-800 uppercase tracking-tight">Student Profile</h2>
                <p className="text-slate-500 font-serif italic text-lg">Level {level} • {xp.toLocaleString()} Total XP</p>
              </div>
            </div>
          </section>

          {/* Admin Section */}
          {role === 'admin' && (
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-4">Academy Administration</h3>
              <div className="bg-white rounded-sm border-2 border-slate-100 shadow-xl overflow-hidden">
                <Link 
                  href="/admin"
                  className="p-6 flex items-center justify-between border-b border-slate-50 hover:bg-yellow-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center shadow-inner">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 uppercase tracking-tight">Teacher&apos;s Lounge</div>
                      <div className="text-xs text-slate-400 font-serif italic">Access the main administration dashboard</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-[#4a3728] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Open Dashboard</div>
                </Link>

                <Link 
                  href="/admin/curriculum"
                  className="p-6 flex items-center justify-between border-b border-slate-50 hover:bg-yellow-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 uppercase tracking-tight">Lesson Control Panel</div>
                      <div className="text-xs text-slate-400 font-serif italic">Manage curriculum, lessons, and content</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-[#4a3728] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Manage Lessons</div>
                </Link>
              </div>
            </section>
          )}

          {/* Training Settings */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-4">Training Preferences</h3>
            <div className="bg-white rounded-sm border-2 border-slate-100 shadow-xl overflow-hidden">
              <div className="p-6 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shadow-inner">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 uppercase tracking-tight">Strict Mode</div>
                    <div className="text-xs text-slate-400 font-serif italic">Disables backspace during lessons</div>
                  </div>
                </div>
                <button
                  onClick={handleToggleStrict}
                  className={`w-14 h-8 rounded-full transition-all relative ${settings.strictMode ? "bg-red-500" : "bg-slate-200"}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${settings.strictMode ? "left-7" : "left-1"}`} />
                </button>
              </div>

              <div className="p-6 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 uppercase tracking-tight">Sound Effects</div>
                    <div className="text-xs text-slate-400 font-serif italic">Audio feedback for keystrokes</div>
                  </div>
                </div>
                <button className="w-14 h-8 rounded-full bg-emerald-500 relative">
                  <div className="absolute top-1 left-7 w-6 h-6 bg-white rounded-full shadow-sm" />
                </button>
              </div>

              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shadow-inner">
                    <Keyboard className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 uppercase tracking-tight">Virtual Keyboard</div>
                    <div className="text-xs text-slate-400 font-serif italic">Show keyboard guide on screen</div>
                  </div>
                </div>
                <button className="w-14 h-8 rounded-full bg-emerald-500 relative">
                  <div className="absolute top-1 left-7 w-6 h-6 bg-white rounded-full shadow-sm" />
                </button>
              </div>
            </div>
          </section>

          {/* Language Settings */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-4">{t.settings.language}</h3>
            <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Languages className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">{t.settings.language}</div>
                  <div className="text-xs text-slate-400">Current: {lang === "en" ? "English" : "العربية"}</div>
                </div>
              </div>
              <button 
                onClick={handleLanguageToggle}
                className="text-emerald-600 font-bold text-sm hover:underline"
              >
                {lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
              </button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-red-400 uppercase tracking-[0.2em] px-4">Danger Zone</h3>
            <div className="bg-white rounded-3xl border-2 border-red-50 shadow-sm p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Reset Key Statistics</div>
                  <div className="text-xs text-slate-400">Clear all data about your weak keys</div>
                </div>
              </div>
              <button 
                onClick={handleResetStats}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
              >
                Reset Data
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
