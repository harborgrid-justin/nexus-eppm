
import React, { useMemo } from 'react';
import { Briefcase, Plus, List as ListIcon, Layers, Search, Loader2, X } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { FilterBar } from '../common/FilterBar';
import { usePermissions } from '../../hooks/usePermissions';
import ProjectWizard from './ProjectWizard';
import { ProjectListTable } from './list/ProjectListTable';
import { ProjectListCards } from './list/ProjectListCards';
import { EpsTreeView } from './list/EpsTreeView';
import { EmptyGrid } from '../common/EmptyGrid';
import { ModuleNavigation, NavGroup } from '../common/ModuleNavigation';
import { useProjectListLogic } from '../../hooks/domain/useProjectListLogic';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

const ProjectList: React.FC = () => {
  const { canEditProject } = usePermissions();
  const theme = useTheme();
  
  const {
      searchTerm,
      setSearchTerm,
      deferredSearchTerm,
      activeGroup,
      activeView,
      setActiveView,
      isPending,
      filteredProjects,
      handleCreateProject,
      handleSelectProject,
      handleViewChange
  } = useProjectListLogic();

  const navGroups: NavGroup[] = useMemo(() => [
      { id: 'views', label: 'Visualization Mode', items: [
          { id: 'list', label: 'Executive Grid', icon: ListIcon },
          { id: 'eps', label: 'Hierarchy (EPS)', icon: Layers }
      ]}
  ], []);

  if (activeView === 'create') {
      return <ProjectWizard onClose={() => setActiveView('list')} onSave={handleCreateProject} />;
  }

  return (
    <div className={`p-[var(--spacing-gutter)] space-y-4 h-full flex flex-col w-full max-w-[var(--spacing-container)] mx-auto ${theme.colors.background}`}>
      <PageHeader 
        title="Portfolio Execution" 
        subtitle="Operational oversight of the project landscape and global delivery health."
        icon={Briefcase}
        actions={canEditProject() && (
            <button onClick={() => setActiveView('create')} className={`px-5 py-2.5 ${theme.colors.primary} hover:brightness-110 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 shadow-lg active:scale-95 transition-all`}>
                <Plus size={16} /> New Project
            </button>
        )}
      />

      <div className={`flex flex-col h-full ${theme.colors.surface} rounded-2xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
        <div className={`flex-shrink-0 z-10 border-b ${theme.colors.border} ${theme.colors.background}/30 flex flex-col md:flex-row justify-between md:items-center`}>
            <div className="flex-1">
                <ModuleNavigation 
                    groups={navGroups}
                    activeGroup={activeGroup}
                    activeItem={activeView}
                    onGroupChange={() => {}} 
                    onItemChange={handleViewChange}
                    className="bg-transparent border-0 shadow-none"
                />
            </div>
            <div className="p-3 md:pr-6">
                <FilterBar 
                    searchValue={searchTerm} 
                    onSearch={setSearchTerm} 
                    searchPlaceholder="Search projects..."
                />
            </div>
        </div>

        <div className={`flex-1 overflow-hidden flex flex-col relative transition-opacity duration-300 ${isPending || searchTerm !== deferredSearchTerm ? 'opacity-70' : 'opacity-100'}`}>
          {(isPending || searchTerm !== deferredSearchTerm) && (
             <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-[1px]">
                <Loader2 className="animate-spin text-nexus-500" size={32} />
             </div>
          )}

          {filteredProjects.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center h-full">
                 <EmptyGrid 
                    title={deferredSearchTerm ? "No Matches Identified" : "Portfolio Registry Null"} 
                    description={deferredSearchTerm 
                        ? `Search for "${deferredSearchTerm}" returned zero results from the project pool.` 
                        : "The enterprise project database is currently unpopulated. Initialize a project charter to begin."}
                    onAdd={deferredSearchTerm ? () => setSearchTerm('') : (canEditProject() ? () => setActiveView('create') : undefined)}
                    actionLabel={deferredSearchTerm ? "Clear Search" : "Initialize Project"}
                    icon={deferredSearchTerm ? X : Search}
                 />
             </div>
          ) : (
             <div className="flex-1 overflow-hidden">
                {activeView === 'list' && (
                   <div className="h-full flex flex-col">
                     <div className="hidden lg:block flex-1 overflow-hidden">
                       <ProjectListTable projects={filteredProjects} onSelect={handleSelectProject} />
                     </div>
                     <div className={`lg:hidden flex-1 overflow-y-auto ${theme.colors.background}/50 scrollbar-thin`}>
                       <ProjectListCards projects={filteredProjects} onSelect={handleSelectProject} />
                     </div>
                   </div>
                )}
                {activeView === 'eps' && (
                   <div className="h-full overflow-auto bg-white">
                       <EpsTreeView projects={filteredProjects} onSelect={handleSelectProject} />
                   </div>
                )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProjectList;
