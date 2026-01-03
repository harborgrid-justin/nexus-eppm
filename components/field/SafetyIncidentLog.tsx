
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AlertTriangle, Plus, ShieldCheck, Activity, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import StatCard from '../shared/StatCard';
import { SafetyIncident } from '../../types';
import { generateId } from '../../utils/formatters';

interface SafetyIncidentLogProps {
  projectId: string;
}

const SafetyIncidentLog: React.FC<SafetyIncidentLogProps> = ({ projectId }) => {
  const { state, dispatch } = useData();
  const theme = useTheme();
  
  const incidents = state.safetyIncidents.filter(i => i.projectId === projectId);
  
  const handleAddIncident = () => {
      const newIncident: SafetyIncident = {
          id: generateId('INC'),
          projectId,
          date: new Date().toISOString().split('T')[0],
          type: 'Near Miss',
          description: 'New Incident Report',
          location: 'Site',
          status: 'Open',
          reportedBy: 'User'
      };
      dispatch({ type: 'FIELD_ADD_INCIDENT', payload: newIncident });
  };

  return (
    <div className={`h-full flex flex-col ${theme.colors.background}/50`}>
       {/* Stats */}
       <div className={`p-6 grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
           <StatCard title="Days Without Incident" value="142" icon={ShieldCheck} trend="up" />
           <StatCard title="Total Incidents" value={incidents.length} subtext="Project Lifetime" icon={Activity} />
           <StatCard title="Open Observations" value={incidents.filter(i => i.status === 'Open').length} icon={AlertTriangle} />
       </div>

       {/* List */}
       <div className="flex-1 overflow-hidden p-6 pt-0 flex flex-col">
           <div className={theme.layout.panelContainer}>
               <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center ${theme.colors.surface}`}>
                   <div className="flex items-center gap-4">
                       <h3 className={theme.typography.h3}>Incident Registry</h3>
                       <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-md w-48" />
                       </div>
                   </div>
                   <Button size="sm" icon={Plus} variant="danger" onClick={handleAddIncident}>Report Incident</Button>
               </div>
               <div className="flex-1 overflow-auto">
                   <table className="min-w-full divide-y divide-slate-100">
                       <thead className="bg-slate-50">
                           <tr>
                               <th className={theme.components.table.header}>Date</th>
                               <th className={theme.components.table.header}>Type</th>
                               <th className={theme.components.table.header}>Description</th>
                               <th className={theme.components.table.header}>Location</th>
                               <th className={theme.components.table.header}>Status</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                           {incidents.map(inc => (
                               <tr key={inc.id} className={theme.components.table.row}>
                                   <td className={theme.components.table.cell}>{inc.date}</td>
                                   <td className={theme.components.table.cell}><Badge variant={inc.type === 'Near Miss' ? 'warning' : 'danger'}>{inc.type}</Badge></td>
                                   <td className={`${theme.components.table.cell} ${theme.colors.text.primary}`}>{inc.description}</td>
                                   <td className={theme.components.table.cell}>{inc.location}</td>
                                   <td className={theme.components.table.cell}><Badge variant={inc.status === 'Closed' ? 'success' : 'neutral'}>{inc.status}</Badge></td>
                               </tr>
                           ))}
                           {incidents.length === 0 && (
                               <tr><td colSpan={5} className="p-8 text-center text-slate-400">No incidents recorded.</td></tr>
                           )}
                       </tbody>
                   </table>
               </div>
           </div>
       </div>
    </div>
  );
};

export default SafetyIncidentLog;
