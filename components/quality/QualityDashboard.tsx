import React from 'react';
import { ShieldCheck, Bug, CheckCircle, AlertTriangle } from 'lucide-react';
import { useQualityData } from '../../hooks';
import StatCard from '../shared/StatCard';
import { CustomBarChart } from '../charts/CustomBarChart';

interface QualityDashboardProps {
  projectId: string;
}

const QualityDashboard: React.FC<QualityDashboardProps> = ({ projectId }) => {
  const { qualityProfile, paretoData, trendData } = useQualityData(projectId);

  if (!qualityProfile || !paretoData || !trendData) {
    return <div className="p-4">Loading quality data...</div>;
  }

  // Flatten trend data for CustomBarChart which currently supports single data key per chart simply
  // For simplicity in this fix, we'll just show Pass trends
  const trendDataSimple = trendData.map(d => ({
      name: d.month,
      Pass: d.Pass
  }));

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
                <h3 className="text-lg font-bold text-slate-900 mb-4">Defect Analysis by Category</h3>
                <CustomBarChart 
                    data={paretoData}
                    xAxisKey="name"
                    dataKey="count"
                    barColor="#ef4444"
                    height={250}
                />
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Inspections Passed Trend</h3>
                 <CustomBarChart 
                    data={trendDataSimple}
                    xAxisKey="name"
                    dataKey="Pass"
                    barColor="#22c55e"
                    height={250}
                />
            </div>
        </div>
    </div>
  );
};

export default QualityDashboard;