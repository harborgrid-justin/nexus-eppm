
import React from 'react';
import StatCard from '../../shared/StatCard';
import { ShieldCheck, Activity, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface IncidentStatsProps {
    daysWithoutIncident: number;
    totalIncidents: number;
    openIncidents: number;
}

export const IncidentStats: React.FC<IncidentStatsProps> = ({ daysWithoutIncident, totalIncidents, openIncidents }) => {
    const theme = useTheme();
    return (
        <div className={`p-6 grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
           <StatCard title="Days Without Incident" value={daysWithoutIncident} icon={ShieldCheck} trend="up" />
           <StatCard title="Total Incidents" value={totalIncidents} subtext="Project Lifetime" icon={Activity} />
           <StatCard title="Open Observations" value={openIncidents} icon={AlertTriangle} trend={openIncidents > 0 ? 'down' : undefined} />
       </div>
    );
};
