
import React, { useMemo, useTransition } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { CheckSquare, ListTodo, Clock, LayoutGrid } from 'lucide-react';
import MyTasks from './team/MyTasks';
import Timesheet from './team/Timesheet';
import { useTeamWorkspaceLogic } from '../hooks/domain/useTeamWorkspaceLogic';
import { useData } from '../context/DataContext';
import { KanbanBoard } from './common/KanbanBoard';
import { TaskStatus } from '../types';
import { TabbedLayout } from './layout/standard/TabbedLayout';
import { NavGroup } from './common/ModuleNavigation';

const TeamWorkspace: React.FC = () => {
  const { state, dispatch } = useData();
  const { activeTab, setActiveTab } = useTeamWorkspaceLogic();
  const [isPending, startTransition] = useTransition();

  const navGroups: NavGroup[] = useMemo(() => [
      { id: 'work', label: 'My Work', items: [
          { id: 'tasks', label: 'My List', icon: ListTodo },
          { id: 'board', label: 'My Board', icon: LayoutGrid },
          { id: 'timesheet', label: 'Timesheet', icon: Clock }
      ]}
  ], []);

  // Filter tasks assigned to current user (Mock user ID 'U-001' or from Auth)
  const myTasks = useMemo(() => {
     return state.projects.flatMap(p => p.tasks).slice(0, 15); // Mock: Showing first 15 for demo
  }, [state.projects]);

  const handleTaskMove = (taskId: string, newStatus: string) => {
      // Find project ID for the task
      const project = state.projects.find(p => p.tasks.some(t => t.id === taskId));
      if (!project) return;
      
      const task = project.tasks.find(t => t.id === taskId);
      if (task) {
          const updatedTask = { ...task, status: newStatus as TaskStatus };
          dispatch({ type: 'TASK_UPDATE', payload: { projectId: project.id, task: updatedTask }});
      }
  };

  const handleItemChange = (itemId: string) => {
      startTransition(() => {
          setActiveTab(itemId as 'tasks' | 'timesheet' | 'board');
      });
  };

  return (
    <TabbedLayout
        title="Team Workspace"
        subtitle="Manage your assignments, track time, and update progress."
        icon={CheckSquare}
        navGroups={navGroups}
        activeGroup="work"
        activeItem={activeTab}
        onGroupChange={() => {}}
        onItemChange={handleItemChange}
    >
        <div className={`flex-1 overflow-hidden relative ${isPending ? 'opacity-70' : 'opacity-100'} transition-opacity duration-200`}>
          <ErrorBoundary name="Team Workspace">
             {activeTab === 'tasks' && <MyTasks />}
             {activeTab === 'board' && <KanbanBoard tasks={myTasks} onTaskMove={handleTaskMove} />}
             {activeTab === 'timesheet' && <Timesheet />}
          </ErrorBoundary>
        </div>
    </TabbedLayout>
  );
};

export default TeamWorkspace;
