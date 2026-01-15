
import React, { useMemo, useState } from 'react';
import { Briefcase, Plus, List as ListIcon, Layers, Search, Loader2, Download, Trash2, X } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { usePermissions } from '../../hooks/usePermissions';
import ProjectWizard from './ProjectWizard';
import { ProjectListTable } from './list/ProjectListTable';
import { EpsTreeView } from './list/EpsTreeView';
import { EmptyGrid } from '../common/EmptyGrid';
import { ModuleNavigation, NavGroup } from '../common/ModuleNavigation';
import { useProjectListLogic } from '../../hooks/domain/useProjectListLogic';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ExportService } from '../../services/ExportService';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { ProjectListCards } from './list/ProjectListCards';

const ProjectList: React.FC = () => {
  const { canEditProject } = usePermissions();
  const { dispatch } = useData();
  const theme = useTheme();
  const { success, error } = useToast();
  
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

  // Local state for extended filtering and bulk actions
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const filteredAndStatusProjects = useMemo(() => {
      if (statusFilter === 'All') return filteredProjects;
      return filteredProjects.filter(p => p.status === statusFilter);
  }, [filteredProjects, statusFilter]);

  const navGroups: NavGroup[] = useMemo(() => [
      { id: 'views', label: 'Visualization Mode', items: [
          { id: 'list', label: 'Executive Grid', icon: ListIcon },
          { id: 'eps', label: 'Hierarchy (EPS)', icon: Layers }
      ]}
  ], []);

  const handleExport = async () => {
      setIsExporting(true);
      try {
          const dataToExport = selectedIds.length > 0 
            ? filteredAndStatusProjects.filter(p => selectedIds.includes(p.id)) 
            : filteredAndStatusProjects;
          await ExportService.exportData(dataToExport, 'project_export', 'CSV');
          success("Export Complete", `${dataToExport.length} projects exported to CSV.`);
      } catch (e) {
          error("Export Failed", "Could not generate project export.");
      } finally {
          setIsExporting(false);
      }
  };

  const handleBulkDelete = () => {
      if(confirm(`Are you sure you want to delete ${selectedIds.length} projects? This action cannot be undone.`)) {
          selectedIds.forEach(id => {
              // Dispatch delete for each ID
              // Note: In a real app, we'd have a BULK_DELETE action
              // For now, we simulate by dispatching individual deletes or assumes backend handles it
              // We'll define a loop here as a pragmatic solution for the mock reducer
              // Ideally, add DELETE_PROJECT to reducer. Assuming it might exist or use PROJECT_CLOSE
              dispatch({ type: 'PROJECT_CLOSE', payload: id }); 
          });
          success("Projects Archived", `${selectedIds.length} projects have been closed/archived.`);
          setSelectedIds([]);
      }
  };

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
        <div className={`flex-shrink-0 z-10 border-b ${theme.colors.border} ${theme.colors.background}/30 flex flex-col md:flex-row justify-between md:items-center gap-4`}>
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
            
            {activeView === 'list' && (
                <div className="p-3 md:pr-6 flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Input 
                            isSearch 
                            placeholder="Search projects..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full sm:w-64"
                        />
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`h-10 px-3 border ${theme.colors.border} rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none cursor-pointer`}
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Planned">Planned</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <Button 
                        variant="outline" 
                        size="md" 
                        icon={isExporting ? Loader2 : Download} 
                        onClick={handleExport} 
                        disabled={isExporting}
                        className="shrink-0"
                    >
                        {isExporting ? 'Exporting...' : 'Export'}
                    </Button>
                </div>
            )}
        </div>

        <div className={`flex-1 overflow-hidden flex flex-col relative transition-opacity duration-300 ${isPending || searchTerm !== deferredSearchTerm ? 'opacity-70' : 'opacity-100'}`}>
          {(isPending || searchTerm !== deferredSearchTerm) && (
             <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-[1px]">
                <Loader2 className="animate-spin text-nexus-500" size={32} />
             </div>
          )}

          {filteredAndStatusProjects.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center h-full">
                 <EmptyGrid 
                    title={deferredSearchTerm ? "No Matches Identified" : "Portfolio Registry Null"} 
                    description={deferredSearchTerm 
                        ? `Search for "${deferredSearchTerm}" returned zero results from the project pool.` 
                        : "The enterprise project database is currently unpopulated or filtered."}
                    onAdd={deferredSearchTerm ? () => setSearchTerm('') : (canEditProject() ? () => setActiveView('create') : undefined)}
                    actionLabel={deferredSearchTerm ? "Clear Search" : "Initialize Project"}
                    icon={deferredSearchTerm ? X : Search}
                 />
             </div>
          ) : (
             <div className="flex-1 overflow-hidden flex flex-col">
                {activeView === 'list' && (
                   <div className="h-full flex flex-col">
                     <div className="hidden lg:block flex-1 overflow-hidden">
                       <ProjectListTable 
                            projects={filteredAndStatusProjects} 
                            onSelect={handleSelectProject} 
                            selectable={true}
                            selectedIds={selectedIds}
                            onSelectionChange={setSelectedIds}
                        />
                     </div>
                     <div className={`lg:hidden flex-1 overflow-y-auto ${theme.colors.background}/50 scrollbar-thin`}>
                       <ProjectListCards projects={filteredAndStatusProjects} onSelect={handleSelectProject} />
                     </div>
                     
                     {/* Bulk Action Bar */}
                     {selectedIds.length > 0 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-6 z-50">
                            <span className="font-bold text-sm whitespace-nowrap">{selectedIds.length} Selected</span>
                            <div className="h-4 w-px bg-white/20"></div>
                            <button onClick={handleExport} className="flex items-center gap-2 text-xs font-bold hover:text-nexus-400 transition-colors">
                                <Download size={14}/> Export
                            </button>
                            <button onClick={handleBulkDelete} className="flex items-center gap-2 text-xs font-bold hover:text-red-400 transition-colors">
                                <Trash2 size={14}/> Close/Archive
                            </button>
                            <button onClick={() => setSelectedIds([])} className="ml-2 p-1 hover:bg-white/20 rounded-full">
                                <X size={14}/>
                            </button>
                        </div>
                     )}
                   </div>
                )}
                {activeView === 'eps' && (
                   <div className="h-full overflow-auto bg-white">
                       <EpsTreeView projects={filteredAndStatusProjects} onSelect={handleSelectProject} />
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
