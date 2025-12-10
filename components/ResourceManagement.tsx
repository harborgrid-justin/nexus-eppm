import React, { useState } from 'react';
import { useProjectState } from '../hooks/useProjectState';
import { Users, FileText, BarChart2, Sliders } from 'lucide-react';
import ResourcePool from './resources/ResourcePool';
import ResourceCapacity from './resources/ResourceCapacity';
import ResourceLeveling from './resources/ResourceLeveling';
import ResourcePlanEditor from './resources/ResourcePlanEditor';

interface ResourceManagementProps {
  projectId: string;
}

const ResourceManagement: React.FC<ResourceManagementProps> = ({ projectId }) => {
  const [activeView, setActiveView] = useState('pool');
  const { project } = useProjectState(projectId);

  const navItems = [
    { id: 'plan', label: 'Resource Plan', icon: FileText },
    { id: 'pool', label: 'Resource Pool', icon: Users },
    { id: 'capacity', label: 'Capacity Planning', icon: BarChart2 },
    { id: 'leveling', label: 'Leveling', icon: Sliders },
  ];
  
  const renderContent = () => {
    switch(activeView) {
      case 'plan':
        return <ResourcePlanEditor projectId={projectId} />;
      case 'pool':
        return <ResourcePool projectId={projectId} />;
      case 'capacity':
        return <ResourceCapacity projectId={projectId} />;
      case 'leveling':
        return <ResourceLeveling projectId={projectId} />;
      default:
        return <ResourcePool projectId={projectId} />;
    }
  };

  if (!project) return <div>Loading resources...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full overflow-hidden flex flex-col p-6">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Users className="text-nexus-600"/> Resource Management</h1>
          <p className="text-slate-500">Plan, staff, and manage your project and enterprise resources.</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50">
          <nav className="flex space-x-2 px-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
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
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ResourceManagement;