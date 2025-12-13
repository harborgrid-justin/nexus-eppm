
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import DataTable, { Column } from '../common/DataTable';
import { Task, TaskStatus, Project } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { Calendar, Briefcase } from 'lucide-react';

interface EnrichedTask extends Task {
  projectName: string;
  projectCode: string;
  projectId: string;
}

const MyTasks: React.FC = () => {
  const { state } = useData();
  const { user } = useAuth();

  // Filter tasks across ALL projects where the user is assigned
  const myTasks = useMemo(() => {
    // For demo purposes, if no user is assigned, we might show tasks assigned to 'Sarah Chen' (R-001) if logged in as admin
    // In a real app, user.id would match resource.id. 
    // Mock mapping: User ID 'U-001' (Justin) might map to Resource 'R-001' (Sarah) for demo visibility if they are the same person contextually.
    // Let's assume the user IS 'Sarah Chen' for this demo context or we just show all tasks for 'R-001' for now.
    
    // Hardcoded target resource ID for demo to ensure data appears
    const targetResourceId = 'R-001'; 

    const tasks: EnrichedTask[] = [];
    state.projects.forEach(project => {
        project.tasks.forEach(task => {
            const assignment = task.assignments.find(a => a.resourceId === targetResourceId);
            if (assignment || task.status === TaskStatus.IN_PROGRESS) { // Broaden filter for demo
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

  const columns: Column<EnrichedTask>[] = [
    {
      key: 'name',
      header: 'Task Name',
      render: (task) => (
        <div>
          <div className="font-medium text-slate-900">{task.name}</div>
          <div className="text-xs text-slate-500 font-mono mt-0.5">{task.wbsCode}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'projectName',
      header: 'Project',
      render: (task) => (
        <div className="flex items-center gap-2">
            <div className="p-1 bg-slate-100 rounded text-slate-500"><Briefcase size={12}/></div>
            <div>
                <div className="text-sm text-slate-700">{task.projectName}</div>
                <div className="text-[10px] text-slate-400">{task.projectCode}</div>
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
        <div className="text-xs text-slate-600">
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
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">My Assignments</h3>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{myTasks.length} Active Tasks</span>
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
