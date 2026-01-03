
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
  const projectId = project.id;
  const theme = useTheme();

  const {
      activeGroup,
      activeView,
      isPending,
      navStructure,
      handleGroupChange,
      handleViewChange
  } = useScopeManagementLogic();

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <ScopeDashboard />;
      case 'statement': return <ScopeStatement projectId={projectId} />;
      case 'wbs': return <WBSManager projectId={projectId} />;
      case 'requirements': return <RequirementsTraceability />;
      default: return <ScopeDashboard />;
    }
  };

  if (!project) return <div className={theme.layout.pagePadding}>Loading scope data...</div>;

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
