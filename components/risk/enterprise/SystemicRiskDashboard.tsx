
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { ShieldAlert, TrendingUp, Activity, Layers, AlertTriangle, PieChart } from 'lucide-react';
import StatCard from '../../shared/StatCard';
import { CustomBarChart } from '../../charts/CustomBarChart';
import { CustomPieChart } from '../../charts/CustomPieChart';
import { formatCompactCurrency } from '../../../utils/formatters';
import { useSystemicRiskLogic } from '../../../hooks/domain/useSystemicRiskLogic';
import { EmptyGrid } from '../../common/EmptyGrid';
import { useNavigate } from 'react-router-dom';

export const SystemicRiskDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { metrics, projects } = useSystemicRiskLogic();

  if (metrics.totalRisks === 0) {
      return (
          <div className="h-full flex items-center justify-center p-12">
              <EmptyGrid 
                title="Systemic Risk Registry Null"
                description="No organizational or escalated project risks have been identified. Initialize risk monitoring to secure the portfolio."
                icon={ShieldAlert}
                actionLabel="Identify Corporate Risk"
                onAdd={() => navigate('/enterpriseRisks?view=register')}
              />
          </div>
      );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in duration-300`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Risk Exposure" value={formatCompactCurrency(metrics.totalExposure)} icon={ShieldAlert} subtext="Aggregated Financial Impact" />
            <StatCard title="Critical Threats" value={metrics.criticalRisks} icon={AlertTriangle} subtext="Score ≥ 15" trend={metrics.criticalRisks > 5 ? 'down' : 'up'} />
            <StatCard title="Active Risks" value={metrics.totalRisks} icon={Activity} subtext="Across all levels" />
            <StatCard title="Avg Risk Score" value={metrics.avgScore.toFixed(1)} icon={TrendingUp} subtext="Portfolio Heat" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${theme.components.card} ${theme.layout.cardPadding} h-[400px] flex flex-col`}>
                <h3 className={`${theme.typography.h3} mb-6 flex items-center gap-2`}>
                    <Layers size={18} className="text-nexus-600"/> Risk Distribution by Hierarchy
                </h3>
                <div className="flex-1">
                    <CustomBarChart 
                        data={metrics.byContext}
                        xAxisKey="name"
                        dataKey="value"
                        barColor={theme.charts.palette[0]} 
                        height={300}
                    />
                </div>
            </div>

            <div className={`${theme.components.card} ${theme.layout.cardPadding} h-[400px] flex flex-col`}>
                <h3 className={`${theme.typography.h3} mb-6 flex items-center gap-2`}>
                    <PieChart size={18} className="text-blue-500"/> Systemic Risk Categories
                </h3>
                <div className="flex-1">
                    <CustomPieChart data={metrics.categoryData} height={300} />
                </div>
            </div>
        </div>

        {/* Top 5 Critical Risks */}
        <div className={`${theme.components.card} overflow-hidden`}>
            <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.semantic.danger.bg}/20`}>
                <h3 className={`font-bold ${theme.colors.semantic.danger.text} flex items-center gap-2`}>
                    <AlertTriangle size={18}/> Critical Enterprise Risks
                </h3>
            </div>
            <table className="min-w-full divide-y divide-slate-200">
                <thead className={theme.colors.background}>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Context</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Description</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">Score</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Financial Impact</th>
                    </tr>
                </thead>
                <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')} ${theme.colors.surface}`}>
                    {metrics.topRisks.map((risk: any) => (
                        <tr key={risk.id} className="hover:bg-red-50/30">
                            <td className={`px-6 py-4 text-xs font-bold ${theme.colors.text.tertiary}`}>
                                {risk.projectId ? `Project: ${projects.find(p => p.id === risk.projectId)?.code}` : 'Portfolio'}
                            </td>
                            <td className={`px-6 py-4 text-sm font-medium ${theme.colors.text.primary}`}>{risk.description}</td>
                            <td className="px-6 py-4 text-center">
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                                    {risk.score}
                                </span>
                            </td>
                            <td className={`px-6 py-4 text-right font-mono text-sm ${theme.colors.text.secondary}`}>
                                {formatCompactCurrency(risk.financialImpact || 0)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};
