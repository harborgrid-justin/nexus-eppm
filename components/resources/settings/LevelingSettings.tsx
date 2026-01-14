import React from 'react';
import { Sliders, ShieldCheck, Activity, Info } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useData } from '../../../context/DataContext';

export const LevelingSettings: React.FC = () => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    const schedulingConfig = state.governance?.scheduling;
    const resourceDefaults = state.governance?.resourceDefaults;

    if (!schedulingConfig || !resourceDefaults) {
        return (
            <div className="p-12 text-center text-slate-400 nexus-empty-pattern border-2 border-dashed border-slate-200 rounded-[2rem]">
                <Activity size={48} className="mx-auto mb-4 opacity-10"/>
                <p className="font-bold uppercase tracking-widest text-[10px]">Governance Context Isolated</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-10 animate-in fade-in p-2">
            <div className={`p-8 ${theme.colors.background} border ${theme.colors.border} rounded-[2rem] shadow-sm relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-12 bg-nexus-500/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <h3 className="font-black text-slate-900 text-lg uppercase tracking-tighter flex items-center gap-3 mb-8 relative z-10">
                    <Sliders size={22} className="text-nexus-600"/> Resource Leveling Engine
                </h3>
                
                <div className="space-y-10 relative z-10">
                    <div className={`${theme.colors.surface} flex items-center justify-between p-6 border ${theme.colors.border} rounded-2xl shadow-sm hover:border-nexus-200 transition-all group`}>
                        <div>
                            <p className="text-base font-black text-slate-800 uppercase tracking-tight group-hover:text-nexus-700 transition-colors">Automated Heuristic Resolution</p>
                            <p className="text-xs text-slate-500 font-medium mt-1">Enable CPM-based automatic shifting of activities to resolve over-allocations.</p>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={schedulingConfig.autoSaveOnSchedule}
                            readOnly
                            className="w-12 h-6 rounded-full appearance-none bg-slate-200 checked:bg-nexus-600 relative cursor-not-allowed transition-all shadow-inner" 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Priority Rule Set</label>
                            <select className={`w-full p-4 border ${theme.colors.border} rounded-xl text-sm bg-white font-bold text-slate-700 outline-none focus:ring-4 focus:ring-nexus-500/10 transition-all shadow-sm`}>
                                <option>Total Float (Lowest First)</option>
                                <option>Late Start (Earliest First)</option>
                                <option>Resource Rate (Highest First)</option>
                                <option>Activity Code Priority</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Leveling Sensitivity Threshold</label>
                            <div className="relative group">
                                <input 
                                    type="number" 
                                    className={`w-full p-4 border ${theme.colors.border} rounded-xl text-sm bg-white font-mono font-black text-slate-800 outline-none focus:ring-4 focus:ring-nexus-500/10 transition-all shadow-sm`}
                                    value={resourceDefaults.autoLevelingThreshold}
                                    readOnly
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">% LOAD</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
                        <div className="relative z-10 flex gap-6 items-start">
                            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 shadow-inner">
                                <ShieldCheck size={28} className="text-nexus-400"/>
                            </div>
                            <div>
                                <h4 className="font-black text-base tracking-tight uppercase mb-2">Governance Hard-Guardrails</h4>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium uppercase tracking-tight max-w-lg">
                                    The leveling algorithm is restricted to non-critical float paths. Logic will never automatically shift the project's contractually approved finish date beyond the <span className="text-white font-bold">10% volatility tolerance</span> defined in the CMP.
                                </p>
                            </div>
                        </div>
                        <Sliders size={200} className="absolute -right-20 -bottom-20 text-white/5 pointer-events-none rotate-12" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                 <Info size={20} className="text-blue-600 shrink-0"/>
                 <p className="text-[10px] text-blue-800 font-bold uppercase tracking-tight leading-relaxed">
                     These parameters drive the multi-project leveling simulation used in the <strong>Negotiation Hub</strong> and <strong>Portfolio Balancing</strong> modules.
                 </p>
            </div>
        </div>
    );
};