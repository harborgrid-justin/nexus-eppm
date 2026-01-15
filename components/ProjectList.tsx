
import React, { useMemo, useState } from 'react';
import { Briefcase, Plus, List as ListIcon, Layers, Search, Download, Trash2, X } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { usePermissions } from '../hooks/usePermissions';
import ProjectWizard from './projects/ProjectWizard';
import { ProjectListTable } from './projects/list/ProjectListTable';
import { EpsTreeView } from './list/EpsTreeView';
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
  const { dispatch } = useData();
  const theme = useTheme();
  const { success, error } = useToast();
  
  const {
      searchTerm, setSearchTerm, deferredSearchTerm, activeGroup, activeView,
      setActiveView, isPending, filteredProjects, handleCreateProject,
      handleSelectProject, handleViewChange
  } = useProjectListLogic();

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
          success("Export Complete", "Current project partitions synchronized to disk.");
      } catch (e) {
          error("Export Failed", "System encountered an error during data serialization.");
      } finally {
          setIsExporting(false);
      }
  };

  if (activeView === 'create') {
      return <ProjectWizard onClose={() => setActiveView('list')} onSave={handleCreateProject} />;
  }

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding} ${theme.colors.background}`}>
      <PageHeader 
        title="Portfolio Execution" 
        subtitle="Operational oversight of the global delivery health."
        icon={Briefcase}
        actions={canEditProject() && (
            <Button onClick={() => setActiveView('create')} icon={Plus} size="sm">
                New Project
            </Button>
        )}
      />

      <div className={`mt-6 flex flex-col flex-1 ${theme.colors.surface} rounded-2xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
        <div className={`flex-shrink-0 z-10 border-b ${theme.colors.border} bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4`}>
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
                <div className="p-3 md:pr-6 flex items-center gap-3 w-full md:w-auto">
                    <Input 
                        isSearch 
                        placeholder="Search projects..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full sm:w-64"
                    />
                    <Button 
                        variant="outline" 
                        icon={isExporting ? X : Download} 
                        onClick={handleExport} 
                        disabled={isExporting}
                    >
                        {isExporting ? 'Exporting...' : 'Export'}
                    </Button>
                </div>
            )}
        </div>

        <div className={`flex-1 overflow-hidden flex flex-col relative transition-opacity duration-300 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
          {filteredAndStatusProjects.length === 0 ? (
             <EmptyGrid 
                title="Portfolio Registry Neutral" 
                description="The enterprise project database is currently unpopulated in this partition."
                onAdd={canEditProject() ? () => setActiveView('create') : undefined}
                actionLabel="Initialize Project"
                icon={Briefcase}
             />
          ) : (
             <div className="flex-1 overflow-hidden flex flex-col">
                {activeView === 'list' && (
                    <ProjectListTable 
                        projects={filteredAndStatusProjects} 
                        onSelect={handleSelectProject} 
                        selectable={true}
                        selectedIds={selectedIds}
                        onSelectionChange={setSelectedIds}
                    />
                )}
                {activeView === 'eps' && (
                    <EpsTreeView projects={filteredAndStatusProjects} onSelect={handleSelectProject} />
                )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProjectList;
