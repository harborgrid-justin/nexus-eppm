import React, { useMemo } from 'react';
import { useProjectState } from '../../hooks';
import { DollarSign, TrendingUp, TrendingDown, Layers, LineChart as LineChartIcon } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency, formatCurrency, formatPercentage } from '../../utils/formatters';
import { calculateProjectProgress } from '../../utils/calculations';

interface CostDashboardProps {
  projectId: string;
}

const CostDashboard: React.FC<CostDashboardProps> = ({ projectId }) => {
  const { project, financials } = useProjectState(projectId);

  const eac = useMemo(() => {
      if (!project || !financials) return 0;
      // Calculate EVM metrics for EAC
      const ev = project.originalBudget * (calculateProjectProgress(project) / 100);
      const ac = project.spent;
      const cpi = ac > 0 ? (ev / ac) : 1;
      
      // BAC / CPI = EAC
      return cpi > 0 ? project.originalBudget / cpi : project.originalBudget;
  }, [project, financials]);

  if (!financials) return null;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Revised Budget" value={formatCompactCurrency(financials.revisedBudget)} subtext="Original + Approved Changes" icon={DollarSign} />
            <StatCard title="Actuals (Cost)" value={formatCompactCurrency(financials.totalActual)} subtext={`${formatPercentage(financials.budgetUtilization, 1)} Utilized`} icon={TrendingUp} />
            <StatCard title="Variance" value={formatCurrency(financials.variance)} subtext={financials.variance >= 0 ? "Under budget" : "Over budget"} icon={TrendingDown} trend={financials.variance >= 0 ? 'up' : 'down'} />
            <StatCard title="Estimate at Completion" value={formatCompactCurrency(eac)} subtext="Forecasted total cost (EAC)" icon={Layers} />
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
