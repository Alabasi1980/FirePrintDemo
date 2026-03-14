import Link from "next/link";
import {
  Keyboard,
  Target,
  BrainCircuit,
  Activity,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Trophy,
  Flame,
  Star,
  GraduationCap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4e4bc] text-slate-900 font-sans selection:bg-yellow-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#4a3728]/95 backdrop-blur-md border-b border-[#3a2a1e] z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center shadow-inner">
              <BookOpen className="w-5 h-5 text-[#4a3728]" />
            </div>
            <span className="text-xl font-serif font-black text-white tracking-tighter">
              TYPING ACADEMY
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/visitor/typing"
              className="text-sm font-bold text-white/80 hover:text-white transition-colors uppercase tracking-widest"
            >
              Visitor Lab
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-bold text-white/80 hover:text-white transition-colors uppercase tracking-widest"
            >
              Classroom
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2 text-sm font-black text-[#4a3728] bg-yellow-400 hover:bg-yellow-300 rounded-lg transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none uppercase tracking-wider"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-10 rotate-12 hidden lg:block">
          <GraduationCap className="w-40 h-40" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10 -rotate-12 hidden lg:block">
          <Trophy className="w-40 h-40" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4a3728] text-yellow-400 text-xs font-black uppercase tracking-[0.2em] mb-8 border border-white/10 shadow-xl">
          <Star className="w-3 h-3 fill-yellow-400" />
          ESTABLISHED 2026
          <Star className="w-3 h-3 fill-yellow-400" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-serif font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
          Master the Art of <br />
          <span className="text-emerald-700 underline decoration-yellow-400 decoration-8 underline-offset-[12px]">Touch Typing</span>
        </h1>
        
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto font-serif italic leading-relaxed">
          &quot;A professional academy dedicated to the discipline of muscle memory. 
          Learn English and Arabic through adaptive paths and competitive excellence.&quot;
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/dashboard"
            className="px-10 py-5 text-lg font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_rgba(0,0,0,0.1)] flex items-center gap-3 w-full sm:w-auto justify-center uppercase tracking-widest"
          >
            Enter Classroom
            <ArrowRight className="w-6 h-6" />
          </Link>
          <Link
            href="/visitor/typing"
            className="px-10 py-5 text-lg font-black text-slate-700 bg-white hover:bg-slate-50 border-4 border-slate-200 rounded-xl transition-all w-full sm:w-auto justify-center flex items-center gap-3 uppercase tracking-widest shadow-[8px_8px_0px_rgba(0,0,0,0.05)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_rgba(0,0,0,0.05)]"
          >
            <Keyboard className="w-6 h-6 text-slate-400" />
            Visitor Lab
          </Link>
        </div>
      </section>

      {/* Features Grid - Bento Style */}
      <section
        id="curriculum"
        className="py-32 bg-white border-t-[12px] border-[#4a3728] relative"
        style={{
          backgroundImage: 'radial-gradient(#e5e5e5 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-serif font-black text-slate-900 mb-6 underline decoration-yellow-400 decoration-4 underline-offset-8">
              THE ACADEMY PILLARS
            </h2>
            <p className="text-xl text-slate-500 font-serif italic max-w-2xl mx-auto">
              Our methodology combines traditional discipline with modern adaptive technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-10 rounded-sm bg-[#fffdf5] border-t-8 border-emerald-500 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <BrainCircuit className="w-24 h-24" />
              </div>
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-black text-slate-900 mb-4 uppercase tracking-tight">
                Adaptive Learning
              </h3>
              <p className="text-slate-600 font-serif leading-relaxed italic text-lg">
                Every lesson begins with a placement diagnostic. Our engine adjusts the curriculum difficulty in real-time to match your current skill level.
              </p>
            </div>

            <div className="p-10 rounded-sm bg-[#fffdf5] border-t-8 border-yellow-400 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Trophy className="w-24 h-24" />
              </div>
              <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-black text-slate-900 mb-4 uppercase tracking-tight">
                Honor Roll
              </h3>
              <p className="text-slate-600 font-serif leading-relaxed italic text-lg">
                Compete with fellow students on the global leaderboard. Earn achievement medals and maintain your daily practice streak to climb the ranks.
              </p>
            </div>

            <div className="p-10 rounded-sm bg-[#fffdf5] border-t-8 border-[#4a3728] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Keyboard className="w-24 h-24" />
              </div>
              <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                <Keyboard className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-black text-slate-900 mb-4 uppercase tracking-tight">
                Bilingual Mastery
              </h3>
              <p className="text-slate-600 font-serif leading-relaxed italic text-lg">
                Full curriculum support for both English and Arabic layouts. Master the nuances of both languages with dedicated remedial exercises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 bg-[#4a3728] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-5xl font-black text-yellow-400 mb-2">120+</div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Lessons</div>
            </div>
            <div>
              <div className="text-5xl font-black text-yellow-400 mb-2">2</div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Languages</div>
            </div>
            <div>
              <div className="text-5xl font-black text-yellow-400 mb-2">15k+</div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Students</div>
            </div>
            <div>
              <div className="text-5xl font-black text-yellow-400 mb-2">98%</div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a140f] text-white/40 py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center text-yellow-400 font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="font-serif font-black text-white text-xl tracking-tighter block leading-none">
                  TYPING ACADEMY
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold">Excellence in Motion</span>
              </div>
            </div>
            <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
              <Link href="/dashboard" className="hover:text-white transition-colors">Classroom</Link>
              <Link href="/settings" className="hover:text-white transition-colors">Settings</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            </div>
            <p className="text-xs font-mono">© 2026 TYPING ACADEMY. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
