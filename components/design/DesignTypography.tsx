
import React from 'react';
import { Type, ArrowRight, Quote, List, AlignLeft, Hash } from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';

export const DesignTypography = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-300 pb-20">
        <SectionHeading title="Typography" icon={Type} count="TYP-01 to TYP-35" />
        
        {/* --- HEADINGS --- */}
        <div className="grid grid-cols-1 gap-8">
            <DemoContainer>
                <ComponentLabel id="TYP-01" name="Display & Headings" />
                <div className="space-y-8">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 border-b border-slate-50 pb-4">
                        <div className="w-32 text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">Display / 4XL</div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter">Enterprise Vision</h1>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 border-b border-slate-50 pb-4">
                        <div className="w-32 text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">H1 / 3XL</div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Portfolio Management</h1>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 border-b border-slate-50 pb-4">
                        <div className="w-32 text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">H2 / 2XL</div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Risk Analysis</h2>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 border-b border-slate-50 pb-4">
                        <div className="w-32 text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">H3 / XL</div>
                        <h3 className="text-xl font-bold text-slate-800">Critical Path Dependencies</h3>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 border-b border-slate-50 pb-4">
                        <div className="w-32 text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">H4 / LG</div>
                        <h4 className="text-lg font-bold text-slate-700">Quarterly Objectives</h4>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12">
                        <div className="w-32 text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">H5 / Base</div>
                        <h5 className="text-base font-bold text-slate-700">Task Assignment</h5>
                    </div>
                </div>
            </DemoContainer>
        </div>

        {/* --- BODY TEXT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DemoContainer>
                <ComponentLabel id="TYP-06" name="Body Text Scales" />
                <div className="space-y-6">
                    <div>
                        <span className="text-[9px] text-slate-400 font-mono mb-1 block">Lead Paragraph (18px)</span>
                        <p className="text-lg text-slate-600 leading-relaxed font-light">
                            The Nexus platform leverages a standardized typographic scale to ensure clarity across complex data grids and interactive schedule visualizations.
                        </p>
                    </div>
                    <div>
                        <span className="text-[9px] text-slate-400 font-mono mb-1 block">Body Base (14px)</span>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Standard body text is used for general content, descriptions, and long-form reading. It maintains high legibility with appropriate line height and contrast against the enterprise background.
                        </p>
                    </div>
                    <div>
                        <span className="text-[9px] text-slate-400 font-mono mb-1 block">Body Small (12px)</span>
                        <p className="text-xs text-slate-500 leading-normal">
                            Small text is utilized for metadata, helper text, timestamps, and secondary information that supports the primary content without competing for attention.
                        </p>
                    </div>
                    <div>
                        <span className="text-[9px] text-slate-400 font-mono mb-1 block">Tiny / Micro (10px)</span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Legal Disclaimers & Labels
                        </p>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="TYP-10" name="Font Weights (Re-mapped)" />
                <div className="space-y-4">
                    <p className="text-3xl font-bold text-slate-900">Black (Maps to 700)</p>
                    <p className="text-3xl font-bold text-slate-900">Bold (Maps to 600)</p>
                    <p className="text-3xl font-medium text-slate-900">Semibold (Maps to 500)</p>
                    <p className="text-3xl font-medium text-slate-900">Medium (500)</p>
                    <p className="text-3xl font-normal text-slate-900">Normal (400)</p>
                    <p className="text-3xl font-light text-slate-900">Light (300)</p>
                </div>
            </DemoContainer>
        </div>
    </div>
  );
};
