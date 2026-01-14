import React, { useMemo, useState, useDeferredValue } from 'react';
import { Issue, Column } from '../types/index';
import { Plus, FileWarning, Lock, Search, Edit2, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
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
  const { t } = useI18n();
  const { canEditProject } = usePermissions();
  const { dispatch, state } = useData();
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Partial<Issue> | null>(null);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const filteredIssues = useMemo(() => {
    const list = issues || [];
    return list.filter(i => 
        i.description.toLowerCase().includes(deferredSearch.toLowerCase()) || 
        i.id.toLowerCase().includes(deferredSearch.toLowerCase())
    );
  }, [issues, deferredSearch]);

  const handleOpenPanel = (issue?: Issue) => {
      setEditingIssue(issue || { priority: 'Medium', status: 'Open', description: '' });
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
            assigneeId: 'Unassigned'
        };
        dispatch({ type: 'ADD_ISSUE', payload: newIssue });
    }
    setIsPanelOpen(false);
  };

  const columns: Column<Issue>[] = useMemo(() => [
      { key: 'id', header: t('issue.id', 'ID Ref'), width: 'w-24', render: (i) => <span className={`font-mono text-xs font-bold ${theme.colors.text.tertiary}`}>{i.id}</span> },
      { key: 'priority', header: t('common.priority', 'Priority'), width: 'w-32', render: (i) => (
          <Badge variant={i.priority === 'Critical' ? 'danger' : i.priority === 'High' ? 'warning' : 'info'}>{i.priority}</Badge>
      )},
      { key: 'description', header: t('issue.desc', 'Narrative Description'), render: (i) => <span className={`font-bold ${theme.colors.text.primary}`}>{i.description}</span> },
      { key: 'status', header: t('common.status', 'Status'), width: 'w-32', render: (i) => <Badge variant={i.status === 'Open' ? 'warning' : 'success'}>{i.status}</Badge> },
      { key: 'actions', header: '', width: 'w-24', align: 'right', render: (i) => (
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {canEditProject() && (
                  <button onClick={(e) => { e.stopPropagation(); handleOpenPanel(i); }} className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-nexus-600"><Edit2 size={14}/></button>
              )}
          </div>
      )}
  ], [theme, t, canEditProject]);

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding} ${theme.colors.background}`}>
      <PageHeader 
        title={t('issue.title', 'Project Impediment Log')} 
        subtitle={t('issue.subtitle', 'Track and resolve active constraints impacting project delivery.')}
        icon={FileWarning}
        actions={canEditProject() ? (
            <Button variant="primary" size="md" icon={Plus} onClick={() => handleOpenPanel()}>{t('issue.add', 'Add Issue')}</Button>
        ) : (
            <Badge variant="neutral" icon={Lock}>{t('common.locked', 'Registry Locked')}</Badge>
        )}
      />
      
      <div className={`mt-6 flex-1 flex flex-col border ${theme.colors.border} rounded-xl overflow-hidden bg-white shadow-sm`}>
        <div className={`p-4 border-b ${theme.colors.border} flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-3`}>
            <Input isSearch placeholder={t('common.filter', 'Filter registry...')} value={search} onChange={e => setSearch(e.target.value)} className="w-full md:w-72" />
        </div>
        
        <div className="flex-1 overflow-hidden">
           {filteredIssues.length > 0 ? (
               <DataTable data={filteredIssues} columns={columns} keyField="id" onRowClick={(i) => canEditProject() && handleOpenPanel(i)} />
           ) : (
               <EmptyGrid 
                    title={t('issue.empty', 'Clear Impediment Log')}
                    description={t('issue.empty_desc', 'This project currently has zero unresolved issues.')}
                    onAdd={canEditProject() ? () => handleOpenPanel() : undefined}
                    actionLabel={t('issue.log_action', 'Log Impediment')}
                    icon={FileWarning}
               />
           )}
        </div>
      </div>

      <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} title={editingIssue?.id ? t('issue.edit', 'Edit Issue') : t('issue.new', 'Log New Issue')}
            footer={<><Button variant="secondary" onClick={() => setIsPanelOpen(false)}>{t('common.cancel', 'Cancel')}</Button><Button onClick={() => handleSaveIssue(editingIssue!)} icon={Save}>{t('common.save', 'Save')}</Button></>}>
            <div className="space-y-6">
                <div>
                    <label className={`${theme.typography.label} mb-1 block`}>{t('issue.desc', 'Description')}</label>
                    <textarea className={`w-full p-3 border ${theme.colors.border} rounded-lg text-sm h-32 outline-none resize-none`} value={editingIssue?.description || ''} onChange={e => setEditingIssue({...editingIssue!, description: e.target.value})} />
                </div>
            </div>
      </SidePanel>
    </div>
  );
};
export default IssueLog;