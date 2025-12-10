import React, { useState, useMemo } from 'react';
import { useProjectState } from '../hooks';
import { 
  Briefcase, Sliders, GanttChartSquare, DollarSign, AlertTriangle, Users,
  MessageCircle, ShoppingCart, ShieldCheck, Network, FileWarning, Folder
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
import DocumentControl from './DocumentControl';


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
        { id: 'integration', label: 'Dashboard', icon: Briefcase }
      ]
    },
    {
      id: 'planning',
      label: 'Planning & Performance',
      items: [
        { id: 'scope', label: 'Scope', icon: Sliders },
        { id: 'schedule', label: 'Schedule', icon: GanttChartSquare },
        { id: 'cost', label: 'Cost', icon: DollarSign },
        { id: 'quality', label: 'Quality', icon: ShieldCheck },
      ]
    },
    {
      id: 'execution',
      label: 'Execution',
      items: [
        { id: 'resources', label: 'Resources', icon: Users },
        { id: 'procurement', label: 'Procurement', icon: ShoppingCart },
        { id: 'documents', label: 'Documents', icon: Folder },
      ]
    },
    {
      id: 'monitoring',
      label: 'Monitoring & Control',
      items: [
        { id: 'risk', label: 'Risk', icon: AlertTriangle },
        { id: 'issues', label: 'Issues', icon: FileWarning },
        { id: 'stakeholder', label: 'Stakeholders', icon: Users },
        { id: 'communications', label: 'Communications', icon: MessageCircle },
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
      case 'documents':
        return <DocumentControl projectId={projectId} />;
      default:
        return <div>Module not found</div>;
    }
  };

  if (!project) {
    return <div>Loading Project Workspace...</div>;
  }

  return (
    <div className="h-full w-full flex bg-slate-50 animate-in fade-in duration-300">
      {/* Level 1 Navigation (Groups) */}
      <div className="w-56 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
             <h2 className="text-sm font-semibold text-slate-800">Knowledge Areas</h2>
             <p className="text-xs text-slate-500">PMBOK Guide</p>
          </div>
          <nav className="flex-1 p-2">
            {navStructure.map(group => (
              <div key={group.id} className="mb-2">
                 <h3 className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{group.label}</h3>
                 <div className="space-y-1">
                  {group.items.map(area => {
                    const isActive = activeArea === area.id;
                    return (
                        <button
                          key={area.id}
                          onClick={() => setActiveArea(area.id)}
                          className={`
                              w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                              ${isActive 
                              ? 'bg-nexus-50 text-nexus-700' 
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                              }
                          `}
                        >
                          <area.icon size={16} className={isActive ? 'text-nexus-600' : 'text-slate-400'} strokeWidth={2} />
                          <span className="whitespace-nowrap">{area.label}</span>
                        </button>
                    );
                  })}
                 </div>
              </div>
            ))}
          </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeArea === 'schedule' && (
            <div className="absolute top-4 right-6 flex bg-slate-200 p-1 rounded-lg border border-slate-300 flex-shrink-0 z-30">
                <button onClick={() => setScheduleView('gantt')} className={`p-1.5 rounded-md transition-all ${scheduleView === 'gantt' ? 'bg-white shadow text-nexus-600' : 'text-slate-500 hover:text-slate-700'}`} title="Gantt View"><GanttChartSquare size={16} /></button>
                <button onClick={() => setScheduleView('network')} className={`p-1.5 rounded-md transition-all ${scheduleView === 'network' ? 'bg-white shadow text-nexus-600' : 'text-slate-500 hover:text-slate-700'}`} title="Network Diagram"><Network size={16} /></button>
            </div>
        )}
        <ErrorBoundary name={`${activeArea} Module`}>
          {renderContent()}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default ProjectWorkspace;
