
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, ShieldAlert } from 'lucide-react';
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
    <div className={`h-full flex flex-col bg-slate-50/30 animate-in fade-in duration-300`}>
       <IncidentStats 
            daysWithoutIncident={daysWithoutIncident} 
            totalIncidents={incidents.length} 
            openIncidents={incidents.filter(i => i.status === 'Open').length} 
       />

       <div className="flex-1 overflow-hidden p-6 pt-0 flex flex-col">
           <div className={`flex-1 flex flex-col bg-white rounded-[2.5rem] border ${theme.colors.border} shadow-sm overflow-hidden`}>
               <div className={`p-6 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 gap-4`}>
                   <div className="flex items-center gap-4">
                       <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-500/20"><ShieldAlert size={24}/></div>
                       <div>
                           <h3 className={`font-black text-sm uppercase tracking-tighter text-slate-800`}>Occupational Safety Registry</h3>
                           <p className="text-xs text-slate-500 font-medium">HSE compliance and incident monitoring thread.</p>
                       </div>
                   </div>
                   <Button size="sm" icon={Plus} variant="danger" onClick={handleAddIncident} className="shadow-lg shadow-red-500/10 font-black uppercase text-[10px] tracking-widest px-8">Report Critical Incident</Button>
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
