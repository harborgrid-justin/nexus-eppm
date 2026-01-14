
import React, { useMemo, useState, useDeferredValue } from 'react';
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
import { PageHeader } from './common/PageHeader';

const IssueLog: React.FC = () => {
  const { project, issues } = useProjectWorkspace();
  const theme = useTheme();
  const { canEditProject } = usePermissions();
  const { dispatch, state } = useData();
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Partial<Issue> | null>(null);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [statusFilter, setStatusFilter] = useState('All');

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
    if (!issueData.description) return;
    
    if (issueData.id) {
        dispatch({ type: 'UPDATE_ISSUE', payload: issueData as Issue });
    } else {
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

  const handleDeleteIssue = (id: string) => {
      if (confirm("Permanently delete this impediment record?")) {
          dispatch({ type: 'DELETE_ISSUE', payload: id });
      }
  };

  const columns: Column<Issue>[] = useMemo(() => [
      { key: 'id', header: 'ID Ref', width: 'w-24', render: (i) => <span className={`font-mono text-xs font-bold ${theme.colors.text.tertiary}`}>{i.id}</span>, sortable: true },
      { key: 'priority', header: 'Priority', width: 'w-32', render: (i) => (
          <Badge variant={i.priority === 'Critical' ? 'danger' : i.priority === 'High' ? 'warning' : 'info'}>{i.priority}</Badge>
      ), sortable: true },
      { key: 'description', header: 'Narrative Description', render: (i) => <span className={`font-bold ${theme.colors.text.primary}`}>{i.description}</span>, sortable: true },
      { key: 'status', header: 'Status', width: 'w-32', render: (i) => <Badge variant={i.status === 'Open' ? 'warning' : 'success'}>{i.status}</Badge>, sortable: true },
      { key: 'assigneeId', header: 'Assigned To', width: 'w-48', render: (i) => {
          const name = state.resources.find(r => r.id === i.assigneeId)?.name || i.assigneeId;
          return <span className={theme.colors.text.secondary}>{name}</span>;
      }},
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
  ], [theme, state.resources, canEditProject]);

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
      <PageHeader 
        title="Project Impediment Log" 
        subtitle="Track and resolve active constraints impacting project delivery."
        icon={FileWarning}
        actions={canEditProject() ? (
            <Button variant="primary" size="md" icon={Plus} onClick={() => handleOpenPanel()}>Add Issue</Button>
        ) : (
            <div className={`flex items-center gap-2 text-xs font-black uppercase ${theme.colors.text.tertiary} ${theme.colors.background} px-3 py-2 rounded-lg border ${theme.colors.border}`}>
               <Lock size={14}/> Registry Locked
            </div>
        )}
      />
      
      <div className={theme.layout.panelContainer}>
        <div className={`p-4 ${theme.layout.headerBorder} flex flex-col md:flex-row justify-between items-center bg-slate-50/50 flex-shrink-0 gap-3`}>
            <div className="relative w-full md:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <Input isSearch placeholder="Filter registry..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
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
               <EmptyGrid 
                    title="Clear Impediment Log"
                    description={search ? `No impediments match "${search}".` : "This project currently has zero unresolved issues. All delivery constraints are managed."}
                    onAdd={canEditProject() ? () => handleOpenPanel() : undefined}
                    actionLabel="Log Impediment"
                    icon={FileWarning}
               />
           )}
        </div>
      </div>

      <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} title={editingIssue?.id ? `Edit Issue: ${editingIssue.id}` : "Log New Project Issue"}
            footer={<><Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button><Button onClick={() => handleSaveIssue(editingIssue!)} icon={Save}>Save Issue</Button></>}>
            <div className="space-y-6">
                <div>
                    <label className={`${theme.typography.label} block mb-1`}>Narrative Description <span className="text-red-500">*</span></label>
                    <textarea className={`w-full p-3 border ${theme.colors.border} rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none resize-none`} value={editingIssue?.description || ''} onChange={e => setEditingIssue({...editingIssue!, description: e.target.value})} placeholder="Describe the problem..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                         <label className={`${theme.typography.label} block mb-1`}>Priority</label>
                         <select value={editingIssue?.priority} onChange={e => setEditingIssue({...editingIssue!, priority: e.target.value as any})} className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none`}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
                     </div>
                     <div>
                         <label className={`${theme.typography.label} block mb-1`}>Status</label>
                         <select value={editingIssue?.status} onChange={e => setEditingIssue({...editingIssue!, status: e.target.value})} className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none`}><option>Open</option><option>In Progress</option><option>On Hold</option><option>Closed</option></select>
                     </div>
                </div>
                <div>
                     <label className={`${theme.typography.label} block mb-1`}>Assignee</label>
                     <select value={editingIssue?.assigneeId || ''} onChange={e => setEditingIssue({...editingIssue!, assigneeId: e.target.value})} className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none`}>
                         <option value="">Unassigned</option>
                         {state.resources.map(r => <option key={r.id} value={r.id}>{r.name} ({r.role})</option>)}
                     </select>
                </div>
            </div>
      </SidePanel>
    </div>
  );
};

export default IssueLog;
