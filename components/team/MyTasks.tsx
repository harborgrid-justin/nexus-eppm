
import React, { useMemo } from 'react';
import DataTable from '../common/DataTable';
// Corrected import path for Column and EnrichedTask from types
import { Column } from '../../types/index';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { Calendar, Briefcase, CheckSquare } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useMyTasksLogic, EnrichedTask } from '../../hooks/domain/useMyTasksLogic';
import { EmptyGrid } from '../common/EmptyGrid';

const MyTasks: React.FC = () => {
  const theme = useTheme();
  const { myTasks, isEmpty, user } = useMyTasksLogic();

  const columns = useMemo<Column<EnrichedTask>[]>(() => [
    {
      key: 'name',
      header: 'Task Name',
      render: (task) => (
        <div>
          <div className={`font-medium ${theme.colors.text.primary}`}>{task.name}</div>
          <div className={`text-xs ${theme.colors.text.secondary} font-mono mt-0.5`}>{task.wbsCode}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'projectName',
      header: 'Project',
      render: (task) => (
        <div className="flex items-center gap-2">
            <div className={`p-1 ${theme.colors.background} rounded ${theme.colors.text.secondary}`}><Briefcase size={12}/></div>
            <div>
                <div className={`text-sm ${theme.colors.text.primary}`}>{task.projectName}</div>
                <div className={`text-[10px] ${theme.colors.text.tertiary}`}>{task.projectCode}</div>
            </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-32',
      render: (task) => <StatusBadge status={task.status} variant="status" />,
      sortable: true,
    },
    {
      key: 'dates',
      header: 'Schedule',
      render: (task) => (
        <div className={`text-xs ${theme.colors.text.secondary}`}>
            <div className="flex items-center gap-1"><Calendar size={10}/> Start: {task.startDate}</div>
            <div className="flex items-center gap-1 mt-1"><Calendar size={10}/> Due: {task.endDate}</div>
        </div>
      )
    },
    {
      key: 'progress',
      header: 'Progress',
      width: 'w-48',
      render: (task) => (
        <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
                <span>{task.progress}%</span>
            </div>
            <ProgressBar value={task.progress} size="sm" />
        </div>
      ),
      sortable: true,
    }
  ], [theme]);

  if (!user) {
      return (
          <div className={`h-full flex items-center justify-center ${theme.colors.text.secondary}`}>
              <p>Please log in to view your assignments.</p>
          </div>
      );
  }

  return (
    <div className={`h-full flex flex-col ${theme.components.card} overflow-hidden`}>
      <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center`}>
        <h3 className={`font-bold ${theme.colors.text.primary}`}>My Assignments</h3>
        <span className={`text-xs ${theme.colors.text.secondary} ${theme.colors.background} px-2 py-1 rounded-full`}>{myTasks.length} Active Tasks</span>
      </div>
      <div className="flex-1 overflow-auto">
        {isEmpty ? (
             <div className="h-full flex flex-col items-center justify-center p-8">
                 <EmptyGrid 
                    title="No Active Assignments" 
                    description="You have no tasks currently assigned to you across the portfolio."
                    icon={CheckSquare}
                    actionLabel="Refresh Assignments"
                    onAdd={() => window.location.reload()}
                 />
             </div>
        ) : (
            <DataTable 
                data={myTasks}
                columns={columns}
                keyField="id"
                emptyMessage="No tasks found."
            />
        )}
      </div>
    </div>
  );
};

export default MyTasks;
