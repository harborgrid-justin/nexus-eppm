
import React, { useState, useMemo } from 'react';
import { useProjectState } from '../hooks';
import { 
  Briefcase, Sliders, GanttChartSquare, DollarSign, AlertTriangle, Users,
  MessageCircle, ShoppingCart, ShieldCheck, Network, FileWarning, Layout
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

  const navStructure = useMemo(() => [
    {
      id: 'overview',
      label: 'Overview',
      items: [
        { id: 'integration', label: 'Integration', icon: Briefcase }
      ]
    },
    {
      id: 'performance',
      label: 'Performance',
      items: [
        { id: 'scope', label: 'Scope', icon: Sliders },
        { id: 'schedule', label: 'Schedule', icon: GanttChartSquare },
        { id: 'cost', label: 'Cost', icon: DollarSign },
        { id: 'quality', label: 'Quality', icon: ShieldCheck },
      ]
    },
    {
      id: 'people',
      label: 'People & Comms',
      items: [
        { id: 'resources', label: 'Resources', icon: Users },
        { id: 'stakeholder', label: 'Stakeholders', icon: Users },
        { id: 'communications', label: 'Communications', icon: MessageCircle },
      ]
    },
    {
      id: 'controls',
      label: 'Controls',
      items: [
        { id: 'risk', label: 'Risk', icon: AlertTriangle },
        { id: 'issues', label: 'Issues', icon: FileWarning },
        { id: 'procurement', label: 'Procurement', icon: ShoppingCart },
      ]
    }
  ], []);

  const activeGroup = useMemo(() => 
    navStructure.find(g => g.items.some(i => i.id === activeArea)) || navStructure[0]
  , [navStructure, activeArea]);

  const renderContent = () => {
    if (!project) {
        return <div className="p-6">Loading project details...</div>;
    }
    switch (activeArea) {
      case 'integration':
        return <ProjectIntegrationManagement projectId={projectId} />;
      case 'scope':
        return <ScopeManagement projectId={projectId} />;
      case 'schedule':
        return scheduleView === 'gantt' 
            ? <ProjectGantt project={project} /> 
            : <NetworkDiagram project={project} />;
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
      {/* Level 1 Navigation (Groups) */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 pt-2">
        <div className="flex gap-8">
          {navStructure.map(group => {
            const isActiveGroup = activeGroup.id === group.id;
            return (
              <button
                key={group.id}
                onClick={() => setActiveArea(group.items[0].id)}
                className={`
                  pb-3 text-sm font-semibold transition-all relative
                  ${isActiveGroup ? 'text-nexus-700' : 'text-slate-500 hover:text-slate-700'}
                `}
              >
                {group.label}
                {isActiveGroup && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-nexus-600 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level 2 Navigation (Specific Modules) */}
      <div className="flex-shrink-0 bg-slate-50 border-b border-slate-200 px-4 py-2 flex justify-between items-center gap-4 z-10 shadow-sm relative min-h-[52px]">
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1 flex-1 min-w-0">
          {activeGroup.items.map(area => {
            const isActive = activeArea === area.id;
            return (
                <button
                key={area.id}
                onClick={() => setActiveArea(area.id)}
                className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border flex-shrink-0
                    ${isActive 
                    ? 'bg-white border-nexus-200 text-nexus-700 shadow-sm ring-1 ring-nexus-100' 
                    : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-200/50 hover:text-slate-700'
                    }
                `}
                >
                <area.icon size={16} className={isActive ? 'text-nexus-600' : 'text-slate-400'} strokeWidth={isActive ? 2.5 : 2} />
                <span className="whitespace-nowrap">{area.label}</span>
                </button>
            );
          })}
        </nav>
        
        {activeArea === 'schedule' && (
            <div className="flex bg-slate-200 p-1 rounded-lg border border-slate-300 flex-shrink-0">
                <button onClick={() => setScheduleView('gantt')} className={`p-1.5 rounded-md transition-all ${scheduleView === 'gantt' ? 'bg-white shadow text-nexus-600' : 'text-slate-500 hover:text-slate-700'}`} title="Gantt View"><GanttChartSquare size={16} /></button>
                <button onClick={() => setScheduleView('network')} className={`p-1.5 rounded-md transition-all ${scheduleView === 'network' ? 'bg-white shadow text-nexus-600' : 'text-slate-500 hover:text-slate-700'}`} title="Network Diagram"><Network size={16} /></button>
            </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden p-0 bg-slate-50 relative">
        <ErrorBoundary>
          {renderContent()}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default ProjectWorkspace;
