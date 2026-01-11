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
            <div 
                className={`h-24 w-full rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center relative overflow-hidden transition-transform active:scale-95`}
                style={{ backgroundColor: hex }}
            >
                <div className={`opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]`}>
                    {copied ? <Check className="text-white h-6 w-6 drop-shadow-md"/> : <Copy className="text-white h-6 w-6 drop-shadow-md"/>}
                </div>
            </div>
            <div className="flex justify-between items-start px-1">
                <div className="flex flex-col min-w-0">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight truncate">{name}</span>
                    <span className={`text-[9px] uppercase font-mono font-bold ${textClass}`}>{hex}</span>
                </div>
            </div>
        </div>
    );
};

export const DesignColors = () => {
  const theme = useTheme();
  const { tokens } = theme;

  return (
    <div className="space-y-12 animate-nexus-in">
        <SectionHeading title="Color Variables" icon={Palette} count="Live Tokens" />

        <div className="space-y-8">
            <h4 className="text-lg font-black text-slate-900 border-b-2 border-slate-100 pb-2 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-nexus-600 rounded-full"></div> Brand Fundamentals
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DemoContainer>
                    <ComponentLabel id="COL-01" name="Primary Tokens" />
                    <div className="grid grid-cols-3 gap-4">
                        <ColorSwatch name="Base" hex={tokens.colors.primary} className="" />
                        <ColorSwatch name="Dark" hex={tokens.colors.primaryDark} className="" />
                        <ColorSwatch name="Light" hex={tokens.colors.primaryLight} className="" />
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="COL-02" name="Supporting Accent" />
                    <div className="grid grid-cols-3 gap-4">
                        <ColorSwatch name="Secondary" hex={tokens.colors.secondary} className=""/>
                        <ColorSwatch name="Accent" hex={tokens.colors.accent} className=""/>
                        <ColorSwatch name="Info" hex={tokens.colors.info} className=""/>
                    </div>
                </DemoContainer>
            </div>
        </div>
        
        <div className="space-y-8">
            <h4 className="text-lg font-black text-slate-900 border-b-2 border-slate-100 pb-2 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-green-500 rounded-full"></div> Semantic Outcomes
            </h4>
            <DemoContainer>
                <ComponentLabel id="COL-03" name="Feedback System" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <ColorSwatch name="Success" hex={tokens.colors.success} className=""/>
                    <ColorSwatch name="Warning" hex={tokens.colors.warning} className=""/>
                    <ColorSwatch name="Error" hex={tokens.colors.error} className=""/>
                    <ColorSwatch name="Neutral Muted" hex={tokens.colors.textMuted} className=""/>
                </div>
            </DemoContainer>
        </div>

        <div className="space-y-8">
            <h4 className="text-lg font-black text-slate-900 border-b-2 border-slate-100 pb-2 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-slate-400 rounded-full"></div> Surface Architecture
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DemoContainer>
                    <ComponentLabel id="COL-04" name="Background Layers" />
                    <div className="grid grid-cols-3 gap-4">
                        <ColorSwatch name="Canvas" hex={tokens.colors.background} className=""/>
                        <ColorSwatch name="Surface" hex={tokens.colors.surface} className=""/>
                        <ColorSwatch name="Border" hex={tokens.colors.border} className=""/>
                    </div>
                </DemoContainer>
                <DemoContainer>
                    <ComponentLabel id="COL-05" name="Content Strategy" />
                    <div className="grid grid-cols-2 gap-4">
                        <ColorSwatch name="Text Main" hex={tokens.colors.text} className=""/>
                        <ColorSwatch name="Text Muted" hex={tokens.colors.textMuted} className=""/>
                    </div>
                </DemoContainer>
            </div>
        </div>
    </div>
  );
};