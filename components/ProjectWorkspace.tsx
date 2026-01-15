
import React, { Suspense } from 'react';
import { Network, GanttChartSquare, GitBranch, Briefcase } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { ModuleNavigation } from './common/ModuleNavigation';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { ProjectWorkspaceProvider } from '../context/ProjectWorkspaceContext';
import SuspenseFallback from './layout/SuspenseFallback';
import { useProjectWorkspaceLogic } from '../hooks/domain/useProjectWorkspaceLogic';
import { EmptyGrid } from './common/EmptyGrid';
import { useNavigate } from 'react-router-dom';
import { ProjectContent } from './project/ProjectContent';

const ProjectWorkspace: React.FC = () => {
  const theme = useTheme();
  const { t } = useI18n();
  const navigate = useNavigate();
  
  const {
      projectData, activeGroup, activeArea, scheduleView, setScheduleView,
      isPending, navGroups, handleGroupChange, handleItemChange
  } = useProjectWorkspaceLogic();

  if (!projectData) {
      return (
        <div className={`h-full w-full flex items-center justify-center p-12 ${theme.colors.background}`}>
            <EmptyGrid 
                title={t('project.workspace_null', 'Project Context Undefined')}
                description={t('project.workspace_null_desc', 'Select an active initiative from the portfolio registry to initialize the command center.')}
                icon={Briefcase}
                onAdd={() => navigate('/projectList')}
                actionLabel={t('project.browse', 'Browse Projects')}
            />
        </div>
      );
  }

  return (
    <ProjectWorkspaceProvider value={projectData}>
        <div className={`h-full w-full flex flex-col ${theme.colors.background}`}>
        {projectData.project.isReflection && (
            <div className={`${theme.colors.semantic.warning.bg} ${theme.colors.semantic.warning.text} px-4 py-2 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm z-50 border-b ${theme.colors.semantic.warning.border}`}>
                <GitBranch size={16} /> {t('project.sandbox_warning', 'Sandbox Mode: Simulation Project')}
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
                        <ProjectContent activeArea={activeArea} scheduleView={scheduleView} />
                    </div>
                </Suspense>
            </ErrorBoundary>
        </div>
        </div>
    </ProjectWorkspaceProvider>
  );
};

export default ProjectWorkspace;
