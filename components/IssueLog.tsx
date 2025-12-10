import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Issue } from '../types';
import { Plus, Filter, Search, FileWarning, ArrowUp, ArrowDown, ChevronsUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useProjectState } from '../hooks';

interface IssueLogProps {
  projectId: string;
}

const IssueLog: React.FC<IssueLogProps> = ({ projectId }) => {
  // FIX: The useProjectState hook was updated to return 'issues'.
  const { project, issues } = useProjectState(projectId);
  const theme = useTheme();
  const taskMap = useMemo(() => {
    return new Map(project?.tasks.map(t => [t.id, t.name]));
  }, [project?.tasks]);

  const getPriorityIcon = (priority: Issue['priority']) => {
    switch (priority) {
      case 'High': return <ChevronsUp size={16} className="text-red-500" />;
      case 'Medium': return <ArrowUp size={16} className="text-yellow-500" />;
      case 'Low': return <ArrowDown size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
      <div className={theme.layout.header}>
        <div>
          <h1 className={theme.typography.h1}>
            <FileWarning className="text-yellow-500"/> Issue Log
          </h1>
          <p className={theme.typography.small}>Track and resolve project impediments and action items.</p>
        </div>
        <button className={`px-3 py-2 ${theme.colors.accentBg} text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium`}>
             <Plus size={16} /> Add Issue
        </button>
      </div>
      
      <div className={theme.layout.panelContainer}>
        <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center ${theme.colors.background}/50 flex-shrink-0`}>
           <div className="flex items-center gap-2">
              <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search issues..." className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-nexus-500" />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm text-slate-600 hover:bg-slate-50">
                  <Filter size={14} /> Filter
              </button>
           </div>
        </div>
        
        <div className="flex-1 overflow-auto">
           <table className="min-w-full divide-y divide-slate-200">
              <thead className={`${theme.colors.background} sticky top-0`}>
                 <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Activity</th>
                 </tr>
              </thead>
              <tbody className={`${theme.colors.surface} divide-y divide-slate-100`}>
                 {issues.map(issue => (
                   <tr key={issue.id} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{issue.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="flex items-center gap-2 font-medium">
                          {getPriorityIcon(issue.priority)} {issue.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 max-w-md truncate">{issue.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{issue.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{issue.assignedTo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 truncate max-w-xs" title={taskMap.get(issue.activityId || '')}>
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs mr-2">{project?.tasks.find(t=>t.id===issue.activityId)?.wbsCode}</span> 
                        {taskMap.get(issue.activityId || '')}
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default IssueLog;