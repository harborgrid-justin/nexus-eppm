import React from 'react';
import { Users, Loader2 } from 'lucide-react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { ErrorBoundary } from './ErrorBoundary';
import ResourcePool from './resources/ResourcePool';
import ResourceCapacity from './resources/ResourceCapacity';
import ResourceLeveling from './resources/ResourceLeveling';
import ResourcePlanEditor from './resources/ResourcePlanEditor';
import TeamCharter from './resources/TeamCharter';
import ResourceHistogram from './resources/ResourceHistogram';
import PhysicalResources from './resources/PhysicalResources';
import { PageHeader } from './common/PageHeader';
import { ModuleNavigation } from './common/ModuleNavigation';
import { Resource } from '../types/index';
import { useResourceManagementLogic } from '../hooks/domain/useResourceManagementLogic';
import { useTheme } from '../context/ThemeContext';
import { EmptyGrid } from './common/EmptyGrid';

const ResourceManagement: React.FC = () => {
  const { project, assignedResources } = useProjectWorkspace();
  const theme = useTheme();
  
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

  if (!project) return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} h-full ${theme.colors.background}`}>
        <PageHeader title="Resource Management" subtitle="Staffing and allocation hub" icon={Users} />
        <div className="flex-1 flex items-center justify-center">
             <EmptyGrid 
                title="Project Context Required" 
                description="Select a project from the portfolio list to manage its resource plan and staffing assignments."
                icon={Users}
            />
        </div>
    </div>
  );

  return (
    <div className={`${theme.layout.pageContainer} ${theme.colors.background}`}>
      <div className={`${theme.layout.pagePadding} pb-0`}>
        <PageHeader 
          title="Resource Management" 
          subtitle={`Plan, staff, and manage resources for ${project.code}: ${project.name}`}
          icon={Users}
          actions={
              overAllocatedResources.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">
                      <AlertTriangle size={14}/> {overAllocatedResources.length} Conflicts
                  </div>
              )
          }
        />
      </div>

      <div className={`${theme.layout.panelContainer} m-6 md:m-8 mt-4 flex-1 flex flex-col overflow-hidden`}>
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
        <div className={`flex-1 overflow-hidden transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
          <ErrorBoundary name="Resource Module">
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
import { AlertTriangle } from 'lucide-react';
export default ResourceManagement;