
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { SafetyIncident } from '../../types';
import { generateId } from '../../utils/formatters';
import { getDaysDiff } from '../../utils/dateUtils';
import { IncidentStats } from './safety/IncidentStats';
import { IncidentList } from './safety/IncidentList';

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
       <IncidentStats 
            daysWithoutIncident={daysWithoutIncident} 
            totalIncidents={incidents.length} 
            openIncidents={incidents.filter(i => i.status === 'Open').length} 
       />

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
                   <IncidentList incidents={incidents} onAdd={handleAddIncident} />
               </div>
           </div>
       </div>
    </div>
  );
};

export default SafetyIncidentLog;
