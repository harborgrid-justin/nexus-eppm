
import React from 'react';
import { Sliders } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { ModuleNavigation } from './common/ModuleNavigation';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { useScopeManagementLogic } from '../hooks/domain/useScopeManagementLogic';

// Sub-components
import ScopeDashboard from './scope/ScopeDashboard';
import ScopeStatement from './scope/ScopeStatement';
import WBSManager from './scope/WBSManager';
import RequirementsTraceability from './scope/RequirementsTraceability';

const ScopeManagement: React.FC = () => {
  const { project } = useProjectWorkspace();
  const theme = useTheme();
  
  const {
      activeGroup,
      activeView,
      isPending,
      navStructure,
      handleGroupChange,
      handleViewChange
  } = useScopeManagementLogic();

  // Handle case where project is undefined (e.g. direct navigation or loading)
  if (!project) return (
    <div className={`p-6 space-y-4 flex flex-col h-full ${theme.colors.background}`}>
        <PageHeader title="Scope Management" subtitle="Deliverable and requirements hub" icon={Sliders} />
        <div className="flex-1 bg-slate-100 border border-slate-200 rounded-xl animate-pulse flex flex-col items-center justify-center text-slate-400 nexus-empty-pattern">
            <Sliders size={48} className="mb-4 opacity-10" />
            <p className="font-black uppercase tracking-widest text-[10px]">Initializing Scope Registry...</p>
        </div>
    </div>
  );

  const projectId = project.id;

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <ScopeDashboard />;
      case 'statement': return <ScopeStatement projectId={projectId} />;
      case 'wbs': return <WBSManager projectId={projectId} />;
      case 'requirements': return <RequirementsTraceability />;
      default: return <ScopeDashboard />;
    }
  };

  return (
    <div className={`${theme.layout.pageContainer} flex flex-col h-full bg-slate-50/30`}>
      <div className={`${theme.layout.pagePadding} pb-0 shrink-0`}>
        <PageHeader 
          title="Project Scope Management" 
          subtitle="Define, validate, and control project deliverables through the Work Breakdown Structure."
          icon={Sliders}
        />
      </div>

      <div className={`${theme.layout.panelContainer} m-6 mt-4 flex-1 flex flex-col overflow-hidden`}>
        <div className={`flex-shrink-0 border-b ${theme.colors.border} bg-slate-50/50 z-10`}>
          <ModuleNavigation 
              groups={navStructure}
              activeGroup={activeGroup}
              activeItem={activeView}
              onGroupChange={handleGroupChange}
              onItemChange={handleViewChange}
              className="bg-transparent border-0 shadow-none"
          />
        </div>
        <div className={`flex-1 overflow-hidden transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'} flex flex-col`}>
          <ErrorBoundary name="Scope Module">
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
export default ScopeManagement;
