
import React, { Suspense, lazy } from 'react';
import { Network, GanttChartSquare, Loader2, GitBranch } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { ModuleNavigation } from './common/ModuleNavigation';
import { useTheme } from './context/ThemeContext';
import { ProjectWorkspaceProvider } from './context/ProjectWorkspaceContext';
import SuspenseFallback from './layout/SuspenseFallback';
import { useProjectWorkspaceLogic } from '../hooks/domain/useProjectWorkspaceLogic';

const ProjectGantt = lazy(() => import('./ProjectGantt'));
const CostManagement = lazy(() => import('./CostManagement'));
const ProjectRiskManager = lazy(() => import('./risk/ProjectRiskManager')); // Updated import
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
  const theme = useTheme();
  
  const {
      projectData,
      activeGroup,
      activeArea,
      scheduleView,
      setScheduleView,
      isPending,
      navGroups,
      handleGroupChange,
      handleItemChange
  } = useProjectWorkspaceLogic();

  if (!projectData) {
      return (
        <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4 text-slate-400">
                <Loader2 className="animate-spin" size={32} />
                <p>Loading project workspace...</p>
            </div>
        </div>
      );
  }

  const { project } = projectData;

  const renderContent = () => {
    switch (activeArea) {
      case 'integration': return <ProjectIntegrationManagement />;
      case 'scope': return <ScopeManagement />;
      case 'schedule': return scheduleView === 'gantt' ? <ProjectGantt /> : <NetworkDiagram />;
      case 'cost': return <CostManagement />;
      case 'risk': return <ProjectRiskManager />; // Updated component
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
        {project.isReflection && (
            <div className="bg-purple-600 text-white px-4 py-2 text-sm font-bold flex items-center justify-center gap-2 shadow-sm z-50">
                <GitBranch size={16} /> SANDBOX MODE: You are editing a Reflection Project. Changes are isolated until merged.
            </div>
        )}
        <ModuleNavigation 
            groups={navGroups} 
            activeGroup={activeGroup} 
            activeItem={activeArea} 
            onGroupChange={handleGroupChange} 
            onItemChange={handleItemChange} 
        />
        <div className="flex-1 flex flex-col overflow-hidden relative">
            {activeArea === 'schedule' && (
                <div className={`absolute top-4 right-6 flex ${theme.colors.surface} p-1 rounded-lg border ${theme.colors.border} z-30 shadow-md`}>
                    <button onClick={() => setScheduleView('gantt')} className={`p-2 rounded-md transition-all ${scheduleView === 'gantt' ? 'bg-slate-100 text-nexus-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`} title="Gantt"><GanttChartSquare size={18} /></button>
                    <button onClick={() => setScheduleView('network')} className={`p-2 rounded-md transition-all ${scheduleView === 'network' ? 'bg-slate-100 text-nexus-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`} title="Network"><Network size={18} /></button>
                </div>
            )}
            
            <ErrorBoundary name={`${activeArea} Module`}>
                <Suspense fallback={<SuspenseFallback />}>
                    <div className={`h-full w-full transition-opacity duration-300 ${isPending ? 'opacity-70 pointer-events-none' : 'opacity-100'}`}>
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
