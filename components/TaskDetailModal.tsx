
import React, { useState, useMemo } from 'react';
import { Task, Project, TaskType, ConstraintType, Dependency, EffortType, DependencyType, ActivityCode, Issue, Expense, NonConformanceReport, Risk, TaskStatus } from '../types';
import { useData } from '../context/DataContext';
import { X, Calendar, User, FileText, AlertTriangle, Paperclip, CheckSquare, Link, Trash2, Clock, BrainCircuit, Tag, FileWarning, Receipt, ShieldAlert, ShieldCheck } from 'lucide-react';
import { canCompleteTask } from '../utils/integrationUtils';

interface TaskDetailModalProps {
  task: Task;
  project: Project;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, project, onClose }) => {
  const { state, dispatch, getActivityCodesForProject } = useData();
  const [localTask, setLocalTask] = useState<Task>(task);
  
  const applicableCodes = useMemo(() => {
    return getActivityCodesForProject(project.id);
  }, [getActivityCodesForProject, project.id]);

  const linkedIssues: Issue[] = useMemo(() => {
    if (!localTask.issueIds) return [];
    return state.issues.filter(issue => localTask.issueIds?.includes(issue.id));
  }, [state.issues, localTask.issueIds]);

  const linkedExpenses: Expense[] = useMemo(() => {
    if (!localTask.expenseIds) return [];
    return state.expenses.filter(expense => localTask.expenseIds?.includes(expense.id));
  }, [state.expenses, localTask.expenseIds]);

  // INTEGRATION: Quality & Schedule
  const projectNCRs = useMemo(() => state.nonConformanceReports.filter(n => n.projectId === project.id), [state.nonConformanceReports, project.id]);
  const { canComplete, blockingNCRs } = useMemo(() => canCompleteTask(localTask.id, projectNCRs), [localTask.id, projectNCRs]);

  // INTEGRATION: Risk & Schedule
  const linkedRisks: Risk[] = useMemo(() => {
      return state.risks.filter(r => r.linkedTaskId === localTask.id);
  }, [state.risks, localTask.id]);

  const handleUpdate = <K extends keyof Task>(key: K, value: Task[K]) => {
    setLocalTask(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
      if (newStatus === TaskStatus.COMPLETED && !canComplete) {
          alert(`Cannot complete task. There are ${blockingNCRs.length} blocking Non-Conformance Reports (Critical/Major) linked to this activity.`);
          return;
      }
      handleUpdate('status', newStatus);
      if (newStatus === TaskStatus.COMPLETED) {
          handleUpdate('progress', 100);
      }
  };

  const handleCodeAssignmentChange = (codeId: string, valueId: string) => {
    const newAssignments = { ...(localTask.activityCodeAssignments || {}) };
    if (valueId) {
        newAssignments[codeId] = valueId;
    } else {
        delete newAssignments[codeId]; // unassign if empty value is selected
    }
    handleUpdate('activityCodeAssignments', newAssignments);
  };

  const handleSave = () => {
    dispatch({ type: 'UPDATE_TASK', payload: { projectId: project.id, task: localTask } });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
             <div>
                <input
                  type="text"
                  value={localTask.name}
                  onChange={(e) => handleUpdate('name', e.target.value)}
                  className="text-2xl font-bold text-slate-900 bg-transparent -ml-2 px-2 py-1 rounded-lg border border-transparent hover:border-slate-300 focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500"
                />
                <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-600">{localTask.wbsCode}</span>
                    {!canComplete && (
                        <span className="text-xs font-bold text-red-600 flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            <ShieldAlert size={12} /> Quality Gate Locked
                        </span>
                    )}
                </div>
             </div>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full border border-slate-200 shadow-sm hover:shadow">
                <X size={20} />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
             {/* Quality Gate Warning */}
             {!canComplete && (
                 <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                     <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={20} />
                     <div>
                         <h4 className="text-sm font-bold text-red-800">Completion Blocked by Quality Control</h4>
                         <p className="text-sm text-red-700 mt-1">The following Non-Conformance Reports must be closed before this task can be marked as Complete:</p>
                         <ul className="mt-2 space-y-1">
                             {blockingNCRs.map(ncr => (
                                 <li key={ncr.id} className="text-xs font-medium text-red-800 flex items-center gap-2">
                                     <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                     {ncr.id}: {ncr.description} ({ncr.severity})
                                 </li>
                             ))}
                         </ul>
                     </div>
                 </div>
             )}

             <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                   <section>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Description</h3>
                      <textarea
                        value={localTask.description || ''}
                        onChange={(e) => handleUpdate('description', e.target.value)}
                        className="w-full bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700 leading-relaxed min-h-[120px] focus:outline-none focus:ring-1 focus:ring-nexus-500"
                        placeholder="Add a detailed description..."
                      />
                   </section>

                   <section>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Tag size={16} className="text-nexus-500"/> Activity Codes
                      </h3>
                      <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                          {applicableCodes.map(code => (
                              <div key={code.id} className="grid grid-cols-[150px_1fr] items-center">
                                  <label className="text-sm font-medium text-slate-600">{code.name}</label>
                                  <select
                                      value={localTask.activityCodeAssignments?.[code.id] || ''}
                                      onChange={(e) => handleCodeAssignmentChange(code.id, e.target.value)}
                                      className="w-full mt-1 p-2 text-sm border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-nexus-500"
                                  >
                                      <option value="">-- Not Assigned --</option>
                                      {code.values.map(val => (
                                          <option key={val.id} value={val.id}>{val.value}</option>
                                      ))}
                                  </select>
                              </div>
                          ))}
                          {applicableCodes.length === 0 && (
                              <p className="text-sm text-slate-400 italic">No activity codes defined for this project.</p>
                          )}
                      </div>
                   </section>

                   <section>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                         <Link size={16} className="text-nexus-500"/> Dependencies
                      </h3>
                      <div className="space-y-2">
                         {localTask.dependencies.map((dep, i) => (
                           <div key={i} className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2 p-2 border border-slate-200 rounded-md text-sm">
                             <select className="font-mono text-xs bg-slate-100 p-1 rounded w-full border-none focus:ring-0">
                                <option>{project.tasks.find(t => t.id === dep.targetId)?.name || 'Unknown Task'}</option>
                             </select>
                             <select defaultValue={dep.type} className="border-slate-200 rounded-md p-1 focus:ring-1 focus:ring-nexus-500">
                                <option value="FS">Finish-to-Start</option>
                                <option value="SS">Start-to-Start</option>
                                <option value="FF">Finish-to-Finish</option>
                                <option value="SF">Start-to-Finish</option>
                             </select>
                             <input type="number" defaultValue={dep.lag} className="w-16 p-1 border-slate-200 rounded-md focus:ring-1 focus:ring-nexus-500" />
                             <span>days</span>
                             <button className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                           </div>
                         ))}
                         <button className="w-full p-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-sm hover:border-nexus-400 hover:text-nexus-600">
                            + Add Predecessor
                         </button>
                      </div>
                   </section>
                   
                   {/* INTEGRATED MODULES SECTION */}
                   <div className="grid grid-cols-2 gap-4">
                       {/* RISKS */}
                       <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                           <h3 className="text-xs font-bold text-orange-800 uppercase mb-2 flex items-center gap-2">
                               <AlertTriangle size={14}/> Associated Risks
                           </h3>
                           {linkedRisks.length > 0 ? (
                               <div className="space-y-2">
                                   {linkedRisks.map(risk => (
                                       <div key={risk.id} className="bg-white p-2 rounded border border-orange-200 text-xs shadow-sm">
                                           <div className="flex justify-between">
                                               <span className="font-semibold text-slate-800">{risk.id}</span>
                                               <span className="font-bold text-orange-600">Score: {risk.score}</span>
                                           </div>
                                           <p className="text-slate-600 mt-1 line-clamp-2">{risk.description}</p>
                                       </div>
                                   ))}
                               </div>
                           ) : (
                               <p className="text-xs text-orange-400 italic">No risks linked directly to this task.</p>
                           )}
                       </div>

                       {/* ISSUES */}
                       <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                           <h3 className="text-xs font-bold text-yellow-800 uppercase mb-2 flex items-center gap-2">
                               <FileWarning size={14}/> Active Issues
                           </h3>
                           {linkedIssues.length > 0 ? (
                               <div className="space-y-2">
                                   {linkedIssues.map(issue => (
                                       <div key={issue.id} className="bg-white p-2 rounded border border-yellow-200 text-xs shadow-sm">
                                           <div className="flex justify-between">
                                               <span className="font-semibold text-slate-800">{issue.id}</span>
                                               <span className="text-slate-500">{issue.priority}</span>
                                           </div>
                                           <p className="text-slate-600 mt-1 line-clamp-2">{issue.description}</p>
                                       </div>
                                   ))}
                               </div>
                           ) : (
                               <p className="text-xs text-yellow-400 italic">No open issues linked.</p>
                           )}
                       </div>
                   </div>

                    {linkedExpenses.length > 0 && (
                     <section>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2"><Receipt size={16} className="text-green-500"/> Linked Expenses</h3>
                        <div className="space-y-2">
                           {linkedExpenses.map(expense => (
                             <div key={expense.id} className="p-3 border border-slate-200 rounded-md text-sm bg-slate-50 flex justify-between items-center">
                               <div>
                                   <p className="font-medium text-slate-700">{expense.description}</p>
                                   <p className="text-xs text-slate-500 mt-1">Category: {state.expenseCategories.find(c => c.id === expense.categoryId)?.name}</p>
                               </div>
                               <p className="font-semibold text-slate-800">${expense.actualCost.toLocaleString()}</p>
                             </div>
                           ))}
                        </div>
                     </section>
                   )}
                </div>

                <div className="space-y-6">
                   <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      {/* Status Control */}
                      <div>
                          <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Task Status</label>
                          <select 
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
                          <label className="text-xs text-slate-500 flex items-center gap-1"><BrainCircuit size={12}/> Effort Type</label>
                          <select
                            value={localTask.effortType}
                            onChange={(e) => handleUpdate('effortType', e.target.value as EffortType)}
                            className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md"
                          >
                            <option>Fixed Duration</option>
                            <option>Fixed Work</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12}/> Work (hrs)</label>
                          <input type="number" value={localTask.work || ''} onChange={(e) => handleUpdate('work', parseInt(e.target.value))} className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md"/>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-slate-500">Start Date</label>
                          <input type="date" value={localTask.startDate} onChange={e => handleUpdate('startDate', e.target.value)} className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md"/>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500">End Date</label>
                          <input type="date" value={localTask.endDate} onChange={e => handleUpdate('endDate', e.target.value)} className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md"/>
                        </div>
                      </div>
                       <div>
                          <label className="text-xs text-slate-500">Constraint</label>
                          <select 
                            value={localTask.primaryConstraint?.type || ''}
                            onChange={(e) => {
                                const newType = e.target.value as ConstraintType | '';
                                if (newType) {
                                    handleUpdate('primaryConstraint', {
                                        type: newType,
                                        date: newType.includes('Start') ? localTask.startDate : localTask.endDate,
                                    });
                                } else {
                                    handleUpdate('primaryConstraint', undefined);
                                }
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
             <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
             <button onClick={handleSave} className="px-4 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700 shadow-sm">Save Changes</button>
          </div>
       </div>
    </div>
  );
};

export default TaskDetailModal;
