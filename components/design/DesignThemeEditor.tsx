
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
    Settings2, Palette, Type, Layers, Maximize, RotateCcw, 
    Save, Sun, Moon, Move, Zap, BarChart2, 
    AlignLeft, Hash, Box, Ruler, Layers as LayersIcon,
    Plus, AlertCircle, Square
} from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel, EmptyPatternDemo } from './DesignHelpers';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

export const DesignThemeEditor: React.FC = () => {
    const theme = useTheme();
    const { tokens, setTokens, isDark, toggleDark } = theme;

    // Local Helper to update deep nested tokens
    const updateToken = (category: string, key: string, value: any, subCategory?: string) => {
        const newTokens = { ...tokens } as any;
        if (subCategory) {
            newTokens[category][subCategory][key] = value;
        } else {
            newTokens[category][key] = value;
        }
        setTokens(newTokens);
    };

    const handleReset = () => {
        if (confirm("Restore factory defaults? This will clear all local overrides.")) {
            window.location.reload(); 
        }
    };

    const TokenGrid = ({ title, icon: Icon, items, category, subCategory }: any) => (
        <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Icon size={18} className="text-nexus-600"/>
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">{title}</h3>
                <span className="ml-auto text-[10px] font-mono text-slate-400">{items ? Object.keys(items).length : 0} Tokens</span>
            </div>
            {!items ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center gap-3">
                    <EmptyPatternDemo label={`${title} Ledger Empty`} />
                    <Button size="sm" variant="ghost" icon={Plus}>Initialize Category</Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Object.entries(items).map(([key, value]: [string, any]) => (
                        <div key={key} className="space-y-1 group">
                            <label className="text-[9px] font-bold text-slate-400 uppercase truncate block" title={key}>{key}</label>
                            {typeof value === 'string' && value.startsWith('#') ? (
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="color" 
                                        value={value} 
                                        onChange={(e) => updateToken(category, key, e.target.value, subCategory)}
                                        className="w-8 h-8 rounded border border-slate-200 cursor-pointer bg-transparent"
                                    />
                                    <span className="text-[10px] font-mono text-slate-500 group-hover:text-nexus-600 transition-colors uppercase">{value}</span>
                                </div>
                            ) : (
                                <Input 
                                    value={value} 
                                    onChange={(e) => updateToken(category, key, e.target.value, subCategory)}
                                    className="h-8 text-[10px] font-mono bg-slate-50/50"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-16 animate-nexus-in pb-32 max-w-7xl">
            <SectionHeading title="Enterprise Theme Engine" icon={Settings2} count="140+ Active Variables" />

            {/* --- 1. APPEARANCE & POLARITY --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DemoContainer>
                    <ComponentLabel id="SYS-POL" name="Interface Polarity" />
                    <div className="flex items-center justify-between p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${isDark ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-amber-400/20 text-amber-400 border border-amber-400/30'}`}>
                                {isDark ? <Moon size={24}/> : <Sun size={24}/>}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white uppercase tracking-tight">Active Mode: {isDark ? 'Dark' : 'Light'}</p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Reactive System Tokens</p>
                            </div>
                        </div>
                        <button 
                            onClick={toggleDark}
                            className={`w-16 h-8 rounded-full transition-all relative ${isDark ? 'bg-nexus-600 shadow-inner' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-xl transition-all duration-300 ${isDark ? 'left-9' : 'left-1'}`}></div>
                        </button>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="SYS-EMP" name="Contextual Empty State Pattern" />
                    <div className="space-y-4">
                        <EmptyPatternDemo label="Professional Light Grey fill" />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight text-center">Mandatory background for unpopulated production containers</p>
                    </div>
                </DemoContainer>
            </div>

            {/* --- 2. COLOR ARCHITECTURE --- */}
            <TokenGrid title="Brand & Semantic Palette" icon={Palette} items={tokens.colors} category="colors" />

            {/* --- 3. LAYOUT GEOMETRY --- */}
            <TokenGrid title="Structural Layout Rails" icon={Maximize} items={tokens.layout} category="layout" />

            {/* --- 4. MULTI-DENSITY SPACING --- */}
            <div className="space-y-8">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Ruler size={18} className="text-nexus-600"/>
                    <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Multi-Density Spacing System</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {Object.entries(tokens.spacing).map(([densityKey, spacingTokens]: [string, any]) => (
                        <div key={densityKey} className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                             <div className="flex justify-between items-center mb-6">
                                <Badge variant="neutral" className="font-black">{densityKey}</Badge>
                                <span className="text-[10px] font-mono text-slate-400 uppercase">Tokens: {Object.keys(spacingTokens).length}</span>
                             </div>
                             <div className="space-y-4">
                                {Object.entries(spacingTokens).map(([sKey, sVal]: [string, any]) => (
                                    <div key={sKey} className="flex items-center justify-between gap-4">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">{sKey}</label>
                                        <Input 
                                            value={sVal} 
                                            onChange={(e) => updateToken('spacing', sKey, e.target.value, densityKey)}
                                            className="h-8 text-[10px] font-mono text-right w-24"
                                        />
                                    </div>
                                ))}
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- 5. TYPOGRAPHY SYSTEM --- */}
            <div className="space-y-8">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Type size={18} className="text-nexus-600"/>
                    <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Global Typographic Stack</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Font Sans</label>
                            <Input value={tokens.typography.fontSans} onChange={e => updateToken('typography', 'fontSans', e.target.value)} className="font-mono text-xs" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Font Mono</label>
                            <Input value={tokens.typography.fontMono} onChange={e => updateToken('typography', 'fontMono', e.target.value)} className="font-mono text-xs" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Letter Spacing (Tight)</label>
                                <Input value={tokens.typography.letterSpacingTight} onChange={e => updateToken('typography', 'letterSpacingTight', e.target.value)} className="font-mono text-xs" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Letter Spacing (Wide)</label>
                                <Input value={tokens.typography.letterSpacingWide} onChange={e => updateToken('typography', 'letterSpacingWide', e.target.value)} className="font-mono text-xs" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 bg-nexus-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <p className="text-[10px] font-black text-nexus-400 uppercase tracking-[0.2em] mb-4">Rendering Engine Preview</p>
                        <h4 className="text-4xl font-bold leading-tight tracking-tight mb-4" style={{ fontFamily: tokens.typography.fontSans, letterSpacing: tokens.typography.letterSpacingTight }}>
                            High-Density <br/>Portfolio Matrix
                        </h4>
                        <p className="text-slate-400 font-mono text-xs leading-relaxed" style={{ fontFamily: tokens.typography.fontMono }}>
                            // v1.3.0 Standard <br/>
                            const Nexus = () => "Precision Controls";
                        </p>
                    </div>
                </div>
                
                <div className="space-y-4 pt-6">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Enterprise Weight Mapping (Refined)</label>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {Object.entries(tokens.typography.weights).map(([weight, val]: [string, any]) => (
                            <div key={weight} className="p-4 rounded-xl border border-slate-200 bg-white group hover:border-nexus-400 transition-colors">
                                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">{weight}</span>
                                <span className="text-lg font-bold text-slate-800" style={{ fontWeight: val }}>{val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- 6. ELEVATION & SHADOWS --- */}
            <TokenGrid title="Elevation & Depth" icon={Square} items={tokens.shadows} category="shadows" />

            {/* --- 7. COMPONENT RADIUS --- */}
            <TokenGrid title="Component Geometry (Radius)" icon={Box} items={tokens.borderRadius} category="borderRadius" />

            {/* --- 8. Z-INDEX STACK --- */}
            <TokenGrid title="Layer Topology (Z-Index)" icon={LayersIcon} items={tokens.zIndex} category="zIndex" />

            {/* --- 9. TRANSITIONS & MOTION --- */}
            <TokenGrid title="Interaction Timing" icon={Zap} items={tokens.transitions} category="transitions" />

            {/* --- 10. ANALYTICS PALETTE --- */}
            <TokenGrid title="Data Visualization Palette" icon={BarChart2} items={tokens.charts} category="charts" />

            {/* --- SYSTEM ACTIONS --- */}
            <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3 text-slate-400">
                    <AlertCircle size={16}/>
                    <p className="text-[11px] font-bold uppercase tracking-tight">Theme modifications are session-persistent and affect all project environments.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button 
                        onClick={handleReset}
                        className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
                    >
                        <RotateCcw size={14}/> Factory Reset
                    </button>
                    <Button icon={Save} className="shadow-2xl shadow-nexus-500/20 px-12 h-14 uppercase tracking-widest font-black text-xs rounded-2xl flex-1 md:flex-none">
                        Commit Variables
                    </Button>
                </div>
            </div>
        </div>
    );
};
