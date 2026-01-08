
import React from 'react';
import { AlertTriangle, ShieldCheck, TrendingDown, List, Plus } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { useTheme } from '../../context/ThemeContext';
import { CustomBarChart } from '../charts/CustomBarChart';
import { EmptyGrid } from '../common/EmptyGrid';
import { useRiskDashboardLogic } from '../../hooks/domain/useRiskDashboardLogic';
import { useNavigate } from 'react-router-dom';

const RiskDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { 
      hasData, categoryData, avgRiskScore, openRisksCount, mitigatedCount, topRisks, totalRisks
  } = useRiskDashboardLogic();

  const handleAddRisk = () => {
      // Navigate to register view to add a risk since this is a dashboard
      // Alternatively, we could open a modal here if provided by the hook, but navigation is safer for dashboard
      navigate('../register');
  };

  if (!hasData) {
      return (
          <div className="h-full flex items-center justify-center p-8 bg-slate-50">
              <EmptyGrid 
                title="Risk Register Isolated"
                description="Identify and register project threats to enable qualitative and quantitative analysis."
                icon={AlertTriangle}
                actionLabel="Identify First Risk"
                onAdd={handleAddRisk}
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
            <StatCard title="Total Risks" value={totalRisks} icon={List} />
            <StatCard title="Open Risks" value={openRisksCount} icon={AlertTriangle} trend="down" />
            <StatCard title="Mitigated / Closed" value={mitigatedCount} icon={ShieldCheck} trend="up" />
            <StatCard title="Avg. Risk Score" value={avgRiskScore} icon={TrendingDown} trend="down" />
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm flex flex-col h-[350px]`}>
                <h3 className={`${theme.typography.h3} mb-4`}>Risk Exposure by Category</h3>
                <div className="flex-1 min-h-0">
                    <CustomBarChart
                        data={categoryData}
                        xAxisKey="name"
                        dataKey="count"
                        height={250}
                        barColor={theme.charts.palette[0]}
                    />
                </div>
            </div>
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm h-[350px] overflow-hidden flex flex-col`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`${theme.typography.h3}`}>Top 5 Risks by Score</h3>
                    <button onClick={handleAddRisk} className="text-xs font-bold text-nexus-600 hover:underline flex items-center gap-1">
                        <Plus size={12}/> Add Risk
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2">
                    <ul className="space-y-3">
                        {topRisks.map(risk => (
                            <li key={risk.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded transition-colors cursor-default">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${getScoreColorClass(risk.score)} ${getScoreTextColorClass(risk.score)}`}>
                                    {risk.score}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800 line-clamp-1" title={risk.description}>{risk.description}</p>
                                    <p className="text-xs text-slate-500">{risk.category} / {risk.ownerId}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
  );
};

export default RiskDashboard;
