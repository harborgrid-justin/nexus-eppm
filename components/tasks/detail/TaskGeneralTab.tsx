import React from 'react';
import { Task, TaskStatus } from '../../../types';
import { AlertTriangle, MessageCircle, Truck, FileText, Activity } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface TaskGeneralTabProps {
  task: Task;
  isReadOnly: boolean;
  canComplete: boolean;
  rfiCheck: { blocked: boolean, count: number };
  materialCheck: { hasShortfall: boolean, delayDays: number };
  blockingNCRs: any[];
  onUpdate: (field: string, value: any) => void;
  onStatusChange: (status: TaskStatus) => void;
}

export const TaskGeneralTab: React.FC<TaskGeneralTabProps> = ({ 
    task, isReadOnly, canComplete, rfiCheck, materialCheck, blockingNCRs, onUpdate, onStatusChange 
}) => {
  const theme = useTheme();

  return (
    <div className="space-y-6">
        <div className="space-y-3">
        {!canComplete && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-red-800">Completion Blocked by Quality Control</h4>
                    <ul className="mt-2 space-y-1">
                        {blockingNCRs.map(ncr => (
                            <li key={ncr.id} className="text-xs font-medium text-red-700 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                {ncr.id}: {ncr.description}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )}
        {materialCheck.hasShortfall && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <Truck className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-amber-800">Supply Chain Constraint</h4>
                    <p className="text-sm text-amber-700 mt-1">Material delivery delayed by {materialCheck.delayDays} days.</p>
                </div>
            </div>
        )}
        {rfiCheck.blocked && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <MessageCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-blue-800">Pending RFIs</h4>
                    <p className="text-sm text-blue-700 mt-1">{rfiCheck.count} open RFIs linked.</p>
                </div>
            </div>
        )}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <label className={`${theme.typography.label} mb-1 block`}><FileText size={14} className="inline mr-1" /> Activity Description</label>
                    <textarea 
                        className="w-full p-3 border border-slate-300 rounded-xl text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none resize-none"
                        value={task.description || ''}
                        onChange={e => onUpdate('description', e.target.value)}
                        disabled={isReadOnly}
                    />
                </div>
                <div>
                    <label className={`${theme.typography.label} mb-1 block`}><Activity size={14} className="inline mr-1" /> Primary Status</label>
                    <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500"
                        value={task.status}
                        onChange={e => onStatusChange(e.target.value as TaskStatus)}
                        disabled={isReadOnly}
                    >
                        {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            
            <div className="space-y-4">
                <div className={`${theme.colors.background} p-5 rounded-2xl border ${theme.colors.border}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Progress Baseline</span>
                        <span className="text-lg font-black text-nexus-700">{task.progress}%</span>
                    </div>
                    <input 
                        type="range" min="0" max="100" step="1"
                        value={task.progress}
                        onChange={e => onUpdate('progress', parseInt(e.target.value))}
                        disabled={isReadOnly || task.status === TaskStatus.COMPLETED}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-nexus-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-bold uppercase">
                        <span>Not Started</span>
                        <span>In Progress</span>
                        <span>Complete</span>
                    </div>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Resource Assignments</h4>
                    <div className="space-y-2">
                        {task.assignments.length > 0 ? task.assignments.map(a => (
                            <div key={a.resourceId} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100 text-sm">
                                <span className="font-medium text-slate-700">{a.resourceId}</span>
                                <span className="font-bold text-nexus-600">{a.units}%</span>
                            </div>
                        )) : (
                            <p className="text-xs text-slate-400 italic">No resources assigned.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
};