
import React from 'react';
import { Users, FileText, BarChart2, Sliders } from 'lucide-react';
import { useResourceData } from '../hooks';
import ErrorBoundary from './ErrorBoundary';
import ResourcePool from './resources/ResourcePool';
import ResourceCapacity from './resources/ResourceCapacity';
import ResourceLeveling from './resources/ResourceLeveling';
import ResourcePlanEditor from './resources/ResourcePlanEditor';
import { useTheme } from '../context/ThemeContext';

interface ResourceManagementProps {
  projectId: string;
}

const ResourceManagement: React.FC<ResourceManagementProps> = ({ projectId }) => {
  const {
    project,
    activeView,
    projectResources,
    overAllocatedResources,
    setActiveView,
    navItems,
  } = useResourceData(projectId);
  const theme = useTheme();

  const renderContent = () => {
    switch(activeView) {
      case 'plan':
        return <ResourcePlanEditor projectId={projectId} />;
      case 'pool':
        return <ResourcePool resources={projectResources} />;
      case 'capacity':
        return <ResourceCapacity projectResources={projectResources} />;
      case 'leveling':
        return <ResourceLeveling overAllocatedResources={overAllocatedResources} />;
      default:
        return <ResourcePool resources={projectResources} />;
    }
  };

  if (!project) return <div className={theme.layout.pagePadding}>Loading resources...</div>;

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
      <div className={theme.layout.header}>
        <div>
          <h1 className={theme.typography.h1}><Users className="text-nexus-600"/> Resource Management</h1>
          <p className={theme.typography.small}>Plan, staff, and manage your project and enterprise resources.</p>
        </div>
      </div>

      <div className={theme.layout.panelContainer}>
        <div className={`flex-shrink-0 ${theme.layout.headerBorder} ${theme.colors.background}`}>
          <nav className="flex space-x-2 px-4 overflow-x-auto scrollbar-hide">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeView === item.id
                    ? `${theme.colors.border.replace('slate-200', 'nexus-600')} text-nexus-600`
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
                style={{ borderColor: activeView === item.id ? '#0284c7' : 'transparent' }}
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
