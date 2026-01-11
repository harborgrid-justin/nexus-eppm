
import React from 'react';
import { Palette, Copy, Check } from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';
import { useTheme } from '../../context/ThemeContext';

interface ColorSwatchProps {
    name: string;
    hex: string;
    className: string;
    textClass?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, hex, className, textClass = "text-slate-500" }) => {
    const [copied, setCopied] = React.useState(false);
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-2 group cursor-pointer" onClick={copyToClipboard}>
            <div 
                className={`h-16 w-full rounded-lg shadow-sm border border-slate-200 flex items-center justify-center relative overflow-hidden transition-transform active:scale-95`}
                style={{ backgroundColor: hex }}
            >
                <div className={`opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]`}>
                    {copied ? <Check className="text-white h-5 w-5 drop-shadow-md"/> : <Copy className="text-white h-5 w-5 drop-shadow-md"/>}
                </div>
            </div>
            <div className="flex justify-between items-start px-1">
                <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight truncate">{name}</span>
                    <span className={`text-[9px] uppercase font-mono ${textClass}`}>{hex}</span>
                </div>
            </div>
        </div>
    );
};

export const DesignColors = () => {
  const theme = useTheme();
  const { tokens } = theme;

  // Semantic scales for demo
  const slates = [
      { n: '50', h: '#f8fafc' }, { n: '100', h: '#f1f5f9' }, { n: '200', h: '#e2e8f0' }, { n: '300', h: '#cbd5e1' },
      { n: '400', h: '#94a3b8' }, { n: '500', h: '#64748b' }, { n: '600', h: '#475569' }, { n: '700', h: '#334155' },
      { n: '800', h: '#1e293b' }, { n: '900', h: '#0f172a' }, { n: '950', h: '#020617' }
  ];
  const blues = [
      { n: '50', h: '#eff6ff' }, { n: '100', h: '#dbeafe' }, { n: '200', h: '#bfdbfe' }, { n: '300', h: '#93c5fd' },
      { n: '400', h: '#60a5fa' }, { n: '500', h: '#3b82f6' }, { n: '600', h: '#2563eb' }, { n: '700', h: '#1d4ed8' },
      { n: '800', h: '#1e40af' }, { n: '900', h: '#1e3a8a' }, { n: '950', h: '#172554' }
  ];
  const emeralds = [
      { n: '50', h: '#ecfdf5' }, { n: '100', h: '#d1fae5' }, { n: '200', h: '#a7f3d0' }, { n: '300', h: '#6ee7b7' },
      { n: '400', h: '#34d399' }, { n: '500', h: '#10b981' }, { n: '600', h: '#059669' }, { n: '700', h: '#047857' },
      { n: '800', h: '#065f46' }, { n: '900', h: '#064e3b' }, { n: '950', h: '#022c22' }
  ];

  return (
    <div className="space-y-12 animate-nexus-in">
        <SectionHeading title="Color Variables" icon={Palette} count="100+ Tokens" />

        {/* 1. Core Brand */}
        <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Primary Brand Identity</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <ColorSwatch name="Primary" hex={tokens.colors.primary} className="" />
                <ColorSwatch name="Primary Dark" hex={tokens.colors.primaryDark} className="" />
                <ColorSwatch name="Primary Light" hex={tokens.colors.primaryLight} className="" />
                <ColorSwatch name="Secondary" hex={tokens.colors.secondary} className=""/>
                <ColorSwatch name="Accent" hex={tokens.colors.accent} className=""/>
            </div>
        </div>

        {/* 2. Semantic Feedback */}
        <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Semantic Feedback</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <ColorSwatch name="Success" hex={tokens.colors.success} className=""/>
                <ColorSwatch name="Warning" hex={tokens.colors.warning} className=""/>
                <ColorSwatch name="Error" hex={tokens.colors.error} className=""/>
                <ColorSwatch name="Info" hex={tokens.colors.info} className=""/>
            </div>
        </div>

        {/* 3. Neutral Scale (Slate) */}
        <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Neutral Scale (Slate)</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-4">
                {slates.map(c => <ColorSwatch key={c.n} name={c.n} hex={c.h} className="" />)}
            </div>
        </div>

        {/* 4. Brand Scale (Nexus Blue) */}
        <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Primary Scale (Nexus Blue)</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-4">
                {blues.map(c => <ColorSwatch key={c.n} name={c.n} hex={c.h} className="" />)}
            </div>
        </div>

         {/* 5. Success Scale (Emerald) */}
         <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Success Scale (Emerald)</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-4">
                {emeralds.map(c => <ColorSwatch key={c.n} name={c.n} hex={c.h} className="" />)}
            </div>
        </div>

        {/* 6. Data Visualization */}
        <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Data Visualization Palette</h4>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                <ColorSwatch name="Chart 1" hex="#0ea5e9" className=""/>
                <ColorSwatch name="Chart 2" hex="#22c55e" className=""/>
                <ColorSwatch name="Chart 3" hex="#f59e0b" className=""/>
                <ColorSwatch name="Chart 4" hex="#ef4444" className=""/>
                <ColorSwatch name="Chart 5" hex="#8b5cf6" className=""/>
                <ColorSwatch name="Chart 6" hex="#ec4899" className=""/>
            </div>
        </div>

         {/* 7. Gradients & Overlays */}
         <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Gradients & Overlays</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="h-24 rounded-lg bg-gradient-to-r from-nexus-500 to-nexus-900 shadow-sm flex items-center justify-center text-white text-xs font-bold">Brand Gradient</div>
                <div className="h-24 rounded-lg bg-gradient-to-tr from-slate-800 to-slate-950 shadow-sm flex items-center justify-center text-white text-xs font-bold">Dark Surface</div>
                <div className="h-24 rounded-lg bg-white shadow-sm flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-nexus-500/10"></div>
                    <span className="relative text-nexus-700 text-xs font-bold">10% Overlay</span>
                </div>
                <div className="h-24 rounded-lg bg-slate-900 shadow-sm flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10"></div>
                    <span className="relative text-white text-xs font-bold">White Alpha 10</span>
                </div>
            </div>
        </div>

        {/* 8. Text Colors */}
        <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Typography Tokens</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-4 bg-white border rounded-lg">
                    <p className="text-3xl font-bold text-slate-900">Primary Text</p>
                    <p className="text-xs text-slate-400 font-mono mt-1">text-slate-900</p>
                </div>
                 <div className="p-4 bg-white border rounded-lg">
                    <p className="text-3xl font-bold text-slate-600">Secondary Text</p>
                    <p className="text-xs text-slate-400 font-mono mt-1">text-slate-600</p>
                </div>
                 <div className="p-4 bg-white border rounded-lg">
                    <p className="text-3xl font-bold text-slate-400">Tertiary Text</p>
                    <p className="text-xs text-slate-400 font-mono mt-1">text-slate-400</p>
                </div>
                <div className="p-4 bg-slate-900 border rounded-lg">
                    <p className="text-3xl font-bold text-white">Inverted Text</p>
                    <p className="text-xs text-slate-500 font-mono mt-1">text-white</p>
                </div>
            </div>
        </div>
    </div>
  );
};
