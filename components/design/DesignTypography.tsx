import React from 'react';
import { Type, ArrowRight } from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';

export const DesignTypography = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-300 pb-20">
        <SectionHeading title="Typography System" icon={Type} count="TYP-01 to TYP-12" />
        
        <div className="grid grid-cols-1 gap-8">
            <DemoContainer>
                <ComponentLabel id="TYP-01" name="Visual Hierarchy (Scale)" />
                <div className="space-y-10">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 border-b border-slate-50 pb-6">
                        <div className="w-32 text-[10px] text-slate-400 font-black uppercase tracking-widest shrink-0">H1 Display / 3XL</div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Enterprise Portfolio Management</h1>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 border-b border-slate-50 pb-6">
                        <div className="w-32 text-[10px] text-slate-400 font-black uppercase tracking-widest shrink-0">H2 Header / 2XL</div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Risk Matrix Analysis</h2>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 border-b border-slate-50 pb-6">
                        <div className="w-32 text-[10px] text-slate-400 font-black uppercase tracking-widest shrink-0">H3 Section / XL</div>
                        <h3 className="text-xl font-bold text-slate-800">Critical Path Dependencies</h3>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 border-b border-slate-50 pb-6">
                        <div className="w-32 text-[10px] text-slate-400 font-black uppercase tracking-widest shrink-0">Body / Base</div>
                        <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                            The Nexus platform leverages a standardized typographic scale to ensure clarity across complex data grids and interactive schedule visualizations.
                        </p>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12">
                        <div className="w-32 text-[10px] text-slate-400 font-black uppercase tracking-widest shrink-0">Label / Caps</div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Baseline Authorization Period</p>
                    </div>
                </div>
            </DemoContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DemoContainer>
                <ComponentLabel id="TYP-03" name="Primary Interface Font" />
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                    <p className="text-xs font-bold text-nexus-600 uppercase mb-4 tracking-widest">Brand Typeface: Inter</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tight mb-4">Aa Bb Cc Dd</p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Inter is the primary sans-serif face used for all functional elements, inputs, and executive dashboards.
                    </p>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="TYP-04" name="Data & Code Font" />
                <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl">
                    <p className="text-xs font-bold text-nexus-400 uppercase mb-4 tracking-widest">Technical Typeface: JetBrains Mono</p>
                    <p className="text-4xl font-medium text-white font-mono tracking-tight mb-4">0123456789</p>
                    <p className="text-sm text-slate-400 leading-relaxed font-mono">
                        JetBrains Mono is used for all tabular data, currency values, WBS codes, and system logs.
                    </p>
                </div>
            </DemoContainer>
        </div>
    </div>
  );
};