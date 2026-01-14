
import React from 'react';
import { Sliders, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const LevelingSettings: React.FC = () => {
    const theme = useTheme();
    return (
        <div className="max-w-3xl space-y-6 animate-in fade-in">
            <div className={`p-6 ${theme.colors.background} border ${theme.colors.border} rounded-2xl`}>
                <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
                    <Sliders size={18} className="text-nexus-600"/> Resource Leveling Engine Configuration
                </h3>
                <div className="space-y-6">
                    <div className={`${theme.colors.surface} flex items-center justify-between p-4 border ${theme.colors.border} rounded-xl shadow-sm`}>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Automatic Leveling</p>
                            <p className="text-xs text-slate-500">Enable CPM-based automatic resolution of over-allocations.</p>
                        </div>
                        <input type="checkbox" className="w-10 h-5 rounded-full appearance-none bg-slate-200 checked:bg-nexus-600 relative cursor-pointer transition-all" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Priority Resolution Strategy</label>
                        <select className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-white font-medium text-slate-700 outline-none focus:ring-2 focus:ring-nexus-500`}>
                            <option>Critical Path First (Total Float Heuristic)</option>
                            <option>Lowest Resource Rate First</option>
                            <option>WBS Priority (Manual Override)</option>
                        </select>
                    </div>
                    <div className="p-4 bg-indigo-900 rounded-xl text-white relative overflow-hidden shadow-md">
                        <div className="relative z-10">
                            <h4 className="font-bold flex items-center gap-2 mb-2 text-sm">
                                <ShieldCheck size={16} className="text-nexus-400"/> Governance Guardrails
                            </h4>
                            <p className="text-[11px] text-indigo-200 leading-relaxed uppercase tracking-tight">
                                Leveling can only be committed if the resultant schedule slippage is within 10% of the project's original approved finish date.
                            </p>
                        </div>
                        <Sliders size={80} className="absolute -right-4 -bottom-4 text-white/5" />
                    </div>
                </div>
            </div>
        </div>
    );
};
