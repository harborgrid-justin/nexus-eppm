import React from 'react';
import { Plus } from 'lucide-react';

export const ComponentLabel = ({ id, name }: { id: string; name: string }) => (
  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest truncate pr-2">{name}</span>
    <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0">{id}</span>
  </div>
);

export const DemoContainer = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => (
  <div className={`p-6 border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col group hover:border-nexus-300 transition-all ${className}`}>
    {children}
  </div>
);

export const SectionHeading = ({ title, icon: Icon, count }: { title: string; icon: any; count: string }) => (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
        <div>
            <div className="inline-flex items-center gap-2 text-nexus-600 bg-nexus-50 px-2.5 py-1 rounded-lg border border-nexus-100 text-[10px] font-black uppercase tracking-widest mb-3">
                <Icon size={12}/> Design Pattern
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {title}
            </h3>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">{count} Elements</span>
            <button className="p-2 bg-slate-900 text-white rounded-lg shadow-md hover:bg-black transition-all active:scale-95">
                <Plus size={16}/>
            </button>
        </div>
    </div>
);

/**
 * Helper to display the required 'professional light grey fill' pattern in the design system showcase.
 */
export const EmptyPatternDemo = ({ label = "Empty Context Pattern" }: { label?: string }) => (
    <div className="w-full h-32 nexus-empty-pattern border border-slate-200 rounded-xl flex items-center justify-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{label}</span>
    </div>
);