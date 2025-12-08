import React, { useState } from 'react';
import { Task, Project, TaskType, ConstraintType, Dependency, EffortType, DependencyType } from '../types';
import { useData } from '../context/DataContext';
import { X, Calendar, User, FileText, AlertTriangle, Paperclip, CheckSquare, Link, Trash2, Clock, BrainCircuit } from 'lucide-react';

interface TaskDetailModalProps {
  task: Task;
  project: Project;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, project, onClose }) => {
  const { state, dispatch } = useData();
  const [localTask, setLocalTask] = useState<Task>(task);
  
  const handleUpdate = <K extends keyof Task>(key: K, value: Task[K]) => {
    setLocalTask(prev => ({ ...prev, [key]: value }));
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
             </div>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full border border-slate-200 shadow-sm hover:shadow">
                <X size={20} />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
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
                </div>

                <div className="space-y-6">
                   <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
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
                            value={localTask.constraintType || ''}
                            onChange={(e) => handleUpdate('constraintType', e.target.value as ConstraintType)}
                            className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md"
                           >
                              <option value="">None</option>
                              <option value="Start No Earlier Than">Start No Earlier Than</option>
                              <option value="Finish No Later Than">Finish No Later Than</option>
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