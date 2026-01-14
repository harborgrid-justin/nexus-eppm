import React from 'react';
import { Task, Project, EffortType } from '../../../types/index';
// Added missing Plus icon to lucide-react imports
import { BrainCircuit, Clock, Link, Trash2, Calendar, AlertTriangle, Plus } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Badge } from '../../ui/Badge';

interface TaskScheduleTabProps {
  task: Task;
  project: Project;
  isReadOnly: boolean;
  onUpdate: (field: string, value: any) => void;
}

export const TaskScheduleTab: React.FC<TaskScheduleTabProps> = ({ task, project, isReadOnly, onUpdate }) => {
  const theme = useTheme();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className={`${theme.colors.surface} p-8 rounded-[2rem] border ${theme.colors.border} shadow-sm space-y-8`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className={`text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2 ml-1`}><BrainCircuit size={14} className="text-nexus-600"/> Effort Calculation Type</label>
                    <select
                        value={task.effortType}
                        disabled={isReadOnly}
                        onChange={(e) => onUpdate('effortType', e.target.value as EffortType)}
                        className={`w-full p-3.5 text-sm font-bold border ${theme.colors.border} rounded-xl disabled:bg-slate-50 transition-all outline-none focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500`}
                    >
                        <option>Fixed Duration</option>
                        <option>Fixed Work</option>
                        <option>Fixed Units/Time</option>
                    </select>
                </div>
                <div>
                    <label className={`text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2 ml-1`}><Clock size={14} className="text-nexus-600"/> Resource Work (Hrs)</label>
                    <input 
                        type="number" 
                        disabled={isReadOnly} 
                        value={task.work || ''} 
                        onChange={(e) => onUpdate('work', parseInt(e.target.value))} 
                        className={`w-full p-3.5 text-sm font-mono font-bold border ${theme.colors.border} rounded-xl disabled:bg-slate-50 transition-all outline-none focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500`}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className={`text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2 ml-1`}><Calendar size={14}/> Early Start</label>
                    <input type="date" disabled={isReadOnly} value={task.startDate} onChange={e => onUpdate('startDate', e.target.value)} className={`w-full p-3.5 text-sm font-mono font-bold border ${theme.colors.border} rounded-xl disabled:bg-slate-50 transition-all outline-none focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500`}/>
                </div>
                <div>
                    <label className={`text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2 ml-1`}><Calendar size={14}/> Early Finish</label>
                    <input type="date" disabled={isReadOnly} value={task.endDate} onChange={e => onUpdate('endDate', e.target.value)} className={`w-full p-3.5 text-sm font-mono font-bold border ${theme.colors.border} rounded-xl disabled:bg-slate-50 transition-all outline-none focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500`}/>
                </div>
            </div>
        </div>

        <section>
            <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-3">
                <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2`}>
                    <Link size={16} className="text-nexus-500"/> Logic Network Relationships
                </h3>
                <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded border border-slate-200">PDM Logic</span>
            </div>
            
            <div className="space-y-3">
                {task.dependencies && task.dependencies.length > 0 ? task.dependencies.map((dep, i) => (
                <div key={i} className={`grid grid-cols-[1fr_auto_auto_auto] items-center gap-6 p-4 border border-slate-100 rounded-2xl text-sm bg-white shadow-sm hover:border-nexus-300 transition-all group`}>
                    <div className="min-w-0 flex flex-col">
                        <span className={`text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tighter`}>{dep.targetId}</span>
                        <span className={`font-bold text-slate-800 truncate`}>{project.tasks.find(t => t.id === dep.targetId)?.name || 'Unknown Logic Reference'}</span>
                    </div>
                    <Badge variant="neutral" className="font-mono text-[10px] px-3">{dep.type}</Badge>
                    <span className={`text-xs font-mono font-black ${dep.lag > 0 ? 'text-red-500' : 'text-slate-400'} bg-slate-50 px-2 py-1 rounded border`}>{dep.lag > 0 ? `+${dep.lag}d` : `${dep.lag}d`} lag</span>
                    {!isReadOnly && (
                        <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
                )) : (
                    <div className="h-24 nexus-empty-pattern border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center">
                        <AlertTriangle size={24} className="text-slate-300 mb-2 opacity-40"/>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Logic End (No Predecessors)</p>
                    </div>
                )}
                
                {!isReadOnly && (
                    <button className={`w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:border-nexus-400 hover:text-nexus-600 hover:bg-nexus-50/50 transition-all flex items-center justify-center gap-2 group`}>
                        <Plus size={16} className="group-hover:scale-110 transition-transform"/> Add Predecessor logic
                    </button>
                )}
            </div>
        </section>
    </div>
  );
};