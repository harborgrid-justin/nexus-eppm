
import React from 'react';
import { Home, LayoutGrid, Briefcase, ChevronRight, PieChart, Globe } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

interface BreadcrumbProps {
  activeTab: string;
  projectId?: string;
  onNavigate: (tab: string, id?: string) => void;
}

export const GlobalBreadcrumbs: React.FC<BreadcrumbProps> = ({ activeTab, projectId, onNavigate }) => {
  const { state } = useData();
  const theme = useTheme();
  
  const currentProject = state.projects.find(p => p.id === projectId);
  
  // Resolve Module Group
  const getModuleGroup = () => {
      switch(activeTab) {
          case 'myWork': return 'Personal';
          case 'portfolio': case 'programs': return 'Strategy';
          case 'projectList': case 'projectWorkspace': return 'Execution';
          case 'admin': case 'dataExchange': return 'Configuration';
          default: return 'Enterprise';
      }
  };

  return (
    <nav className={`flex items-center space-x-1 text-[11px] font-semibold ${theme.colors.text.secondary} select-none`}>
      <div 
        className={`flex items-center gap-1 px-2 py-1 rounded hover:${theme.colors.background} cursor-pointer transition-colors`} 
        onClick={() => onNavigate('portfolio')}
      >
          <Home size={14} className={theme.colors.text.tertiary}/>
      </div>
      
      <ChevronRight size={12} className={theme.colors.text.tertiary} />
      
      <span className={`px-2 py-1 uppercase tracking-wider text-[10px] font-black ${theme.colors.text.tertiary}`}>{getModuleGroup()}</span>

      <ChevronRight size={12} className={theme.colors.text.tertiary} />

      {activeTab === 'projectWorkspace' && currentProject ? (
        <div 
            className={`flex items-center gap-2 ${theme.colors.semantic.info.bg} ${theme.colors.semantic.info.text} px-3 py-1 rounded-full border ${theme.colors.semantic.info.border} shadow-sm cursor-pointer hover:brightness-95 transition-all`}
            onClick={() => onNavigate('projectWorkspace', currentProject.id)}
        >
            <Briefcase size={12} />
            <span className="font-bold">{currentProject.code}</span>
            <span className="font-medium opacity-70 hidden sm:inline">| {currentProject.name}</span>
        </div>
      ) : (
        <div className={`flex items-center gap-2 px-2 py-1 ${theme.colors.text.primary}`}>
            <span className="capitalize font-bold">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</span>
        </div>
      )}
    </nav>
  );
};
