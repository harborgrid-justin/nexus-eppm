
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import DataTable, { Column } from '../common/DataTable';
import { Task, TaskStatus, Project } from '../../types/index';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { Calendar, Briefcase } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface EnrichedTask extends Task {
  projectName: string;
  projectCode: string;
  projectId: string;
}

const MyTasks: React.FC = () => {
  const { state } = useData();
  const { user } = useAuth();
  const theme = useTheme();

  // Filter tasks across ALL projects where the user is assigned
  const myTasks = useMemo(() => {
    const targetResourceId = 'R-001'; 

    const tasks: EnrichedTask[] = [];
    state.projects.forEach(project => {
        project.tasks.forEach(task => {
            const assignment = task.assignments.find(a => a.resourceId === targetResourceId);
            if (assignment || task.status === TaskStatus.IN_PROGRESS) { 
                tasks.push({
                    ...task,
                    projectName: project.name,
                    projectCode: project.code,
                    projectId: project.id
                });
            }
        });
    });
    return tasks;
  }, [state.projects]);

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
            emptyMessage="No tasks assigned to you."
        />
      </div>
    </div>
  );
};

export default MyTasks;