
import React, { useState, useMemo, Suspense, lazy, useTransition } from 'react';
import { useLoaderData } from 'react-router-dom';
import { 
  Briefcase, Sliders, GanttChartSquare, DollarSign, AlertTriangle, Users,
  MessageSquare, ShoppingCart, ShieldCheck, Network, FileWarning, Folder, Loader2, History, Activity,
  HardHat
} from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { ModuleNavigation, NavGroup } from './common/ModuleNavigation';
import { useTheme } from '../context/ThemeContext';
import { ProjectWorkspaceProvider } from '../context/ProjectWorkspaceContext';

const ProjectGantt = lazy(() => import('./ProjectGantt'));
const CostManagement = lazy(() => import('./CostManagement'));
const RiskManagement = lazy(() => import('./risk/RiskManagement'));
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
const BaselineManager = lazy(() => import('./scheduling/BaselineManager'));
const ScheduleHealthReport = lazy(() => import('./scheduling/ScheduleHealthReport'));
const FieldManagement = lazy(() => import('./FieldManagement'));

const ProjectWorkspace: React.FC = () => {
  const projectData = useLoaderData() as any;
  const { project } = projectData;

  const theme = useTheme();
  const [activeGroup, setActiveGroup] = useState('overview');
  const [activeArea, setActiveArea] = useState('integration');
  const [scheduleView, setScheduleView] = useState<'gantt' | 'network'>('gantt');
  
  const [isPending, startTransition] = useTransition();

  const navGroups: NavGroup[] = useMemo(() => [
    { id: 'overview', label: 'Overview', items: [
        { id: 'integration', label: 'Dashboard', icon: Briefcase }
    ] },
    { id: 'planning', label: 'Planning', items: [
        { id: 'scope', label: 'Scope', icon: Sliders },
        { id: 'schedule', label: 'Schedule', icon: GanttChartSquare },
        { id: 'cost', label: 'Cost', icon: DollarSign },
        { id: 'quality', label: 'Quality', icon: ShieldCheck },
    ]},
    { id: 'advanced', label: 'Advanced Tools', items: [
        { id: 'baseline', label: 'Baseline Manager', icon: History },
        { id: 'health', label: 'Logic Health', icon: Activity },
    ]},
    { id: 'execution', label: 'Execution', items: [
        { id: 'resources', label: 'Resources', icon: Users },
        { id: 'procurement', label: 'Procurement', icon: ShoppingCart },
        { id: 'documents', label: 'Docs', icon: Folder },
        { id: 'field', label: 'Field', icon: HardHat },
    ]},
    { id: 'monitoring', label: 'Control', items: [
        { id: 'risk', label: 'Risk', icon: AlertTriangle },
        { id: 'issues', label: 'Issues', icon: FileWarning },
        { id: 'stakeholder', label: 'Stakeholders', icon: Users },
        { id: 'communications', label: 'Comms', icon: MessageSquare },
    ]}
  ], []);
  
  const handleGroupChange = (groupId: string) => {
    const newGroup = navGroups.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      startTransition(() => {
        setActiveGroup(groupId);
        setActiveArea(newGroup.items[0].id);
      });
    }
  };

  const handleItemChange = (itemId: string) => {
      startTransition(() => {
          setActiveArea(itemId);
      });
  };

  const renderContent = () => {
    if (!project) return <div className="p-6">Loading project...</div>;
    switch (activeArea) {
      case 'integration': return <ProjectIntegrationManagement />;
      case 'scope': return <ScopeManagement />;
      case 'schedule': return scheduleView === 'gantt' ? <ProjectGantt /> : <NetworkDiagram />;
      case 'cost': return <CostManagement />;
      case 'risk': return <RiskManagement />;
      case 'issues': return <IssueLog />;
      case 'stakeholder': return <StakeholderManagement />;
      case 'procurement': return <ProcurementManagement />;
      case 'quality': return <QualityManagement />;
      case 'communications': return <CommunicationsManagement />;
      case 'resources': return <ResourceManagement />;
      case 'documents': return <DocumentControl />;
      case 'baseline': return <BaselineManager />;
      case 'health': return <ScheduleHealthReport />;
      case 'field': return <FieldManagement />;
      default: return <div>Module not found</div>;
    }
  };

  return (
    <ProjectWorkspaceProvider value={projectData}>
        <div className={`h-full w-full flex flex-col ${theme.colors.background}`}>
        <ModuleNavigation 
            groups={navGroups} 
            activeGroup={activeGroup} 
            activeItem={activeArea} 
            onGroupChange={handleGroupChange} 
            onItemChange={handleItemChange} 
        />
        <div className="flex-1 flex flex-col overflow-hidden relative">
            {activeArea === 'schedule' && (
                <div className={`absolute top-4 right-6 flex ${theme.colors.surface} p-1 rounded-lg border ${theme.colors.border} z-30`}>
                    <button onClick={() => setScheduleView('gantt')} className={`p-2 rounded-md ${scheduleView === 'gantt' ? 'bg-slate-100 text-nexus-600 shadow-sm' : 'text-slate-500'}`} title="Gantt"><GanttChartSquare size={18} /></button>
                    <button onClick={() => setScheduleView('network')} className={`p-2 rounded-md ${scheduleView === 'network' ? 'bg-slate-100 text-nexus-600 shadow-sm' : 'text-slate-500'}`} title="Network"><Network size={18} /></button>
                </div>
            )}
            <ErrorBoundary name={`${activeArea} Module`}>
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Loader2 className="animate-spin mb-2" size={32} />
                    <span className="text-sm font-medium">Loading Workspace...</span>
                </div>
            }>
                <div className={`h-full w-full ${isPending ? 'opacity-70 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>
                    {renderContent()}
                </div>
            </Suspense>
            </ErrorBoundary>
        </div>
        </div>
    </ProjectWorkspaceProvider>
  );
};

export default ProjectWorkspace;
