import React from 'react';
import { Palette, Copy, Check } from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';
import { useTheme } from '../../context/ThemeContext';

const ColorSwatch = ({ name, hex, className, textClass = "text-slate-500" }: { name: string, hex: string, className: string, textClass?: string }) => {
    const [copied, setCopied] = React.useState(false);
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-3 group cursor-pointer" onClick={copyToClipboard}>
            <div className={`h-24 w-full rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center relative overflow-hidden transition-transform active:scale-95 ${className}`}>
                <div className={`opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]`}>
                    {copied ? <Check className="text-white h-6 w-6 drop-shadow-md"/> : <Copy className="text-white h-6 w-6 drop-shadow-md"/>}
                </div>
            </div>
            <div className="flex justify-between items-start px-1">
                <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{name}</span>
                    <span className={`text-[9px] uppercase font-mono font-bold ${textClass}`}>{hex}</span>
                </div>
            </div>
        </div>
    );
};

export const DesignColors = () => {
  const theme = useTheme();

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
        <SectionHeading title="Color Variables" icon={Palette} count="12 Base Swatches" />

        <div className="space-y-8">
            <h4 className="text-lg font-black text-slate-900 border-b-2 border-slate-100 pb-2 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-nexus-600 rounded-full"></div> Core Branding
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DemoContainer>
                    <ComponentLabel id="COL-01" name="Nexus Primary (Blue)" />
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                        <ColorSwatch name="Base 600" hex="#2563eb" className="bg-blue-600"/>
                        <ColorSwatch name="Light 500" hex="#3b82f6" className="bg-blue-500"/>
                        <ColorSwatch name="Tint 100" hex="#dbeafe" className="bg-blue-100"/>
                        <ColorSwatch name="Wash 50" hex="#eff6ff" className="bg-blue-50"/>
                        <ColorSwatch name="Deep 900" hex="#1e3a8a" className="bg-blue-900"/>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="COL-02" name="Neutral Slates" />
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                        <ColorSwatch name="Ink 900" hex="#0f172a" className="bg-slate-900"/>
                        <ColorSwatch name="Slate 600" hex="#475569" className="bg-slate-600"/>
                        <ColorSwatch name="Muted 400" hex="#94a3b8" className="bg-slate-400"/>
                        <ColorSwatch name="Surface 100" hex="#f1f5f9" className="bg-slate-100"/>
                        <ColorSwatch name="BG 50" hex="#f8fafc" className="bg-slate-50"/>
                    </div>
                </DemoContainer>
            </div>
        </div>
        
        <div className="space-y-8">
            <h4 className="text-lg font-black text-slate-900 border-b-2 border-slate-100 pb-2 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-green-500 rounded-full"></div> Semantic Feedback
            </h4>
            <DemoContainer>
                <ComponentLabel id="COL-03" name="Action & Status Tokens" />
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {[
                        { label: 'Success', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', hex: '#10b981' },
                        { label: 'Warning', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', hex: '#f59e0b' },
                        { label: 'Danger', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', hex: '#ef4444' },
                        { label: 'Info', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', hex: '#3b82f6' },
                        { label: 'Portfolio', bg: 'bg-slate-900', border: 'border-slate-800', text: 'text-white', hex: '#0f172a' },
                    ].map((c) => (
                        <div key={c.label} className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 shadow-sm hover:shadow-md transition-all ${c.bg} ${c.border}`}>
                            <span className={`text-xs font-black uppercase tracking-widest ${c.text}`}>{c.label}</span>
                            <span className={`text-[10px] font-mono font-bold opacity-60 ${c.text}`}>{c.hex}</span>
                        </div>
                    ))}
                </div>
            </DemoContainer>
        </div>
    </div>
  );
};