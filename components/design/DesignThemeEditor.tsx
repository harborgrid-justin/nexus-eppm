
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Settings2, Palette, Type, Layers, Maximize, RotateCcw, Save, Sun, Moon } from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel, EmptyPatternDemo } from './DesignHelpers';
import { Button } from '../ui/Button';

export const DesignThemeEditor: React.FC = () => {
    const theme = useTheme();
    const { tokens, setTokens, isDark, toggleDark } = theme;

    const handleColorChange = (key: string, value: string) => {
        setTokens({
            ...tokens,
            colors: { ...tokens.colors, [key]: value }
        });
    };

    const handleRadiusChange = (key: string, value: string) => {
        setTokens({
            ...tokens,
            borderRadius: { ...tokens.borderRadius, [key]: value }
        });
    };

    const handleReset = () => {
        if (confirm("Reset all design variables to system defaults?")) {
            window.location.reload(); // Simplest way to restore DEFAULT_TOKENS constant
        }
    };

    return (
        <div className="space-y-12 animate-nexus-in pb-20">
            <SectionHeading title="Theme Engine" icon={Settings2} count="Live Variables" />

            {/* --- GLOBAL SWITCHES --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DemoContainer>
                    <ComponentLabel id="THM-01" name="Apperance Mode" />
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800 text-purple-400' : 'bg-amber-50 text-orange-500'}`}>
                                {isDark ? <Moon size={20}/> : <Sun size={20}/>}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Interface Polarity</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black">{isDark ? 'Dark Mode' : 'Light Mode'}</p>
                            </div>
                        </div>
                        <button 
                            onClick={toggleDark}
                            className={`w-12 h-6 rounded-full transition-all relative ${isDark ? 'bg-nexus-600' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDark ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="THM-02" name="Contextual Fill" />
                    <EmptyPatternDemo label="Professional Light Grey Pattern" />
                </DemoContainer>
            </div>

            {/* --- COLOR TOKENS --- */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Palette size={18} className="text-nexus-600"/>
                    <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">Brand Color Palette</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {Object.entries(tokens.colors).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase truncate" title={key}>{key}</label>
                            <div className="flex items-center gap-2 group">
                                <input 
                                    type="color" 
                                    value={value} 
                                    onChange={(e) => handleColorChange(key, e.target.value)}
                                    className="w-10 h-10 rounded-xl border-2 border-white shadow-md cursor-pointer overflow-hidden bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase">{value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- BORDER RADII --- */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Layers size={18} className="text-nexus-600"/>
                    <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">Component Sharpness (Radius)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {Object.entries(tokens.borderRadius).filter(([k]) => k !== 'full').map(([key, value]) => (
                        <div key={key} className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase block">{key} Radius</label>
                            <div className="flex items-center gap-4">
                                <input 
                                    type="range" min="0" max="48" step="1"
                                    // FIX: Casting 'value' to string as Object.entries may return unknown types in certain TS configurations
                                    value={parseInt(value as string)}
                                    onChange={(e) => handleRadiusChange(key, `${e.target.value}px`)}
                                    className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-nexus-600"
                                />
                                {/* FIX: Casting 'value' to string to satisfy type requirements for children */}
                                <span className="text-xs font-mono font-bold bg-slate-50 px-2 py-1 rounded border border-slate-200">{value as string}</span>
                            </div>
                            <div 
                                className="h-16 w-full bg-nexus-600 border border-nexus-700 shadow-sm"
                                // FIX: Casting 'value' to string for CSS style property compatibility
                                style={{ borderRadius: value as string }}
                            ></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- TYPOGRAPHY --- */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Type size={18} className="text-nexus-600"/>
                    <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">Typeface Assignment</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <DemoContainer>
                        <ComponentLabel id="THM-TYP-01" name="Global Sans Font" />
                        <textarea 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white transition-colors outline-none"
                            value={tokens.typography.fontSans}
                            onChange={(e) => setTokens({...tokens, typography: {...tokens.typography, fontSans: e.target.value}})}
                            rows={2}
                        />
                        <p className="mt-4 text-xl" style={{ fontFamily: tokens.typography.fontSans }}>
                            The quick brown fox jumps over the lazy dog.
                        </p>
                    </DemoContainer>
                    <DemoContainer>
                        <ComponentLabel id="THM-TYP-02" name="Global Mono Font" />
                        <textarea 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white transition-colors outline-none"
                            value={tokens.typography.fontMono}
                            onChange={(e) => setTokens({...tokens, typography: {...tokens.typography, fontMono: e.target.value}})}
                            rows={2}
                        />
                        <p className="mt-4 text-xl font-mono" style={{ fontFamily: tokens.typography.fontMono }}>
                            0123456789 ABC-xyz
                        </p>
                    </DemoContainer>
                </div>
            </div>

            {/* --- CONTROL FOOTER --- */}
            <div className="pt-12 flex justify-end gap-4">
                <button 
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 active:scale-95 transition-all"
                >
                    <div className="p-0.5"><RotateCcw size={14}/></div> Factory Reset
                </button>
                <Button icon={Save} className="shadow-xl shadow-nexus-500/20 px-10 h-12 uppercase tracking-widest font-black text-xs">
                    Commit to Global State
                </Button>
            </div>
        </div>
    );
};
