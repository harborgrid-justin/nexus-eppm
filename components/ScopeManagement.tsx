
import React from 'react';
import { Sliders } from 'lucide-react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { useScopeManagementLogic } from '../hooks/domain/useScopeManagementLogic';
import { EmptyGrid } from './common/EmptyGrid';
import { ModuleNavigation } from './common/ModuleNavigation';

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
    <div className="flex flex-col h-full bg-white">
        <div className="flex-shrink-0 border-b border-slate-100">
             <ModuleNavigation 
                groups={navStructure}
                activeGroup={activeGroup}
                activeItem={activeView}
                onGroupChange={handleGroupChange}
                onItemChange={handleViewChange}
                className="bg-transparent border-0 shadow-none"
             />
        </div>
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            {renderContent()}
        </div>
    </div>
  );
};
export default ScopeManagement;
