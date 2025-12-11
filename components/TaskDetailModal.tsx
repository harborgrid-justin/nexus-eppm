
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Task, Project, TaskType, ConstraintType, Dependency, EffortType, DependencyType, TaskStatus } from '../types';
import { useData } from '../context/DataContext';
import { X, Calendar, Link, Trash2, Clock, BrainCircuit, Tag, FileWarning, Receipt, ShieldAlert, AlertTriangle } from 'lucide-react';
import { canCompleteTask } from '../utils/integrationUtils';
import { Button } from './ui/Button';

interface TaskDetailModalProps {
  task: Task;
  project: Project;
  onClose: () => void;
}

// --- Custom Hook for Form Logic ---
const useTaskForm = (task: Task, project: Project, onClose: () => void) => {
  const { state, dispatch, getActivityCodesForProject } = useData();
  const [localTask, setLocalTask] = useState<Task>(JSON.parse(JSON.stringify(task))); // Deep clone for local edits

  const applicableCodes = useMemo(() => 
    getActivityCodesForProject(project.id), 
  [getActivityCodesForProject, project.id]);

  const linkedIssues = useMemo(() => 
    localTask.issueIds ? state.issues.filter(i => localTask.issueIds?.includes(i.id)) : [], 
  [state.issues, localTask.issueIds]);

  const linkedExpenses = useMemo(() => 
    localTask.expenseIds ? state.expenses.filter(e => localTask.expenseIds?.includes(e.id)) : [], 
  [state.expenses, localTask.expenseIds]);

  const projectNCRs = useMemo(() => 
    state.nonConformanceReports.filter(n => n.projectId === project.id), 
  [state.nonConformanceReports, project.id]);

  const { canComplete, blockingNCRs } = useMemo(() => 
    canCompleteTask(localTask.id, projectNCRs), 
  [localTask.id, projectNCRs]);

  const linkedRisks = useMemo(() => 
    state.risks.filter(r => r.linkedTaskId === localTask.id), 
  [state.risks, localTask.id]);

  const updateField = <K extends keyof Task>(key: K, value: Task[K]) => {
    setLocalTask(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus === TaskStatus.COMPLETED && !canComplete) {
        alert(`Cannot complete task. There are ${blockingNCRs.length} blocking Non-Conformance Reports.`);
        return;
    }
    updateField('status', newStatus);
    if (newStatus === TaskStatus.COMPLETED) {
        updateField('progress', 100);
    }
  };

  const saveChanges = () => {
    dispatch({ type: 'UPDATE_TASK', payload: { projectId: project.id, task: localTask } });
    onClose();
  };

  return {
    localTask,
    updateField,
    handleStatusChange,
    saveChanges,
    applicableCodes,
    linkedIssues,
    linkedExpenses,
    linkedRisks,
    canComplete,
    blockingNCRs,
    state // Expose state for categories lookup
  };
};

