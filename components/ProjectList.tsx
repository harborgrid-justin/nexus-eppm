
import React, { useMemo } from 'react';
import { Briefcase, Plus, List as ListIcon, Layers, Search, Loader2 } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { FilterBar } from './common/FilterBar';
import { usePermissions } from '../hooks/usePermissions';
import ProjectWizard from './projects/ProjectWizard';
import { ProjectListTable } from './projects/list/ProjectListTable';
import { ProjectListCards } from './projects/list/ProjectListCards';
import { EpsTreeView } from './projects/list/EpsTreeView';
import { EmptyState } from './common/EmptyState';
import { ModuleNavigation, NavGroup } from './common/ModuleNavigation';
import { useProjectListLogic } from '../hooks/domain/useProjectListLogic';

const ProjectList: React.FC = () => {
  const { canEditProject } = usePermissions();
  
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
      { id: 'views', label: 'View Mode', items: [
          { id: 'list', label: 'Flat List', icon: ListIcon },
          { id: 'eps', label: 'EPS Hierarchy', icon: Layers }
      ]}
  ], []);

  if (activeView === 'create') {
      return <ProjectWizard onClose={() => setActiveView('list')} onSave={handleCreateProject} />;
  }

  return (
    <div className="p-[var(--spacing-gutter)] space-y-[var(--spacing-gutter)] h-full flex flex-col w-full max-w-[var(--spacing-container)] mx-auto">
      <PageHeader 
        title="Enterprise Projects" 
        subtitle="Manage active project portfolio, track execution, and monitor delivery health."
        icon={Briefcase}
        actions={canEditProject() && (
            <button onClick={() => setActiveView('create')} className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-sm font-semibold text-text-inverted flex items-center gap-2 shadow-sm active:scale-95 transition-all">
                <Plus size={16} /> <span className="hidden sm:inline">New Project</span>
            </button>
        )}
      />

      <div className="flex flex-col h-full bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="flex-shrink-0 z-10 rounded-t-xl overflow-hidden border-b border-border bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center">
            <div className="flex-1">
                <ModuleNavigation 
                    groups={navGroups}
                    activeGroup={activeGroup}
                    activeItem={activeView}
                    onGroupChange={() => {}} // Single group
                    onItemChange={handleViewChange}
                    className="bg-transparent border-0 shadow-none"
                />
            </div>
            <div className="p-2 md:pr-4">
                <FilterBar 
                    searchValue={searchTerm} 
                    onSearch={setSearchTerm} 
                    searchPlaceholder="Search projects..."
                />
            </div>
        </div>

        <div className={`flex-1 overflow-hidden flex flex-col relative ${isPending || searchTerm !== deferredSearchTerm ? 'opacity-70' : 'opacity-100'} transition-opacity duration-200`}>
          {(isPending || searchTerm !== deferredSearchTerm) && (
             <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-[1px]">
                <Loader2 className="animate-spin text-nexus-500" size={32} />
             </div>
          )}

          {filteredProjects.length === 0 ? (
             <div className="flex-1 flex items-center justify-center">
                 <EmptyState 
                    title="No Projects Found" 
                    description={deferredSearchTerm ? `No projects match "${deferredSearchTerm}"` : "Get started by creating your first project."}
                    icon={Search}
                 />
             </div>
          ) : (
             <>
                {activeView === 'list' && (
                   <div className="h-full overflow-hidden">
                     <div className="hidden lg:block h-full overflow-hidden">
                       <ProjectListTable projects={filteredProjects} onSelect={handleSelectProject} />
                     </div>
                     <div className="lg:hidden h-full overflow-y-auto bg-slate-50/50 scrollbar-thin">
                       <ProjectListCards projects={filteredProjects} onSelect={handleSelectProject} />
                     </div>
                   </div>
                )}
                {activeView === 'eps' && (
                   <div className="flex-1 h-full overflow-auto bg-white">
                       <EpsTreeView projects={filteredProjects} onSelect={handleSelectProject} />
                   </div>
                )}
             </>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProjectList;
