
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { CheckSquare, Clock, ListTodo } from 'lucide-react';
import MyTasks from './team/MyTasks';
import Timesheet from './team/Timesheet';
import { useTeamWorkspaceLogic } from '../hooks/domain/useTeamWorkspaceLogic';

const TeamWorkspace: React.FC = () => {
  const theme = useTheme();
  const { activeTab, setActiveTab } = useTeamWorkspaceLogic();

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader title="Team Workspace" subtitle="Manage your assignments and track your time." icon={CheckSquare} />
      <div className={`${theme.components.card} flex flex-col flex-1 overflow-hidden`}>
        <div className={`flex-shrink-0 border-b ${theme.colors.border} z-10 px-4`}>
          <nav className="flex space-x-2">
            <button onClick={() => setActiveTab('tasks')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tasks' ? 'border-nexus-600 text-nexus-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              <div className="flex items-center gap-2"><ListTodo size={16} /> My Tasks</div>
            </button>
            <button onClick={() => setActiveTab('timesheet')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'timesheet' ? 'border-nexus-600 text-nexus-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              <div className="flex items-center gap-2"><Clock size={16} /> Timesheet</div>
            </button>
          </nav>
        </div>
        <div className={`flex-1 overflow-hidden p-6 ${theme.colors.background}/30`}>
          {activeTab === 'tasks' ? <MyTasks /> : <Timesheet />}
        </div>
      </div>
    </div>
  );
};

export default TeamWorkspace;
