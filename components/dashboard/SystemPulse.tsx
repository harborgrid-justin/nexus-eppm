
import React from 'react';
import { Zap, Activity, AlertOctagon, Layers } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SystemPulseProps {
    summary: {
        totalTasks: number;
        totalCriticalIssues: number;
        healthCounts: { critical: number };
    };
}

const SystemPulseComponent: React.FC<SystemPulseProps> = ({ summary }) => {
    const theme = useTheme();
    return (
        <div className="p-4 bg-slate-950 rounded-[2rem] text-white flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
            
            <div className="flex items-center gap-5 relative z-10 px-4">
                <div className="p-2.5 bg-nexus-600 rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.5)] animate-pulse border border-white/20">
                    <Zap size={22} className="text-white fill-current"/>
                </div>
                <div>
                    <p className="font-black text-sm uppercase tracking-[0.2em]">Telemetry Pulse</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Real-time enterprise ingestion active</p>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-12 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] relative z-10 px-8 py-4 md:py-0 border-t md:border-t-0 md:border-l border-white/10">
                <div className="flex items-center gap-3 group">
                    <Activity size={14} className="text-nexus-400 group-hover:scale-125 transition-transform" />
                    <span><strong className="text-white text-base font-mono tabular-nums">{summary.totalTasks.toLocaleString()}</strong> Records</span>
                </div>
                <div className="flex items-center gap-3 group">
                    <AlertOctagon size={14} className="text-red-500 group-hover:scale-125 transition-transform" />
                    <span><strong className="text-white text-base font-mono tabular-nums">{summary.totalCriticalIssues}</strong> Escalations</span>
                </div>
                <div className="flex items-center gap-3 group">
                    <Layers size={14} className="text-orange-400 group-hover:scale-125 transition-transform" />
                    <span><strong className="text-white text-base font-mono tabular-nums">{summary.healthCounts.critical}</strong> Risk Clusters</span>
                </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-3 text-[9px] font-mono text-nexus-700 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 relative z-10 mr-4">
                UP_TIME: 99.98% • LATENCY: 24MS
            </div>
        </div>
    );
};

export const SystemPulse = React.memo(SystemPulseComponent);
