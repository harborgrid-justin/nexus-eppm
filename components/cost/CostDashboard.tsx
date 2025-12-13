
import React, { useMemo } from 'react';
import { useProjectState } from '../../hooks';
import { useEVM } from '../../hooks/useEVM';
import { DollarSign, TrendingUp, TrendingDown, Layers } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency, formatCurrency, formatPercentage } from '../../utils/formatters';
import { calculateProjectProgress } from '../../utils/calculations';
import { getDaysDiff } from '../../utils/dateUtils';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface CostDashboardProps {
  projectId: string;
}

const CostDashboard: React.FC<CostDashboardProps> = ({ projectId }) => {
  const { project, financials, budgetItems } = useProjectState(projectId);
  const evm = useEVM(project, budgetItems);

  const eac = useMemo(() => {
      if (!project || !financials) return 0;
      // Calculate EVM metrics for EAC
      const ev = project.originalBudget * (calculateProjectProgress(project) / 100);
      const ac = project.spent;
      const cpi = ac > 0 ? (ev / ac) : 1;
      
      // BAC / CPI = EAC
      return cpi > 0 ? project.originalBudget / cpi : project.originalBudget;
  }, [project, financials]);

  const sCurveData = useMemo(() => {
    if (!project || !evm) return [];
    
    const startDate = new Date(project.startDate);
    const totalDays = getDaysDiff(project.startDate, project.endDate);
    const today = new Date();
    
    const data = [];
    // Generate 12 points for the project duration
    const steps = 12;
    const stepSize = Math.max(1, Math.floor(totalDays / steps));

    for (let i = 0; i <= steps; i++) {
        const currentDayOffset = i * stepSize;
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + currentDayOffset);
        
        const percentTime = Math.min(1, currentDayOffset / totalDays);
        
        // S-Curve logic for Planned Value (PV)
        // Standard S-curve approximation using sine/cosine easing
        const curveFactor = (1 - Math.cos(percentTime * Math.PI)) / 2;
        const pv = project.originalBudget * curveFactor;

        // Earned Value (EV) & Actual Cost (AC) - Stop at today
        let ev = undefined;
        let ac = undefined;

        if (currentDate <= today) {
            // Add some randomness relative to PV to simulate performance for demo
            // In real app, this comes from historical snapshots
            ev = evm.ev * curveFactor; 
            ac = evm.ac * curveFactor; 
        } else if (i === steps) {
            // Forecast point
            // ac = eac;
        }

        data.push({
            date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            PV: Math.round(pv),
            EV: ev ? Math.round(ev) : undefined,
            AC: ac ? Math.round(ac) : undefined
        });
    }
    return data;
  }, [project, evm]);

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
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="text-nexus-600" size={20}/> Cost Performance S-Curve
                    </h3>
                    <div className="flex gap-4 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1"><div className="w-3 h-1 bg-slate-400"></div> Planned Value (PV)</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-1 bg-green-500"></div> Earned Value (EV)</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-1 bg-red-500"></div> Actual Cost (AC)</span>
                    </div>
                </div>
                
                <ResponsiveContainer width="100%" height="85%">
                    <LineChart data={sCurveData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(val) => formatCompactCurrency(val)} />
                        <Tooltip formatter={(val: number) => formatCurrency(val)} />
                        <Legend />
                        <Line type="monotone" dataKey="PV" stroke="#94a3b8" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="EV" stroke="#22c55e" strokeWidth={2} dot={{r:4}} />
                        <Line type="monotone" dataKey="AC" stroke="#ef4444" strokeWidth={2} dot={{r:4}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

export default CostDashboard;
