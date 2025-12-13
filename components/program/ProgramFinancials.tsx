
import React from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { TrendingUp, Lock, Unlock, DollarSign, PieChart as PieIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../shared/StatCard';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, Line } from 'recharts';

interface ProgramFinancialsProps {
  programId: string;
}

const ProgramFinancials: React.FC<ProgramFinancialsProps> = ({ programId }) => {
  const { programFinancials, aggregateMetrics, projects } = useProgramData(programId);
  const theme = useTheme();

  const remainingBudget = aggregateMetrics.totalBudget - aggregateMetrics.totalSpent;
  const projectNamesMap = new Map(projects.map(p => [p.id, p.name]));

  // Prepare chart data
  const chartData = programFinancials.allocations.map(a => ({
      name: projectNamesMap.get(a.projectId) || a.projectId,
      Allocated: a.allocated,
      Spent: a.spent,
      Forecast: a.forecast
  }));

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Program Financial Management</h2>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Program Budget" value={formatCompactCurrency(aggregateMetrics.totalBudget)} icon={DollarSign} />
            <StatCard title="Actual Spend" value={formatCompactCurrency(aggregateMetrics.totalSpent)} subtext={`${((aggregateMetrics.totalSpent / aggregateMetrics.totalBudget) * 100).toFixed(1)}% consumed`} icon={TrendingUp} />
            <StatCard title="Remaining Funding" value={formatCompactCurrency(remainingBudget)} icon={Lock} />
            <StatCard title="Forecast at Completion" value={formatCompactCurrency(aggregateMetrics.totalBudget * 1.05)} subtext="Estimated variance +5%" icon={PieIcon} trend="down" />
        </div>

        {/* Budget Allocation & Forecast */}
        <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm h-[400px]`}>
            <h3 className="font-bold text-slate-800 mb-4">Budget Allocation & Cost-to-Complete</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
                    <YAxis tickFormatter={(val) => formatCompactCurrency(val)} />
                    <Tooltip formatter={(val: number) => formatCurrency(val)} />
                    <Legend />
                    <Bar dataKey="Allocated" fill="#94a3b8" />
                    <Bar dataKey="Spent" fill="#0ea5e9" />
                    <Bar dataKey="Forecast" fill="#f59e0b" />
                </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Funding Gates */}
        <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Lock size={16}/> Funding Gates</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {programFinancials.gates.map(gate => (
                    <div key={gate.id} className="p-6 flex flex-col items-center text-center relative group">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                            gate.status === 'Released' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'
                        }`}>
                            {gate.status === 'Released' ? <Unlock size={20}/> : <Lock size={20}/>}
                        </div>
                        <h4 className="font-bold text-slate-900">{gate.name}</h4>
                        <p className="text-sm text-slate-600 mt-1">{gate.milestoneTrigger}</p>
                        <p className="text-xl font-bold text-nexus-700 mt-2">{formatCompactCurrency(gate.amount)}</p>
                        <p className="text-xs text-slate-400 mt-1">Date: {gate.releaseDate}</p>
                        <div className={`mt-3 px-3 py-1 text-xs font-bold rounded-full ${
                            gate.status === 'Released' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                        }`}>
                            {gate.status}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default ProgramFinancials;
