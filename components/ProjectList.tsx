
import React, { useMemo, useState } from 'react';
import { Project, EPSNode } from '../types';
import { ChevronRight, ChevronDown, Calendar, MoreHorizontal, Briefcase, Plus, Folder, Layers } from 'lucide-react';
import { calculateProjectProgress } from '../utils/calculations';
import { usePortfolioState } from '../hooks';
import { useData } from '../context/DataContext';
import { formatCompactCurrency, formatDate, formatInitials } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';
import { StatusBadge } from './common/StatusBadge';
import { ProgressBar } from './common/ProgressBar';
import DataTable, { Column } from './common/DataTable';
import { PageHeader } from './common/PageHeader';
import { FilterBar } from './common/FilterBar';
import { usePermissions } from '../hooks/usePermissions';

interface ProjectListProps {
  onSelectProject: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ onSelectProject }) => {
  const { projects } = usePortfolioState();
  const { state } = useData();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'eps'>('list');
  const [expandedEps, setExpandedEps] = useState<Set<string>>(new Set(state.eps.map(e => e.id))); // Default all open
  const { canEditProject } = usePermissions();

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const toggleEps = (id: string) => {
    const newSet = new Set(expandedEps);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedEps(newSet);
  };

  const columns = useMemo<Column<Project>[]>(() => [
    {
      key: 'health',
      header: 'Status',
      width: 'w-24',
      sortable: true,
      render: (project) => <StatusBadge status={project.health} variant="health" />
    },
    {
      key: 'name',
      header: 'Project Name',
      sortable: true,
      render: (project) => (
        <div className="flex flex-col min-w-[180px]">
          <span className="text-sm font-semibold text-slate-900 hover:text-nexus-600 transition-colors">{project.name}</span>
          <span className="text-xs text-slate-500 font-mono">{project.code}</span>
        </div>
      )
    },
    {
      key: 'manager',
      header: 'Manager',
      sortable: true,
      render: (project) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600" aria-hidden="true">
            {formatInitials(project.manager)}
          </div>
          <span className="text-sm text-slate-700">{project.manager}</span>
        </div>
      )
    },
    {
      key: 'endDate',
      header: 'Schedule',
      sortable: true,
      render: (project) => (
        <div className="flex flex-col text-sm text-slate-600 min-w-[140px]">
          <span className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-400" /> {formatDate(project.startDate)}</span>
          <span className="flex items-center gap-1.5"><ChevronRight size={12} className="text-slate-400" /> {formatDate(project.endDate)}</span>
        </div>
      )
    },
    {
      key: 'progress',
      header: 'Progress',
      width: 'w-48',
      render: (project) => {
        const progress = calculateProjectProgress(project);
        return (
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-700">{progress}% Complete</span>
            </div>
            <ProgressBar 
              value={progress} 
              colorClass={
                project.health === 'Critical' ? 'bg-red-500' : 
                project.health === 'Warning' ? 'bg-yellow-500' : 
                'bg-nexus-600'
              } 
            />
          </div>
        );
      }
    },
    {
      key: 'budget',
      header: 'Budget',
      align: 'right',
      sortable: true,
      render: (project) => (
        <div>
          <div className="text-sm font-medium text-slate-900">{formatCompactCurrency(project.budget)}</div>
          <div className="text-xs text-slate-500">{formatCompactCurrency(project.spent)} spent</div>
        </div>
      )
    },
    {
      key: 'actions',
      header: '',
      width: 'w-10',
      align: 'right',
      render: () => (
        <button 
          className="p-1 hover:bg-slate-200 rounded text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal size={16} />
        </button>
      )
    }
  ], []);

  // Recursive EPS Renderer
  const renderEpsNode = (node: EPSNode, level: number = 0) => {
    const nodeProjects = filteredProjects.filter(p => p.epsId === node.id);
    const childNodes = state.eps.filter(e => e.parentId === node.id);
    const hasChildren = nodeProjects.length > 0 || childNodes.length > 0;
    const isExpanded = expandedEps.has(node.id);

    if (!hasChildren && level > 0) return null; // Hide empty leaves if deep

    return (
      <React.Fragment key={node.id}>
        <div 
          className={`flex items-center px-4 py-2 bg-slate-50 border-b border-slate-200 hover:bg-slate-100 cursor-pointer select-none transition-colors`}
          style={{ paddingLeft: `${level * 20 + 16}px` }}
          onClick={() => toggleEps(node.id)}
        >
          <span className="mr-2 text-slate-400">
            {hasChildren ? (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <div className="w-4" />}
          </span>
          <Folder size={16} className="text-nexus-500 mr-2" />
          <span className="font-bold text-sm text-slate-800">{node.name}</span>
          <span className="ml-2 text-xs text-slate-400 font-mono">({node.code})</span>
          {nodeProjects.length > 0 && <span className="ml-auto text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-500">{nodeProjects.length} Projects</span>}
        </div>
        
        {isExpanded && (
          <>
            {/* Render Projects in this Node */}
            {nodeProjects.map(project => (
               <div 
                 key={project.id} 
                 onClick={() => onSelectProject(project.id)}
                 className="group flex items-center px-4 py-3 border-b border-slate-100 hover:bg-white bg-slate-50/30 cursor-pointer transition-all border-l-4 border-l-transparent hover:border-l-nexus-500"
                 style={{ paddingLeft: `${(level + 1) * 20 + 36}px` }}
               >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="col-span-1">
                          <div className="font-semibold text-sm text-slate-800 group-hover:text-nexus-700">{project.name}</div>
                          <div className="text-xs text-slate-500 font-mono">{project.code}</div>
                      </div>
                      <div className="hidden md:block text-sm text-slate-600">
                          {project.manager}
                      </div>
                      <div className="hidden md:block">
                          <StatusBadge status={project.health} variant="health"/>
                      </div>
                      <div className="hidden md:block text-right text-sm font-mono text-slate-700">
                          {formatCompactCurrency(project.budget)}
                      </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 ml-4"/>
               </div>
            ))}
            
            {/* Recursively Render Child Nodes */}
            {childNodes.map(child => renderEpsNode(child, level + 1))}
          </>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
      <PageHeader 
        title="Projects" 
        subtitle="Manage active projects, track progress, and monitor health."
        icon={Briefcase}
        actions={canEditProject() && (
            <button className={`px-4 py-2 ${theme.colors.accentBg} rounded-lg text-sm font-medium text-white hover:bg-nexus-700 flex items-center gap-2 shadow-sm`}>
                <Plus size={16} /> New Project
            </button>
        )}
      />

      <div className="flex-1 flex flex-col overflow-hidden h-full">
        {/* Filter Bar */}
        <div className="flex-shrink-0 mb-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <FilterBar 
                searchValue={searchTerm} 
                onSearch={setSearchTerm} 
                onFilterClick={() => {}} 
                searchPlaceholder="Search projects..."
                actions={
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-medium">
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition-all ${viewMode === 'list' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Briefcase size={14}/> Flat
                            </button>
                            <button 
                                onClick={() => setViewMode('eps')}
                                className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition-all ${viewMode === 'eps' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Layers size={14}/> EPS
                            </button>
                        </div>
                        <select className="bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-nexus-500 hidden sm:block">
                            <option>All Projects</option>
                            <option>My Projects</option>
                            <option>Critical Health</option>
                        </select>
                    </div>
                }
            />
        </div>

        {/* Data View */}
        <div className="flex-1 overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
          {viewMode === 'list' ? (
             <div className="flex-1 overflow-auto">
                <DataTable 
                    data={filteredProjects}
                    columns={columns}
                    onRowClick={(p) => onSelectProject(p.id)}
                    keyField="id"
                    emptyMessage="No projects found matching your criteria."
                />
             </div>
          ) : (
             <div className="flex-1 overflow-auto">
                 {/* Root nodes (nodes with no parent) */}
                 {state.eps.filter(e => !e.parentId).map(node => renderEpsNode(node))}
                 {state.eps.length === 0 && <div className="p-8 text-center text-slate-500">No Enterprise Project Structure defined.</div>}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
