
import React, { Suspense, useMemo } from 'react';
import { Network, GanttChartSquare, GitBranch, Briefcase, Share2, GitMerge } from 'lucide-react';
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
import { PanelContainer } from './layout/standard/PanelContainer';
import { PageLayout } from './layout/standard/PageLayout';
import { Button } from './ui/Button';
import { formatInitials } from '../utils/formatters';
import { useData } from '../context/DataContext';

const ProjectWorkspace: React.FC = () => {
  const theme = useTheme();
  const { t } = useI18n();
  const { dispatch } = useData();
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

  const { project } = projectData;

  const handleShare = async () => {
      if (navigator.share) {
          try {
              await navigator.share({
                  title: `Nexus Project: ${project.name}`,
                  text: `Check out the status of ${project.name} on Nexus PPM.`,
                  url: window.location.href
              });
          } catch (error) {
              console.log('Error sharing:', error);
          }
      } else {
          navigator.clipboard.writeText(window.location.href);
          alert("Share link copied to system clipboard.");
      }
  };

  // Custom Title Component for PageLayout
  const ProjectTitle = (
      <div className="flex items-center gap-4">
           <div className={`w-12 h-12 rounded-xl ${theme.colors.primary} flex items-center justify-center text-white font-black text-lg shadow-lg border border-white/10 shrink-0`}>
               {formatInitials(project.name)}
           </div>
           <div>
               <h1 className={`${theme.typography.h1} leading-none mb-1`}>{project.name}</h1>
               <div className="flex items-center gap-2">
                   <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-100 px-1.5 rounded">{project.code}</span>
                   {project.isReflection && (
                       <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 rounded-full border border-purple-100">
                           <GitBranch size={10}/> Sandbox Reflection
                       </span>
                   )}
               </div>
           </div>
      </div>
  );

  const ProjectActions = (
      <>
        <Button variant="ghost" size="sm" onClick={handleShare} icon={Share2}>Share</Button>
        {!project.isReflection && (
            <Button 
                onClick={() => dispatch({ type: 'PROJECT_CREATE_REFLECTION', payload: { sourceProjectId: project.id } })} 
                variant="outline" 
                size="sm" 
                icon={GitBranch}
            >
                Branch Reflection
            </Button>
        )}
        {project.isReflection && (
            <Button 
                onClick={() => dispatch({ type: 'PROJECT_MERGE_REFLECTION', payload: { reflectionId: project.id } })} 
                variant="primary" 
                size="sm" 
                icon={GitMerge}
            >
                Commit Merge
            </Button>
        )}
      </>
  );

  return (
    <ProjectWorkspaceProvider value={projectData}>
        <PageLayout
            title={ProjectTitle}
            subtitle={`${project.category || 'General'} • Managed by ${project.managerId}`}
            actions={ProjectActions}
            // We pass null icon because we handle it in custom title
            icon={undefined} 
        >
            <PanelContainer 
                header={
                    <div className="relative">
                        <ModuleNavigation 
                            groups={navGroups} 
                            activeGroup={activeGroup} 
                            activeItem={activeArea} 
                            onGroupChange={handleGroupChange} 
                            onItemChange={handleItemChange} 
                            className="bg-transparent border-0 shadow-none"
                        />
                        {activeArea === 'schedule' && (
                            <div className={`hidden md:flex absolute top-1/2 right-6 -translate-y-1/2 ${theme.colors.surface} p-1 rounded-lg border ${theme.colors.border} z-30 shadow-md`}>
                                <button onClick={() => setScheduleView('gantt')} className={`p-2 rounded-md transition-all ${scheduleView === 'gantt' ? 'bg-slate-100 text-nexus-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`} title="Gantt"><GanttChartSquare size={18} /></button>
                                <button onClick={() => setScheduleView('network')} className={`p-2 rounded-md transition-all ${scheduleView === 'network' ? 'bg-slate-100 text-nexus-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`} title="Network"><Network size={18} /></button>
                            </div>
                        )}
                    </div>
                }
            >
                <div className="flex-1 overflow-hidden relative">
                    <ErrorBoundary name={`${activeArea} Module`}>
                        <Suspense fallback={<SuspenseFallback />}>
                            <div className={`h-full w-full transition-opacity duration-300 ${isPending ? 'opacity-70 pointer-events-none' : 'opacity-100'}`}>
                                <ProjectContent activeArea={activeArea} scheduleView={scheduleView} />
                            </div>
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </PanelContainer>
        </PageLayout>
    </ProjectWorkspaceProvider>
  );
};

export default ProjectWorkspace;
