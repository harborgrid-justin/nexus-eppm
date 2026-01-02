
import React, { useMemo, useState, useEffect } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useEVM } from '../../hooks/useEVM';
import { DollarSign, TrendingUp, TrendingDown, Layers, AlertTriangle, Zap, Coins, ShoppingCart } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency, formatCurrency, formatPercentage } from '../../utils/formatters';
import { getDaysDiff } from '../../utils/dateUtils';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Area, Bar } from 'recharts';
import { calculateRiskExposure } from '../../utils/integrationUtils';
import { useTheme } from '../../context/ThemeContext';

const CostDashboard: React.FC = () => {
  const { project, financials, budgetItems, risks, purchaseOrders, nonConformanceReports } = useProjectWorkspace();
  const evm = useEVM(project, budgetItems);
  const theme = useTheme();
  
  const [includeRisk, setIncludeRisk] = useState(true);
  const [includePendingChanges, setIncludePendingChanges] = useState(false);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  const riskExposure = useMemo(() => calculateRiskExposure(risks), [risks]);
  
  const costOfQuality = useMemo(() => nonConformanceReports.reduce((sum, ncr) => {
      return sum + (ncr.severity === 'Critical' ? 5000 : 1000); 
  }, 0), [nonConformanceReports]);

  const committedCosts = useMemo(() => purchaseOrders
    .filter(po => po.status === 'Issued')
    .reduce((sum, po) => sum + po.amount, 0), [purchaseOrders]);

  const eac = useMemo(() => {
      if (!project || !financials || !evm) return 0;
      let projectedCost = evm.eac;
      if (includeRisk) projectedCost += riskExposure;
      if (includePendingChanges) projectedCost += financials.pendingCOAmount;
      return projectedCost;
  }, [project, financials, evm, includeRisk, includePendingChanges, riskExposure]);

  const chartData = useMemo(() => {
    if (!project || !evm || !today) return [];
    
    const startDate = new Date(project.startDate);
    const totalDays = getDaysDiff(project.startDate, project.endDate);
    
    const data = [];
    const steps = 12;
    const stepSize = Math.max(1, Math.floor(totalDays / steps));

    for (let i = 0; i <= steps; i++) {
        const currentDayOffset = i * stepSize;
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + currentDayOffset);
        
        const percentTime = Math.min(1, currentDayOffset / totalDays);
        const curveFactor = (1 - Math.cos(percentTime * Math.PI)) / 2;
        const inflationFactor = Math.pow(1.03, (currentDayOffset / 365));
        const pv = (project.originalBudget * curveFactor) * inflationFactor;

        let ev = undefined;
        let ac = undefined;
        let forecast = undefined;

        if (currentDate <= today) {
            ev = evm.ev * curveFactor; 
            ac = (evm.ac * curveFactor) + (costOfQuality * curveFactor); 
        } else {
            forecast = eac * curveFactor;
        }

        data.push({
            date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            PV: Math.round(pv),
            EV: ev ? Math.round(ev) : undefined,
            AC: ac ? Math.round(ac) : undefined,
            Forecast: forecast ? Math.round(forecast) : undefined
        });
    }
    return data;
  }, [project, evm, eac, costOfQuality, today]);

  if (!financials || !today) return <div>Loading...</div>;

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
        
        <div className={`${theme.components.card} ${theme.layout.cardPadding} flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4`}>
            <div>
                <h2 className={`${theme.typography.h3}`}>Integrated Cost Analysis</h2>
                <p className={`${theme.typography.small} mt-1`}>Includes Risk, Quality, and Procurement impacts.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <label className={`flex items-center gap-2 text-sm ${theme.colors.text.primary} cursor-pointer`}>
                    <input type="checkbox" checked={includeRisk} onChange={e => setIncludeRisk(e.target.checked)} className="rounded text-nexus-600"/>
                    Include Risk Exposure (+{formatCompactCurrency(riskExposure)})
                </label>
                <label className={`flex items-center gap-2 text-sm ${theme.colors.text.primary} cursor-pointer`}>
                    <input type="checkbox" checked={includePendingChanges} onChange={e => setIncludePendingChanges(e.target.checked)} className="rounded text-nexus-600"/>
                    Pending Changes (+{formatCompactCurrency(financials.pendingCOAmount)})
                </label>
            </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
            <StatCard title="Revised Budget" value={formatCompactCurrency(financials.revisedBudget)} subtext="Original + Approved Changes" icon={DollarSign} />
            <StatCard title="Committed Cost" value={formatCompactCurrency(committedCosts)} subtext="Issued Purchase Orders" icon={ShoppingCart} />
            <StatCard title="Cost of Quality" value={formatCompactCurrency(costOfQuality)} subtext="Rework & Defects Impact" icon={Coins} trend="down"/>
            <StatCard title="Forecast (EAC)" value={formatCompactCurrency(eac)} subtext={`Var: ${formatCompactCurrency(project.budget - eac)}`} icon={Layers} trend={project.budget - eac >= 0 ? 'up' : 'down'} />
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
            <div className={`lg:col-span-2 ${theme.components.card} ${theme.layout.cardPadding} h-[400px]`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`${theme.typography.h3} flex items-center gap-2`}>
                        <TrendingUp className="text-nexus-600" size={20}/> Risk-Adjusted S-Curve
                    </h3>
                </div>
                <ResponsiveContainer width="100%" height="85%">
                    <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(val) => formatCompactCurrency(val)} />
                        <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={theme.charts.tooltip} />
                        <Legend />
                        <Area type="monotone" dataKey="PV" fill={theme.colors.background} stroke="#94a3b8" strokeWidth={2} name="Planned Value" />
                        <Line type="monotone" dataKey="EV" stroke={theme.charts.palette[1]} strokeWidth={3} dot={false} name="Earned Value" />
                        <Line type="monotone" dataKey="AC" stroke={theme.charts.palette[3]} strokeWidth={3} dot={false} name="Actual Cost" />
                        <Line type="monotone" dataKey="Forecast" stroke={theme.charts.palette[2]} strokeWidth={2} strokeDasharray="5 5" name="Forecast (Risk Adj)" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div className={`${theme.components.card} ${theme.layout.cardPadding} flex flex-col justify-between`}>
                <h3 className={`${theme.typography.h3} mb-4 flex items-center gap-2`}><Zap size={18} className="text-purple-500"/> Efficiency Metrics</h3>
                
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-sm mb-1"><span className={theme.colors.text.secondary}>Cost Efficiency (CPI)</span><span className={`font-bold ${evm.cpi >= 1 ? 'text-green-600' : 'text-red-600'}`}>{evm.cpi.toFixed(2)}</span></div>
                        <div className={`w-full ${theme.colors.background} h-2 rounded-full overflow-hidden`}><div className={`h-full ${evm.cpi >= 1 ? 'bg-green-500' : 'bg-red-500'}`} style={{width: `${Math.min(evm.cpi * 100, 100)}%`}}></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1"><span className={theme.colors.text.secondary}>Schedule Efficiency (SPI)</span><span className={`font-bold ${evm.spi >= 1 ? 'text-green-600' : 'text-yellow-600'}`}>{evm.spi.toFixed(2)}</span></div>
                        <div className={`w-full ${theme.colors.background} h-2 rounded-full overflow-hidden`}><div className={`h-full ${evm.spi >= 1 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{width: `${Math.min(evm.spi * 100, 100)}%`}}></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1"><span className={theme.colors.text.secondary}>To Complete (TCPI)</span><span className={`font-bold ${evm.tcpi <= 1 ? 'text-green-600' : 'text-red-600'}`}>{evm.tcpi.toFixed(2)}</span></div>
                        <div className={`w-full ${theme.colors.background} h-2 rounded-full overflow-hidden`}><div className={`h-full ${evm.tcpi <= 1 ? 'bg-green-500' : 'bg-red-500'}`} style={{width: `${Math.min(evm.tcpi * 100, 100)}%`}}></div></div>
                    </div>
                </div>

                <div className={`mt-6 ${theme.colors.background} p-4 rounded-lg border ${theme.colors.border}`}>
                    <p className={`text-sm ${theme.colors.text.primary} leading-relaxed`}>CPI is <strong>{evm.cpi.toFixed(2)}</strong>. Projected overrun is <strong>{formatPercentage(((eac - project.budget)/project.budget)*100, 1)}</strong>.</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CostDashboard;
