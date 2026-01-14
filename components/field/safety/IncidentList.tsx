import React from 'react';
import { SafetyIncident } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { Badge } from '../../ui/Badge';
import { ShieldCheck, AlertTriangle, User } from 'lucide-react';
import { EmptyGrid } from '../../common/EmptyGrid';

interface IncidentListProps {
    incidents: SafetyIncident[];
    onAdd: () => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({ incidents, onAdd }) => {
    const theme = useTheme();
    
    if (incidents.length === 0) {
        return (
            <div className="h-full flex items-center justify-center p-8">
                <EmptyGrid 
                    title="Zero Incident Workplace"
                    description="No safety incidents, near-misses, or property damage reports have been synchronized for this project lifecycle. High site integrity confirmed."
                    onAdd={onAdd}
                    actionLabel="Record Safety Event"
                    icon={ShieldCheck}
                />
            </div>
        );
    }

    return (
        <div className="h-full bg-white overflow-auto">
            <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0" role="grid">
                <thead className="bg-slate-50 sticky top-0 z-20 shadow-sm">
                    <tr>
                        <th className={theme.components.table.header + " pl-8"}>Timestamp</th>
                        <th className={theme.components.table.header}>Severity / Type</th>
                        <th className={theme.components.table.header + " w-1/3"}>Narrative Summary</th>
                        <th className={theme.components.table.header}>Site Sector</th>
                        <th className={theme.components.table.header}>Workflow</th>
                        <th className={theme.components.table.header + " pr-8 text-right"}>Reported By</th>
                    </tr>
                </thead>
                <tbody className={`divide-y ${theme.colors.border.replace('border-','divide-')} bg-white`}>
                    {incidents.map(inc => (
                        <tr key={inc.id} className="nexus-table-row group hover:bg-slate-50/50 transition-colors">
                            <td className={theme.components.table.cell + " pl-8 font-mono text-[11px] font-black text-slate-400 group-hover:text-nexus-600 transition-colors"}>{String(inc.date)}</td>
                            <td className={theme.components.table.cell}>
                                <Badge variant={inc.type === 'Lost Time' || inc.type === 'Medical Only' ? 'danger' : 'warning'} className="font-black uppercase tracking-tighter">
                                    {String(inc.type)}
                                </Badge>
                            </td>
                            <td className={theme.components.table.cell}>
                                <div className="font-bold text-sm text-slate-800 leading-relaxed truncate max-w-md group-hover:text-nexus-800 transition-colors" title={String(inc.description)}>
                                    {inc.description || <span className="text-slate-300 italic font-normal">No descriptive details provided.</span>}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">REF: {String(inc.id)}</div>
                            </td>
                            <td className={theme.components.table.cell}>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                    <AlertTriangle size={12} className="text-slate-300"/> {String(inc.location)}
                                </div>
                            </td>
                            <td className={theme.components.table.cell}>
                                <Badge variant={inc.status === 'Closed' ? 'success' : 'neutral'} className="bg-white">
                                    {String(inc.status)}
                                </Badge>
                            </td>
                            <td className={theme.components.table.cell + " text-right pr-8"}>
                                <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-500">
                                    <User size={12} className="opacity-40"/> {String(inc.reportedBy)}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {/* Professional spacing for list ends */}
                    {[...Array(3)].map((_, i) => (
                        <tr key={`spacer-${i}`} className="nexus-empty-pattern opacity-10 h-12">
                            <td colSpan={6}></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};