
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
          case 'ai': return 'Intelligence';
          default: return 'Enterprise';
      }
  };

  const getActiveTabLabel = () => {
    return activeTab.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
  };

  return (
    <nav className={`flex items-center space-x-1 text-[10px] font-black text-slate-400 select-none uppercase tracking-[0.2em]`}>
      <div 
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-all active:scale-95 group`} 
        onClick={() => onNavigate('portfolio')}
      >
          <Home size={14} className="group-hover:text-nexus-600 transition-colors"/>
      </div>
      
      <ChevronRight size={10} className="opacity-20 mx-1" />
      
      <span className="px-1">{getModuleGroup()}</span>

      <ChevronRight size={10} className="opacity-20 mx-1" />

      {activeTab === 'projectWorkspace' && currentProject ? (
        <div 
            className={`flex items-center gap-3 bg-nexus-50 text-nexus-700 px-4 py-1.5 rounded-xl border border-nexus-100 shadow-sm cursor-pointer hover:bg-nexus-100 transition-all group`}
            onClick={() => onNavigate('projectWorkspace', currentProject.id)}
        >
            <Briefcase size={12} className="opacity-60 group-hover:scale-110 transition-transform" />
            <span className="font-black font-mono tracking-tighter">{currentProject.code}</span>
            <span className="font-bold opacity-50 hidden lg:inline lowercase tracking-normal">/ {currentProject.name}</span>
        </div>
      ) : (
        <div className={`flex items-center gap-2 px-3 py-1.5 text-slate-900 bg-white rounded-xl border border-slate-200 shadow-sm font-black`}>
            {getActiveTabLabel()}
        </div>
      )}
    </nav>
  );
};
