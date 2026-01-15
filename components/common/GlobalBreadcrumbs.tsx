import React from 'react';
import { Home, ChevronRight, Briefcase, Globe, User, ShieldCheck } from 'lucide-react';
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
          case 'myWork': return 'Human Capital';
          case 'portfolio': case 'programs': return 'Strategic Realization';
          case 'projectList': case 'projectWorkspace': return 'Active Execution';
          case 'admin': case 'dataExchange': return 'Operational Infrastructure';
          case 'ai': return 'Predictive Intelligence';
          default: return 'Enterprise Ledger';
      }
  };

  const getActiveTabLabel = () => {
    return activeTab.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
  };

  const getGroupIcon = () => {
      switch(activeTab) {
          case 'myWork': return User;
          case 'admin': case 'dataExchange': return ShieldCheck;
          case 'portfolio': case 'programs': return Globe;
          default: return Briefcase;
      }
  };

  const GroupIcon = getGroupIcon();

  return (
    <nav className={`flex items-center space-x-1 text-[10px] font-black text-slate-400 select-none uppercase tracking-[0.2em] h-10`}>
      <div 
        className={`flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-all active:scale-95 group shadow-sm bg-white border border-slate-100 hover:border-slate-200`} 
        onClick={() => onNavigate('portfolio')}
        title="Enterprise Root"
      >
          <Home size={14} className="group-hover:text-nexus-600 transition-colors"/>
      </div>
      
      <ChevronRight size={10} className="opacity-20 mx-1.5 text-slate-300" />
      
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 font-black tracking-widest whitespace-nowrap shadow-inner">
          <GroupIcon size={12} className="opacity-60"/>
          <span>{getModuleGroup()}</span>
      </div>

      <ChevronRight size={10} className="opacity-20 mx-1.5 text-slate-300" />

      {activeTab === 'projectWorkspace' && currentProject ? (
        <div 
            className={`flex items-center gap-4 bg-nexus-900 text-white px-5 py-2 rounded-xl border border-nexus-800 shadow-xl cursor-pointer hover:bg-black transition-all group relative overflow-hidden`}
            onClick={() => onNavigate('projectWorkspace', currentProject.id)}
        >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Briefcase size={14} className="text-nexus-400 group-hover:scale-110 transition-transform relative z-10" />
            <span className="font-black font-mono tracking-tighter text-sm relative z-10 tabular-nums">{currentProject.code}</span>
            <span className="font-bold opacity-40 hidden lg:inline lowercase tracking-normal relative z-10">/ {currentProject.name}</span>
        </div>
      ) : (
        <div className={`flex items-center gap-3 px-5 py-2 text-slate-950 bg-white rounded-xl border border-slate-200 shadow-md font-black tracking-tight scale-105 z-10 transition-all hover:border-nexus-300`}>
            <div className="w-1.5 h-1.5 rounded-full bg-nexus-600 animate-pulse"></div>
            {getActiveTabLabel()}
        </div>
      )}
    </nav>
  );
};