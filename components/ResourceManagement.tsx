
import React, { useMemo } from 'react';
import { Users } from 'lucide-react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { ErrorBoundary } from './ErrorBoundary';
import ResourcePool from './resources/ResourcePool';
import ResourceCapacity from './resources/ResourceCapacity';
import ResourceLeveling from './resources/ResourceLeveling';
import ResourcePlanEditor from './resources/ResourcePlanEditor';
import TeamCharter from './resources/TeamCharter';
import ResourceHistogram from './resources/ResourceHistogram';
import PhysicalResources from './resources/PhysicalResources';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { ModuleNavigation } from './common/ModuleNavigation';
import { Resource } from '../types/index';
import { useResourceManagementLogic } from '../hooks/domain/useResourceManagementLogic';

const ResourceManagement: React.FC = () => {
  const { project, assignedResources } = useProjectWorkspace();
  const projectId = project.id;
  const projectResources = assignedResources as Resource[];
 
  const {
      activeGroup,
      activeView,
      isPending,
      navStructure,
      handleGroupChange,
      handleViewChange,
      overAllocatedResources
  } = useResourceManagementLogic();

  const renderContent = () => {
    switch(activeView) {
      case 'plan': return <ResourcePlanEditor projectId={projectId} />;
      case 'pool': return <ResourcePool resources={projectResources} />;
      case 'capacity': return <ResourceCapacity projectResources={projectResources} />;
      case 'leveling': return <ResourceLeveling overAllocatedResources={overAllocatedResources} />;
      case 'charter': return <TeamCharter project={project} />;
      case 'histogram': return <ResourceHistogram />;
      case 'physical_tracking': return <PhysicalResources />;
      default: return <ResourcePool resources={projectResources} />;
    }
  };

  if (!project) return <div className="p-[var(--spacing-gutter)]">Loading resources...</div>;

  return (
    <div className="p-[var(--spacing-gutter)] space-y-[var(--spacing-gutter)] flex flex-col h-full w-full max-w-[var(--spacing-container)] mx-auto">
      <PageHeader 
        title="Resource Management" 
        subtitle="Plan, staff, and manage your project and enterprise resources."
        icon={Users}
      />

      <div className="flex flex-col h-full bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="flex-shrink-0 border-b border-border bg-slate-50/50 z-10">
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
export default ResourceManagement;