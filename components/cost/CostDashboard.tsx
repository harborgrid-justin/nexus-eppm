import React, { useMemo, useState, useEffect, useTransition, useDeferredValue, Suspense } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useEVM } from '../../hooks/useEVM';
import { DollarSign, TrendingUp, TrendingDown, Layers, AlertTriangle, Zap, Coins, ShoppingCart, Loader2, Landmark } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency, formatCurrency, formatPercentage } from '../../utils/formatters';
import { getDaysDiff } from '../../utils/dateUtils';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Area, Bar } from 'recharts';
import { calculateRiskExposure } from '../../utils/integrationUtils';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { EmptyGrid } from '../common/EmptyGrid';

const CostDashboard: React.FC = () => {
  const { project, financials, budgetItems, risks, purchaseOrders, nonConformanceReports } = useProjectWorkspace();
  const evm = useEVM(project, budgetItems);
  const theme = useTheme();
  
  const [includeRisk, setIncludeRisk] = useState(true);
  const [includePendingChanges, setIncludePendingChanges] = useState(false);
  const [isPending, startTransition] = useTransition();

  const deferredIncludeRisk = useDeferredValue(includeRisk);
  const deferredIncludePending = useDeferredValue(includePendingChanges);

  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => { setToday(new Date()); }, []);

  const riskExposure = useMemo(() => calculateRiskExposure(risks), [risks]);
  const costOfQuality = useMemo(() => nonConformanceReports.reduce((sum, ncr) => sum + (ncr.severity === 'Critical' ? 5000 : 1000), 0), [nonConformanceReports]);
  const committedCosts = useMemo(() => purchaseOrders.filter(po => po.status === 'Issued').reduce((sum, po) => sum + po.amount, 0), [purchaseOrders]);

  const eac = useMemo(() => {
      if (!project || !financials || !evm) return 0;
      let projectedCost = evm.eac;
      if (deferredIncludeRisk) projectedCost += riskExposure;
      if (deferredIncludePending) projectedCost += financials.pendingCOAmount;
      return projectedCost;
  }, [project, financials, evm, deferredIncludeRisk, deferredIncludePending, riskExposure]);

  const chartData = useMemo(() => {
    if (!project || !evm || !today || budgetItems.length === 0) return [];
    const startDate = new Date(project.startDate);
    const totalDays = getDaysDiff(project.startDate, project.endDate);
    const data = [];
    for (let i = 0; i <= 12; i++) {
        const curDate = new Date(startDate);
        curDate.setDate(curDate.getDate() + (i * Math.floor(totalDays / 12)));
        const pct = i / 12;
        const curve = (1 - Math.cos(pct * Math.PI)) / 2;
        const pv = (project.originalBudget * curve) * Math.pow(1.03, (i * 30 / 365));
        let ev = curDate <= today ? evm.ev * pct : undefined;
        let ac = curDate <= today ? (evm.ac * pct) + (costOfQuality * pct) : undefined;
        data.push({ 
            date: curDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
            PV: Math.round(pv), 
            EV: ev ? Math.round(ev) : undefined, 
            AC: ac ? Math.round(ac) : undefined, 
            Forecast: i > 6 ? eac * curve : undefined 
        });
    }
    return data;
  }, [project, evm, eac, costOfQuality, today, budgetItems]);

  if (budgetItems.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-8 bg-slate-50">
              <EmptyGrid 
                title="Fiscal Ledger Empty"
                description="Initialize the Cost Breakdown Structure (CBS) and budget allocations to enable performance measurement."
                icon={Landmark}
                actionLabel="Setup CBS"
                onAdd={() => {}}
              />
          </div>
      );
  }

  if (!financials || !today) return <div className="h-full w-full flex items-center justify-center animate-pulse text-slate-300 font-black tracking-widest uppercase">Initializing Fiscal Ledger...</div>;

  return (
    <div className="h-full overflow-y-auto p-8 space-y-8 scrollbar-thin animate-in fade-in duration-500">
        <div className={`${theme.components.card} p-6 flex flex-col xl:flex-row justify-between items-center gap-6 bg-slate-50/50`}>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-nexus-600 text-white rounded-xl shadow-lg shadow-nexus-500/30"><TrendingUp size={24}/></div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">EAC Multi-Variate Analysis</h2>
                    <p className="text-xs text-slate-500 font-medium">Configure forecast inclusions to adjust the Performance Measurement Baseline.</p>
                </div>
            </div>
            <div className="flex gap-8 border-l border-slate-200 pl-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={includeRisk} onChange={e => startTransition(() => setIncludeRisk(e.target.checked))} className="w-4 h-4 rounded text-nexus-600 focus:ring-nexus-500 border-slate-300" />
                    <span className="text-sm font-bold text-slate-700 group-hover:text-nexus-600 transition-colors">Projected Risk EMV</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={includePendingChanges} onChange={e => startTransition(() => setIncludePendingChanges(e.target.checked))} className="w-4 h-4 rounded text-nexus-600 focus:ring-nexus-500 border-slate-300" />
                    <span className="text-sm font-bold text-slate-700 group-hover:text-nexus-600 transition-colors">Pending Changes</span>
                </label>
            </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            <StatCard title="Revised Budget" value={formatCompactCurrency(financials.revisedBudget)} subtext="Approved Baseline" icon={DollarSign} />
            <StatCard title="Committed Cost" value={formatCompactCurrency(committedCosts)} subtext="Issued PO Ledger" icon={ShoppingCart} />
            <StatCard title="Cost of Quality" value={formatCompactCurrency(costOfQuality)} subtext="Rework & Defects" icon={Coins} trend="down"/>
            <StatCard title="EAC (Forecast)" value={formatCompactCurrency(eac)} subtext={`Target: ${formatCompactCurrency(project.budget)}`} icon={Layers} trend={project.budget >= eac ? 'up' : 'down'} />
        </div>

        <Card className={`p-8 h-[450px] relative transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            {isPending && <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/20 backdrop-blur-[1px]"><Loader2 className="animate-spin text-nexus-600 mb-2" size={32}/><p className="text-[10px] font-black uppercase text-nexus-700 tracking-widest">Simulating EAC Curve...</p></div>}
            <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2 border-b border-slate-50 pb-4"><TrendingUp className="text-nexus-600" size={20}/> Risk-Adjusted S-Curve (PMB)</h3>
            <div className="flex-1 h-[320px]">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                            <XAxis dataKey="date" tick={{fontSize: 11, fontWeight: 'bold'}} />
                            <YAxis tickFormatter={(val) => formatCompactCurrency(val)} tick={{fontSize: 11, fontWeight: 'bold'}} />
                            <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={theme.charts.tooltip} />
                            <Area type="monotone" dataKey="PV" fill="#f1f5f9" stroke="#94a3b8" strokeWidth={2} name="Planned Value" />
                            <Line type="monotone" dataKey="EV" stroke={theme.charts.palette[1]} strokeWidth={3} dot={false} name="Earned Value" />
                            <Line type="monotone" dataKey="AC" stroke={theme.charts.palette[3]} strokeWidth={3} dot={false} name="Actual Cost" />
                            <Line type="monotone" dataKey="Forecast" stroke={theme.charts.palette[2]} strokeWidth={3} strokeDasharray="6 4" name="EAC Projection" dot={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
                        Chart requires a defined project schedule and budget.
                    </div>
                )}
            </div>
        </Card>
    </div>
  );
};
export default CostDashboard;