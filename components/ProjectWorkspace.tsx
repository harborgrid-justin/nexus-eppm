import React, { useState, useMemo } from 'react';
import { useProjectState } from '../hooks/useProjectState';
import { 
  Briefcase, Sliders, GanttChartSquare, DollarSign, AlertTriangle, Users,
  MessageCircle, ShoppingCart, ShieldCheck, Network, FileWarning, Folder
} from 'lucide-react';

import ProjectGantt from './ProjectGantt';
import CostManagement from './CostManagement';
import RiskManagement from './RiskManagement';
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
  const [activeGroup, setActiveGroup] = useState('overview');
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
  
  const handleGroupChange = (groupId: string) => {
    const newGroup = navStructure.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      setActiveGroup(groupId);
      setActiveArea(newGroup.items[0].id);
    }
  };

  const activeGroupItems = useMemo(() => {
    return navStructure.find(g => g.id === activeGroup)?.items || [];
  }, [activeGroup, navStructure]);

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
    <div className="h-full w-full flex flex-col bg-slate-100 animate-in fade-in duration-300">
      {/* Horizontal Tab Navigation */}
      <div className="flex-shrink-0 border-b border-slate-200 bg-white shadow-sm z-10">
        
        {/* Group Pills */}
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
          {activeGroupItems.map(area => (
            <button
              key={area.id}
              onClick={() => setActiveArea(area.id)}
              className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeArea === area.id
                  ? 'border-nexus-600 text-nexus-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <area.icon size={16} />
              <span>{area.label}</span>
            </button>
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