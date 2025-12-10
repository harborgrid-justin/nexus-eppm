
import React, { useMemo } from 'react';
import { ShieldCheck, Bug, CheckCircle, BarChart, AlertTriangle } from 'lucide-react';
import { useProjectState } from '../../hooks/useProjectState';
import StatCard from '../shared/StatCard';
import { ResponsiveContainer, ComposedChart, Bar as RechartsBar, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { NonConformanceReport, QualityReport } from '../../types';

interface QualityDashboardProps {
  projectId: string;
}

const QualityDashboard: React.FC<QualityDashboardProps> = ({ projectId }) => {
  const { qualityProfile, nonConformanceReports, qualityReports } = useProjectState(projectId);

  const paretoData = useMemo(() => {
    if (!nonConformanceReports) return [];
    // FIX: Explicitly typed the accumulator to ensure correct type inference for `categoryCounts`.
    const categoryCounts = nonConformanceReports.reduce((acc: Record<string, number>, defect: NonConformanceReport) => {
        acc[defect.category] = (acc[defect.category] || 0) + 1;
        return acc;
    }, {});

    const sorted = Object.entries(categoryCounts)
        // FIX: Explicitly type array destructuring to ensure `a` and `b` are numbers.
        .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
        .map(([name, count]) => ({ name, count }));

    const total = sorted.reduce((sum, item) => sum + item.count, 0);
    let cumulative = 0;
    return sorted.map(item => {
        cumulative += item.count;
        return { ...item, cumulative: total > 0 ? (cumulative / total) * 100 : 0 };
    });
  }, [nonConformanceReports]);

  const trendData = useMemo(() => {
    if (!qualityReports) return [];
    // FIX: Explicitly typed the accumulator to ensure correct type inference for `monthly`.
    const monthly = qualityReports.reduce((acc: Record<string, { month: string; Pass: number; Fail: number }>, report: QualityReport) => {
        const month = new Date(report.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!acc[month]) acc[month] = { month, Pass: 0, Fail: 0 };
        if (report.status === 'Pass') acc[month].Pass++;
        if (report.status === 'Fail') acc[month].Fail++;
        return acc;
    }, {});
    
    // FIX: With `acc` correctly typed, `a` and `b` are no longer `unknown`, allowing property access.
    return Object.values(monthly).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [qualityReports]);


  if (!qualityProfile) return <div className="p-4">Loading quality data...</div>;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Overall Quality Score" value={`${qualityProfile.passRate.toFixed(1)}%`} icon={ShieldCheck} trend="up" />
            <StatCard title="Open Non-Conformances" value={qualityProfile.openDefects} icon={AlertTriangle} trend="down" />
            <StatCard title="Total Inspections" value={qualityProfile.totalReports} icon={CheckCircle} />
            <StatCard title="Total Defects Logged" value={qualityProfile.totalDefects} icon={Bug} trend="down" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Defect Analysis by Category (Pareto)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={paretoData}>
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" unit="%" />
                            <Tooltip />
                            <Legend />
                            <RechartsBar yAxisId="left" dataKey="count" fill="#0ea5e9" name="Defect Count" />
                            <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#ef4444" name="Cumulative %" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Inspection Pass/Fail Trend</h3>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsBar data={trendData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <RechartsBar dataKey="Pass" stackId="a" fill="#22c55e" />
                            <RechartsBar dataKey="Fail" stackId="a" fill="#ef4444" />
                        </RechartsBar>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>
  );
};

export default QualityDashboard;
