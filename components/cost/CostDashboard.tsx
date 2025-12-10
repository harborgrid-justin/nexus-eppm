import React from 'react';
import { useProjectState } from '../../hooks/useProjectState';
import { DollarSign, TrendingUp, TrendingDown, Layers, LineChart as LineChartIcon } from 'lucide-react';

interface CostDashboardProps {
  projectId: string;
}

const StatCard: React.FC<{ title: string; value: string; subtext: string; icon: React.ElementType }> = ({ title, value, subtext, icon: Icon }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-sm font-medium text-slate-500">{title}</h4>
        <Icon size={20} className="text-slate-400" />
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{subtext}</div>
    </div>
);

const CostDashboard: React.FC<CostDashboardProps> = ({ projectId }) => {
  const { financials } = useProjectState(projectId);

  if (!financials) return null;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Revised Budget" value={`$${(financials.revisedBudget / 1000000).toFixed(2)}M`} subtext="Original + Approved Changes" icon={DollarSign} />
            <StatCard title="Actuals (Cost)" value={`$${(financials.totalActual / 1000000).toFixed(2)}M`} subtext={`${financials.budgetUtilization.toFixed(1)}% Utilized`} icon={TrendingUp} />
            <StatCard title="Variance" value={`$${(financials.variance / 1000).toFixed(0)}k`} subtext="Under budget" icon={TrendingDown} />
            <StatCard title="Estimate at Completion" value="$48.2M" subtext="Forecasted total cost" icon={Layers} />
        </div>

        <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Cost Performance (S-Curve)</h3>
                <div className="h-80 flex items-center justify-center text-slate-400">
                    <LineChartIcon size={48} className="opacity-50" />
                    <p className="ml-4">S-Curve Chart Component Scaffold (PV, EV, AC)</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CostDashboard;