// --- Component ---

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, project, onClose }) => {
  const {
    localTask, updateField, handleStatusChange, saveChanges,
    applicableCodes, linkedIssues, linkedExpenses, linkedRisks, canComplete, blockingNCRs, state
  } = useTaskForm(task, project, onClose);

  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap for accessibility
  useEffect(() => {
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
       <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
             <div>
                <label htmlFor="task-name" className="sr-only">Task Name</label>
                <input
                  id="task-name"
                  type="text"
                  value={localTask.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="text-2xl font-bold text-slate-900 bg-transparent -ml-2 px-2 py-1 rounded-lg border border-transparent hover:border-slate-300 focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 w-full"
                />
                <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-600">{localTask.wbsCode}</span>
                    {!canComplete && (
                        <span className="text-xs font-bold text-red-600 flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            <ShieldAlert size={12} aria-hidden="true" /> Quality Gate Locked
                        </span>
                    )}
                </div>
             </div>
             <button onClick={onClose} aria-label="Close Modal" className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full border border-slate-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-nexus-500">
                <X size={20} />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
             {/* Quality Gate Warning */}
             {!canComplete && (
                 <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3" role="alert">
                     <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={20} aria-hidden="true" />
                     <div>
                         <h4 className="text-sm font-bold text-red-800">Completion Blocked by Quality Control</h4>
                         <p className="text-sm text-red-700 mt-1">Resolve the following NCRs before marking complete:</p>
                         <ul className="mt-2 space-y-1">
                             {blockingNCRs.map(ncr => (
                                 <li key={ncr.id} className="text-xs font-medium text-red-800 flex items-center gap-2">
                                     <span className="w-1.5 h-1.5 bg-red-600 rounded-full" aria-hidden="true"></span>
                                     {ncr.id}: {ncr.description}
                                 </li>
                             ))}
                         </ul>
                     </div>
                 </div>
             )}

             <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                   <section aria-labelledby="desc-heading">
                      <h3 id="desc-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Description</h3>
                      <textarea
                        value={localTask.description || ''}
                        onChange={(e) => updateField('description', e.target.value)}
                        className="w-full bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700 leading-relaxed min-h-[120px] focus:outline-none focus:ring-1 focus:ring-nexus-500"
                        placeholder="Add a detailed description..."
                      />
                   </section>

                   {/* Activity Codes */}
                   <section aria-labelledby="codes-heading">
                      <h3 id="codes-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Tag size={16} className="text-nexus-500" aria-hidden="true"/> Activity Codes
                      </h3>
                      <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                          {applicableCodes.map(code => (
                              <div key={code.id} className="grid grid-cols-[150px_1fr] items-center">
                                  <label htmlFor={`code-${code.id}`} className="text-sm font-medium text-slate-600">{code.name}</label>
                                  <select
                                      id={`code-${code.id}`}
                                      value={localTask.activityCodeAssignments?.[code.id] || ''}
                                      onChange={(e) => {
                                          const newMap = { ...localTask.activityCodeAssignments };
                                          if (e.target.value) newMap[code.id] = e.target.value;
                                          else delete newMap[code.id];
                                          updateField('activityCodeAssignments', newMap);
                                      }}
                                      className="w-full mt-1 p-2 text-sm border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-nexus-500"
                                  >
                                      <option value="">-- Not Assigned --</option>
                                      {code.values.map(val => (
                                          <option key={val.id} value={val.id}>{val.value}</option>
                                      ))}
                                  </select>
                              </div>
                          ))}
                          {applicableCodes.length === 0 && <p className="text-sm text-slate-400 italic">No codes available.</p>}
                      </div>
                   </section>

                   {/* Dependencies */}
                   <section aria-labelledby="dep-heading">
                      <h3 id="dep-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                         <Link size={16} className="text-nexus-500" aria-hidden="true"/> Dependencies
                      </h3>
                      <div className="space-y-2">
                         {localTask.dependencies.map((dep, i) => (
                           <div key={i} className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2 p-2 border border-slate-200 rounded-md text-sm">
                             <div className="font-mono text-xs bg-slate-100 p-1 rounded w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                {project.tasks.find(t => t.id === dep.targetId)?.name || 'Unknown'}
                             </div>
                             <span className="font-bold text-xs">{dep.type}</span>
                             <span className="text-xs">{dep.lag}d lag</span>
                             <button className="p-1 text-slate-400 hover:text-red-500" aria-label="Remove dependency"><Trash2 size={14} /></button>
                           </div>
                         ))}
                         <button className="w-full p-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-sm hover:border-nexus-400 hover:text-nexus-600 transition-colors">
                            + Add Predecessor
                         </button>
                      </div>
                   </section>
                   
                   {/* Integration Modules Summary */}
                   <div className="grid grid-cols-2 gap-4">
                       <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                           <h3 className="text-xs font-bold text-orange-800 uppercase mb-2 flex items-center gap-2">
                               <AlertTriangle size={14} aria-hidden="true"/> Risks
                           </h3>
                           <p className="text-sm text-orange-900">{linkedRisks.length} associated risks</p>
                       </div>
                       <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                           <h3 className="text-xs font-bold text-yellow-800 uppercase mb-2 flex items-center gap-2">
                               <FileWarning size={14} aria-hidden="true"/> Issues
                           </h3>
                           <p className="text-sm text-yellow-900">{linkedIssues.length} active issues</p>
                       </div>
                   </div>

                    {linkedExpenses.length > 0 && (
                     <section>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2"><Receipt size={16} className="text-green-500"/> Expenses</h3>
                        <div className="space-y-2">
                           {linkedExpenses.map(expense => (
                             <div key={expense.id} className="p-3 border border-slate-200 rounded-md text-sm bg-slate-50 flex justify-between items-center">
                               <div>
                                   <p className="font-medium text-slate-700">{expense.description}</p>
                                   <p className="text-xs text-slate-500 mt-1">Cat: {state.expenseCategories.find(c => c.id === expense.categoryId)?.name}</p>
                               </div>
                               <p className="font-semibold text-slate-800">${expense.actualCost.toLocaleString()}</p>
                             </div>
                           ))}
                        </div>
                     </section>
                   )}
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                   <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div>
                          <label htmlFor="task-status" className="text-xs text-slate-500 font-bold uppercase mb-1 block">Task Status</label>
                          <select 
                            id="task-status"
                            value={localTask.status}
                            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                            className={`w-full p-2 text-sm border rounded-md font-semibold ${
                                !canComplete && localTask.status !== TaskStatus.COMPLETED 
                                    ? 'border-orange-300 focus:ring-orange-500' 
                                    : 'border-slate-200 focus:ring-nexus-500'
                            }`}
                          >
                              <option value={TaskStatus.NOT_STARTED}>Not Started</option>
                              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                              <option value={TaskStatus.COMPLETED} disabled={!canComplete}>Completed {!canComplete ? '(Blocked)' : ''}</option>
                              <option value={TaskStatus.DELAYED}>Delayed</option>
                          </select>
                      </div>

                      <div className="h-px bg-slate-100 my-2"></div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label htmlFor="effort-type" className="text-xs text-slate-500 flex items-center gap-1"><BrainCircuit size={12}/> Effort Type</label>
                          <select
                            id="effort-type"
                            value={localTask.effortType}
                            onChange={(e) => updateField('effortType', e.target.value as EffortType)}
                            className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md"
                          >
                            <option>Fixed Duration</option>
                            <option>Fixed Work</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="work-hrs" className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12}/> Work (hrs)</label>
                          <input id="work-hrs" type="number" value={localTask.work || ''} onChange={(e) => updateField('work', parseInt(e.target.value))} className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md"/>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label htmlFor="start-date" className="text-xs text-slate-500">Start Date</label>
                          <input id="start-date" type="date" value={localTask.startDate} onChange={e => updateField('startDate', e.target.value)} className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md"/>
                        </div>
                        <div>
                          <label htmlFor="end-date" className="text-xs text-slate-500">End Date</label>
                          <input id="end-date" type="date" value={localTask.endDate} onChange={e => updateField('endDate', e.target.value)} className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md"/>
                        </div>
                      </div>
                       <div>
                          <label htmlFor="constraint" className="text-xs text-slate-500">Constraint</label>
                          <select 
                            id="constraint"
                            value={localTask.primaryConstraint?.type || ''}
                            onChange={(e) => {
                                const newType = e.target.value as ConstraintType | '';
                                updateField('primaryConstraint', newType ? { type: newType, date: newType.includes('Start') ? localTask.startDate : localTask.endDate } : undefined);
                            }}
                            className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md"
                           >
                              <option value="">None</option>
                              <option value="Start On or After">Start On or After</option>
                              <option value="Finish On or Before">Finish On or Before</option>
                              <option value="Start On">Start On</option>
                              <option value="Finish On">Finish On</option>
                              <option value="Mandatory Start">Mandatory Start</option>
                              <option value="Mandatory Finish">Mandatory Finish</option>
                           </select>
                       </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
             <Button variant="secondary" onClick={onClose}>Cancel</Button>
             <Button variant="primary" onClick={saveChanges}>Save Changes</Button>
          </div>
       </div>
    </div>
  );
};

export default TaskDetailModal;
