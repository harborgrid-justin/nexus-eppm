
import React, { useMemo, useState, useDeferredValue } from 'react';
// Corrected import path for Column from types instead of DataTable
import { Issue, Column } from '../types/index';
import { Plus, Filter, FileWarning, ArrowUp, ArrowDown, ChevronsUp, Lock, Search, Edit2, Trash2, Save, AlertCircle } from 'lucide-react';
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
import DataTable from './common/DataTable';

const IssueLog: React.FC = () => {
  const { project, issues } = useProjectWorkspace();
  const theme = useTheme();
  const { canEditProject } = usePermissions();
  const { dispatch, state } = useData();
  
  // State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Partial<Issue> | null>(null);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [statusFilter, setStatusFilter] = useState('All');

  // Logic
  const taskMap = useMemo(() => {
    return new Map(project?.tasks.map(t => [t.id, t.name]));
  }, [project?.tasks]);

  const filteredIssues = useMemo(() => {
    const list = issues || [];
    return list.filter(i => {
        const matchesSearch = i.description.toLowerCase().includes(deferredSearch.toLowerCase()) || 
                              i.id.toLowerCase().includes(deferredSearch.toLowerCase());
        const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
  }, [issues, deferredSearch, statusFilter]);

  const handleOpenPanel = (issue?: Issue) => {
      setEditingIssue(issue || {
          priority: 'Medium',
          status: 'Open',
          description: '',
          assigneeId: '',
          activityId: ''
      });
      setIsPanelOpen(true);
  };

  const handleSaveIssue = (issueData: Partial<Issue>) => {
    if (!issueData.description) {
        alert('Description is required.');
        return;
    }
    
    if (issueData.id) {
        // Update
        dispatch({ type: 'UPDATE_ISSUE', payload: issueData as Issue });
    } else {
        // Create
        const newIssue: Issue = {
            id: generateId('ISS'),
            projectId: project.id,
            dateIdentified: new Date().toISOString().split('T')[0],
            priority: issueData.priority || 'Medium',
            status: issueData.status || 'Open',
            description: issueData.description || '',
            assigneeId: issueData.assigneeId || 'Unassigned',
            activityId: issueData.activityId
        };
        dispatch({ type: 'ADD_ISSUE', payload: newIssue });
    }
    setIsPanelOpen(false);
  };

  // Fixed: passing id as string string directly to dispatch to match payload type in actions
  const handleDeleteIssue = (id: string) => {
      if (confirm("Are you sure you want to delete this issue?")) {
          dispatch({ type: 'DELETE_ISSUE', payload: id });
      }
  };

  const getPriorityBadge = (priority: Issue['priority']) => {
    switch (priority) {
      case 'Critical': return <Badge variant="danger" icon={AlertCircle}>Critical</Badge>;
      case 'High': return <Badge variant="warning" icon={ChevronsUp}>High</Badge>;
      case 'Medium': return <Badge variant="info" icon={ArrowUp}>Medium</Badge>;
      case 'Low': return <Badge variant="neutral" icon={ArrowDown}>Low</Badge>;
      default: return <Badge variant="neutral">{priority}</Badge>;
    }
  };

  const columns: Column<Issue>[] = useMemo(() => [
      { key: 'id', header: 'ID Ref', width: 'w-24', render: (i) => <span className={`font-mono text-xs font-bold ${theme.colors.text.tertiary}`}>{i.id}</span>, sortable: true },
      { key: 'priority', header: 'Priority', width: 'w-32', render: (i) => getPriorityBadge(i.priority), sortable: true },
      { key: 'description', header: 'Narrative Description', render: (i) => <span className={`font-bold ${theme.colors.text.primary}`}>{i.description}</span>, sortable: true },
      { key: 'status', header: 'Status', width: 'w-32', render: (i) => <Badge variant={i.status === 'Open' ? 'warning' : i.status === 'Closed' ? 'success' : 'neutral'}>{i.status}</Badge>, sortable: true },
      { key: 'assigneeId', header: 'Assigned To', width: 'w-48', render: (i) => {
          const name = state.resources.find(r => r.id === i.assigneeId)?.name || i.assigneeId;
          return <span className={theme.colors.text.secondary}>{name}</span>;
      }},
      { key: 'activityId', header: 'Activity Link', render: (i) => i.activityId ? (
          <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-600 truncate max-w-[150px] inline-block" title={taskMap.get(i.activityId)}>
              {project.tasks.find(t => t.id === i.activityId)?.wbsCode || ''} {taskMap.get(i.activityId)}
          </span>
      ) : <span className="text-slate-400 text-xs">-</span>},
      { key: 'id', header: 'Actions', width: 'w-24', align: 'right', render: (i) => (
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {canEditProject() && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); handleOpenPanel(i); }} className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-nexus-600"><Edit2 size={14}/></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteIssue(i.id); }} className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600"><Trash2 size={14}/></button>
                  </>
              )}
          </div>
      )}
  ], [theme, taskMap, project.tasks, state.resources]);

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <div className="flex justify-between items-start flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${theme.colors.border} ${theme.colors.surface} shadow-sm text-nexus-600`}>
             <FileWarning size={20} />
          </div>
          <div>
             <h1 className={theme.typography.h2}>Project Impediment Log</h1>
             <p className={theme.typography.small}>Track and resolve active constraints impacting project delivery.</p>
          </div>
        </div>
        {canEditProject() ? (
            <Button variant="primary" size="md" icon={Plus} onClick={() => handleOpenPanel()}>Add Issue</Button>
        ) : (
            <div className={`flex items-center gap-2 text-xs ${theme.colors.text.tertiary} ${theme.colors.background} px-3 py-2 rounded-lg border ${theme.colors.border}`}>
               <Lock size={14}/> Read Only
            </div>
        )}
      </div>
      
      <div className={theme.layout.panelContainer}>
        <div className={`p-4 ${theme.layout.headerBorder} flex flex-col md:flex-row justify-between items-center ${theme.colors.background}/50 flex-shrink-0 gap-3`}>
           <div className="flex flex-col md:flex-row justify-between items-center gap-2 w-full md:w-auto flex-1">
              <div className="relative w-full md:w-72">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                  <Input 
                    isSearch 
                    placeholder="Filter registry..." 
                    className="pl-9" 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                  />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                 <Filter size={14} className="text-slate-400 ml-2 hidden md:block"/>
                 <select 
                    className={`h-10 px-3 py-2 border ${theme.colors.border} rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none cursor-pointer w-full md:w-40`}
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                 >
                    <option value="All">All Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                 </select>
              </div>
           </div>
        </div>
        
        <div className="flex-1 overflow-hidden p-0 bg-white">
           {filteredIssues.length > 0 ? (
               <DataTable 
                  data={filteredIssues}
                  columns={columns}
                  keyField="id"
                  onRowClick={(i) => canEditProject() && handleOpenPanel(i)}
                  emptyMessage="No issues found."
               />
           ) : (
               <div className="h-full flex items-center justify-center p-8">
                   <EmptyGrid 
                        title="Clear Impediment Log"
                        description={search ? `No impediments identified matching "${search}".` : "This project currently has zero unresolved issues. All delivery constraints are managed."}
                        onAdd={canEditProject() ? () => handleOpenPanel() : undefined}
                        actionLabel="Log Impediment"
                        icon={FileWarning}
                   />
               </div>
           )}
        </div>
      </div>

      <IssueForm 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
        onSave={handleSaveIssue} 
        issue={editingIssue}
        resources={state.resources}
        tasks={project.tasks}
      />
    </div>
  );
};

