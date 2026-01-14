import React from 'react';
import { Users, Plus, Clock, Hammer, MapPin, Activity } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { WorkLog } from '../../../types';
import { FieldPlaceholder } from '../../common/FieldPlaceholder';

interface WorkforceGridProps {
    logs: WorkLog[];
    onAdd: () => void;
}

export const WorkforceGrid: React.FC<WorkforceGridProps> = ({ logs, onAdd }) => {
    const theme = useTheme();

    return (
        <div className={`${theme.components.card} overflow-hidden flex flex-col shadow-lg border-slate-200 rounded-[2rem]`}>
            <div className={`p-6 border-b ${theme.colors.border} ${theme.colors.surface} flex justify-between items-center bg-slate-50/50`}>
                <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Users size={16} className="text-blue-600"/> Field Workforce Topology
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Direct labor utilization and headcount by contractor</p>
                </div>
                <Button size="sm" icon={Plus} onClick={onAdd} className="shadow-lg shadow-nexus-500/10 font-bold uppercase tracking-widest text-[10px] h-10 px-6">Add Labor Entry</Button>
            </div>
            
            <div className={`divide-y ${theme.colors.border.replace('border-', 'divide-')} flex-1`}>
                {logs.length > 0 ? (
                    logs.map(log => (
                        <div key={log.id} className={`p-6 hover:${theme.colors.background} transition-colors group relative overflow-hidden`}>
                            {/* Status Accent Stripe */}
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-nexus-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className={`font-black text-slate-900 text-lg uppercase tracking-tight`}>{String(log.contractor)}</span>
                                    <div className="flex items-center gap-4 mt-1.5">
                                        <span className={`text-[10px] font-mono font-black ${theme.colors.background} border ${theme.colors.border} px-2.5 py-1 rounded-lg text-slate-500 uppercase tracking-tighter shadow-sm`}>
                                            Code: {log.costCode || 'UNMAPPED_LD'}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <MapPin size={12}/> {String(log.location)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-2 text-slate-800 font-black text-2xl tracking-tighter">
                                        <Users size={20} className="text-slate-300"/> {Number(log.headcount)}
                                    </div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Personnel</p>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-5 group-hover:bg-white transition-colors shadow-inner">
                                <p className="text-xs text-slate-600 font-bold leading-relaxed italic">"{log.description || 'No descriptive narrative provided for this labor shift.'}"</p>
                            </div>

                            <div className={`flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500`}>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <Clock size={12} className="text-green-500"/> {Number(log.hours)} <span className="text-slate-400">Aggregated Hours</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <Hammer size={12} className="text-blue-500"/> Type: Physical Labor
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-12">
                        <FieldPlaceholder 
                            label="Labor registry unpopulated for this period." 
                            onAdd={onAdd} 
                            icon={Users}
                            placeholderLabel="Register Workforce Shift"
                        />
                    </div>
                )}
            </div>
            
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center px-10">
                 <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest opacity-80">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-nexus-400"></div> Total Force: {logs.reduce((s,l) => s + (Number(l.headcount) || 0), 0)}</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Total Effort: {logs.reduce((s,l) => s + (Number(l.hours) || 0), 0)}h</span>
                 </div>
                 <div className="flex items-center gap-2 text-nexus-400 text-[10px] font-black uppercase tracking-widest">
                    <Activity size={14} className="animate-pulse" /> Live Telemetry
                 </div>
            </div>
        </div>
    );
};