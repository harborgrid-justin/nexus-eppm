
import React, { useState, useMemo, Suspense, lazy } from 'react';
import { useProjectState } from '../hooks';
import * as LucideIcons from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import { ModuleNavigation, NavGroup } from './common/ModuleNavigation';

// Lazy load modules to split code bundle
const ProjectGantt = lazy(() => import('./ProjectGantt'));
const CostManagement = lazy(() => import('./CostManagement'));
const RiskManagement = lazy(() => import('./RiskManagement'));
const IssueLog = lazy(() => import('./IssueLog'));
const ScopeManagement = lazy(() => import('./ScopeManagement'));
const StakeholderManagement = lazy(() => import('./StakeholderManagement'));
const ProcurementManagement = lazy(() => import('./ProcurementManagement'));
const QualityManagement = lazy(() => import('./QualityManagement'));
const CommunicationsManagement = lazy(() => import('./CommunicationsManagement'));
const ResourceManagement = lazy(() => import('./ResourceManagement'));
const ProjectIntegrationManagement = lazy(() => import('./ProjectIntegrationManagement'));
const NetworkDiagram = lazy(() => import('./scheduling/NetworkDiagram'));
const DocumentControl = lazy(() => import('./DocumentControl'));

interface ProjectWorkspaceProps {
  projectId: string;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ projectId }) => {
  const { project } = useProjectState(projectId);
  const [activeGroup, setActiveGroup] = useState('overview');
  const [activeArea, setActiveArea] = useState('integration');
  const [scheduleView, setScheduleView] = useState<'gantt' | 'network'>('gantt');

  const navGroups = useMemo<NavGroup[]>(() => [
    {
      id: 'overview',
      label: 'Overview',
      items: [
        { id: 'integration', label: 'Dashboard', icon: LucideIcons.Briefcase }
      ]
    },
    {
      id: 'planning',
      label: 'Planning',
      items: [
        { id: 'scope', label: 'Scope', icon: LucideIcons.Sliders },
        { id: 'schedule', label: 'Schedule', icon: LucideIcons.Calendar },
        { id: 'cost', label: 'Cost', icon: LucideIcons.DollarSign },
        { id: 'quality', label: 'Quality', icon: LucideIcons.ShieldCheck },
      ]
    },
    {
      id: 'execution',
      label: 'Execution',
      items: [
        { id: 'resources', label: 'Resources', icon: LucideIcons.Users },
        { id: 'procurement', label: 'Procurement', icon: LucideIcons.ShoppingCart },
        { id: 'documents', label: 'Docs', icon: LucideIcons.Folder },
      ]
    },
    {
      id: 'monitoring',
      label: 'Control',
      items: [
        { id: 'risk', label: 'Risk', icon: LucideIcons.AlertTriangle },
        { id: 'issues', label: 'Issues', icon: LucideIcons.TriangleAlert },
        { id: 'stakeholder', label: 'Stakeholders', icon: LucideIcons.Users },
        { id: 'communications', label: 'Comms', icon: LucideIcons.MessageSquare },
      ]
    }
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navGroups.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      setActiveGroup(groupId);
      setActiveArea(newGroup.items[0].id);
    }
  };

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
    return <div className="flex items-center justify-center h-full"><LucideIcons.Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="h-full w-full flex flex-col bg-slate-100 animate-in fade-in duration-300">
      <ModuleNavigation
        groups={navGroups}
        activeGroup={activeGroup}
        activeItem={activeArea}
        onGroupChange={handleGroupChange}
        onItemChange={setActiveArea}
      />

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeArea === 'schedule' && (
          <div className="absolute top-4 right-4 md:right-6 flex bg-slate-200 p-1 rounded-lg border border-slate-300 flex-shrink-0 z-30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
            <button onClick={() => setScheduleView('gantt')} className={`p-2 rounded-md transition-all ${scheduleView === 'gantt' ? 'bg-white shadow text-nexus-600' : 'text-slate-500 hover:text-slate-700'}`} title="Gantt View"><LucideIcons.Calendar size={18} /></button>
            <button onClick={() => setScheduleView('network')} className={`p-2 rounded-md transition-all ${scheduleView === 'network' ? 'bg-white shadow text-nexus-600' : 'text-slate-500 hover:text-slate-700'}`} title="Network Diagram"><LucideIcons.Network size={18} /></button>
          </div>
        )}
        <ErrorBoundary name={`${activeArea} Module`}>
          <Suspense fallback={
            <div className="flex items-center justify-center h-full w-full bg-slate-50">
              <div className="text-center">
                <LucideIcons.Loader2 size={32} className="animate-spin text-nexus-500 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Loading Module...</p>
              </div>
            </div>
          }>
            {renderContent()}
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default ProjectWorkspace;
