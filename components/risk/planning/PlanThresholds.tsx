
import React from 'react';
import { RiskManagementPlan } from '../../../types/index';
import { BarChart2, ShieldCheck, Target } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface PlanThresholdsProps {
    formData: RiskManagementPlan;
    setFormData: (data: RiskManagementPlan) => void;
    isReadOnly: boolean;
}

export const PlanThresholds: React.FC<PlanThresholdsProps> = ({ formData, setFormData, isReadOnly }) => {
    const theme = useTheme();
    return (
        <div className="space-y-12 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter">
                        <Target size={24} className="text-nexus-600"/> Governance Scoring Logic
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">Authorized probability-impact scale for enterprise risk evaluation.</p>
                </div>
            </div>
            
            <div className="flex flex-col xl:flex-row gap-12 items-center justify-center">
                <div className="grid grid-cols-5 grid-rows-5 gap-2 p-4 bg-slate-50 border border-slate-100 rounded-[2.5rem] shadow-inner shrink-0">
                    {[5,4,3,2,1].map(r => [1,2,3,4,5].map(c => {
                        const score = r * c;
                        let bg = 'bg-green-500/20 text-green-700 border-green-500/10';
                        if (score >= 15) bg = 'bg-red-500 text-white border-red-600 shadow-lg'; 
                        else if (score >= 8) bg = 'bg-yellow-400 text-yellow-900 border-yellow-500 shadow-md';
                        
                        return (
                            <div 
                                key={`${r}-${c}`} 
                                className={`w-16 h-16 ${bg} rounded-2xl flex flex-col items-center justify-center transition-all border-2`}
                            >
                                <span className="text-lg font-black font-mono">{score}</span>
                                <span className="text-[8px] font-bold opacity-40">{r}x{c}</span>
                            </div>
                        )
                    }))}
                </div>
                
                <div className="space-y-6 flex-1 w-full max-w-xl">
                     <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between shadow-sm group hover:border-red-300 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                            <div>
                                <h4 className="text-sm font-black text-red-900 uppercase tracking-tight">Critical Escalation</h4>
                                <p className="text-[10px] text-red-700 font-medium uppercase tracking-widest mt-1">Automatic Program Level Report</p>
                            </div>
                        </div>
                        <span className="font-mono text-sm font-black text-red-900 bg-white px-3 py-1 rounded-xl border border-red-100">Score &ge; 15</span>
                     </div>
                     
                     <div className="p-6 bg-yellow-50 border border-yellow-100 rounded-2xl flex items-center justify-between shadow-sm group hover:border-yellow-300 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                            <div>
                                <h4 className="text-sm font-black text-yellow-900 uppercase tracking-tight">Major Tracking</h4>
                                <p className="text-[10px] text-yellow-700 font-medium uppercase tracking-widest mt-1">Weekly PMO Monitoring</p>
                            </div>
                        </div>
                        <span className="font-mono text-sm font-black text-yellow-900 bg-white px-3 py-1 rounded-xl border border-yellow-100">8 &le; Score &lt; 15</span>
                     </div>
                     
                     <div className="p-6 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-between shadow-sm group hover:border-green-300 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                            <div>
                                <h4 className="text-sm font-black text-green-900 uppercase tracking-tight">Standard Monitor</h4>
                                <p className="text-[10px] text-green-700 font-medium uppercase tracking-widest mt-1">Monthly Operational Review</p>
                            </div>
                        </div>
                        <span className="font-mono text-sm font-black text-green-900 bg-white px-3 py-1 rounded-xl border border-green-100">Score &lt; 8</span>
                     </div>
                </div>
            </div>
            
            <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-white/10">
                 <div className="relative z-10 flex gap-6 items-start">
                    <div className="p-3 bg-white/10 rounded-2xl border border-white/10 shadow-inner">
                        <ShieldCheck size={28} className="text-nexus-400"/>
                    </div>
                    <div>
                        <h4 className="font-black text-base tracking-tight uppercase mb-2">Policy Enforcement Acknowledgment</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium uppercase tracking-tight max-w-lg">
                            Scoring thresholds are globally enforced. Any risk identification surpassing the <span className="text-white font-bold">CRITICAL</span> boundary triggers an immutable entry in the enterprise audit log and automated stakeholder alerts.
                        </p>
                    </div>
                 </div>
                 <BarChart2 size={180} className="absolute -right-16 -bottom-16 opacity-5 text-white pointer-events-none rotate-12 group-hover:scale-110 transition-transform duration-1000" />
            </div>
        </div>
    );
};
