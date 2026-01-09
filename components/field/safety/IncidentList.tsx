
import React from 'react';
import { SafetyIncident } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { Badge } from '../../ui/Badge';
import { ShieldCheck } from 'lucide-react';
import { EmptyGrid } from '../../common/EmptyGrid';

interface IncidentListProps {
    incidents: SafetyIncident[];
    onAdd: () => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({ incidents, onAdd }) => {
    const theme = useTheme();
    
    if (incidents.length === 0) {
        return (
            <EmptyGrid 
                title="Safe Site: Zero Incidents"
                description="No safety incidents or near-miss observations have been recorded for this project lifecycle."
                onAdd={onAdd}
                actionLabel="Record Safety Observation"
                icon={ShieldCheck}
            />
        );
    }

    return (
        <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50 sticky top-0">
                <tr>
                    <th className={theme.components.table.header}>Date</th>
                    <th className={theme.components.table.header}>Type</th>
                    <th className={theme.components.table.header}>Description</th>
                    <th className={theme.components.table.header}>Location</th>
                    <th className={theme.components.table.header}>Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
                {incidents.map(inc => (
                    <tr key={inc.id} className={`${theme.components.table.row} hover:bg-slate-50 cursor-pointer`}>
                        <td className={theme.components.table.cell + " font-mono text-xs font-bold text-slate-500"}>{inc.date}</td>
                        <td className={theme.components.table.cell}><Badge variant={inc.type === 'Near Miss' ? 'warning' : 'danger'}>{inc.type}</Badge></td>
                        <td className={`${theme.components.table.cell} font-bold text-slate-800`}>{inc.description || <span className="text-slate-300 italic font-normal">Pending detail...</span>}</td>
                        <td className={theme.components.table.cell + " text-sm text-slate-500"}>{inc.location}</td>
                        <td className={theme.components.table.cell}><Badge variant={inc.status === 'Closed' ? 'success' : 'neutral'}>{inc.status}</Badge></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
