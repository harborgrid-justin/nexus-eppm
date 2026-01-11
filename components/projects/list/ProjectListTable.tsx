
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, Column } from '../../../types';
import { useData } from '../../../context/DataContext';
import { StatusBadge } from '../../common/StatusBadge';
import { ProgressBar } from '../../common/ProgressBar';
import DataTable from '../../common/DataTable';
import { calculateProjectProgress } from '../../../utils/calculations';
import { formatCompactCurrency, formatInitials } from '../../../utils/formatters';
import { GitBranch } from 'lucide-react';
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
          <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${theme.colors.text.primary} truncate`}>{p.name}</span>
              {p.isReflection && <GitBranch size={14} className="text-purple-500" title="Reflection Project" />}
          </div>
          <span className={`text-xs ${theme.colors.text.secondary} font-mono truncate`}>{p.code}</span>
        </div>
      )
    },
    {
      key: 'managerId', header: 'Manager', width: 'w-48', sortable: true,
      render: (p) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-6 h-6 rounded-full ${theme.colors.background} border ${theme.colors.border} flex items-center justify-center text-[10px] font-bold ${theme.colors.text.secondary} flex-shrink-0`}>
            {formatInitials(getManagerName(p.managerId))}
          </div>
          <span className={`text-sm ${theme.colors.text.secondary} truncate`}>{getManagerName(p.managerId)}</span>
        </div>
      )
    },
    {
      key: 'progress', header: 'Progress', width: 'w-56',
      render: (p) => {
        const prog = calculateProjectProgress(p);
        return (
          <div className="w-full pr-4">
            <div className="flex justify-between text-xs mb-1"><span className={`font-medium ${theme.colors.text.secondary}`}>{prog}%</span></div>
            <ProgressBar value={prog} colorClass={p.health === 'Critical' ? 'bg-red-500' : p.health === 'Warning' ? 'bg-yellow-500' : 'bg-nexus-600'} />
          </div>
        );
      }
    },
    {
      key: 'budget', header: 'Budget', width: 'w-32', align: 'right', sortable: true,
      render: (p) => (
        <div className="text-right overflow-hidden">
          <div className={`text-sm font-medium ${theme.colors.text.primary} truncate`}>{formatCompactCurrency(p.budget)}</div>
          <div className={`text-[10px] ${theme.colors.text.secondary} truncate`}>{formatCompactCurrency(p.spent)} spent</div>
        </div>
      )
    }
  ], [state.resources, theme]);

  return (
    <DataTable 
        data={projects} 
        columns={columns} 
        onRowClick={(p) => navigate(`/projectWorkspace/${p.id}`)} 
        keyField="id" 
        emptyMessage="No projects found." 
        selectable={selectable}
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
    />
  );
};