interface IssueFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (issue: Partial<Issue>) => void;
    issue: Partial<Issue> | null;
    resources: any[];
    tasks: any[];
}

const IssueForm: React.FC<IssueFormProps> = ({ isOpen, onClose, onSave, issue, resources, tasks }) => {
    const [formData, setFormData] = useState<Partial<Issue>>({});
    const theme = useTheme();

    // Reset form when opening
    React.useEffect(() => {
        if (isOpen && issue) {
            setFormData(issue);
        }
    }, [isOpen, issue]);

    const handleSave = () => onSave(formData);

    return (
        <SidePanel 
            isOpen={isOpen} 
            onClose={onClose} 
            title={formData.id ? `Edit Issue: ${formData.id}` : "Log New Project Issue"} 
            width="md:w-[500px]"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} icon={Save}>Save Issue</Button>
                </>
            }
        >
            <div className="space-y-6">
                <div>
                    <label className={`${theme.typography.label} block mb-1`}>Narrative Description <span className="text-red-500">*</span></label>
                    <textarea 
                        className={`w-full p-3 border ${theme.colors.border} rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none resize-none`}
                        value={formData.description || ''} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                        placeholder="Describe the problem, impact, and required resolution..." 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                         <label className={`${theme.typography.label} block mb-1`}>Priority</label>
                         <select 
                            value={formData.priority} 
                            onChange={e => setFormData({...formData, priority: e.target.value as any})} 
                            className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none`}
                         >
                             <option>Low</option>
                             <option>Medium</option>
                             <option>High</option>
                             <option>Critical</option>
                         </select>
                     </div>
                     <div>
                         <label className={`${theme.typography.label} block mb-1`}>Status</label>
                         <select 
                            value={formData.status} 
                            onChange={e => setFormData({...formData, status: e.target.value})} 
                            className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none`}
                         >
                             <option>Open</option>
                             <option>In Progress</option>
                             <option>On Hold</option>
                             <option>Closed</option>
                         </select>
                     </div>
                </div>

                <div>
                     <label className={`${theme.typography.label} block mb-1`}>Assignee</label>
                     <select 
                        value={formData.assigneeId || ''} 
                        onChange={e => setFormData({...formData, assigneeId: e.target.value})} 
                        className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none`}
                     >
                         <option value="">Unassigned</option>
                         {resources.map((r: any) => <option key={r.id} value={r.id}>{r.name} ({r.role})</option>)}
                     </select>
                </div>

                <div>
                     <label className={`${theme.typography.label} block mb-1`}>Linked Activity</label>
                     <select 
                        value={formData.activityId || ''} 
                        onChange={e => setFormData({...formData, activityId: e.target.value})} 
                        className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none`}
                     >
                         <option value="">None</option>
                         {tasks.map((t: any) => <option key={t.id} value={t.id}>{t.wbsCode} - {t.name}</option>)}
                     </select>
                </div>
            </div>
        </SidePanel>
  );
};

export default IssueLog;
