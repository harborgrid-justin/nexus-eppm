
import React, { useMemo, useState } from 'react';
import { Issue } from '../types/index';
import { Plus, Filter, FileWarning, ArrowUp, ArrowDown, ChevronsUp, Lock, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { usePermissions } from '../hooks/usePermissions';
import { SidePanel } from './ui/SidePanel';
import { useData } from '../context/DataContext';
import { generateId } from '../utils/formatters';
import { EmptyGrid } from './common/EmptyGrid';

const IssueLog: React.FC = () => {
  const { project, issues } = useProjectWorkspace();
  const theme = useTheme();
  const { canEditProject } = usePermissions();
  const { dispatch } = useData();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const taskMap = useMemo(() => {
    return new Map(project?.tasks.map(t => [t.id, t.name]));
  }, [project?.tasks]);

  const filteredIssues = useMemo(() => {
    const list = issues || [];
    return list.filter(i => i.description.toLowerCase().includes(search.toLowerCase()));
  }, [issues, search]);

  const handleSaveIssue = (newIssue: Partial<Issue>) => {
    if (!newIssue.description) {
        alert('Description is required.');
        return;
    }
    const issueToSave: Issue = {
        id: generateId('ISS'),
        projectId: project.id,
        dateIdentified: new Date().toISOString().split('T')[0],
        ...newIssue
    } as Issue;
    dispatch({ type: 'ADD_ISSUE', payload: issueToSave });
    setIsPanelOpen(false);
  };

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
            <FileWarning className="text-yellow-500"/> Project Impediment Log
          </h1>
          <p className={theme.typography.small}>Track and resolve active constraints impacting project delivery.</p>
        </div>
        {canEditProject() ? (
            <Button variant="primary" size="md" icon={Plus} className="hidden md:flex" onClick={() => setIsPanelOpen(true)}>Add Issue</Button>
        ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
               <Lock size={14}/> Read Only
            </div>
        )}
      </div>
      
      <div className={theme.layout.panelContainer}>
        <div className={`p-4 ${theme.layout.headerBorder} flex flex-col md:flex-row justify-between items-center ${theme.colors.background}/50 flex-shrink-0 gap-3`}>
           <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
              <Input isSearch placeholder="Filter registry..." className="w-full md:w-64" value={search} onChange={e => setSearch(e.target.value)} />
              <Button variant="secondary" size="md" icon={Filter} className="w-full md:w-auto">Category</Button>
           </div>
           {canEditProject() && <Button variant="primary" size="md" icon={Plus} className="md:hidden w-full" onClick={() => setIsPanelOpen(true)}>Add Issue</Button>}
        </div>
        
        <div className="flex-1 overflow-auto bg-white">
           {filteredIssues.length > 0 ? (
               <div className="min-w-[800px] animate-nexus-in">
                   <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                      <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm`}>
                         <tr>
                            <th className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b">ID Ref</th>
                            <th className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b">Priority</th>
                            <th className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b">Narrative Description</th>
                            <th className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b">Step</th>
                            <th className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b">Assigned To</th>
                            <th className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b">Activity Link</th>
                         </tr>
                      </thead>
                      <tbody className={`divide-y divide-slate-50`}>
                         {filteredIssues.map(issue => (
                           <tr key={issue.id} className="nexus-table-row group cursor-pointer border-b border-slate-50">
                              <td className="px-6 py-4 whitespace-nowrap text-xs font-mono font-bold text-slate-400 group-hover:text-nexus-600 transition-colors">{issue.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {getPriorityBadge(issue.priority)}
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-slate-800 max-w-md truncate">{issue.description}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-black uppercase text-slate-600 border border-slate-200">{issue.status}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{issue.assigneeId}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 truncate max-w-xs" title={taskMap.get(issue.activityId || '')}>
                                <span className="font-mono bg-slate-50 px-2 py-0.5 rounded text-xs mr-2 border border-slate-200">{project?.tasks.find(t=>t.id===issue.activityId)?.wbsCode || '---'}</span> 
                                {taskMap.get(issue.activityId || '')}
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
               </div>
           ) : (
               <EmptyGrid 
                    title="Clear Impediment Log"
                    description={search ? `No impediments identified matching "${search}".` : "This project currently has zero unresolved issues. All delivery constraints are managed."}
                    onAdd={canEditProject() ? () => setIsPanelOpen(true) : undefined}
                    actionLabel="Log Impediment"
                    icon={FileWarning}
               />
           )}
        </div>
      </div>

      <IssueForm isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} onSave={handleSaveIssue} />
    </div>
  );
};

interface IssueFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (issue: Partial<Issue>) => void;
}

const IssueForm: React.FC<IssueFormProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Issue>>({
        priority: 'Medium',
        status: 'Open',
        description: '',
        assigneeId: ''
    });

    const handleSave = () => onSave(formData);

    return (
        <SidePanel isOpen={isOpen} onClose={onClose} title="Log New Project Issue" footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSave}>Log Issue</Button></>}>
            <div className="space-y-4">
                <Input label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the problem..." />
                <div className="grid grid-cols-2 gap-4">
                     <Input label="Assignee ID" value={formData.assigneeId} onChange={e => setFormData({...formData, assigneeId: e.target.value})} placeholder="e.g. R-001" />
                     <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Priority</label>
                         <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as Issue['priority']})} className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none">
                             <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                         </select>
                     </div>
                </div>
            </div>
        </SidePanel>
    );
};

export default IssueLog;
