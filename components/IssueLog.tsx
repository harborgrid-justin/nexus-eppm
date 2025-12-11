import React, { useMemo } from 'react';
import { Issue } from '../types';
import { Plus, Filter, FileWarning, ArrowUp, ArrowDown, ChevronsUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useProjectState } from '../hooks';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface IssueLogProps {
  projectId: string;
}

const IssueLog: React.FC<IssueLogProps> = ({ projectId }) => {
  const { project, issues } = useProjectState(projectId);
  const theme = useTheme();
  const taskMap = useMemo(() => {
    return new Map(project?.tasks.map(t => [t.id, t.name]));
  }, [project?.tasks]);

  const getPriorityBadge = (priority: Issue['priority']) => {
    switch (priority) {
      case 'High': return <Badge variant="danger" icon={ChevronsUp}>High</Badge>;
      case 'Medium': return <Badge variant="warning" icon={ArrowUp}>Medium</Badge>;
      case 'Low': return <Badge variant="info" icon={ArrowDown}>Low</Badge>;
      default: return <Badge variant="neutral">{priority}</Badge>;
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
        <Button variant="primary" size="md" icon={Plus}>Add Issue</Button>
      </div>
      
      <div className={theme.layout.panelContainer}>
        <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center ${theme.colors.background}/50 flex-shrink-0`}>
           <div className="flex items-center gap-2">
              <Input isSearch placeholder="Search issues..." className="w-64" />
              <Button variant="secondary" size="md" icon={Filter}>Filter</Button>
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
                 {(issues || []).map(issue => (
                   <tr key={issue.id} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{issue.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getPriorityBadge(issue.priority)}
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