
import React, { useState, useMemo, useTransition } from 'react';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { ModuleNavigation, NavGroup } from './common/ModuleNavigation';
import { ErrorBoundary } from './ErrorBoundary';
import { CheckSquare, ListTodo, Clock } from 'lucide-react';
import MyTasks from './team/MyTasks';
import Timesheet from './team/Timesheet';
import { useTeamWorkspaceLogic } from '../hooks/domain/useTeamWorkspaceLogic';

const TeamWorkspace: React.FC = () => {
  const theme = useTheme();
  const { activeTab, setActiveTab } = useTeamWorkspaceLogic();
  const [isPending, startTransition] = useTransition();

  const navGroups: NavGroup[] = useMemo(() => [
      { id: 'work', label: 'My Work', items: [
          { id: 'tasks', label: 'My Tasks', icon: ListTodo },
          { id: 'timesheet', label: 'Timesheet', icon: Clock }
      ]}
  ], []);

  const handleItemChange = (itemId: string) => {
      startTransition(() => {
          setActiveTab(itemId as 'tasks' | 'timesheet');
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
             {activeTab === 'tasks' ? <MyTasks /> : <Timesheet />}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default TeamWorkspace;
