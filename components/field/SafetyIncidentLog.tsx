
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
          location: 'Site Location TBD',
          status: 'Open',
          reportedBy: 'System User'
      };
      dispatch({ type: 'FIELD_ADD_INCIDENT', payload: newIncident });
  };

  return (
    <div className={`h-full flex flex-col ${theme.colors.background}/50 animate-in fade-in duration-300`}>
       <IncidentStats 
            daysWithoutIncident={daysWithoutIncident} 
            totalIncidents={incidents.length} 
            openIncidents={incidents.filter(i => i.status === 'Open').length} 
       />

       <div className="flex-1 overflow-hidden p-6 pt-0 flex flex-col">
           <div className={`${theme.layout.panelContainer} shadow-md`}>
               <div className={`p-5 ${theme.layout.headerBorder} flex flex-col sm:flex-row justify-between items-center ${theme.colors.surface} gap-4`}>
                   <div className="flex items-center gap-6">
                       <h3 className={`text-[10px] font-black uppercase tracking-widest ${theme.colors.text.tertiary}`}>Occupational Safety Registry</h3>
                   </div>
                   <Button size="sm" icon={Plus} variant="danger" onClick={handleAddIncident}>Report Critical Incident</Button>
               </div>
               <div className="flex-1 overflow-auto scrollbar-thin">
                   <IncidentList incidents={incidents} onAdd={handleAddIncident} />
               </div>
           </div>
       </div>
    </div>
  );
};

export default SafetyIncidentLog;
