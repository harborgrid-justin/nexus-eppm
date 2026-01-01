
import React from 'react';
import { Task, Project, EffortType } from '../../../types';
import { BrainCircuit, Clock, Link, Trash2 } from 'lucide-react';

interface TaskScheduleTabProps {
  task: Task;
  project: Project;
  isReadOnly: boolean;
  onUpdate: (field: string, value: any) => void;
}

export const TaskScheduleTab: React.FC<TaskScheduleTabProps> = ({ task, project, isReadOnly, onUpdate }) => {
  return (
    <div className="space-y-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-slate-500 flex items-center gap-1 font-bold"><BrainCircuit size={12}/> Effort Type</label>
                    <select
                    value={task.effortType}
                    disabled={isReadOnly}
                    onChange={(e) => onUpdate('effortType', e.target.value as EffortType)}
                    className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md disabled:bg-slate-100"
                    >
                    <option>Fixed Duration</option>
                    <option>Fixed Work</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs text-slate-500 flex items-center gap-1 font-bold"><Clock size={12}/> Work (hrs)</label>
                    <input type="number" disabled={isReadOnly} value={task.work || ''} onChange={(e) => onUpdate('work', parseInt(e.target.value))} className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md disabled:bg-slate-100"/>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-slate-500 font-bold">Start Date</label>
                    <input type="date" disabled={isReadOnly} value={task.startDate} onChange={e => onUpdate('startDate', e.target.value)} className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md disabled:bg-slate-100"/>
                </div>
                <div>
                    <label className="text-xs text-slate-500 font-bold">End Date</label>
                    <input type="date" disabled={isReadOnly} value={task.endDate} onChange={e => onUpdate('endDate', e.target.value)} className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-md disabled:bg-slate-100"/>
                </div>
            </div>
        </div>

        <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Link size={16} className="text-nexus-500"/> Dependencies
            </h3>
            <div className="space-y-2">
                {task.dependencies.map((dep, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 p-2 border border-slate-200 rounded-md text-sm">
                    <div className="font-mono text-xs bg-slate-100 p-1 rounded truncate">
                        {project.tasks.find(t => t.id === dep.targetId)?.name || 'Unknown'}
                    </div>
                    <span className="font-bold text-xs">{dep.type}</span>
                    <span className="text-xs">{dep.lag}d lag</span>
                    {!isReadOnly && <button className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>}
                </div>
                ))}
                {!isReadOnly && (
                    <button className="w-full p-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-sm hover:border-nexus-400 hover:text-nexus-600 transition-colors">
                        + Add Predecessor
                    </button>
                )}
            </div>
        </section>
    </div>
  );
};
