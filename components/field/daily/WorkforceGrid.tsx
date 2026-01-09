
import React from 'react';
import { Users, Plus, Clock } from 'lucide-react';
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
        <div className={`${theme.components.card} overflow-hidden flex flex-col`}>
            <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.surface} flex justify-between items-center`}>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Users size={16} className="text-blue-600"/> Workforce Distribution
                </h3>
                <Button size="sm" icon={Plus} onClick={onAdd}>Add Labor Entry</Button>
            </div>
            <div className={`divide-y ${theme.colors.border.replace('border-', 'divide-')} flex-1`}>
                {logs.length > 0 ? (
                    logs.map(log => (
                        <div key={log.id} className={`p-5 hover:${theme.colors.background} transition-colors group`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className={`font-black text-slate-900`}>{log.contractor}</span>
                                <span className={`text-[10px] font-mono font-bold ${theme.colors.background} border ${theme.colors.border} px-2 py-1 rounded text-slate-500 uppercase`}>Code: {log.costCode || 'General'}</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">{log.description}</p>
                            <div className={`flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400`}>
                                <span className="flex items-center gap-1.5"><Users size={12}/> {log.headcount} Pax</span>
                                <span className="flex items-center gap-1.5"><Clock size={12}/> {log.hours} Man-Hours</span>
                                <span>Loc: {log.location}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4">
                        <FieldPlaceholder 
                            label="No labor records logged for this shift." 
                            onAdd={onAdd} 
                            icon={Users}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
