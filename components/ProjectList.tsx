import React, { useMemo } from 'react';
import { Briefcase, Plus, List as ListIcon, Layers, Search, Loader2 } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { FilterBar } from './common/FilterBar';
import { usePermissions } from '../hooks/usePermissions';
import ProjectWizard from './projects/ProjectWizard';
import { ProjectListTable } from './projects/list/ProjectListTable';
import { ProjectListCards } from './projects/list/ProjectListCards';
import { EpsTreeView } from './projects/list/EpsTreeView';
import { EmptyGrid } from './common/EmptyGrid';
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
      { id: 'views', label: 'Visualization Mode', items: [
          { id: 'list', label: 'Executive Grid', icon: ListIcon },
          { id: 'eps', label: 'Hierarchy (EPS)', icon: Layers }
      ]}
  ], []);

  if (activeView === 'create') {
      return <ProjectWizard onClose={() => setActiveView('list')} onSave={handleCreateProject} />;
  }

  return (
    <div className="p-[var(--spacing-gutter)] space-y-[var(--spacing-gutter)] h-full flex flex-col w-full max-w-[var(--spacing-container)] mx-auto">
      <PageHeader 
        title="Portfolio Execution" 
        subtitle="Operational oversight of the project landscape and global delivery health."
        icon={Briefcase}
        actions={canEditProject() && (
            <button onClick={() => setActiveView('create')} className="px-5 py-2.5 bg-slate-900 hover:bg-black rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 shadow-lg active:scale-95 transition-all">
                <Plus size={16} /> New Project
            </button>
        )}
      />

      <div className="flex flex-col h-full bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="flex-shrink-0 z-10 border-b border-border bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center">
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
                    title="Portfolio Search Exhausted" 
                    description={deferredSearchTerm ? `No projects matching "${deferredSearchTerm}" were identified in the active ledger.` : "The enterprise project pool is currently unpopulated."}
                    onAdd={!deferredSearchTerm && canEditProject() ? () => setActiveView('create') : undefined}
                    actionLabel="Initialize Project"
                    icon={Search}
                 />
             </div>
          ) : (
             <div className="flex-1 overflow-hidden">
                {activeView === 'list' && (
                   <div className="h-full flex flex-col">
                     <div className="hidden lg:block flex-1 overflow-hidden">
                       <ProjectListTable projects={filteredProjects} onSelect={handleSelectProject} />
                     </div>
                     <div className="lg:hidden flex-1 overflow-y-auto bg-slate-50/50 scrollbar-thin">
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