
import React from 'react';
import { Home, LayoutGrid, Briefcase, Database, ChevronRight, Layers, PieChart, Globe } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

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
          case 'projectList': case 'projectWorkspace': case 'resources': return 'Execution';
          case 'admin': case 'dataExchange': return 'Configuration';
          default: return 'Enterprise';
      }
  };

  const getModuleIcon = () => {
      switch(activeTab) {
          case 'portfolio': return Globe;
          case 'programs': return PieChart;
          case 'projectWorkspace': return Briefcase;
          default: return LayoutGrid;
      }
  };

  const ModuleIcon = getModuleIcon();

  return (
    <nav className="flex items-center space-x-1 text-[11px] font-semibold text-slate-500 select-none">
      <div className={`flex items-center gap-1 px-2 py-1 rounded hover:${theme.colors.background} cursor-pointer transition-colors`} onClick={() => onNavigate('portfolio')}>
          <Home size={14} className="text-slate-400"/>
      </div>
      
      <ChevronRight size={12} className="text-slate-300" />
      
      <span className="px-2 py-1 uppercase tracking-wider text-[10px] font-bold text-slate-400">{getModuleGroup()}</span>

      <ChevronRight size={12} className="text-slate-300" />

      {activeTab === 'projectWorkspace' && currentProject ? (
        <div className={`flex items-center gap-2 ${theme.colors.semantic.info.bg} ${theme.colors.semantic.info.text} px-3 py-1 rounded-full border ${theme.colors.semantic.info.border} shadow-sm cursor-pointer hover:bg-blue-100 transition-colors`}>
            <Briefcase size={12} />
            <span>{currentProject.code}</span>
            <span className="font-normal text-blue-600 hidden sm:inline">| {currentProject.name}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-2 py-1 text-slate-700">
            <span className="capitalize">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</span>
        </div>
      )}
    </nav>
  );
};
