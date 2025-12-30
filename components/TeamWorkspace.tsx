
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { Clock, CheckCircle, Calendar, FileText } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import MyTasks from './team/MyTasks';
import Timesheet from './team/Timesheet';

const CheckSquare = (LucideIcons as any).CheckSquare || CheckCircle;
const ListTodo = (LucideIcons as any).ListTodo || FileText;

const TeamWorkspace: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'tasks' | 'timesheet'>('tasks');

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
      <PageHeader
        title="Team Workspace"
        subtitle="Manage your assignments and track your time."
        icon={CheckSquare}
      />

      <div className={theme.layout.panelContainer}>
        {/* Module Nav */}
        <div className="flex-shrink-0 border-b border-slate-200 bg-white z-10 px-4">
          <nav className="flex space-x-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors focus:outline-none ${
                activeTab === 'tasks' 
                  ? 'border-nexus-600 text-nexus-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <ListTodo size={16} />
              My Tasks
            </button>
            <button
              onClick={() => setActiveTab('timesheet')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors focus:outline-none ${
                activeTab === 'timesheet' 
                  ? 'border-nexus-600 text-nexus-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Clock size={16} />
              Timesheet
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6 bg-slate-50/30">
          {activeTab === 'tasks' ? <MyTasks /> : <Timesheet />}
        </div>
      </div>
    </div>
  );
};

export default TeamWorkspace;
