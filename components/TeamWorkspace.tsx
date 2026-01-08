
import React, { useState, useMemo, useTransition } from 'react';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { ModuleNavigation, NavGroup } from './common/ModuleNavigation';
import { ErrorBoundary } from './ErrorBoundary';
import { CheckSquare, ListTodo, Clock, LayoutGrid } from 'lucide-react';
import MyTasks from './team/MyTasks';
import Timesheet from './team/Timesheet';
import { useTeamWorkspaceLogic } from '../hooks/domain/useTeamWorkspaceLogic';
import { useData } from '../context/DataContext';
import { KanbanBoard } from './common/KanbanBoard';
import { TaskStatus } from '../types';

const TeamWorkspace: React.FC = () => {
  const theme = useTheme();
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
  // In a real implementation, this comes from useAuth().user.id
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
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="Team Workspace" 
        subtitle="Manage your assignments, track time, and update progress." 
        icon={CheckSquare} 
      />
      
      <div className={theme.layout.panelContainer}>
        <div className={`flex-shrink-0 border-b ${theme.colors.border} z-10 bg-slate-50/50`}>
           <ModuleNavigation 
                groups={navGroups}
                activeGroup="work"
                activeItem={activeTab}
                onGroupChange={() => {}}
                onItemChange={handleItemChange}
                className="bg-transparent border-0 shadow-none"
            />
        </div>
        <div className={`flex-1 overflow-hidden relative ${isPending ? 'opacity-70' : 'opacity-100'} transition-opacity duration-200`}>
          <ErrorBoundary name="Team Workspace">
             {activeTab === 'tasks' && <MyTasks />}
             {activeTab === 'board' && <KanbanBoard tasks={myTasks} onTaskMove={handleTaskMove} />}
             {activeTab === 'timesheet' && <Timesheet />}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default TeamWorkspace;
