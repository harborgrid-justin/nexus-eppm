import React, { useMemo, useState } from 'react';
import { Task, Project, TaskStatus } from '../types/index';
import { ShieldAlert, FileText, Calendar, Database, ListChecks, Book, MessageSquare, Plus } from 'lucide-react';
import { Button } from './ui/Button';
import { useTaskForm } from '../hooks/useTaskForm';
import { useData } from '../context/DataContext';
import { checkOpenRFIsForTask } from '../utils/integrationUtils';
import { usePermissions } from '../hooks/usePermissions';
import { SidePanel } from './ui/SidePanel';
import { TaskGeneralTab } from './tasks/detail/TaskGeneralTab';
import { TaskScheduleTab } from './tasks/detail/TaskScheduleTab';
import { TaskAdvancedTab } from './tasks/detail/TaskAdvancedTab';
import { TaskStepsTab } from './tasks/detail/TaskStepsTab';
import { checkMaterialAvailability } from '../utils/integrations/resource';
import { FieldPlaceholder } from './common/FieldPlaceholder';

interface TaskDetailModalProps {
  task: Task;
  project: Project;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, project, onClose }) => {
  const { state, dispatch } = useData();
  const { canEditProject } = usePermissions();
  const isReadOnly = !canEditProject();
  const [activeTab, setActiveTab] = useState<'general' | 'schedule' | 'steps' | 'notebook' | 'advanced'>('general');

  const {
    localTask, updateField, handleStatusChange, saveChanges, applicableCodes, 
    linkedIssues, linkedExpenses, linkedRisks, canComplete, blockingNCRs
  } = useTaskForm(task, project, onClose);

  const taskUdfs = useMemo(() => state.userDefinedFields.filter(udf => udf.subjectArea === 'Tasks'), [state.userDefinedFields]);
  const materialCheck = checkMaterialAvailability(localTask, state.purchaseOrders);
  const rfiCheck = checkOpenRFIsForTask(localTask.id, state.communicationLogs);

  // P6 Parity: Notebook logic
  const handleAddNotebookEntry = () => {
    const topic = prompt("Enter Notebook Topic (e.g. Constraint Description, Delay Log):");
    if (!topic) return;
    const entries = [...(localTask.notebooks || []), { id: Date.now().toString(), topic, content: '' }];
    updateField('notebooks', entries);
  };

  return (
    <SidePanel isOpen={true} onClose={onClose} width="max-w-4xl"
       title={
         <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">WBS: {localTask.wbsCode}</span>
            <div className="flex items-center gap-3">
                <span className="text-xl font-black text-slate-900 uppercase tracking-tighter">{localTask.name}</span>
                {!canComplete && <span className="text-[10px] font-black text-red-700 flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded border border-red-200 uppercase tracking-widest"><ShieldAlert size={12}/> QC Block</span>}
            </div>
         </div>
       }
       footer={<><Button variant="secondary" onClick={onClose}>{isReadOnly ? 'Close' : 'Cancel'}</Button>{!isReadOnly && <Button variant="primary" onClick={saveChanges}>Commit Changes</Button>}</>}
    >
       <div className="space-y-6">
          <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide" role="tablist">
              {[ 
                  { id: 'general', label: 'General', icon: FileText }, 
                  { id: 'schedule', label: 'Schedule', icon: Calendar }, 
                  { id: 'steps', label: 'Activity Steps', icon: ListChecks },
                  { id: 'notebook', label: 'Notebook', icon: Book },
                  { id: 'advanced', label: 'Metadata', icon: Database } 
              ].map((tab) => (
                  <button 
                    key={tab.id} 
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`py-3 px-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 focus:outline-none whitespace-nowrap rounded-t-lg ${activeTab === tab.id ? 'border-nexus-600 text-nexus-700 bg-nexus-50/30 shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                  >
                      <tab.icon size={14}/> {tab.label}
                  </button>
              ))}
          </div>

          <div className="pt-2 min-h-[400px]" role="tabpanel">
             {activeTab === 'general' && (
                 <TaskGeneralTab 
                    task={localTask} isReadOnly={isReadOnly} canComplete={canComplete} rfiCheck={rfiCheck} 
                    materialCheck={materialCheck} blockingNCRs={blockingNCRs} onUpdate={updateField} onStatusChange={handleStatusChange} 
                 />
             )}
             {activeTab === 'schedule' && (
                 <TaskScheduleTab task={localTask} project={project} isReadOnly={isReadOnly} onUpdate={updateField} />
             )}
             {activeTab === 'steps' && (
                 <TaskStepsTab task={localTask} isReadOnly={isReadOnly} onUpdate={updateField} />
             )}
             {activeTab === 'notebook' && (
                 <div className="space-y-6 animate-nexus-in">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Activity Notebook Entries</h3>
                        {!isReadOnly && <Button size="sm" variant="ghost" icon={Plus} onClick={handleAddNotebookEntry}>Add Topic</Button>}
                    </div>
                    {localTask.notebooks && localTask.notebooks.length > 0 ? (
                        <div className="space-y-4">
                            {localTask.notebooks.map((entry, idx) => (
                                <div key={entry.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm group hover:border-nexus-300 transition-all">
                                    <h4 className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tight">{entry.topic}</h4>
                                    <textarea 
                                        className="w-full h-32 p-3 bg-slate-50 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-nexus-500 outline-none resize-none border border-transparent transition-all"
                                        value={entry.content}
                                        disabled={isReadOnly}
                                        onChange={e => {
                                            const newNb = [...localTask.notebooks!];
                                            newNb[idx] = { ...newNb[idx], content: e.target.value };
                                            updateField('notebooks', newNb);
                                        }}
                                        placeholder="Record narrative history or constraints..."
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <FieldPlaceholder 
                            label="No Notebook Topics Defined" 
                            onAdd={isReadOnly ? undefined : handleAddNotebookEntry} 
                            icon={Book}
                        />
                    )}
                 </div>
             )}
             {activeTab === 'advanced' && (
                 <TaskAdvancedTab 
                    task={localTask} isReadOnly={isReadOnly} udfs={taskUdfs} codes={applicableCodes}
                    linkedIssues={linkedIssues} linkedRisks={linkedRisks} linkedExpenses={linkedExpenses} onUpdate={updateField}
                 />
             )}
          </div>
       </div>
    </SidePanel>
  );
};

export default TaskDetailModal;