
import React from 'react';
import { Sliders, Loader2 } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { useScopeManagementLogic } from '../hooks/domain/useScopeManagementLogic';
import { TabbedLayout } from './layout/standard/TabbedLayout';
import { EmptyGrid } from './common/EmptyGrid';

// Sub-components
import ScopeDashboard from './scope/ScopeDashboard';
import ScopeStatement from './scope/ScopeStatement';
import WBSManager from './scope/WBSManager';
import RequirementsTraceability from './scope/RequirementsTraceability';

const ScopeManagement: React.FC = () => {
  const { project } = useProjectWorkspace();
  
  const {
      activeGroup,
      activeView,
      isPending,
      navStructure,
      handleGroupChange,
      handleViewChange
  } = useScopeManagementLogic();

  // Handle case where project is undefined
  if (!project) return (
      <div className="h-full flex items-center justify-center p-8">
          <EmptyGrid 
              title="Scope Context Initializing" 
              description="Loading project parameters..."
              icon={Sliders}
          />
      </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <ScopeDashboard />;
      case 'statement': return <ScopeStatement projectId={project.id} />;
      case 'wbs': return <WBSManager projectId={project.id} />;
      case 'requirements': return <RequirementsTraceability />;
      default: return <ScopeDashboard />;
    }
  };

  return (
    <TabbedLayout
        title="Project Scope Management"
        subtitle="Define, validate, and control project deliverables through the Work Breakdown Structure."
        icon={Sliders}
        navGroups={navStructure}
        activeGroup={activeGroup}
        activeItem={activeView}
        onGroupChange={handleGroupChange}
        onItemChange={handleViewChange}
    >
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'} flex flex-col`}>
          <ErrorBoundary name="Scope Module">
            {renderContent()}
          </ErrorBoundary>
        </div>
    </TabbedLayout>
  );
};
export default ScopeManagement;
