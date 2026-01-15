
import React, { useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { ShieldCheck, ShieldAlert, Activity, BarChart2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const ScheduleHealthReport: React.FC = () => {
  const { project } = useProjectWorkspace();
  const theme = useTheme();

  const metrics = useMemo(() => {
    if (!project || !project.tasks) return [];
    const tasks = project.tasks.filter(t => t.type !== 'Summary');
    const total = tasks.length;
    if (total === 0) return [];

    // DCMA 14-Point Assessment Logic (Simplified for Demo)
    const checks = [
      { id: 1, label: 'Logic (Missing Links)', fn: (t: any) => t.dependencies.length === 0, limit: 0.05 },
      { id: 2, label: 'Negative Lags', fn: (t: any) => t.dependencies.some((d: any) => d.lag < 0), limit: 0 },
      { id: 3, label: 'High Float (>44d)', fn: (t: any) => (t.totalFloat || 0) > 44, limit: 0.05 },
      { id: 4, label: 'Hard Constraints', fn: (t: any) => !!t.primaryConstraint, limit: 0.05 },
      { id: 5, label: 'High Duration (>44d)', fn: (t: any) => t.duration > 44, limit: 0.05 },
      { id: 6, label: 'Invalid Dates', fn: (t: any) => new Date(t.endDate) < new Date(t.startDate), limit: 0 },
      { id: 7, label: 'Resource Missing', fn: (t: any) => !t.assignments || t.assignments.length === 0, limit: 0 }
    ];

    return checks.map(c => {
        const count = tasks.filter(c.fn).length;
        const pct = count / total;
        return {
            ...c,
            count,
            pct: Math.round(pct * 100),
            passed: pct <= c.limit
        };
    });
  }, [project]);

  if (!project) return null;

  const score = metrics.length > 0 
    ? Math.round((metrics.filter(m => m.passed).length / metrics.length) * 100)
    : 0;

  return (
    <div className={`h-full flex flex-col ${theme.colors.background} animate-in fade-in`}>
        <div className={`p-6 border-b ${theme.colors.border} ${theme.colors.surface} flex justify-between items-center`}>
            <div>
                <h2 className={`${theme.typography.h2} flex items-center gap-2`}>
                    <Activity className="text-nexus-600" /> DCMA Schedule Health
                </h2>
                <p className={theme.typography.small}>14-Point Assessment & Logic Integrity</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Quality Score</p>
                    <p className={`text-3xl font-black ${score >= 90 ? 'text-green-600' : score >= 75 ? 'text-yellow-500' : 'text-red-500'}`}>{score}%</p>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Chart */}
                 <div className={`${theme.components.card} p-6 h-80 flex flex-col`}>
                     <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart2 size={16}/> Compliance Profile</h3>
                     <div className="flex-1 min-h-0">
                         <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={metrics} layout="vertical" margin={{ left: 20 }}>
                                 <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                 <XAxis type="number" domain={[0, 100]} hide />
                                 <YAxis dataKey="label" type="category" width={140} tick={{fontSize: 10}} />
                                 <Tooltip />
                                 <Bar dataKey="pct" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                             </BarChart>
                         </ResponsiveContainer>
                     </div>
                 </div>

                 {/* KPI Grid */}
                 <div className="grid grid-cols-2 gap-4">
                     <div className={`p-4 rounded-xl border ${theme.colors.border} bg-green-50/50 flex flex-col justify-center items-center`}>
                         <ShieldCheck className="text-green-600 mb-2" size={32}/>
                         <span className="text-2xl font-black text-slate-900">{metrics.filter(m => m.passed).length}</span>
                         <span className="text-xs font-bold text-green-700 uppercase">Checks Passed</span>
                     </div>
                     <div className={`p-4 rounded-xl border ${theme.colors.border} bg-red-50/50 flex flex-col justify-center items-center`}>
                         <ShieldAlert className="text-red-600 mb-2" size={32}/>
                         <span className="text-2xl font-black text-slate-900">{metrics.filter(m => !m.passed).length}</span>
                         <span className="text-xs font-bold text-red-700 uppercase">Checks Failed</span>
                     </div>
                 </div>
            </div>

            {/* Detailed Table */}
            <div className={`${theme.components.card} overflow-hidden`}>
                <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-xs text-slate-500 uppercase tracking-widest">
                    Assessment Detail
                </div>
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-white">
                        <tr>
                            <th className={theme.components.table.header}>Check</th>
                            <th className={`${theme.components.table.header} text-center`}>Threshold</th>
                            <th className={`${theme.components.table.header} text-center`}>Actual</th>
                            <th className={`${theme.components.table.header} text-right`}>Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {metrics.map(m => (
                            <tr key={m.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-sm font-medium text-slate-700">{m.label}</td>
                                <td className="px-6 py-4 text-center text-xs text-slate-500">&le; {m.limit * 100}%</td>
                                <td className="px-6 py-4 text-center text-sm font-bold">
                                    {m.count} <span className="text-slate-400 font-normal">({m.pct}%)</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Badge variant={m.passed ? 'success' : 'danger'}>{m.passed ? 'Pass' : 'Fail'}</Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default ScheduleHealthReport;
