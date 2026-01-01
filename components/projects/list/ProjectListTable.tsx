
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../../types';
import { useData } from '../../../context/DataContext';
import { StatusBadge } from '../../common/StatusBadge';
import { ProgressBar } from '../../common/ProgressBar';
import DataTable, { Column } from '../../common/DataTable';
import { calculateProjectProgress } from '../../../utils/calculations';
import { formatCompactCurrency, formatInitials } from '../../../utils/formatters';

interface ProjectListTableProps {
  projects: Project[];
  onSelect: (id: string) => void;
}

export const ProjectListTable: React.FC<ProjectListTableProps> = ({ projects, onSelect }) => {
  const { state } = useData();
  const navigate = useNavigate();

  const getManagerName = (managerId: string) => state.resources.find(r => r.id === managerId)?.name || 'Unassigned';

  const columns = useMemo<Column<Project>[]>(() => [
    {
      key: 'health', header: 'Status', width: 'w-32', sortable: true,
      render: (p) => <StatusBadge status={p.health} variant="health" />
    },
    {
      key: 'name', header: 'Project Name', sortable: true,
      render: (p) => (
        <div className="flex flex-col min-w-0 overflow-hidden">
          <span className="text-sm font-semibold text-slate-900 truncate">{p.name}</span>
          <span className="text-xs text-slate-500 font-mono truncate">{p.code}</span>
        </div>
      )
    },
    {
      key: 'managerId', header: 'Manager', width: 'w-48', sortable: true,
      render: (p) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 flex-shrink-0">
            {formatInitials(getManagerName(p.managerId))}
          </div>
          <span className="text-sm text-slate-700 truncate">{getManagerName(p.managerId)}</span>
        </div>
      )
    },
    {
      key: 'progress', header: 'Progress', width: 'w-56',
      render: (p) => {
        const prog = calculateProjectProgress(p);
        return (
          <div className="w-full pr-4">
            <div className="flex justify-between text-xs mb-1"><span className="font-medium text-slate-700">{prog}%</span></div>
            <ProgressBar value={prog} colorClass={p.health === 'Critical' ? 'bg-red-500' : p.health === 'Warning' ? 'bg-yellow-500' : 'bg-nexus-600'} />
          </div>
        );
      }
    },
    {
      key: 'budget', header: 'Budget', width: 'w-32', align: 'right', sortable: true,
      render: (p) => (
        <div className="text-right overflow-hidden">
          <div className="text-sm font-medium text-slate-900 truncate">{formatCompactCurrency(p.budget)}</div>
          <div className="text-[10px] text-slate-500 truncate">{formatCompactCurrency(p.spent)} spent</div>
        </div>
      )
    }
  ], [state.resources]);

  return <DataTable data={projects} columns={columns} onRowClick={(p) => navigate(`/projectWorkspace/${p.id}`)} keyField="id" emptyMessage="No projects found." />;
};
