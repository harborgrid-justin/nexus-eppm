
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../../types/index';
import { useData } from '../../../context/DataContext';
// Fix: Added missing ArrowRight icon to lucide-react imports
import { User, Briefcase, Target, Activity, ArrowRight } from 'lucide-react';
import { calculateProjectProgress } from '../../../utils/calculations';
import { formatCompactCurrency, formatInitials } from '../../../utils/formatters';
import { StatusBadge } from '../../common/StatusBadge';
import { ProgressBar } from '../../common/ProgressBar';
import { useTheme } from '../../../context/ThemeContext';
import { EmptyGrid } from '../../common/EmptyGrid';

interface ProjectListCardsProps {
  projects: Project[];
  onSelect: (id: string) => void;
}

export const ProjectListCards: React.FC<ProjectListCardsProps> = ({ projects, onSelect }) => {
  const { state } = useData();
  const theme = useTheme();
  const navigate = useNavigate();

  if (projects.length === 0) {
      return (
          <div className="w-full py-12 flex justify-center">
               <EmptyGrid title="Registry Isolated" description="No active project components identified in this view." icon={Briefcase} />
          </div>
      );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-8 pb-32">
      {projects.map(project => {
        const progress = calculateProjectProgress(project);
        const managerName = state.resources.find(r => r.id === project.managerId)?.name || 'Unassigned';
        
        return (
          <div 
            key={project.id} 
            onClick={() => navigate(`/projectWorkspace/${project.id}`)} 
            className={`bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:shadow-2xl hover:border-nexus-400 hover:-translate-y-1 active:scale-[0.98] transition-all cursor-pointer flex flex-col group relative overflow-hidden`}
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-nexus-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-6 gap-6">
              <div className="min-w-0 flex-1">
                <h3 className={`text-lg font-black text-slate-900 leading-tight truncate uppercase tracking-tight group-hover:text-nexus-700 transition-colors`}>{project.name}</h3>
                <p className={`text-[10px] font-mono font-bold text-slate-400 mt-1 truncate uppercase tracking-widest`}>ID: {project.code}</p>
              </div>
              <StatusBadge status={project.health} variant="health" className="flex-shrink-0 scale-90 origin-top-right"/>
            </div>
            
            <div className={`grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10`}>
              <div className="flex items-center gap-2 min-w-0 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <User size={14} className="text-slate-300 flex-shrink-0"/>
                <span className="truncate text-slate-700">{managerName}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <Target size={14} className="text-slate-300 flex-shrink-0"/>
                <span className="font-mono font-black text-nexus-600">{formatCompactCurrency(project.budget)}</span>
              </div>
            </div>

            <div className={`mt-auto pt-6 border-t border-slate-50`}>
              <div className={`flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3`}>
                <span>Maturity Index</span>
                <span className={`font-mono font-black text-slate-900`}>{progress}%</span>
              </div>
              <ProgressBar value={progress} colorClass={project.health === 'Critical' ? 'bg-red-500' : project.health === 'Warning' ? 'bg-amber-500' : 'bg-nexus-600'} size="sm"/>
              
              <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <Activity size={12}/> {project.tasks?.length || 0} Nodes
                  </div>
                  <button className="text-[10px] font-black text-nexus-600 uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    Launch Workspace <ArrowRight size={12}/>
                  </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
