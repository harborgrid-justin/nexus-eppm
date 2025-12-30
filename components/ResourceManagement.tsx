
import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { useResourceData } from '../hooks';
import ErrorBoundary from './ErrorBoundary';
import ResourcePool from './resources/ResourcePool';
import ResourceCapacity from './resources/ResourceCapacity';
import ResourceLeveling from './resources/ResourceLeveling';
import ResourcePlanEditor from './resources/ResourcePlanEditor';
import TeamCharter from './resources/TeamCharter';
import ResourceHistogram from './resources/ResourceHistogram';
import PhysicalResources from './resources/PhysicalResources';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';

interface ResourceManagementProps {
  projectId: string;
}

const ResourceManagement: React.FC<ResourceManagementProps> = ({ projectId }) => {
  const {
    project,
    projectResources,
    overAllocatedResources,
  } = useResourceData(projectId);
  const theme = useTheme();
  const [activeGroup, setActiveGroup] = useState('planning');
  const [activeView, setActiveView] = useState('plan');

  const navStructure = useMemo(() => [
    { id: 'planning', label: 'Planning & Setup', items: [
      { id: 'plan', label: 'Resource Plan', icon: LucideIcons.FileText },
      { id: 'charter', label: 'Team Charter', icon: LucideIcons.ScrollText },
      { id: 'pool', label: 'Resource Pool', icon: LucideIcons.Users },
    ]},
    { id: 'analysis', label: 'Analysis & Optimization', items: [
      { id: 'capacity', label: 'Capacity Planning', icon: LucideIcons.BarChart2 },
      { id: 'histogram', label: 'Resource Histogram', icon: LucideIcons.BarChart2 },
      { id: 'leveling', label: 'Leveling', icon: LucideIcons.Sliders },
    ]},
    { id: 'physical', label: 'Physical Resources', items: [
      { id: 'physical_tracking', label: 'Materials & Equipment', icon: LucideIcons.Box }
    ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navStructure.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      setActiveGroup(groupId);
      setActiveView(newGroup.items[0].id);
    }
  };

  const activeGroupItems = useMemo(() => {
    return navStructure.find(g => g.id === activeGroup)?.items || [];
  }, [activeGroup, navStructure]);

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
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
      <PageHeader 
        title="Resource Management" 
        subtitle="Plan, staff, and manage your project and enterprise resources."
        icon={LucideIcons.Users}
      />

      <div className={theme.layout.panelContainer}>
        <div className={`flex-shrink-0 border-b ${theme.colors.border} bg-white z-10`}>
          <div className="px-4 pt-3 pb-2 space-x-2 border-b border-slate-200">
              {navStructure.map(group => (
                  <button
                      key={group.id}
                      onClick={() => handleGroupChange(group.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                          activeGroup === group.id
                          ? 'bg-nexus-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                      {group.label}
                  </button>
              ))}
          </div>
          <nav className="flex space-x-2 px-4 overflow-x-auto scrollbar-hide">
            {activeGroupItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeView === item.id
                    ? `border-nexus-600 text-nexus-600`
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="flex-1 overflow-hidden">
          <ErrorBoundary>
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default ResourceManagement;
