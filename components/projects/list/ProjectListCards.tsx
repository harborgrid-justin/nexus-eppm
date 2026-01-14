
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../../types';
import { useData } from '../../../context/DataContext';
import { User, Briefcase } from 'lucide-react';
import { calculateProjectProgress } from '../../../utils/calculations';
import { formatCompactCurrency, formatInitials } from '../../../utils/formatters';
import { StatusBadge } from '../../common/StatusBadge';
import { ProgressBar } from '../../common/ProgressBar';
import { useTheme } from '../../../context/ThemeContext';

interface ProjectListCardsProps {
  projects: Project[];
  onSelect: (id: string) => void;
}

export const ProjectListCards: React.FC<ProjectListCardsProps> = ({ projects, onSelect }) => {
  const { state } = useData();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 pb-20">
      {projects.map(project => {
        const progress = calculateProjectProgress(project);
        const managerName = state.resources.find(r => r.id === project.managerId)?.name || 'Unassigned';
        
        return (
          <div key={project.id} onClick={() => navigate(`/projectWorkspace/${project.id}`)} className={`${theme.components.card} ${theme.layout.cardPadding} hover:shadow-md active:scale-[0.98] transition-all cursor-pointer flex flex-col min-w-0 h-full hover:border-nexus-300`}>
            <div className="flex justify-between items-start mb-4 gap-2">
              <div className="min-w-0 flex-1">
                <h3 className={`text-sm font-bold ${theme.colors.text.primary} leading-tight truncate`}>{project.name}</h3>
                <p className={`text-[10px] font-mono ${theme.colors.text.tertiary} mt-1 truncate`}>{project.code}</p>
              </div>
              <StatusBadge status={project.health} variant="health" className="flex-shrink-0 scale-90 origin-top-right"/>
            </div>
            
            <div className={`flex justify-between items-center text-[11px] ${theme.colors.text.secondary} mb-6 gap-4`}>
              <div className="flex items-center gap-1.5 min-w-0">
                <User size={12} className={theme.colors.text.tertiary + " flex-shrink-0"}/>
                <span className="truncate">{managerName}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Briefcase size={12} className={theme.colors.text.tertiary}/>
                <span className="font-mono font-medium">{formatCompactCurrency(project.budget)}</span>
              </div>
            </div>

            <div className={`mt-auto pt-4 border-t ${theme.colors.border.replace('border-', 'border-slate-').replace('200','50')}`}>
              <div className={`flex justify-between text-[10px] ${theme.colors.text.secondary} mb-1.5`}>
                <span className="font-bold">Execution Progress</span>
                <span className={`font-bold ${theme.colors.text.primary}`}>{progress}%</span>
              </div>
              <ProgressBar value={progress} colorClass={project.health === 'Critical' ? 'bg-red-500' : project.health === 'Warning' ? 'bg-yellow-500' : 'bg-nexus-600'} size="sm"/>
            </div>
          </div>
        );
      })}
      {projects.length === 0 && <div className={`col-span-full text-center py-12 ${theme.colors.text.tertiary}`}>No projects found.</div>}
    </div>
  );
};
