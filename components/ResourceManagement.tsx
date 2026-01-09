
import React from 'react';
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
import { PageHeader } from './common/PageHeader';
import { ModuleNavigation } from './common/ModuleNavigation';
import { Resource } from '../types/index';
import { useResourceManagementLogic } from '../hooks/domain/useResourceManagementLogic';
import { useTheme } from '../context/ThemeContext';

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
    <div className={`p-6 space-y-4 flex flex-col h-full ${theme.colors.background}`}>
        <PageHeader title="Resource Management" subtitle="Staffing and allocation hub" icon={Users} />
        <div className="flex-1 bg-slate-100 border border-slate-200 rounded-xl animate-pulse flex flex-col items-center justify-center text-slate-400">
            <Users size={48} className="mb-4 opacity-10" />
            <p className="font-bold uppercase tracking-widest text-xs">Initializing Resource Context...</p>
        </div>
    </div>
  );

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="Resource Management" 
        subtitle="Plan, staff, and manage your project and enterprise resources."
        icon={Users}
      />

      <div className={theme.layout.panelContainer}>
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
export default ResourceManagement;
