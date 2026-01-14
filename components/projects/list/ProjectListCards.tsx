import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../../types/index';
import { useData } from '../../../context/DataContext';
import { User, Briefcase } from 'lucide-react';
import { calculateProjectProgress } from '../../../utils/calculations';
import { formatCompactCurrency } from '../../../utils/formatters';
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
          <div className="w-full py-12">
               <EmptyGrid title="No Projects Found" description="The current view filter or partition returned zero project components." icon={Briefcase} />
          </div>
      );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 pb-20">
      {projects.map(project => {
        const progress = calculateProjectProgress(project);
        const managerName = state.resources.find(r => r.id === project.managerId)?.name || 'Unassigned';
        
        return (
          <div 
            key={project.id} 
            onClick={() => navigate(`/projectWorkspace/${project.id}`)} 
            className={`${theme.components.card} ${theme.layout.cardPadding} hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer flex flex-col min-w-0 h-full hover:border-nexus-400 group relative overflow-hidden`}
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-nexus-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-4 gap-4">
              <div className="min-w-0 flex-1">
                <h3 className={`text-base font-black ${theme.colors.text.primary} leading-tight truncate uppercase tracking-tight`}>{project.name}</h3>
                <p className={`text-[10px] font-mono font-bold ${theme.colors.text.tertiary} mt-1 truncate uppercase`}>{project.code}</p>
              </div>
              <StatusBadge status={project.health} variant="health" className="flex-shrink-0 scale-90 origin-top-right"/>
            </div>
            
            <div className={`flex justify-between items-center text-[10px] font-black uppercase tracking-widest ${theme.colors.text.secondary} mb-8 gap-4`}>
              <div className="flex items-center gap-1.5 min-w-0">
                <User size={14} className={theme.colors.text.tertiary + " flex-shrink-0"}/>
                <span className="truncate">{managerName}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Briefcase size={14} className={theme.colors.text.tertiary}/>
                <span className="font-mono font-black">{formatCompactCurrency(project.budget)}</span>
              </div>
            </div>

            <div className={`mt-auto pt-5 border-t ${theme.colors.border}`}>
              <div className={`flex justify-between text-[10px] font-black uppercase tracking-widest ${theme.colors.text.secondary} mb-2`}>
                <span className="opacity-60">Physical Completion</span>
                <span className={`font-mono ${theme.colors.text.primary}`}>{progress}%</span>
              </div>
              <ProgressBar value={progress} colorClass={project.health === 'Critical' ? 'bg-red-500' : project.health === 'Warning' ? 'bg-amber-500' : 'bg-nexus-600'} size="sm"/>
            </div>
          </div>
        );
      })}
    </div>
  );
};