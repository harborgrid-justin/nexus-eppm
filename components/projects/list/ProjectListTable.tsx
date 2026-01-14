import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../../types/index';
import { useData } from '../../../context/DataContext';
import { StatusBadge } from '../../common/StatusBadge';
import { ProgressBar } from '../../common/ProgressBar';
import DataTable from '../../common/DataTable';
import { calculateProjectProgress } from '../../../utils/calculations';
import { formatCompactCurrency, formatInitials } from '../../../utils/formatters';
import { GitBranch, User } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface ProjectListTableProps {
  projects: Project[];
  onSelect: (id: string) => void;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

export const ProjectListTable: React.FC<ProjectListTableProps> = ({ 
    projects, onSelect, selectable, selectedIds, onSelectionChange 
}) => {
  const { state } = useData();
  const navigate = useNavigate();
  const theme = useTheme();

  const getManagerName = (managerId: string) => state.resources.find(r => r.id === managerId)?.name;

  const columns = useMemo(() => [
    {
      key: 'health', 
      header: 'Status', 
      width: 'w-24', 
      sortable: true,
      render: (p: Project) => p.health ? <StatusBadge status={p.health} variant="health" /> : <div className="w-16 h-6 bg-slate-100 rounded-full animate-pulse shadow-inner" />
    },
    {
      key: 'name', 
      header: 'Project Name', 
      sortable: true,
      render: (p: Project) => (
        <div className="flex flex-col min-w-0 overflow-hidden py-1">
          <div className="flex items-center gap-2">
              <span className={`text-sm font-black ${theme.colors.text.primary} truncate group-hover:text-nexus-600 transition-colors uppercase tracking-tight`}>{p.name || 'Untitled Project'}</span>
              {p.isReflection && <GitBranch size={12} className="text-purple-500" title="Reflection Sandbox" />}
          </div>
          <span className={`text-[10px] font-mono font-bold ${theme.colors.text.tertiary} uppercase tracking-tighter truncate`}>{p.code || 'NO_CODE'}</span>
        </div>
      )
    },
    {
      key: 'managerId', 
      header: 'Manager', 
      width: 'w-56', 
      sortable: true,
      render: (p: Project) => {
          const name = getManagerName(p.managerId);
          return (
            <div className="flex items-center gap-3 min-w-0">
              {name ? (
                  <div className={`w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-black text-white shadow-lg shrink-0`}>
                    {formatInitials(name)}
                  </div>
              ) : (
                  <div className={`w-8 h-8 rounded-xl ${theme.colors.background} border ${theme.colors.border} flex items-center justify-center text-slate-300 shrink-0`}>
                    <User size={14}/>
                  </div>
              )}
              <div className="flex flex-col truncate">
                <span className={`text-sm font-bold ${name ? 'text-slate-700' : 'text-slate-400 italic'}`}>{name || 'Unassigned'}</span>
              </div>
            </div>
          );
      }
    },
    {
      key: 'progress', 
      header: 'Execution Progress', 
      width: 'w-64',
      render: (p: Project) => {
        const prog = calculateProjectProgress(p);
        return (
          <div className="w-full pr-8">
            <div className={`flex justify-between items-end text-[10px] font-black uppercase mb-1.5`}>
                <span className={theme.colors.text.tertiary}>Physical %</span>
                <span className="text-slate-900 font-mono">{prog}%</span>
            </div>
            <ProgressBar value={prog} colorClass={p.health === 'Critical' ? 'bg-red-500' : p.health === 'Warning' ? 'bg-amber-500' : 'bg-nexus-600'} size="sm" />
          </div>
        );
      }
    },
    {
      key: 'budget', 
      header: 'Capital Authority', 
      width: 'w-40', 
      align: 'right', 
      sortable: true,
      render: (p: Project) => (
        <div className="text-right overflow-hidden pr-4">
          <div className={`text-sm font-black ${theme.colors.text.primary} font-mono`}>{formatCompactCurrency(p.budget || 0)}</div>
          <div className={`text-[10px] font-bold ${theme.colors.text.tertiary} uppercase tracking-tighter mt-0.5`}>
              {formatCompactCurrency(p.spent || 0)} <span className="font-normal opacity-60 italic lowercase">consumed</span>
          </div>
        </div>
      )
    }
  ], [state.resources, theme]);

  return (
    <div className={`h-full ${theme.colors.surface} flex flex-col`}>
        <DataTable 
            data={projects} 
            columns={columns} 
            onRowClick={(p) => navigate(`/projectWorkspace/${p.id}`)} 
            keyField="id" 
            emptyMessage="The project database is unpopulated for this partition. Provision a new initiative to begin." 
            selectable={selectable}
            selectedIds={selectedIds}
            onSelectionChange={onSelectionChange}
        />
    </div>
  );
};