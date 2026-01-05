
import React, { useMemo } from 'react';
import DataTable, { Column } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { Calendar, Briefcase, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useMyTasksLogic, EnrichedTask } from '../../hooks/domain/useMyTasksLogic';
import { Button } from '../ui/Button';

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
          <div className="h-full flex items-center justify-center text-slate-400">
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
        <DataTable 
            data={myTasks}
            columns={columns}
            keyField="id"
            emptyMessage="No tasks currently assigned."
        />
        {isEmpty && (
             <div className="p-8 flex flex-col items-center justify-center text-center">
                 <AlertCircle size={32} className="text-slate-300 mb-2" />
                 <p className="text-slate-500 text-sm mb-4">You have no active tasks.</p>
                 <Button size="sm" variant="outline">Browse Project Tasks</Button>
             </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
