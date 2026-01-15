import React from 'react';
import { SafetyIncident } from '../../../types/index';
import { useTheme } from '../../../context/ThemeContext';
import { Badge } from '../../ui/Badge';
import { ShieldCheck, AlertTriangle, User, ExternalLink, Trash2, Clock } from 'lucide-react';
import { EmptyGrid } from '../../common/EmptyGrid';
import { useData } from '../../../context/DataContext';

interface IncidentListProps {
    incidents: SafetyIncident[];
    onAdd: () => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({ incidents, onAdd }) => {
    const theme = useTheme();
    const { dispatch } = useData();
    
    if (incidents.length === 0) {
        return (
            <div className="h-full flex items-center justify-center p-12">
                <EmptyGrid 
                    title="Incident Matrix Null"
                    description="Zero occupational safety artifacts detected. HSE record integrity is nominal."
                    onAdd={onAdd}
                    actionLabel="Record High-Risk Observation"
                    icon={ShieldCheck}
                />
            </div>
        );
    }

    return (
        <div className="h-full bg-white overflow-auto scrollbar-thin">
            <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0" role="grid">
                <thead className={`bg-slate-50/80 sticky top-0 z-20 shadow-sm border-b backdrop-blur-md`}>
                    <tr>
                        <th className={`${theme.components.table.header} pl-10 py-6`}>Handshake ID</th>
                        <th className={theme.components.table.header}>Classification</th>
                        <th className={`${theme.components.table.header} w-1/3`}>Narrative Summary</th>
                        <th className={theme.components.table.header}>Vector Sector</th>
                        <th className={`${theme.components.table.header} text-right pr-12`}>Reporting Principal</th>
                    </tr>
                </thead>
                <tbody className={`divide-y ${theme.colors.border.replace('border-','divide-')} bg-white`}>
                    {incidents.map(inc => (
                        <tr key={inc.id} className="nexus-table-row group hover:bg-slate-50/50 transition-all border-l-4 border-transparent hover:border-nexus-500">
                            <td className={`px-6 py-5 pl-10`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-xl text-slate-400 group-hover:text-nexus-600 transition-colors"><Clock size={14}/></div>
                                    <span className="font-mono text-[11px] font-black text-slate-400 group-hover:text-slate-700">{String(inc.date)}</span>
                                </div>
                            </td>
                            <td className={theme.components.table.cell}>
                                <Badge variant={inc.type === 'Lost Time' || inc.type === 'Property Damage' ? 'danger' : 'warning'} className="font-black px-3 h-7">{String(inc.type)}</Badge>
                            </td>
                            <td className={theme.components.table.cell}>
                                <div className={`font-black text-sm text-slate-800 uppercase tracking-tight truncate max-w-md group-hover:text-nexus-700 transition-colors`}>{inc.description || 'Record initializing...'}</div>
                                <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Instance: {inc.id}</div>
                            </td>
                            <td className={theme.components.table.cell}>
                                <div className={`flex items-center gap-2 text-xs font-black uppercase text-slate-500 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100 shadow-inner group-hover:border-nexus-100 group-hover:bg-nexus-50 group-hover:text-nexus-700 transition-all`}>
                                    <AlertTriangle size={12} className="text-nexus-400"/> {String(inc.location)}
                                </div>
                            </td>
                            <td className={`${theme.components.table.cell} text-right pr-12`}>
                                <div className="flex items-center justify-end gap-10">
                                    <div className={`flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase`}>
                                        <User size={12} className="opacity-40"/> {String(inc.reportedBy)}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 text-slate-400 hover:text-nexus-600"><ExternalLink size={16}/></button>
                                        <button onClick={() => dispatch({type: 'FIELD_DELETE_INCIDENT', payload: inc.id})} className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {[...Array(5)].map((_, i) => (
                        <tr key={`spacer-${i}`} className="nexus-empty-pattern opacity-10 h-16 pointer-events-none">
                            <td colSpan={10}></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};