import React from "react";
import Link from "next/link";
import {
  Settings,
  Users,
  BookOpen,
  Shield,
  Database,
  Activity,
  ArrowLeft,
  Trophy,
  GraduationCap,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#f4e4bc] text-slate-900 font-sans selection:bg-yellow-200">
      <header className="bg-[#4a3728] border-b border-[#3a2a1e] sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-yellow-400" />
            <div>
              <span className="font-serif font-black text-white block leading-none text-xl tracking-tighter uppercase">
                Academy Administration
              </span>
              <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Headmaster&apos;s Office</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Classroom
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-serif font-black text-[#4a3728] mb-4 uppercase tracking-tight">
            Platform <span className="underline decoration-yellow-400 decoration-8 underline-offset-8">Oversight</span>
          </h1>
          <p className="text-slate-500 font-serif italic text-lg">
            &quot;Managing the future of touch typing excellence. Every student record, every lesson, every success starts here.&quot;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              label: "Total Students",
              value: "1,248",
              icon: Users,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Active Trainers",
              value: "32",
              icon: GraduationCap,
              color: "text-[#4a3728]",
              bg: "bg-yellow-100",
            },
            {
              label: "Academy Modules",
              value: "14",
              icon: BookOpen,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Platform Load",
              value: "12%",
              icon: Activity,
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-sm border-2 border-slate-100 shadow-xl flex items-center gap-4 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400" />
              <div
                className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shadow-inner`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {stat.label}
                </div>
                <div className="text-2xl font-black text-[#4a3728]">
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <section className="bg-white rounded-sm border-2 border-slate-100 shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Users className="w-24 h-24" />
            </div>
            <h2 className="text-2xl font-serif font-black text-[#4a3728] mb-8 flex items-center gap-3 uppercase tracking-tight">
              <Users className="w-6 h-6 text-yellow-500" />
              Recent Enrollments
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-yellow-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center font-black text-[#4a3728] text-xs">
                      S{i}
                    </div>
                    <div>
                      <div className="font-bold text-[#4a3728] uppercase tracking-tight">
                        New Student {i}
                      </div>
                      <div className="text-xs text-slate-400 font-serif italic">
                        student{i}@typingacademy.edu
                      </div>
                    </div>
                  </div>
                  <button className="text-[10px] font-black text-[#4a3728] uppercase tracking-widest hover:text-yellow-600 transition-colors">
                    Manage
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all border-2 border-dashed border-slate-200 hover:border-[#4a3728] hover:text-[#4a3728]">
              View All Academy Students
            </button>
          </section>

          <section className="bg-white rounded-sm border-2 border-slate-100 shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Settings className="w-24 h-24" />
            </div>
            <h2 className="text-2xl font-serif font-black text-[#4a3728] mb-8 flex items-center gap-3 uppercase tracking-tight">
              <Settings className="w-6 h-6 text-yellow-500" />
              Academy Controls
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 rounded-xl border border-slate-100 hover:border-yellow-400 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-[#4a3728] uppercase tracking-tight">
                      Curriculum Engine
                    </div>
                    <div className="text-xs text-slate-400 font-serif italic">
                      Manage lessons and progression logic
                    </div>
                  </div>
                </div>
                <Link 
                  href="/admin/curriculum"
                  className="px-6 py-2 bg-[#4a3728] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#3a2a1e] transition-all"
                >
                  Configure
                </Link>
              </div>
              <div className="flex items-center justify-between p-6 rounded-xl border border-slate-100 hover:border-yellow-400 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-[#4a3728] uppercase tracking-tight">
                      Academy Archives
                    </div>
                    <div className="text-xs text-slate-400 font-serif italic">
                      Last backup: 2 hours ago
                    </div>
                  </div>
                </div>
                <button className="px-6 py-2 bg-slate-100 text-[#4a3728] text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-all">
                  Manage
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
