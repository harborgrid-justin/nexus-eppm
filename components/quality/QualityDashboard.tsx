
import React, { useMemo } from 'react';
import { ShieldCheck, Bug, CheckCircle, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { useQualityData } from '../../hooks';
import StatCard from '../shared/StatCard';
import { CustomBarChart } from '../charts/CustomBarChart';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface QualityDashboardProps {
  projectId: string;
}

const QualityDashboard: React.FC<QualityDashboardProps> = ({ projectId }) => {
  const { qualityProfile, paretoData, trendData } = useQualityData(projectId);
  const theme = useTheme();

  if (!qualityProfile || !paretoData || !trendData) {
    return <div className="p-4">Loading quality data...</div>;
  }

  const trendDataSimple = trendData.map(d => ({
      name: d.month,
      Pass: d.Pass,
      Fail: d.Fail
  }));

  // Mock holistic health data
  const healthRadar = [
      { subject: 'Product', A: 92, fullMark: 100 },
      { subject: 'Process', A: 85, fullMark: 100 },
      { subject: 'Supplier', A: 78, fullMark: 100 },
      { subject: 'Safety', A: 98, fullMark: 100 },
      { subject: 'Documentation', A: 88, fullMark: 100 },
      { subject: 'Customer', A: 90, fullMark: 100 },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 animate-in fade-in duration-300">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard 
                title="First Pass Yield" 
                value={`${qualityProfile.passRate.toFixed(1)}%`} 
                subtext="Target: 95%" 
                icon={CheckCircle} 
                trend={qualityProfile.passRate > 95 ? 'up' : 'down'} 
            />
            <StatCard 
                title="Active NCRs" 
                value={qualityProfile.openDefects} 
                subtext={`${qualityProfile.totalDefects} Total Lifetime`} 
                icon={Bug} 
                trend={qualityProfile.openDefects > 5 ? 'down' : 'up'} 
            />
            <StatCard 
                title="Compliance Score" 
                value="92/100" 
                subtext="Based on last audit" 
                icon={ShieldCheck} 
            />
            <StatCard 
                title="Cost of Poor Quality" 
                value="$12.5k" 
                subtext="Rework & Scrap (YTD)" 
                icon={AlertTriangle} 
                trend="down" 
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pareto Chart */}
            <div className={`lg:col-span-2 ${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm`}>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-nexus-600"/> Defect Pareto Analysis
                </h3>
                <CustomBarChart 
                    data={paretoData}
                    xAxisKey="name"
                    dataKey="count"
                    barColor="#ef4444"
                    height={300}
                />
            </div>

            {/* Health Radar */}
            <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm flex flex-col items-center`}>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Quality Health Index</h3>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={healthRadar}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" tick={{fontSize: 11}} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Current Score" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.5} />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Inspection Trend */}
        <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp size={18} className="text-green-600"/> Inspection Results Trend
                </h3>
            </div>
            <CustomBarChart 
                data={trendDataSimple}
                xAxisKey="name"
                dataKey="Pass"
                barColor="#22c55e"
                height={250}
            />
        </div>
    </div>
  );
};

export default QualityDashboard;
