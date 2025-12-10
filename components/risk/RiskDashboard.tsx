
import React from 'react';
import { useProjectState } from '../../hooks';
import { AlertTriangle, ShieldCheck, TrendingDown, List } from 'lucide-react';
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import StatCard from '../shared/StatCard';
import { useTheme } from '../../context/ThemeContext';

interface RiskDashboardProps {
  projectId: string;
}

const RiskDashboard: React.FC<RiskDashboardProps> = ({ projectId }) => {
  const { risks } = useProjectState(projectId);
  const theme = useTheme();

  if (!risks) {
    return <div className={theme.layout.pagePadding}>Loading risk data...</div>;
  }

  const riskCategories = Array.from(new Set(risks.map(r => r.category)));
  const categoryData = riskCategories.map(cat => ({
    name: cat,
    count: risks.filter(r => r.category === cat).length
  }));

  const getScoreColor = (score: number) => {
    if (score >= 15) return '#ef4444'; // red
    if (score >= 8) return '#eab308'; // yellow
    return '#22c55e'; // green
  };

  const avgRiskScore = risks.length > 0 ? (risks.reduce((acc, r) => acc + r.score, 0) / risks.length).toFixed(1) : "N/A";

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
        <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
            <StatCard title="Total Risks" value={risks.length} icon={List} />
            <StatCard title="Open Risks" value={risks.filter(r => r.status === 'Open').length} icon={AlertTriangle} trend="down" />
            <StatCard title="Mitigated / Closed" value={risks.filter(r => r.status !== 'Open').length} icon={ShieldCheck} trend="up" />
            <StatCard title="Avg. Risk Score" value={avgRiskScore} icon={TrendingDown} trend="down" />
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
                <h3 className={`${theme.typography.h3} mb-4`}>Risk Exposure by Category</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={categoryData} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                            <Tooltip cursor={{ fill: '#f1f5f9' }} />
                            <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={20} />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
                <h3 className={`${theme.typography.h3} mb-4`}>Top 5 Risks by Score</h3>
                <ul className="space-y-3">
                    {risks.sort((a,b) => b.score - a.score).slice(0, 5).map(risk => (
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
