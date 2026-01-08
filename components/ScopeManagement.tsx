
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
    <div className="p-8 flex items-center justify-center h-full text-slate-400">
        <div className="flex flex-col items-center gap-2">
            <Sliders size={32} className="opacity-20"/>
            <span className="font-bold text-xs uppercase tracking-widest">Initializing Scope Context...</span>
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
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="Scope Management" 
        subtitle="Define, validate, and control project scope and deliverables."
        icon={Sliders}
      />

      <div className={theme.layout.panelContainer}>
        <div className={`flex-shrink-0 ${theme.layout.headerBorder} z-10 bg-slate-50/50`}>
          <ModuleNavigation 
              groups={navStructure}
              activeGroup={activeGroup}
              activeItem={activeView}
              onGroupChange={handleGroupChange}
              onItemChange={handleViewChange}
              className="bg-transparent border-0 shadow-none"
          />
        </div>
        <div className={`flex-1 overflow-hidden transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
          <ErrorBoundary name="Scope Module">
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
export default ScopeManagement;
