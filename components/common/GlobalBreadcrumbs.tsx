import React from 'react';
import { Home, ChevronRight, Briefcase } from 'lucide-react';
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
  
  const getModuleGroup = () => {
      switch(activeTab) {
          case 'myWork': return 'Personal';
          case 'portfolio': case 'programs': return 'Strategic';
          case 'projectList': case 'projectWorkspace': return 'Execution';
          case 'admin': case 'dataExchange': return 'System Control';
          default: return 'Enterprise';
      }
  };

  return (
    <nav className={`flex items-center space-x-1 text-[11px] font-black ${theme.colors.text.tertiary} select-none uppercase tracking-[0.1em]`}>
      <div 
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:${theme.colors.background} cursor-pointer transition-all active:scale-95 group`} 
        onClick={() => onNavigate('portfolio')}
      >
          <Home size={14} className="group-hover:text-nexus-600 transition-colors"/>
      </div>
      
      <ChevronRight size={12} className="opacity-30" />
      
      <span className={`px-2 py-1.5`}>{getModuleGroup()}</span>

      <ChevronRight size={12} className="opacity-30" />

      {activeTab === 'projectWorkspace' && currentProject ? (
        <div 
            className={`flex items-center gap-3 ${theme.colors.semantic.info.bg} ${theme.colors.semantic.info.text} px-4 py-1.5 rounded-xl border ${theme.colors.semantic.info.border} shadow-sm cursor-pointer hover:brightness-95 transition-all group`}
            onClick={() => onNavigate('projectWorkspace', currentProject.id)}
        >
            <Briefcase size={12} className="opacity-60 group-hover:scale-110 transition-transform" />
            <span className="font-black font-mono tracking-tighter">{currentProject.code}</span>
            <span className="font-bold opacity-60 hidden lg:inline lowercase tracking-normal">| {currentProject.name}</span>
        </div>
      ) : (
        <div className={`flex items-center gap-2 px-3 py-1.5 ${theme.colors.text.primary} bg-white rounded-xl border ${theme.colors.border} shadow-sm`}>
            <span className="font-black text-[10px]">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</span>
        </div>
      )}
    </nav>
  );
};