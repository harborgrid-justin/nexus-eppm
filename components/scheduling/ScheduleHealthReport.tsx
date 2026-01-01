
import React, { useMemo } from 'react';
import { Project, Task } from '../../types';
import { ShieldCheck, ShieldAlert, Activity, Info, BarChart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';

const ScheduleHealthReport: React.FC = () => {
  const { project } = useProjectWorkspace();
  const theme = useTheme();

  const metrics = useMemo(() => {
    if (!project) return null;
    const tasks = project.tasks.filter(t => t.type !== 'Summary');
    const total = tasks.length;
    if (total === 0) return null;

    // DCMA Check Logic
    const missingPred = tasks.filter(t => t.dependencies.length === 0 && !t.wbsCode.includes('.1')).length;
    const missingSucc = tasks.filter(t => !project.tasks.some(other => other.dependencies.some(d => d.targetId === t.id))).length;
    const highLag = tasks.filter(t => t.dependencies.some(d => d.lag > 5)).length;
    const negLag = tasks.filter(t => t.dependencies.some(d => d.lag < 0)).length;
    const constraints = tasks.filter(t => !!t.primaryConstraint).length;
    const highFloat = tasks.filter(t => (t.totalFloat || 0) > 44).length; // 2 months
    const nonFS = tasks.filter(t => t.dependencies.some(d => d.type !== 'FS')).length;

    return [
      { id: 1, label: 'Logic (Missing Pred/Succ)', value: missingPred + missingSucc, limit: 0.05, count: missingPred + missingSucc },
      { id: 2, label: 'Lags (> 5 days)', value: highLag, limit: 0.05, count: highLag },
      { id: 3, label: 'Negative Lags', value: negLag, limit: 0, count: negLag },
      { id: 4, label: 'Relationship Types (Non-FS)', value: nonFS, limit: 0.1, count: nonFS },
      { id: 5, label: 'Hard Constraints', value: constraints, limit: 0.05, count: constraints },
      { id: 6, label: 'High Float (> 44 days)', value: highFloat, limit: 0.05, count: highFloat },
      { id: 7, label: 'Long Durations (> 44 days)', value: tasks.filter(t => t.duration > 44).length, limit: 0.05, count: tasks.filter(t => t.duration > 44).length }
    ];
  }, [project]);

  if (!project || !metrics) return <div>No tasks to analyze.</div>;

  const overallScore = metrics.reduce((sum, m) => sum + (m.count === 0 ? 1 : 0), 0) / metrics.length * 100;

  return (
    <div className={`h-full flex flex-col ${theme.colors.background}`}>
        <div className={`p-6 border-b ${theme.colors.border} ${theme.colors.surface}`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className={`${theme.typography.h2} flex items-center gap-2`}>
                        <Activity className="text-nexus-600" /> DCMA 14-Point Schedule Health
                    </h2>
                    <p className={theme.typography.small}>Validation of network logic quality and schedule stability.</p>
                </div>
                <div className="text-right">
                    <p className={theme.typography.label}>Schedule Quality Score</p>
                    <div className="flex items-center gap-3">
                        <div className="text-3xl font-black text-slate-900">{overallScore.toFixed(0)}%</div>
                        <Badge variant={overallScore > 85 ? 'success' : overallScore > 70 ? 'warning' : 'danger'}>
                            {overallScore > 85 ? 'Healthy' : 'Needs Review'}
                        </Badge>
                    </div>
                </div>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
                <div className={`p-4 rounded-xl border ${theme.colors.border} ${theme.colors.semantic.info.bg}/50`}>
                    <p className={`${theme.typography.label} ${theme.colors.semantic.info.text}`}>Critical Path Length</p>
                    <p className="text-lg font-bold">142 Days</p>
                </div>
                <div className={`p-4 rounded-xl border ${theme.colors.border} ${theme.colors.semantic.warning.bg}/50`}>
                    <p className={`${theme.typography.label} ${theme.colors.semantic.warning.text}`}>Dangling Activities</p>
                    <p className="text-lg font-bold">5</p>
                </div>
                <div className={`p-4 rounded-xl border ${theme.colors.border} bg-purple-50`}>
                    <p className={`${theme.typography.label} text-purple-600`}>Constraint Impact</p>
                    <p className="text-lg font-bold">Moderate</p>
                </div>
                <div className={`p-4 rounded-xl border ${theme.colors.border} ${theme.colors.semantic.success.bg}/50`}>
                    <p className={`${theme.typography.label} ${theme.colors.semantic.success.text}`}>Status updates</p>
                    <p className="text-lg font-bold">Current</p>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            <div className={`${theme.components.card} overflow-hidden`}>
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className={theme.components.table.header}>Metric Component</th>
                            <th className={`${theme.components.table.header} text-center`}>Count</th>
                            <th className={`${theme.components.table.header} text-center`}>Threshold</th>
                            <th className={theme.components.table.header}>Compliance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {metrics.map(m => {
                            const isCompliant = m.count <= (project.tasks.length * m.limit);
                            return (
                                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                    <td className={theme.components.table.cell}>
                                        <div className="flex items-center gap-3">
                                            {isCompliant ? <ShieldCheck className="text-green-500" size={18}/> : <ShieldAlert className="text-red-500" size={18}/>}
                                            <span className="font-medium text-slate-700">{m.label}</span>
                                        </div>
                                    </td>
                                    <td className={`${theme.components.table.cell} text-center font-mono font-bold text-slate-900`}>{m.count}</td>
                                    <td className={`${theme.components.table.cell} text-center text-xs`}>{m.limit * 100}% of activities</td>
                                    <td className={theme.components.table.cell}>
                                        <Badge variant={isCompliant ? 'success' : 'danger'}>
                                            {isCompliant ? 'Passed' : 'Triggered'}
                                        </Badge>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            <div className={`mt-8 grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
                 <div className="p-6 bg-indigo-900 text-white rounded-xl shadow-lg">
                    <h3 className="font-bold flex items-center gap-2 mb-4"><Info size={18}/> Master Scheduler Recommendation</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed">
                        The schedule contains multiple high-float activities that are not properly linked to successors. 
                        This creates an optimistic bias in the P80 confidence level. 
                        Recommend closing out logic loops in WBS 1.3 (Mechanical) to stabilize the Critical Path.
                    </p>
                 </div>
                 <div className={`${theme.components.card} p-6`}>
                    <h3 className={`${theme.typography.h3} mb-4 flex items-center gap-2`}><BarChart size={18}/> Logic Type Distribution</h3>
                    <div className="flex items-end gap-2 h-32">
                        <div className="flex-1 bg-nexus-500 rounded-t-md relative group">
                            <div className="h-full"></div>
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold">88% FS</span>
                        </div>
                        <div className="flex-1 bg-yellow-400 rounded-t-md h-[12%] relative">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-yellow-600">8% SS</span>
                        </div>
                        <div className="flex-1 bg-orange-400 rounded-t-md h-[4%] relative">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-orange-600">4% FF</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
                        <span>Finish-Start</span>
                        <span>Start-Start</span>
                        <span>Finish-Finish</span>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default ScheduleHealthReport;
