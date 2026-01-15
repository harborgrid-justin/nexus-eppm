
import React from 'react';
import { Users, Plus, Clock, Hammer, MapPin, Search } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { WorkLog } from '../../../types/index';
import { EmptyGrid } from '../../common/EmptyGrid';

interface WorkforceGridProps {
    logs: WorkLog[];
    onAdd: () => void;
}

export const WorkforceGrid: React.FC<WorkforceGridProps> = ({ logs, onAdd }) => {
    const theme = useTheme();

    return (
        <div className={`${theme.components.card} overflow-hidden flex flex-col shadow-lg rounded-[2.5rem] bg-white border-slate-200`}>
            <div className={`p-8 border-b ${theme.colors.border} bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-nexus-900 text-white rounded-2xl shadow-xl border border-slate-700">
                        <Users size={24}/>
                    </div>
                    <div>
                        <h3 className={`text-xs font-black ${theme.colors.text.tertiary} uppercase tracking-[0.2em] flex items-center gap-2`}>
                            Operational Human Capital Thread
                        </h3>
                        <p className="text-sm font-bold text-slate-900 mt-1">Cross-Contractor Field Deployment</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative group flex-1 sm:flex-none">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-nexus-600 transition-colors"/>
                        <input className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold w-full sm:w-48 focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 outline-none transition-all" placeholder="Filter vendors..." />
                    </div>
                    <Button size="md" icon={Plus} onClick={onAdd} className="shadow-lg shadow-nexus-500/20 font-black uppercase tracking-widest text-[10px] h-10 px-6 shrink-0">Add Labor Record</Button>
                </div>
            </div>
            
            <div className={`divide-y divide-slate-100 flex-1 overflow-auto bg-white`}>
                {logs.length > 0 ? (
                    <div className="min-w-full">
                         <div className="grid grid-cols-[1fr_120px_120px_1fr] px-8 py-4 bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                             <div>Strategic Partner Identity</div>
                             <div className="text-center">Active Headcount</div>
                             <div className="text-center">Consolidated Hrs</div>
                             <div className="text-right">Node Alignment</div>
                         </div>
                        {logs.map(log => (
                            <div key={log.id} className={`p-8 hover:${theme.colors.background} transition-all group relative overflow-hidden grid grid-cols-[1fr_120px_120px_1fr] items-center`}>
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-nexus-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[11px] font-black text-slate-500 shadow-inner group-hover:bg-white transition-colors">
                                        {String(log.contractor).charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <span className={`font-black text-slate-800 text-sm uppercase tracking-tight truncate block group-hover:text-nexus-700 transition-colors`}>{String(log.contractor)}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter`}>Ref: {log.id}</span>
                                            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                            <span className="text-[9px] font-black uppercase text-nexus-600">{log.costCode || 'UNBilled'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <span className="text-2xl font-black font-mono text-slate-900 tabular-nums">{Number(log.headcount)}</span>
                                </div>

                                <div className="text-center">
                                    <span className="text-lg font-black font-mono text-slate-500 tabular-nums group-hover:text-slate-800 transition-colors">{Number(log.hours)}h</span>
                                </div>

                                <div className="text-right">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-black uppercase text-slate-600 shadow-inner">
                                        <MapPin size={12} className="text-nexus-500"/> {String(log.location)}
                                    </div>
                                </div>
                            </div>
                        ))}
                         {[...Array(2)].map((_, i) => (
                            <div key={`fill-${i}`} className="nexus-empty-pattern h-16 opacity-5"></div>
                        ))}
                    </div>
                ) : (
                    <div className="p-16 h-full flex flex-col justify-center">
                        <EmptyGrid 
                            title="Labor Signal Null" 
                            description="No workforce participation artifacts have been synchronized for the active shift." 
                            onAdd={onAdd} 
                            icon={Hammer}
                            actionLabel="Provision Labor Thread"
                        />
                    </div>
                )}
            </div>
            <div className="p-4 bg-slate-950 text-white flex justify-between items-center px-10 border-t border-white/5 shadow-2xl">
                 <div className="flex gap-10">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total Presence</span>
                        <span className="text-base font-black font-mono text-green-400">{logs.reduce((s,l) => s+l.headcount,0)} <span className="text-[10px] text-slate-500">FTE</span></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Consolidated Effort</span>
                        <span className="text-base font-black font-mono text-white">{logs.reduce((s,l) => s+l.hours,0)}h</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-nexus-500">
                    <Clock size={14}/>
                    <span className="text-[10px] font-mono font-black uppercase">ledger_sync_v1.3</span>
                 </div>
            </div>
        </div>
    );
};
