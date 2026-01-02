
import React, { useState, useMemo, useTransition } from 'react';
import { Users, FileText, BarChart2, Sliders, Box, ScrollText } from 'lucide-react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
// FIX: Changed import to a named import as ErrorBoundary does not have a default export.
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
// FIX: Corrected import path for Resource type to resolve module resolution error.
import { Resource } from '../types/index';

const ResourceManagement: React.FC = () => {
  const { project, assignedResources } = useProjectWorkspace();
  const projectId = project.id;
  const projectResources = assignedResources as Resource[];
  const overAllocatedResources = useMemo(() => {
      // Mock logic as full enterprise allocation is not available in project context
      return projectResources.filter(r => r.allocated > r.capacity);
  }, [projectResources]);

  const theme = useTheme();
  const [activeGroup, setActiveGroup] = useState('planning');
  const [activeView, setActiveView] = useState('plan');
  const [isPending, startTransition] = useTransition();

  const navStructure = useMemo(() => [
    { id: 'planning', label: 'Planning & Setup', items: [
      { id: 'plan', label: 'Resource Plan', icon: FileText },
      { id: 'charter', label: 'Team Charter', icon: ScrollText },
      { id: 'pool', label: 'Resource Pool', icon: Users },
    ]},
    { id: 'analysis', label: 'Analysis & Optimization', items: [
      { id: 'capacity', label: 'Capacity Planning', icon: BarChart2 },
      { id: 'histogram', label: 'Resource Histogram', icon: BarChart2 },
      { id: 'leveling', label: 'Leveling', icon: Sliders },
    ]},
    { id: 'physical', label: 'Physical Resources', items: [
      { id: 'physical_tracking', label: 'Materials & Equipment', icon: Box }
    ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navStructure.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      startTransition(() => {
        setActiveGroup(groupId);
        setActiveView(newGroup.items[0].id);
      });
    }
  };

  const activeGroupItems = useMemo(() => {
    return navStructure.find(g => g.id === activeGroup)?.items || [];
  }, [activeGroup, navStructure]);
  
  const handleViewChange = (viewId: string) => {
      startTransition(() => {
          setActiveView(viewId);
      });
  };

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

  if (!project) return <div className={theme.layout.pagePadding}>Loading resources...</div>;

  return (
    <div className={`${theme.layout.pagePadding} flex flex-col h-full`}>
      <PageHeader 
        title="Resource Management" 
        subtitle="Plan, staff, and manage your project and enterprise resources."
        icon={Users}
      />

      <div className={`${theme.components.card} flex-1 flex flex-col overflow-hidden`}>
        <div className={`flex-shrink-0 border-b ${theme.colors.border} z-10`}>
          <div className={`px-4 pt-3 pb-2 space-x-2 border-b ${theme.colors.border}`}>
              {navStructure.map(group => (
                  <button
                      key={group.id}
                      onClick={() => handleGroupChange(group.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                          activeGroup === group.id
                          ? `${theme.colors.primary} text-white shadow-sm`
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                      {group.label}
                  </button>
              ))}
          </div>
          <nav className="flex space-x-2 px-4 overflow-x-auto scrollbar-hide" role="tablist">
            {activeGroupItems.map(item => (
              <button
                key={item.id}
                role="tab"
                aria-selected={activeView === item.id}
                onClick={() => handleViewChange(item.id)}
                className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-nexus-500 rounded-t ${
                  activeView === item.id
                    ? 'border-nexus-600 text-nexus-600'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
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
