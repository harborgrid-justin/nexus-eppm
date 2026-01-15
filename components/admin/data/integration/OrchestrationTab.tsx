
import React from 'react';
import { Clock, RefreshCw, Zap } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';
import { Input } from '../../../ui/Input';

interface OrchestrationTabProps {
    orchestration: {
        triggerType: string;
        cronExpression: string;
        frequency: string;
        retryAttempts: number;
        backoffInterval: number;
    };
    setOrchestration: (val: any) => void;
}

export const OrchestrationTab: React.FC<OrchestrationTabProps> = ({ orchestration, setOrchestration }) => {
    const theme = useTheme();

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-nexus-in">
            <div className={`bg-white border ${theme.colors.border} rounded-[2rem] p-8 shadow-sm relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 p-12 bg-nexus-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-nexus-500/10 transition-colors"></div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-8 flex items-center gap-3 relative z-10 border-b pb-4 border-slate-50">
                    <Clock size={18} className="text-nexus-600"/> Transmission Cycles & Triggers
                </h3>
                <div className="space-y-10 relative z-10">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Initiation Protocol</label>
                        <div className={`flex ${theme.colors.background} p-1 rounded-2xl border ${theme.colors.border} shadow-inner`}>
                            {['Scheduled', 'Event-Based', 'Manual'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setOrchestration({...orchestration, triggerType: t})}
                                    className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${orchestration.triggerType === t ? 'bg-white shadow-md text-nexus-700 ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {orchestration.triggerType === 'Scheduled' && (
                        <div className="grid grid-cols-2 gap-8 animate-nexus-in">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Ingestion Frequency</label>
                                <select 
                                    className={`w-full p-3.5 border ${theme.colors.border} rounded-xl text-sm font-black bg-slate-50 focus:bg-white transition-all outline-none focus:ring-4 focus:ring-nexus-500/5 focus:border-nexus-500 text-slate-700`}
                                    value={orchestration.frequency}
                                    onChange={e => setOrchestration({...orchestration, frequency: e.target.value})}
                                >
                                    <option>Real-time Polling</option>
                                    <option>Hourly Batch</option>
                                    <option>Daily Synchronization</option>
                                    <option>Weekly Re-index</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">CRON Expression (POSIX)</label>
                                <Input value={orchestration.cronExpression} onChange={e => setOrchestration({...orchestration, cronExpression: e.target.value})} className="font-mono text-sm font-black text-slate-800" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className={`bg-white border ${theme.colors.border} rounded-[2rem] p-8 shadow-sm relative overflow-hidden group`}>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-8 flex items-center gap-3 border-b pb-4 border-slate-50 relative z-10">
                    <RefreshCw size={18} className="text-orange-500"/> Resilience & Retry Policy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Fault Recovery Attempts</label>
                        <Input type="number" value={orchestration.retryAttempts} onChange={e => setOrchestration({...orchestration, retryAttempts: parseInt(e.target.value)})} className="font-mono font-black" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Exponential Backoff (Sec)</label>
                        <Input type="number" value={orchestration.backoffInterval} onChange={e => setOrchestration({...orchestration, backoffInterval: parseInt(e.target.value)})} className="font-mono font-black" />
                    </div>
                </div>
                <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3 shadow-sm relative z-10">
                    <Zap size={18} className="text-orange-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-orange-900 leading-relaxed font-bold uppercase tracking-tight">
                        Aggressive retry policies may impact source system throughput. Coordinated maintenance windows are recommended for full re-indexing.
                    </p>
                </div>
            </div>
        </div>
    );
};
