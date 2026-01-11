import React from 'react';
import { Users, Plus, Clock, Hammer, MapPin } from 'lucide-react';
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
        <div className={`${theme.components.card} overflow-hidden flex flex-col shadow-sm border-slate-200`}>
            <div className={`p-5 border-b ${theme.colors.border} ${theme.colors.surface} flex justify-between items-center bg-slate-50/50`}>
                <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Users size={16} className="text-blue-600"/> Field Workforce Distribution
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Labor utilization by contractor</p>
                </div>
                <Button size="sm" icon={Plus} onClick={onAdd} className="shadow-lg shadow-nexus-500/10 font-black uppercase tracking-widest text-[10px]">Add Labor Entry</Button>
            </div>
            
            <div className={`divide-y ${theme.colors.border.replace('border-', 'divide-')} flex-1`}>
                {logs.length > 0 ? (
                    logs.map(log => (
                        <div key={log.id} className={`p-6 hover:${theme.colors.background} transition-colors group relative overflow-hidden`}>
                            {/* Accent line for active status */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-nexus-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className={`font-black text-slate-900 text-base uppercase tracking-tight`}>{log.contractor}</span>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className={`text-[10px] font-mono font-black ${theme.colors.background} border ${theme.colors.border} px-2 py-0.5 rounded text-slate-500 uppercase tracking-tighter`}>
                                            Code: {log.costCode || 'UNMAPPED'}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                                            <MapPin size={10}/> {log.location}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-slate-800 font-black text-lg">
                                        <Users size={16} className="text-slate-400"/> {log.headcount}
                                    </div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Personnel</p>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 group-hover:bg-white transition-colors">
                                <p className="text-xs text-slate-600 font-medium leading-relaxed italic">"{log.description || 'No descriptive narrative provided for this labor shift.'}"</p>
                            </div>

                            <div className={`flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500`}>
                                <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm">
                                    <Clock size={12} className="text-green-500"/> {log.hours} <span className="text-slate-400">Net Man-Hours</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm">
                                    <Hammer size={12} className="text-blue-500"/> Effort Type: Fixed
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8">
                        <FieldPlaceholder 
                            label="Labor registry unpopulated for this period." 
                            onAdd={onAdd} 
                            icon={Users}
                        />
                    </div>
                )}
            </div>
            
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center px-8">
                 <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest opacity-80">
                    <span>Total Force: {logs.reduce((s,l) => s + l.headcount, 0)}</span>
                    <span>Aggregate Effort: {logs.reduce((s,l) => s + l.hours, 0)}h</span>
                 </div>
                 <div className="flex items-center gap-2 text-nexus-400 text-[10px] font-black uppercase tracking-widest">
                    <ActivityIcon size={12} className="animate-pulse" /> Live Telemetry Linked
                 </div>
            </div>
        </div>
    );
};

// Internal Mock to satisfy component dependencies
const ActivityIcon: React.FC<any> = (props) => <div {...props}>●</div>;