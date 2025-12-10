import React, { useState } from 'react';
import { useProjectState } from '../hooks/useProjectState';
import { 
  Briefcase, Sliders, GanttChartSquare, DollarSign, AlertTriangle, Users,
  MessageCircle, ShoppingCart, ShieldCheck, Network, FileWarning
} from 'lucide-react';

import ProjectGantt from './ProjectGantt';
import CostManagement from './CostManagement';
import RiskManagement from './risk/RiskManagement';
import IssueLog from './IssueLog';
import ScopeManagement from './ScopeManagement';
import StakeholderManagement from './StakeholderManagement';
import ProcurementManagement from './ProcurementManagement';
import QualityManagement from './QualityManagement';
import CommunicationsManagement from './CommunicationsManagement';
import ResourceManagement from './ResourceManagement';
import ProjectIntegrationManagement from './ProjectIntegrationManagement';
import NetworkDiagram from './scheduling/NetworkDiagram';
import ErrorBoundary from './ErrorBoundary';


interface ProjectWorkspaceProps {
  projectId: string;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ projectId }) => {
  const { project } = useProjectState(projectId);
  const [activeArea, setActiveArea] = useState('integration');
  const [scheduleView, setScheduleView] = useState<'gantt' | 'network'>('gantt');

  const knowledgeAreas = [
    { id: 'integration', label: 'Integration', icon: Briefcase },
    { id: 'scope', label: 'Scope', icon: Sliders },
    { id: 'schedule', label: 'Schedule', icon: GanttChartSquare },
    { id: 'cost', label: 'Cost', icon: DollarSign },
    { id: 'quality', label: 'Quality', icon: ShieldCheck },
    { id: 'resources', label: 'Resources', icon: Users },
    { id: 'communications', label: 'Communications', icon: MessageCircle },
    { id: 'risk', label: 'Risk', icon: AlertTriangle },
    { id: 'procurement', label: 'Procurement', icon: ShoppingCart },
    { id: 'stakeholder', label: 'Stakeholder', icon: Users },
    { id: 'issues', label: 'Issues', icon: FileWarning },
  ];

  const renderContent = () => {
    switch (activeArea) {
      case 'integration':
        return <ProjectIntegrationManagement projectId={projectId} />;
      case 'scope':
        return <ScopeManagement projectId={projectId} />;
      case 'schedule':
        return scheduleView === 'gantt' ? <ProjectGantt project={project!} /> : <NetworkDiagram project={project!} />;
      case 'cost':
        return <CostManagement projectId={projectId} />;
      case 'risk':
        return <RiskManagement projectId={projectId} />;
      case 'issues':
        return <IssueLog projectId={projectId} />;
      case 'stakeholder':
        return <StakeholderManagement projectId={projectId} />;
      case 'procurement':
        return <ProcurementManagement projectId={projectId} />;
      case 'quality':
         return <QualityManagement projectId={projectId} />;
      case 'communications':
         return <CommunicationsManagement projectId={projectId} />;
      case 'resources':
         return <ResourceManagement projectId={projectId} />;
      default:
        return <div>Module not found</div>;
    }
  };

  if (!project) {
    return <div>Loading Project Workspace...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col animate-in fade-in duration-300">
      {/* Knowledge Area Navigation */}
      <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50 overflow-x-auto scrollbar-hide flex justify-between items-center pr-4">
        <nav className="flex space-x-2 px-4">
          {knowledgeAreas.map(area => (
            <button
              key={area.id}
              onClick={() => setActiveArea(area.id)}
              className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeArea === area.id
                  ? 'border-nexus-600 text-nexus-600'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              <area.icon size={16} />
              <span>{area.label}</span>
            </button>
          ))}
        </nav>
        {activeArea === 'schedule' && (
            <div className="flex bg-slate-200 p-0.5 rounded-lg">
                <button onClick={() => setScheduleView('gantt')} className={`p-1.5 rounded-md ${scheduleView === 'gantt' ? 'bg-white shadow' : ''}`}><GanttChartSquare size={16} /></button>
                <button onClick={() => setScheduleView('network')} className={`p-1.5 rounded-md ${scheduleView === 'network' ? 'bg-white shadow' : ''}`}><Network size={16} /></button>
            </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden p-0 bg-white">
        <ErrorBoundary>
          {renderContent()}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default ProjectWorkspace;