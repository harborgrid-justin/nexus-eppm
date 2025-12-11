import React from 'react';
import { ShieldCheck, Bug, CheckCircle, BarChart, AlertTriangle } from 'lucide-react';
import { useQualityData } from '../../hooks';
import StatCard from '../shared/StatCard';
import { ResponsiveContainer, ComposedChart, Bar as RechartsBar, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { NonConformanceReport, QualityReport } from '../../types';

interface QualityDashboardProps {
  projectId: string;
}

const QualityDashboard: React.FC<QualityDashboardProps> = ({ projectId }) => {
  const { qualityProfile, paretoData, trendData } = useQualityData(projectId);

  if (!qualityProfile || !paretoData || !trendData) {
    return <div className="p-4">Loading quality data...</div>;
  }

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
                        <RechartsBar data={trendData} barSize={20}>
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
