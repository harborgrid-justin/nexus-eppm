
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
        <div className={`${theme.components.card} overflow-hidden flex flex-col shadow-lg rounded-[2rem]`}>
            <div className={`p-6 border-b ${theme.colors.border} ${theme.colors.surface} flex justify-between items-center bg-slate-50/50`}>
                <div>
                    <h3 className={`text-xs font-black ${theme.colors.text.tertiary} uppercase tracking-widest flex items-center gap-2`}>
                        <Users size={16} className="text-blue-600"/> Field Workforce Topology
                    </h3>
                </div>
                <Button size="sm" icon={Plus} onClick={onAdd}>Add Labor Entry</Button>
            </div>
            
            <div className={`divide-y ${theme.colors.border.replace('border-', 'divide-')} flex-1`}>
                {logs.length > 0 ? (
                    logs.map(log => (
                        <div key={log.id} className={`p-6 hover:${theme.colors.background} transition-colors group relative overflow-hidden`}>
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-nexus-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className={`font-black ${theme.colors.text.primary} text-lg uppercase tracking-tight`}>{String(log.contractor)}</span>
                                    <div className="flex items-center gap-4 mt-1.5">
                                        <span className={`text-[10px] font-mono font-black ${theme.colors.background} border ${theme.colors.border} px-2.5 py-1 rounded-lg ${theme.colors.text.tertiary} uppercase tracking-tighter shadow-sm`}>
                                            Code: {log.costCode || 'UNMAPPED'}
                                        </span>
                                        <span className={`flex items-center gap-1 text-[10px] font-bold ${theme.colors.text.tertiary} uppercase tracking-widest`}>
                                            <MapPin size={12}/> {String(log.location)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`flex items-center justify-end gap-2 ${theme.colors.text.primary} font-black text-2xl tracking-tighter`}>
                                        <Users size={20} className="text-slate-300"/> {Number(log.headcount)}
                                    </div>
                                    <p className={`text-[9px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest`}>Active Personnel</p>
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
        </div>
    );
};
