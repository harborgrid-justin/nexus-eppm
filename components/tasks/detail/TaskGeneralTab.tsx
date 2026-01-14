import React from 'react';
import { Task, TaskStatus } from '../../../types/index';
import { AlertTriangle, MessageCircle, Truck, FileText, Activity, ShieldCheck, DollarSign } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { ProgressBar } from '../../common/ProgressBar';
import { Badge } from '../../ui/Badge';

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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="space-y-4">
        {!canComplete && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                <div className="p-2 bg-white rounded-xl shadow-sm text-red-600"><AlertTriangle size={24}/></div>
                <div className="flex-1">
                    <h4 className="text-sm font-black text-red-900 uppercase tracking-tight">Governance Blocker: Quality Control</h4>
                    <p className="text-xs text-red-700 mt-1 font-medium leading-relaxed">Activity completion is prohibited until the following critical Non-Conformance Reports (NCRs) are resolved and signed-off by QA.</p>
                    <ul className="mt-4 space-y-2">
                        {blockingNCRs.map(ncr => (
                            <li key={ncr.id} className="text-[11px] font-bold text-red-800 flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-red-100">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                {ncr.id}: {ncr.description}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )}
        {materialCheck.hasShortfall && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                <div className="p-2 bg-white rounded-xl shadow-sm text-amber-600"><Truck size={24}/></div>
                <div>
                    <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight">Supply Chain Impediment</h4>
                    <p className="text-xs text-amber-700 mt-1 font-medium">Critical material shortfall detected. Delivery delay estimated at <strong>{materialCheck.delayDays} days</strong>.</p>
                </div>
            </div>
        )}
        {rfiCheck.blocked && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600"><MessageCircle size={24}/></div>
                <div>
                    <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">Outstanding RFIs</h4>
                    <p className="text-xs text-blue-700 mt-1 font-medium">{rfiCheck.count} open Requests for Information are linked to this task. Design clarification pending.</p>
                </div>
            </div>
        )}
        </div>

        <section className={`grid grid-cols-1 md:grid-cols-5 ${theme.layout.gridGap}`}>
            <div className="md:col-span-3 space-y-8">
                <div>
                    <label className={`${theme.typography.label} mb-2 block flex items-center gap-2`}><FileText size={14} className="text-slate-400"/> Physical Scope & Narrative</label>
                    <textarea 
                        className={`w-full p-4 border ${theme.colors.border} rounded-2xl text-sm h-48 focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 outline-none resize-none transition-all shadow-inner bg-slate-50/30`}
                        value={task.description || ''}
                        onChange={e => onUpdate('description', e.target.value)}
                        disabled={isReadOnly}
                        placeholder="Describe the technical work requirements..."
                    />
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className={`${theme.typography.label} mb-2 block flex items-center gap-2`}><Activity size={14} className="text-slate-400"/> Status Configuration</label>
                        <select 
                            className={`w-full p-3 border ${theme.colors.border} rounded-xl text-sm font-bold bg-white focus:ring-4 focus:ring-nexus-500/5 transition-all outline-none text-slate-700`}
                            value={task.status}
                            onChange={e => onStatusChange(e.target.value as TaskStatus)}
                            disabled={isReadOnly}
                        >
                            {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={`${theme.typography.label} mb-2 block flex items-center gap-2`}><DollarSign size={14} className="text-slate-400"/> Cost Center</label>
                        <span className="block p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">{task.wbsCode}</span>
                    </div>
                </div>
            </div>
            
            <div className="md:col-span-2 space-y-6">
                <div className={`${theme.colors.background} p-6 rounded-3xl border ${theme.colors.border} shadow-inner`}>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress Measurement</span>
                        <span className="text-2xl font-black text-nexus-700 font-mono">{task.progress}%</span>
                    </div>
                    <input 
                        type="range" min="0" max="100" step="1"
                        value={task.progress}
                        onChange={e => onUpdate('progress', parseInt(e.target.value))}
                        disabled={isReadOnly || task.status === TaskStatus.COMPLETED}
                        className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-nexus-600 shadow-inner"
                    />
                    <div className="flex justify-between text-[8px] font-black text-slate-400 mt-3 uppercase tracking-tighter">
                        <span>Not Started</span>
                        <span>Halfway</span>
                        <span>Complete</span>
                    </div>
                </div>
                
                <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-2xl p-6 shadow-sm`}>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-slate-50 pb-2">Active Resource Assignments</h4>
                    <div className="space-y-3">
                        {task.assignments && task.assignments.length > 0 ? task.assignments.map(a => (
                            <div key={a.resourceId} className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 text-xs font-bold group hover:border-nexus-300 transition-all">
                                <span className="text-slate-700 uppercase tracking-tight">{a.resourceId}</span>
                                <Badge variant="info" className="scale-75 origin-right">{a.units}% Load</Badge>
                            </div>
                        )) : (
                            <div className="h-20 nexus-empty-pattern rounded-xl border border-dashed border-slate-100 flex items-center justify-center">
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Labor Mapped</span>
                            </div>
                        )}
                    </div>
                    {!isReadOnly && (
                        <button className="w-full py-2.5 mt-6 border-2 border-dashed border-slate-100 rounded-xl text-[9px] font-black uppercase text-slate-400 tracking-widest hover:border-nexus-300 hover:text-nexus-600 hover:bg-nexus-50 transition-all">
                            Provision Resource
                        </button>
                    )}
                </div>
            </div>
        </section>
    </div>
  );
};