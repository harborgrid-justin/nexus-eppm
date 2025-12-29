
import React, { useEffect, useRef } from 'react';
import { Task, Project, ConstraintType, EffortType, TaskStatus } from '../types';
import { Link, Trash2, Clock, BrainCircuit, Tag, Receipt, ShieldAlert, AlertTriangle, MessageCircle, Truck } from 'lucide-react';
import { Button } from './ui/Button';
import { useTaskForm } from '../hooks/useTaskForm';
import { useData } from '../context/DataContext';
import { checkMaterialAvailability, checkOpenRFIsForTask } from '../utils/integrationUtils';
import { usePermissions } from '../hooks/usePermissions';
import { SidePanel } from './ui/SidePanel';

interface TaskDetailModalProps {
  task: Task;
  project: Project;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, project, onClose }) => {
  const { state } = useData();
  const { canEditProject } = usePermissions();
  const isReadOnly = !canEditProject();

  const {
    localTask, updateField, handleStatusChange, saveChanges,
    applicableCodes, linkedIssues, linkedExpenses, linkedRisks, canComplete, blockingNCRs, expenseCategories
  } = useTaskForm(task, project, onClose);

  // Phase 2 Checks (Integration Opportunities)
  const materialCheck = checkMaterialAvailability(localTask, state.purchaseOrders);
  const rfiCheck = checkOpenRFIsForTask(localTask.id, state.communicationLogs);

  return (
    <SidePanel
       isOpen={true}
       onClose={onClose}
       width="md:w-[800px]"
       title={
         <div className="flex flex-col">
            <span className="text-xs font-mono text-slate-500">{localTask.wbsCode}</span>
            <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-slate-900">{localTask.name}</span>
                {!canComplete && (
                    <span className="text-xs font-bold text-red-600 flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        <ShieldAlert size={12} aria-hidden="true" /> QC Block
                    </span>
                )}
            </div>
         </div>
       }
       footer={
         <>
             <Button variant="secondary" onClick={onClose}>{isReadOnly ? 'Close' : 'Cancel'}</Button>
             {!isReadOnly && <Button variant="primary" onClick={saveChanges}>Save Changes</Button>}
         </>
       }
    >
       <div className="space-y-6">
             {/* ALERTS SECTION */}
             <div className="space-y-3">
                {/* Quality Gate Warning */}
                {!canComplete && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3" role="alert">
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
                {/* Material Delay Warning */}
                {materialCheck.hasShortfall && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3" role="alert">
                        <Truck className="text-orange-600 shrink-0 mt-0.5" size={20} aria-hidden="true" />
                        <div>
                            <h4 className="text-sm font-bold text-orange-800">Supply Chain Constraint Detected</h4>
                            <p className="text-sm text-orange-700 mt-1">
                                Material delivery is expected {materialCheck.delayDays} days after current start date.
                            </p>
                        </div>
                    </div>
                )}
                {/* RFI Warning */}
                {rfiCheck.blocked && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3" role="alert">
                        <MessageCircle className="text-blue-600 shrink-0 mt-0.5" size={20} aria-hidden="true" />
                        <div>
                            <h4 className="text-sm font-bold text-blue-800">Pending Technical Clarifications</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                There are {rfiCheck.count} open RFIs linked to this task.
                            </p>
                        </div>
                    </div>
                )}
             </div>

             <div className="grid grid-cols-1 gap-6">
                <div className="space-y-6">
                   <section aria-labelledby="desc-heading">
                      <h3 id="desc-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Description</h3>
                      <textarea
                        value={localTask.description || ''}
                        onChange={(e) => updateField('description', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700 leading-relaxed min-h-[120px] focus:outline-none focus:ring-1 focus:ring-nexus-500 disabled:opacity-70 disabled:cursor-not-allowed"
                        placeholder={isReadOnly ? "No description provided." : "Add a detailed description..."}
                      />
                   </section>

                   <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div>
                          <label htmlFor="task-status" className="text-xs text-slate-500 font-bold uppercase mb-1 block">Task Status</label>
                          <select 
                            id="task-status"
                            value={localTask.status}
                            disabled={isReadOnly}
                            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                            className={`w-full p-2 text-sm border rounded-md font-semibold ${
                                (!canComplete || rfiCheck.blocked) && localTask.status !== TaskStatus.COMPLETED 
                                    ? 'border-orange-300 focus:ring-orange-500' 
                                    : 'border-slate-200 focus:ring-nexus-500'
                            } disabled:bg-slate-100 disabled:text-slate-500`}
                          >
                              <option value={TaskStatus.NOT_STARTED}>Not Started</option>
                              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                              <option value={TaskStatus.COMPLETED} disabled={!canComplete || rfiCheck.blocked}>Completed {(!canComplete || rfiCheck.blocked) ? '(Blocked)' : ''}</option>
                              <option value={TaskStatus.DELAYED}>Delayed</option>
                          </select>
                      </div>

                      <div className="h-px bg-slate-100 my-2"></div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="effort-type" className="text-xs text-slate-500 flex items-center gap-1 font-bold"><BrainCircuit size={12}/> Effort Type</label>
                          <select
                            id="effort-type"
                            value={localTask.effortType}
                            disabled={isReadOnly}
                            onChange={(e) => updateField('effortType', e.target.value as EffortType)}
                            className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md disabled:bg-slate-100"
                          >
                            <option>Fixed Duration</option>
                            <option>Fixed Work</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="work-hrs" className="text-xs text-slate-500 flex items-center gap-1 font-bold"><Clock size={12}/> Work (hrs)</label>
                          <input id="work-hrs" type="number" disabled={isReadOnly} value={localTask.work || ''} onChange={(e) => updateField('work', parseInt(e.target.value))} className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md disabled:bg-slate-100"/>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="start-date" className="text-xs text-slate-500 font-bold">Start Date</label>
                          <input id="start-date" type="date" disabled={isReadOnly} value={localTask.startDate} onChange={e => updateField('startDate', e.target.value)} className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md disabled:bg-slate-100"/>
                        </div>
                        <div>
                          <label htmlFor="end-date" className="text-xs text-slate-500 font-bold">End Date</label>
                          <input id="end-date" type="date" disabled={isReadOnly} value={localTask.endDate} onChange={e => updateField('endDate', e.target.value)} className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md disabled:bg-slate-100"/>
                        </div>
                      </div>
                   </div>

                   {/* Activity Codes */}
                   <section aria-labelledby="codes-heading">
                      <h3 id="codes-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Tag size={16} className="text-nexus-500" aria-hidden="true"/> Activity Codes
                      </h3>
                      <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                          {applicableCodes.map(code => (
                              <div key={code.id} className="grid grid-cols-1 sm:grid-cols-[150px_1fr] items-center gap-2 sm:gap-0">
                                  <label htmlFor={`code-${code.id}`} className="text-sm font-medium text-slate-600">{code.name}</label>
                                  <select
                                      id={`code-${code.id}`}
                                      value={localTask.activityCodeAssignments?.[code.id] || ''}
                                      disabled={isReadOnly}
                                      onChange={(e) => {
                                          const newMap = { ...localTask.activityCodeAssignments };
                                          if (e.target.value) newMap[code.id] = e.target.value;
                                          else delete newMap[code.id];
                                          updateField('activityCodeAssignments', newMap);
                                      }}
                                      className="w-full mt-1 p-2 text-sm border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-nexus-500 disabled:bg-slate-100 disabled:text-slate-500"
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
                             {!isReadOnly && (
                                <button className="p-1 text-slate-400 hover:text-red-500" aria-label="Remove dependency"><Trash2 size={14} /></button>
                             )}
                           </div>
                         ))}
                         {!isReadOnly && (
                            <button className="w-full p-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-sm hover:border-nexus-400 hover:text-nexus-600 transition-colors">
                                + Add Predecessor
                            </button>
                         )}
                      </div>
                   </section>
                   
                   {/* Integration Modules Summary */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                           <h3 className="text-xs font-bold text-orange-800 uppercase mb-2 flex items-center gap-2">
                               <AlertTriangle size={14} aria-hidden="true"/> Risks
                           </h3>
                           <p className="text-sm text-orange-900">{linkedRisks.length} associated risks</p>
                       </div>
                       <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                           <h3 className="text-xs font-bold text-yellow-800 uppercase mb-2 flex items-center gap-2">
                               <ShieldAlert size={14} aria-hidden="true"/> Issues
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
                                   <p className="text-xs text-slate-500 mt-1">Cat: {expenseCategories.find(c => c.id === expense.categoryId)?.name}</p>
                               </div>
                               <p className="font-semibold text-slate-800">${expense.actualCost.toLocaleString()}</p>
                             </div>
                           ))}
                        </div>
                     </section>
                   )}
                </div>
             </div>
          </div>
    </SidePanel>
  );
};

export default TaskDetailModal;
