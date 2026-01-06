import React, { useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { AlertTriangle, ShieldCheck, TrendingDown, List } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { useTheme } from '../../context/ThemeContext';
import { CustomBarChart } from '../charts/CustomBarChart';
import { EmptyGrid } from '../common/EmptyGrid';

const RiskDashboard: React.FC = () => {
  const { risks } = useProjectWorkspace();
  const theme = useTheme();

  const { categoryData, avgRiskScore, openRisksCount, mitigatedCount } = useMemo(() => {
    if (!risks || risks.length === 0) return { categoryData: [], avgRiskScore: "0.0", openRisksCount: 0, mitigatedCount: 0 };

    const riskCategories = Array.from(new Set(risks.map(r => r.category)));
    const data = riskCategories.map(cat => ({
        name: cat,
        count: risks.filter(r => r.category === cat).length
    }));

    const avg = risks.length > 0 ? (risks.reduce((acc, r) => acc + r.score, 0) / risks.length).toFixed(1) : "0.0";
    const open = risks.filter(r => r.status === 'Open').length;
    const mitigated = risks.filter(r => r.status !== 'Open').length;

    return { categoryData: data, avgRiskScore: avg, openRisksCount: open, mitigatedCount: mitigated };
  }, [risks]);

  const topRisks = useMemo(() => {
      if (!risks) return [];
      return [...risks].sort((a,b) => b.score - a.score).slice(0, 5);
  }, [risks]);

  if (!risks || risks.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-8 bg-slate-50">
              <EmptyGrid 
                title="Risk Register Isolated"
                description="Identify and register project threats to enable qualitative and quantitative analysis."
                icon={AlertTriangle}
                actionLabel="Identify Risk"
                onAdd={() => {}}
              />
          </div>
      );
  }

  const getScoreColorClass = (score: number) => {
    if (score >= 15) return theme.colors.semantic.danger.bg; 
    if (score >= 8) return theme.colors.semantic.warning.bg;
    return theme.colors.semantic.success.bg;
  };

  const getScoreTextColorClass = (score: number) => {
    if (score >= 15) return theme.colors.semantic.danger.text; 
    if (score >= 8) return theme.colors.semantic.warning.text;
    return theme.colors.semantic.success.text;
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-nexus-in`}>
        <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
            <StatCard title="Total Risks" value={risks.length} icon={List} />
            <StatCard title="Open Risks" value={openRisksCount} icon={AlertTriangle} trend="down" />
            <StatCard title="Mitigated / Closed" value={mitigatedCount} icon={ShieldCheck} trend="up" />
            <StatCard title="Avg. Risk Score" value={avgRiskScore} icon={TrendingDown} trend="down" />
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
                <h3 className={`${theme.typography.h3} mb-4`}>Risk Exposure by Category</h3>
                <CustomBarChart
                    data={categoryData}
                    xAxisKey="name"
                    dataKey="count"
                    height={250}
                    barColor={theme.charts.palette[0]}
                />
            </div>
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
                <h3 className={`${theme.typography.h3} mb-4`}>Top 5 Risks by Score</h3>
                <ul className="space-y-3">
                    {topRisks.map(risk => (
                        <li key={risk.id} className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${getScoreColorClass(risk.score)} ${getScoreTextColorClass(risk.score)}`}>
                                {risk.score}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800">{risk.description}</p>
                                <p className="text-xs text-slate-500">{risk.category} / {risk.ownerId}</p>
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