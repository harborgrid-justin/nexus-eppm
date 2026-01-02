
import React, { useMemo } from 'react';
import { Project } from '../../types';
import { compareProjects } from '../../utils/analytics/scheduleComparison';
import { useTheme } from '../../context/ThemeContext';
import { ArrowRight, Plus, Minus, Edit3, DollarSign } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { formatCurrency } from '../../utils/formatters';

interface ScheduleComparisonProps {
    currentProject: Project;
    baselineProject?: Project; 
}

const ScheduleComparison: React.FC<ScheduleComparisonProps> = ({ currentProject, baselineProject }) => {
    const theme = useTheme();

    const comparison = useMemo(() => {
        if (!baselineProject) return null;
        return compareProjects(baselineProject, currentProject);
    }, [currentProject, baselineProject]);

    if (!baselineProject || !comparison) return <div className="p-8 text-center text-slate-400">Select a project to compare against.</div>;

    return (
        <div className="h-full flex flex-col bg-slate-50/50">
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="New Activities" value={comparison.varianceStats.addedCount} icon={Plus} />
                <StatCard title="Deleted Activities" value={comparison.varianceStats.deletedCount} icon={Minus} />
                <StatCard title="Modified Logic" value={comparison.varianceStats.modifiedCount} icon={Edit3} />
                <StatCard title="Budget Variance" value={formatCurrency(comparison.varianceStats.costVariance)} icon={DollarSign} trend={comparison.varianceStats.costVariance > 0 ? 'up' : 'down'} />
            </div>

            <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-6">
                {/* Modified Tasks */}
                <div className={`${theme.components.card} overflow-hidden`}>
                    <div className={`p-4 border-b ${theme.colors.border} bg-white flex justify-between items-center`}>
                        <h3 className="font-bold text-slate-800">Variance Detail</h3>
                        <span className="text-xs text-slate-500 font-mono">Comparing against {baselineProject.name}</span>
                    </div>
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Activity</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Field</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Source Value</th>
                                <th className="px-6 py-3 text-center w-8"></th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Reflection Value</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {comparison.modifiedTasks.map(task => (
                                <React.Fragment key={task.id}>
                                    {task.changes.map((change, idx) => (
                                        <tr key={`${task.id}-${idx}`} className="hover:bg-slate-50">
                                            <td className="px-6 py-3 text-sm font-bold text-slate-700">{idx === 0 ? task.name : ''}</td>
                                            <td className="px-6 py-3 text-xs font-mono text-slate-500 uppercase">{change.field}</td>
                                            <td className="px-6 py-3 text-sm text-slate-600 bg-red-50/30">{String(change.oldValue)}</td>
                                            <td className="px-6 py-3 text-center text-slate-400"><ArrowRight size={14}/></td>
                                            <td className="px-6 py-3 text-sm font-bold text-slate-800 bg-green-50/30">{String(change.newValue)}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Added Tasks */}
                    <div className={`${theme.components.card} p-4`}>
                        <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2"><Plus size={16}/> Added Scope</h4>
                        {comparison.addedTasks.length > 0 ? (
                            <ul className="space-y-2">
                                {comparison.addedTasks.map(t => (
                                    <li key={t.id} className="text-sm p-2 bg-green-50 border border-green-100 rounded text-green-900 flex justify-between">
                                        <span>{t.name}</span>
                                        <span className="font-mono text-xs opacity-70">{t.wbsCode}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : <div className="text-sm text-slate-400 italic">No added activities.</div>}
                    </div>

                    {/* Deleted Tasks */}
                    <div className={`${theme.components.card} p-4`}>
                        <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2"><Minus size={16}/> Deleted Scope</h4>
                        {comparison.deletedTasks.length > 0 ? (
                            <ul className="space-y-2">
                                {comparison.deletedTasks.map(t => (
                                    <li key={t.id} className="text-sm p-2 bg-red-50 border border-red-100 rounded text-red-900 flex justify-between">
                                        <span>{t.name}</span>
                                        <span className="font-mono text-xs opacity-70">{t.wbsCode}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : <div className="text-sm text-slate-400 italic">No deleted activities.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleComparison;
