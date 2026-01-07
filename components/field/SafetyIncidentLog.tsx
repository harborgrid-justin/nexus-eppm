import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { AlertTriangle, Plus, ShieldCheck, Activity, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import StatCard from '../shared/StatCard';
import { SafetyIncident } from '../../types';
import { generateId } from '../../utils/formatters';
import { getDaysDiff } from '../../utils/dateUtils';
import { EmptyGrid } from '../common/EmptyGrid';

interface SafetyIncidentLogProps {
  projectId: string;
}

const SafetyIncidentLog: React.FC<SafetyIncidentLogProps> = ({ projectId }) => {
  const { state, dispatch } = useData();
  const theme = useTheme();
  
  const incidents = useMemo(() => 
    state.safetyIncidents.filter(i => i.projectId === projectId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  , [state.safetyIncidents, projectId]);
  
  const daysWithoutIncident = useMemo(() => {
      const today = new Date();
      if (incidents.length === 0) {
          const project = state.projects.find(p => p.id === projectId);
          if (project) return getDaysDiff(new Date(project.startDate), today);
          return 0;
      }
      const lastDate = new Date(incidents[0].date);
      return Math.max(0, getDaysDiff(lastDate, today));
  }, [incidents, state.projects, projectId]);

  const handleAddIncident = () => {
      const newIncident: SafetyIncident = {
          id: generateId('INC'),
          projectId,
          date: new Date().toISOString().split('T')[0],
          type: 'Near Miss',
          description: '',
          location: 'Site',
          status: 'Open',
          reportedBy: 'User'
      };
      dispatch({ type: 'FIELD_ADD_INCIDENT', payload: newIncident });
  };

  return (
    <div className={`h-full flex flex-col ${theme.colors.background}/50`}>
       <div className={`p-6 grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
           <StatCard title="Days Without Incident" value={daysWithoutIncident} icon={ShieldCheck} trend="up" />
           <StatCard title="Total Incidents" value={incidents.length} subtext="Project Lifetime" icon={Activity} />
           <StatCard title="Open Observations" value={incidents.filter(i => i.status === 'Open').length} icon={AlertTriangle} />
       </div>

       <div className="flex-1 overflow-hidden p-6 pt-0 flex flex-col">
           <div className={theme.layout.panelContainer}>
               <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center ${theme.colors.surface}`}>
                   <div className="flex items-center gap-4">
                       <h3 className={`text-sm font-black uppercase tracking-widest text-slate-500`}>Incident Registry</h3>
                       <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Filter log..." className="pl-9 pr-4 py-1.5 text-xs font-bold border border-slate-300 rounded-md w-48 nexus-focus-ring" />
                       </div>
                   </div>
                   <Button size="sm" icon={Plus} variant="danger" onClick={handleAddIncident}>Report Incident</Button>
               </div>
               <div className="flex-1 overflow-auto">
                   {incidents.length > 0 ? (
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
                   ) : (
                       <EmptyGrid 
                            title="Safe Site: Zero Incidents"
                            description="No safety incidents or near-miss observations have been recorded for this project lifecycle."
                            onAdd={handleAddIncident}
                            actionLabel="Record Safety Observation"
                            icon={ShieldCheck}
                       />
                   )}
               </div>
           </div>
       </div>
    </div>
  );
};

export default SafetyIncidentLog;