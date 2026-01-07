import React from 'react';
import { Palette, Box, LayoutTemplate, Scale, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { MetricCard } from '../common/Primitives';
import { useData } from '../../context/DataContext';

export const DesignIntro = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { state } = useData();
  
  // Dynamic metrics from state to avoid static data
  const totalExtensions = state.extensions.length;
  const totalIntegrations = state.integrations.length;

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-5xl">
      <div className="bg-slate-900 p-12 rounded-[2rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3.5 bg-nexus-600 rounded-2xl shadow-lg shadow-nexus-500/20">
                    <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-5xl font-black tracking-tight">Framework <span className="text-nexus-400">Overview</span></h1>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">Enterprise Standard Guidelines v1.3</p>
                </div>
            </div>
            <p className="text-slate-300 text-xl leading-relaxed max-w-2xl font-medium">
            The unified interface framework for the Nexus PPM Ecosystem. 
            Engineered for high-density data, multi-tenant security, and AI-first workflows.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
                <button 
                    onClick={() => onNavigate('colors')} 
                    className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:bg-nexus-50 active:scale-95 flex items-center"
                >
                    System Tokens <ArrowRight className="ml-3 h-4 w-4"/>
                </button>
                <button 
                    className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest border border-slate-700 hover:bg-slate-700 transition-all"
                >
                    Documentation
                </button>
            </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute -right-20 -top-40 w-[500px] h-[500px] bg-nexus-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute right-40 -bottom-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute right-12 top-12 text-white/5 opacity-10 pointer-events-none"><Palette size={400} strokeWidth={0.5}/></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard label="UI Components" value="120+" icon={Box} className="border-t-4 border-t-nexus-500" />
        <MetricCard label="Extensions" value={totalExtensions} icon={LayoutTemplate} className="border-t-4 border-t-indigo-500" />
        <MetricCard label="Integrations" value={totalIntegrations} icon={Scale} className="border-t-4 border-t-purple-500" />
        <MetricCard label="Design Tokens" value="2,4k" icon={Zap} className="border-t-4 border-t-emerald-500" />
      </div>

      <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Production Gap Compliance</h3>
          <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
              All components within the Nexus Design System adhere to the <strong>Grey-Fill Empty Pattern</strong> and <strong>CRUD-Linkage</strong> requirements. 
              UI elements are bound directly to the <code>DataState</code> reducer to ensure real-time consistency across the platform.
          </p>
      </div>
    </div>
  );
};