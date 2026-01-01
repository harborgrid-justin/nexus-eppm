


import React, { useMemo, useState, useDeferredValue, useTransition } from 'react';
// FIX: Corrected import path for Project type to resolve module resolution error.
import { Project } from '../types/index';
import { Briefcase, Plus, List as ListIcon, Layers, Search, Loader2 } from 'lucide-react';
import { usePortfolioState } from '../hooks';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { FilterBar } from './common/FilterBar';
import { usePermissions } from '../hooks/usePermissions';
import ProjectWizard from './projects/ProjectWizard';
import { ProjectListTable } from './projects/list/ProjectListTable';
import { ProjectListCards } from './projects/list/ProjectListCards';
import { EpsTreeView } from './projects/list/EpsTreeView';
import { EmptyState } from './common/EmptyState';
import { useNavigate } from 'react-router-dom';

const ProjectList: React.FC = () => {
  const { projects } = usePortfolioState();
  const { dispatch } = useData();
  const theme = useTheme();
  const { canEditProject } = usePermissions();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  const [viewMode, setViewMode] = useState<'list' | 'eps' | 'create'>('list');
  const [isPending, startTransition] = useTransition();

  const filteredProjects = useMemo(() => 
    projects.filter(p => 
      p.name.toLowerCase().includes(deferredSearchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    ), 
  [projects, deferredSearchTerm]);

  const handleCreateProject = (newProject: Project) => {
    dispatch({ type: 'PROJECT_IMPORT', payload: [newProject] });
    startTransition(() => {
        setViewMode('list');
    });
  };

  const handleViewChange = (mode: 'list' | 'eps' | 'create') => {
    startTransition(() => {
      setViewMode(mode);
    });
  };

  const handleSelectProject = (projectId: string) => {
    navigate(`/projectWorkspace/${projectId}`);
  };

  if (viewMode === 'create') {
      return <ProjectWizard onClose={() => handleViewChange('list')} onSave={handleCreateProject} />;
  }

  return (
    <div className={`${theme.layout.pagePadding} h-full flex flex-col overflow-hidden`}>
      <PageHeader 
        title="Enterprise Projects" 
        subtitle="Manage active project portfolio, track execution, and monitor delivery health."
        icon={Briefcase}
        actions={canEditProject() && (
            <button onClick={() => handleViewChange('create')} className={`px-4 py-2 ${theme.colors.primary} ${theme.colors.primaryHover} rounded-lg text-sm font-semibold text-white flex items-center gap-2 shadow-sm active:scale-95 transition-all`}>
                <Plus size={16} /> <span className="hidden sm:inline">New Project</span>
            </button>
        )}
      />

      <div className={`${theme.components.card} flex-1 flex flex-col min-h-0 overflow-hidden`}>
        <div className={`p-4 border-b ${theme.colors.border} bg-slate-50/50`}>
            <FilterBar 
                searchValue={searchTerm} 
                onSearch={setSearchTerm} 
                searchPlaceholder="Search projects..."
                actions={
                    <div className="bg-slate-200/60 p-1 rounded-lg flex text-[11px] font-bold">
                        <button onClick={() => handleViewChange('list')} className={`px-4 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                            <ListIcon size={14}/> Flat List
                        </button>
                        <button onClick={() => handleViewChange('eps')} className={`px-4 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${viewMode === 'eps' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                            <Layers size={14}/> EPS Hierarchy
                        </button>
                    </div>
                }
            />
        </div>

        <div className={`flex-1 overflow-hidden flex flex-col relative ${isPending ? 'opacity-70' : 'opacity-100'} transition-opacity duration-200`}>
          {isPending && (
             <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/50 backdrop-blur-[1px]">
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
                {viewMode === 'list' && (
                   <>
                     <div className="hidden lg:block h-full overflow-hidden">
                       <ProjectListTable projects={filteredProjects} onSelect={handleSelectProject} />
                     </div>
                     <div className="lg:hidden flex-1 overflow-y-auto bg-slate-50/50 scrollbar-thin">
                       <ProjectListCards projects={filteredProjects} onSelect={handleSelectProject} />
                     </div>
                   </>
                )}
                {viewMode === 'eps' && (
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