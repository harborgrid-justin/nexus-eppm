import React, { useMemo } from 'react';
import { useProjectState } from '../../hooks';
import { ShieldAlert, ShieldCheck, TrendingUp, BarChart2 } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { useTheme } from '../../context/ThemeContext';
import { CustomBarChart } from '../charts/CustomBarChart';

interface RiskDashboardProps {
  projectId: string;
}

const RiskDashboard: React.FC<RiskDashboardProps> = ({ projectId }) => {
  const { risks } = useProjectState(projectId);
  const theme = useTheme();

  const { categoryData, avgRiskScore, openRisksCount, mitigatedCount } = useMemo(() => {
    if (!risks) return { categoryData: [], avgRiskScore: "N/A", openRisksCount: 0, mitigatedCount: 0 };

    const riskCategories = Array.from(new Set(risks.map(r => r.category)));
    const data = riskCategories.map(cat => ({
        name: cat,
        count: risks.filter(r => r.category === cat).length
    }));

    const avg = risks.length > 0 ? (risks.reduce((acc, r) => acc + r.score, 0) / risks.length).toFixed(1) : "N/A";
    const open = risks.filter(r => r.status === 'Open').length;
    const mitigated = risks.filter(r => r.status !== 'Open').length;

    return { categoryData: data, avgRiskScore: avg, openRisksCount: open, mitigatedCount: mitigated };
  }, [risks]);

  const topRisks = useMemo(() => {
      if (!risks) return [];
      return [...risks].sort((a,b) => b.score - a.score).slice(0, 5);
  }, [risks]);

  const getScoreColor = (score: number) => {
    if (score >= 15) return '#ef4444'; // red
    if (score >= 8) return '#eab308'; // yellow
    return '#22c55e'; // green
  };

  if (!risks) {
    return <div className={theme.layout.pagePadding}>Loading risk data...</div>;
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
        <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
            <StatCard title="Total Risks" value={risks.length} icon={BarChart2} />
            <StatCard title="Open Risks" value={openRisksCount} icon={ShieldAlert} trend="down" />
            <StatCard title="Mitigated / Closed" value={mitigatedCount} icon={ShieldCheck} trend="up" />
            <StatCard title="Avg. Risk Score" value={avgRiskScore} icon={TrendingUp} trend="up" />
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
                <h3 className={`${theme.typography.h3} mb-4`}>Risk Exposure by Category</h3>
                <CustomBarChart
                    data={categoryData}
                    xAxisKey="name"
                    dataKey="count"
                    height={250}
                    barColor="#0ea5e9"
                />
            </div>
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
                <h3 className={`${theme.typography.h3} mb-4`}>Top 5 Risks by Score</h3>
                <ul className="space-y-3">
                    {topRisks.map(risk => (
                        <li key={risk.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-lg" style={{backgroundColor: getScoreColor(risk.score)}}>
                                {risk.score}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800">{risk.description}</p>
                                <p className="text-xs text-slate-500">{risk.category} / {risk.owner}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
};

export default RiskDashboard;