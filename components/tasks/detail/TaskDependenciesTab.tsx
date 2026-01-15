
import React, { useMemo } from 'react';
import { Task, Project } from '../../../types';
import { Link, Trash2, Plus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Badge } from '../../ui/Badge';
import { EmptyGrid } from '../../common/EmptyGrid';

interface TaskDependenciesTabProps {
  task: Task;
  project: Project;
  isReadOnly: boolean;
  onUpdate: (field: string, value: any) => void;
}

export const TaskDependenciesTab: React.FC<TaskDependenciesTabProps> = ({ task, project, isReadOnly, onUpdate }) => {
    const theme = useTheme();

    const predecessors = useMemo(() => {
        return task.dependencies.map(dep => {
            const t = project.tasks.find(pt => pt.id === dep.targetId);
            return { ...dep, taskName: t?.name || 'Unknown', wbs: t?.wbsCode || '?' };
        });
    }, [task.dependencies, project.tasks]);

    const successors = useMemo(() => {
        return project.tasks
            .filter(t => t.dependencies.some(d => d.targetId === task.id))
            .map(t => {
                const dep = t.dependencies.find(d => d.targetId === task.id);
                return { ...dep, sourceId: t.id, taskName: t.name, wbs: t.wbsCode };
            });
    }, [project.tasks, task.id]);

    const handleUnlink = (targetId: string) => {
        const newDeps = task.dependencies.filter(d => d.targetId !== targetId);
        onUpdate('dependencies', newDeps);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Predecessors */}
            <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-2xl overflow-hidden shadow-sm`}>
                <div className={`p-4 bg-slate-50 border-b ${theme.colors.border} flex justify-between items-center`}>
                    <h4 className={`text-xs font-black uppercase tracking-widest ${theme.colors.text.secondary} flex items-center gap-2`}>
                        <ArrowLeft size={14} className="text-nexus-600"/> Driving Predecessors
                    </h4>
                    {!isReadOnly && <button className="text-[10px] font-bold text-nexus-600 uppercase hover:underline">+ Link Task</button>}
                </div>
                <div className="p-0">
                    {predecessors.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead className="bg-white text-xs text-slate-400 font-bold uppercase border-b border-slate-100">
                                <tr>
                                    <th className="px-4 py-3 text-left">ID</th>
                                    <th className="px-4 py-3 text-left">Activity Name</th>
                                    <th className="px-4 py-3 text-center">Type</th>
                                    <th className="px-4 py-3 text-center">Lag</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {predecessors.map((p, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.wbs}</td>
                                        <td className="px-4 py-3 font-bold text-slate-700">{p.taskName}</td>
                                        <td className="px-4 py-3 text-center"><Badge variant="neutral">{p.type}</Badge></td>
                                        <td className="px-4 py-3 text-center font-mono text-xs">{p.lag}d</td>
                                        <td className="px-4 py-3 text-right">
                                            {!isReadOnly && (
                                                <button onClick={() => handleUnlink(p.targetId)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                    <Trash2 size={14}/>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-slate-400 italic text-xs">No predecessor logic defined (Open Start).</div>
                    )}
                </div>
            </div>

            {/* Successors */}
            <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-2xl overflow-hidden shadow-sm`}>
                <div className={`p-4 bg-slate-50 border-b ${theme.colors.border} flex justify-between items-center`}>
                    <h4 className={`text-xs font-black uppercase tracking-widest ${theme.colors.text.secondary} flex items-center gap-2`}>
                        <ArrowRight size={14} className="text-nexus-600"/> Driven Successors
                    </h4>
                </div>
                 <div className="p-0">
                    {successors.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead className="bg-white text-xs text-slate-400 font-bold uppercase border-b border-slate-100">
                                <tr>
                                    <th className="px-4 py-3 text-left">ID</th>
                                    <th className="px-4 py-3 text-left">Activity Name</th>
                                    <th className="px-4 py-3 text-center">Type</th>
                                    <th className="px-4 py-3 text-center">Lag</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {successors.map((s, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors bg-slate-50/30">
                                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{s.wbs}</td>
                                        <td className="px-4 py-3 font-bold text-slate-700">{s.taskName}</td>
                                        <td className="px-4 py-3 text-center"><Badge variant="neutral">{s?.type}</Badge></td>
                                        <td className="px-4 py-3 text-center font-mono text-xs">{s?.lag}d</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-slate-400 italic text-xs">No successor logic defined (Open End).</div>
                    )}
                </div>
            </div>
        </div>
    );
};
