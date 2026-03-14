"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Stethoscope, Scale, Code, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCurriculumStore } from '@/store/useCurriculumStore';
import { Domain } from '@/lib/curriculum';

export const CareerPathSelector = () => {
  const { selectedDomain, setSelectedDomain, careerPaths } = useCurriculumStore();

  const paths = [
    { id: 'general', name: 'General', icon: Briefcase, color: 'bg-blue-500', description: 'Standard business and daily communication.' },
    { id: 'medical', name: 'Medical', icon: Stethoscope, color: 'bg-red-500', description: 'Healthcare, anatomy, and clinical terminology.' },
    { id: 'legal', name: 'Legal', icon: Scale, color: 'bg-amber-600', description: 'Contracts, litigation, and formal legal language.' },
    { id: 'coding', name: 'Coding', icon: Code, color: 'bg-emerald-600', description: 'Programming syntax, logic, and technical documentation.' },
  ];

  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-slate-100 shadow-xl">
      <div className="mb-8">
        <h3 className="font-serif font-black text-[#4a3728] text-2xl uppercase tracking-tight">Activate Career Path</h3>
        <p className="text-slate-500 font-serif italic">Select a specialized track to tailor your typing curriculum to your professional goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paths.map((path) => {
          const isActive = selectedDomain === path.id;
          const Icon = path.icon;

          return (
            <button
              key={path.id}
              onClick={() => setSelectedDomain(path.id as Domain)}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-300 text-left group
                ${isActive 
                  ? 'border-yellow-400 bg-yellow-50 shadow-lg' 
                  : 'border-slate-100 hover:border-yellow-200 hover:bg-slate-50'
                }
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${path.color} text-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                {isActive && (
                  <div className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" />
                    Active
                  </div>
                )}
              </div>

              <h4 className={`font-black uppercase tracking-tight text-lg mb-1 ${isActive ? 'text-[#4a3728]' : 'text-slate-700'}`}>
                {path.name}
              </h4>
              <p className="text-xs text-slate-400 font-serif italic leading-relaxed">
                {path.description}
              </p>

              {!isActive && (
                <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-yellow-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Activate Path <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {selectedDomain !== 'general' && (
        <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-4">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-indigo-900 mb-1">Career Path Active: {selectedDomain.toUpperCase()}</p>
            <p className="text-xs text-indigo-700/70 italic">Your curriculum has been filtered to show specialized lessons for this path. Complete them to earn exclusive professional badges.</p>
          </div>
        </div>
      )}
    </div>
  );
};
