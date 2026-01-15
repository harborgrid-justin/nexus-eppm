
import React from 'react';
import { Users, AlertTriangle } from 'lucide-react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { ErrorBoundary } from './ErrorBoundary';
import ResourcePool from './resources/ResourcePool';
import ResourceCapacity from './resources/ResourceCapacity';
import ResourceLeveling from './resources/ResourceLeveling';
import ResourcePlanEditor from './resources/ResourcePlanEditor';
import TeamCharter from './resources/TeamCharter';
import ResourceHistogram from './resources/ResourceHistogram';
import PhysicalResources from './resources/PhysicalResources';
import { Resource } from '../types/index';
import { useResourceManagementLogic } from '../hooks/domain/useResourceManagementLogic';
import { EmptyGrid } from './common/EmptyGrid';
import { TabbedLayout } from './layout/standard/TabbedLayout';

const ResourceManagement: React.FC = () => {
  const { project, assignedResources } = useProjectWorkspace();
  
  const {
      activeGroup, activeView, isPending, navStructure,
      handleGroupChange, handleViewChange, overAllocatedResources
  } = useResourceManagementLogic();

  if (!project) return (
      <div className="h-full flex items-center justify-center p-8">
             <EmptyGrid 
                title="Project Context Required" 
                description="Select a project initiative from the global portfolio to manage its staffing and allocation plan."
                icon={Users}
            />
      </div>
  );

  const renderContent = () => {
    const projectId = project?.id || '';
    const projectResources = (assignedResources || []) as Resource[];

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

  return (
    <TabbedLayout
        title="Resource Management"
        subtitle={`Plan, staff, and manage resources for ${project.code}: ${project.name}`}
        icon={Users}
        actions={
            overAllocatedResources.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">
                    <AlertTriangle size={14}/> {overAllocatedResources.length} Conflicts Detected
                </div>
            )
        }
        navGroups={navStructure}
        activeGroup={activeGroup}
        activeItem={activeView}
        onGroupChange={handleGroupChange}
        onItemChange={handleViewChange}
    >
        <div className={`flex-1 overflow-hidden transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
          <ErrorBoundary name="Resource Module">
            {renderContent()}
          </ErrorBoundary>
        </div>
    </TabbedLayout>
  );
};

export default ResourceManagement;
