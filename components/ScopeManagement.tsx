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
  const workspace = useProjectWorkspace();
  const project = workspace?.project;
  const theme = useTheme();

  const {
      activeGroup,
      activeView,
      isPending,
      navStructure,
      handleGroupChange,
      handleViewChange
  } = useScopeManagementLogic();

  // FIX: Professional grey fill placeholder instead of static text to maintain UI consistency during init.
  if (!project) return (
    <div className="p-[var(--spacing-gutter)] space-y-[var(--spacing-gutter)] flex flex-col h-full w-full max-w-[var(--spacing-container)] mx-auto">
        <PageHeader title="Scope Management" subtitle="Deliverable Hub" icon={Sliders} />
        <div className="flex-1 bg-slate-100 border border-slate-200 rounded-xl animate-pulse flex flex-col items-center justify-center text-slate-400">
            <Sliders size={48} className="mb-4 opacity-10" />
            <p className="font-bold uppercase tracking-widest text-xs">Initializing Scope Context...</p>
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
          <ErrorBoundary>
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
export default ScopeManagement;
