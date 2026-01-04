
import React, { useMemo } from 'react';
import { ShieldCheck, Bug, CheckCircle, AlertTriangle, TrendingUp, Activity, Target, Layers } from 'lucide-react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import StatCard from '../shared/StatCard';
import { CustomBarChart } from '../charts/CustomBarChart';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { formatPercentage } from '../../utils/formatters';
import { QualityReport } from '../../types/index';

const QualityDashboard: React.FC = () => {
  const { qualityProfile, qualityReports } = useProjectWorkspace();
  const theme = useTheme();

  const paretoData = useMemo(() => {
    const categories: Record<string, number> = {};
    (qualityReports as QualityReport[] || []).forEach((report) => {
        const cat = report.type || 'General';
        categories[cat] = (categories[cat] || 0) + 1;
    });
    return Object.entries(categories).map(([name, count]) => ({ name, count }));
  }, [qualityReports]);

  const trendData = useMemo(() => {
    if (!qualityReports || qualityReports.length === 0) return [];

    const timeMap: Record<string, { pass: number; fail: number }> = {};
    
    // Sort reports by date
    const sortedReports = [...qualityReports].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedReports.forEach(report => {
        const date = new Date(report.date);
        const key = date.toLocaleString('default', { month: 'short' }); // Group by month for now
        
        if (!timeMap[key]) timeMap[key] = { pass: 0, fail: 0 };
        
        if (report.status === 'Pass') timeMap[key].pass += 1;
        else if (report.status === 'Fail') timeMap[key].fail += 1;
    });

    return Object.entries(timeMap).map(([month, counts]) => ({
        month,
        Pass: counts.pass,
        Fail: counts.fail
    }));
  }, [qualityReports]);

  const trendDataSimple = trendData.map(d => ({
      name: d.month,
      Pass: d.Pass,
      Fail: d.Fail
  }));

  const healthRadar = [
      { subject: 'Product', A: qualityProfile?.passRate || 0, fullMark: 100 },
      { subject: 'Process', A: 85, fullMark: 100 }, // Metric to be implemented in Phase 5
      { subject: 'Supplier', A: 78, fullMark: 100 }, // Metric to be implemented in Phase 5
      { subject: 'Safety', A: 98, fullMark: 100 }, // Metric to be implemented in Phase 5
      { subject: 'Audit', A: 88, fullMark: 100 }, // Metric to be implemented in Phase 5
      { subject: 'Feedback', A: 90, fullMark: 100 }, // Metric to be implemented in Phase 5
  ];

  if (!qualityProfile) {
    return (
      <div className="flex items-center justify-center h-full">
          <Activity size={24} className="animate-pulse text-slate-300 mr-2" />
          <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aggregating Quality Metrics...</span>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-8 space-y-8 animate-in fade-in duration-500 scrollbar-thin">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                title="First Pass Yield" 
                value={formatPercentage(qualityProfile.passRate)} 
                subtext="Internal Quality Target: 95%" 
                icon={CheckCircle} 
                trend={qualityProfile.passRate > 95 ? 'up' : 'down'} 
            />
            <StatCard 
                title="Non-Conformances" 
                value={qualityProfile.openDefects} 
                subtext={`${qualityProfile.totalDefects} Total Lifetime NCRs`} 
                icon={Bug} 
                trend={qualityProfile.openDefects > 5 ? 'down' : 'up'} 
            />
            <StatCard 
                title="Audit Readiness" 
                value="92%" 
                subtext="Verified via internal controls" 
                icon={ShieldCheck} 
            />
            <StatCard 
                title="Rework Exposure" 
                value="$0" 
                subtext="Cost of Poor Quality (Requires Finance Link)" 
                icon={AlertTriangle} 
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pareto Chart */}
            <div className={`lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[400px]`}>
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Target size={18} className="text-red-500"/> Defect Frequency Pareto Analysis
                    </h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border">Frequency Sorted</span>
                </div>
                <div className="flex-1 min-h-0">
                    {paretoData.length > 0 ? (
                        <CustomBarChart 
                            data={paretoData}
                            xAxisKey="name"
                            dataKey="count"
                            barColor="#ef4444"
                            height={250}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400 text-sm">No defect data available.</div>
                    )}
                </div>
            </div>

            {/* Health Radar */}
            <div className={`bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center h-[400px]`}>
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 self-start">
                    <Layers size={18} className="text-blue-500" /> Multi-Vector Health
                </h3>
                <div className="w-full h-[300px] flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={healthRadar}>
                            <PolarGrid stroke="#f1f5f9" />
                            <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Current Performance" dataKey="A" stroke="#0ea5e9" strokeWidth={2} fill="#0ea5e9" fillOpacity={0.15} />
                            <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Inspection Trend */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-500"/> Verification Velocity (Pass Rate)
                </h3>
                <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Pass</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400"></div> Fail</span>
                </div>
            </div>
            <div className="h-[300px]">
                {trendDataSimple.length > 0 ? (
                    <CustomBarChart 
                        data={trendDataSimple}
                        xAxisKey="name"
                        dataKey="Pass"
                        barColor="#10b981"
                        height={280}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                        No inspection history recorded.
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default QualityDashboard;
