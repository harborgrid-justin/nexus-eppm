import React from 'react';
import { useProjectState } from '../../hooks/useProjectState';
import { AlertTriangle, ShieldCheck, BarChart, TrendingUp, List } from 'lucide-react';
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';

interface RiskDashboardProps {
  projectId: string;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-sm font-medium text-slate-500">{title}</h4>
        <Icon size={20} className="text-slate-400" />
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
    </div>
);

const RiskDashboard: React.FC<RiskDashboardProps> = ({ projectId }) => {
  const { risks } = useProjectState(projectId);

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

  if (!risks) return null;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Risks" value={risks.length} icon={List} />
            <StatCard title="Open Risks" value={risks.filter(r => r.status === 'Open').length} icon={AlertTriangle} />
            <StatCard title="Mitigated / Closed" value={risks.filter(r => r.status !== 'Open').length} icon={ShieldCheck} />
            <StatCard title="Avg. Risk Score" value={ (risks.reduce((acc, r) => acc + r.score, 0) / risks.length).toFixed(1) } icon={TrendingUp} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Risk Exposure by Category</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={categoryData} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={20} />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Top 5 Risks by Score</h3>
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