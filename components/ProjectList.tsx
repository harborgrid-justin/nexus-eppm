
import React, { useMemo, useState } from 'react';
import { Briefcase, Plus, List as ListIcon, Layers, Search, Loader2, X, Download, Archive, Trash2 } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { usePermissions } from '../hooks/usePermissions';
import ProjectWizard from './projects/ProjectWizard';
import { ProjectListTable } from './projects/list/ProjectListTable';
import { ProjectListCards } from './projects/list/ProjectListCards';
import { EpsTreeView } from './projects/list/EpsTreeView';
import { EmptyGrid } from './common/EmptyGrid';
import { ModuleNavigation, NavGroup } from './common/ModuleNavigation';
import { useProjectListLogic } from '../hooks/domain/useProjectListLogic';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ExportService } from '../services/ExportService';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

const ProjectList: React.FC = () => {
  const { canEditProject } = usePermissions();
  const { state, dispatch } = useData();
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
          success("Export Complete", `${dataToExport.length} projects successfully generated for distribution.`);
      } catch (e) {
          error("Export Error", "A runtime exception occurred during data serialization.");
      } finally {
          setIsExporting(false);
      }
  };

  const handleBulkArchive = () => {
      if(confirm(`Archive ${selectedIds.length} projects? Baseline integrity will be preserved.`)) {
          selectedIds.forEach(id => dispatch({ type: 'PROJECT_UPDATE', payload: { projectId: id, updatedData: { status: 'Archived' } } }));
          success("Portfolio Updated", `${selectedIds.length} projects moved to historical archive.`);
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
            <button 
                onClick={() => setActiveView('create')} 
                className={`px-5 py-2.5 bg-slate-900 hover:bg-black rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95 transition-all`}
            >
                <Plus size={16} /> New Project
            </button>
        )}
      />

      <div className={`flex flex-col h-full bg-white rounded-[2.5rem] border ${theme.colors.border} shadow-sm overflow-hidden`}>
        <div className={`flex-shrink-0 z-10 border-b ${theme.colors.border} bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4`}>
            <div className="flex-1 min-w-0">
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
                <div className="p-4 md:pr-8 flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Input 
                            isSearch 
                            placeholder="Search projects..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full sm:w-72 bg-white"
                        />
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`h-10 px-4 border ${theme.colors.border} rounded-xl text-xs font-bold uppercase tracking-widest bg-white focus:ring-4 focus:ring-nexus-500/10 outline-none cursor-pointer transition-all hover:border-slate-300 shadow-sm`}
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Planned">Planned</option>
                            <option value="Closed">Closed</option>
                            <option value="Archived">Archived</option>
                        </select>
                    </div>
                    <Button 
                        variant="outline" 
                        size="md" 
                        icon={Download} 
                        onClick={handleExport} 
                        isLoading={isExporting}
                        className="shrink-0 rounded-xl"
                    >
                        Export
                    </Button>
                </div>
            )}
        </div>

        <div className={`flex-1 overflow-hidden flex flex-col relative transition-opacity duration-300 ${isPending || searchTerm !== deferredSearchTerm ? 'opacity-70' : 'opacity-100'}`}>
          {(isPending || searchTerm !== deferredSearchTerm) && (
             <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/20 backdrop-blur-[1px]">
                <Loader2 className="animate-spin text-nexus-500" size={40} strokeWidth={2} />
             </div>
          )}

          {filteredAndStatusProjects.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center h-full nexus-empty-pattern">
                 <EmptyGrid 
                    title={deferredSearchTerm ? "Logic Query Null" : "Portfolio Database Isolated"} 
                    description={deferredSearchTerm 
                        ? `The operational criteria for "${deferredSearchTerm}" returned zero matching entities from the ledger.` 
                        : "The enterprise project structure is currently unpopulated. Initialize a strategic initiative to begin performance tracking."}
                    onAdd={deferredSearchTerm ? () => setSearchTerm('') : (canEditProject() ? () => setActiveView('create') : undefined)}
                    actionLabel={deferredSearchTerm ? "Clear Execution Filters" : "Establish New Initiative"}
                    icon={deferredSearchTerm ? X : Briefcase}
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
                     <div className={`lg:hidden flex-1 overflow-y-auto bg-slate-50/50 scrollbar-thin`}>
                       <ProjectListCards projects={filteredAndStatusProjects} onSelect={handleSelectProject} />
                     </div>
                     
                     {/* Dynamic Contextual Action Bar */}
                     {selectedIds.length > 0 && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-8 animate-in slide-in-from-bottom-10 duration-500 z-50 border border-white/10 backdrop-blur-xl">
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selection</span>
                                <span className="font-black text-lg text-white tabular-nums">{selectedIds.length} Entities</span>
                            </div>
                            <div className="h-10 w-px bg-white/10"></div>
                            <div className="flex gap-4">
                                <button onClick={handleExport} className="flex flex-col items-center gap-1 text-[9px] font-black uppercase text-slate-400 hover:text-nexus-400 transition-all group">
                                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors"><Download size={16}/></div>
                                    Export
                                </button>
                                <button onClick={handleBulkArchive} className="flex flex-col items-center gap-1 text-[9px] font-black uppercase text-slate-400 hover:text-amber-400 transition-all group">
                                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors"><Archive size={16}/></div>
                                    Archive
                                </button>
                                <button className="flex flex-col items-center gap-1 text-[9px] font-black uppercase text-slate-400 hover:text-red-400 transition-all group">
                                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors"><Trash2 size={16}/></div>
                                    Purge
                                </button>
                            </div>
                            <button onClick={() => setSelectedIds([])} className="ml-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all text-slate-500 hover:text-white">
                                <X size={20}/>
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
