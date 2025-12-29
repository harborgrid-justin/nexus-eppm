
import React, { useMemo, useState } from 'react';
import { useProjectState } from '../../hooks';
import { useEVM } from '../../hooks/useEVM';
import { DollarSign, TrendingUp, TrendingDown, Layers, AlertTriangle, Zap, Coins, ShoppingCart } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency, formatCurrency, formatPercentage } from '../../utils/formatters';
import { calculateProjectProgress } from '../../utils/calculations';
import { getDaysDiff } from '../../utils/dateUtils';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Area, Bar } from 'recharts';
import { calculateRiskExposure, calculateCommittedCost } from '../../utils/integrationUtils';

interface CostDashboardProps {
  projectId: string;
}

const CostDashboard: React.FC<CostDashboardProps> = ({ projectId }) => {
  const { project, financials, budgetItems, risks, purchaseOrders, nonConformanceReports } = useProjectState(projectId);
  const evm = useEVM(project, budgetItems);
  
  // Feature: Toggles for "What-If" Analysis
  const [includeRisk, setIncludeRisk] = useState(true);
  const [includePendingChanges, setIncludePendingChanges] = useState(false);

  // --- Integration Metrics ---
  // Feature: Risk Exposure Calculation (EMV)
  const riskExposure = useMemo(() => calculateRiskExposure(risks), [risks]);
  
  // Feature: Cost of Quality (CoQ) - Mock calculation based on NCR severity
  const costOfQuality = useMemo(() => nonConformanceReports.reduce((sum, ncr) => {
      return sum + (ncr.severity === 'Critical' ? 5000 : 1000); // Mock rework costs
  }, 0), [nonConformanceReports]);

  // Feature: Procurement Commitments
  const committedCosts = useMemo(() => purchaseOrders
    .filter(po => po.status === 'Issued')
    .reduce((sum, po) => sum + po.amount, 0), [purchaseOrders]);

  const eac = useMemo(() => {
      if (!project || !financials || !evm) return 0;
      
      let projectedCost = evm.eac;

      // Feature: Advanced EAC Modeling
      if (includeRisk) projectedCost += riskExposure;
      if (includePendingChanges) projectedCost += financials.pendingCOAmount;
      
      return projectedCost;
  }, [project, financials, evm, includeRisk, includePendingChanges, riskExposure]);

  const chartData = useMemo(() => {
    if (!project || !evm) return [];
    
    const startDate = new Date(project.startDate);
    const totalDays = getDaysDiff(project.startDate, project.endDate);
    const today = new Date();
    
    const data = [];
    const steps = 12;
    const stepSize = Math.max(1, Math.floor(totalDays / steps));

    for (let i = 0; i <= steps; i++) {
        const currentDayOffset = i * stepSize;
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + currentDayOffset);
        
        const percentTime = Math.min(1, currentDayOffset / totalDays);
        const curveFactor = (1 - Math.cos(percentTime * Math.PI)) / 2;
        
        // Feature: Inflation Modeling (Compound 3% annually)
        const inflationFactor = Math.pow(1.03, (currentDayOffset / 365));
        const pv = (project.originalBudget * curveFactor) * inflationFactor;

        let ev = undefined;
        let ac = undefined;
        let forecast = undefined;

        if (currentDate <= today) {
            ev = evm.ev * curveFactor; 
            ac = (evm.ac * curveFactor) + (costOfQuality * curveFactor); // Integrated CoQ
        } else {
            // Feature: Forecast Projection Line
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
  }, [project, evm, eac, costOfQuality]);

  if (!financials) return null;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 animate-in fade-in duration-300">
        
        {/* Feature: Integrated Cost Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
            <div>
                <h2 className="text-lg font-bold text-slate-800">Integrated Cost Analysis</h2>
                <p className="text-xs text-slate-500">Includes Risk, Quality, and Procurement impacts.</p>
            </div>
            <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={includeRisk} onChange={e => setIncludeRisk(e.target.checked)} className="rounded text-nexus-600"/>
                    Include Risk Exposure (+{formatCompactCurrency(riskExposure)})
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={includePendingChanges} onChange={e => setIncludePendingChanges(e.target.checked)} className="rounded text-nexus-600"/>
                    Pending Changes (+{formatCompactCurrency(financials.pendingCOAmount)})
                </label>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Revised Budget" value={formatCompactCurrency(financials.revisedBudget)} subtext="Original + Approved Changes" icon={DollarSign} />
            
            {/* Feature: Procurement Integration in Card */}
            <StatCard title="Committed Cost" value={formatCompactCurrency(committedCosts)} subtext="Issued Purchase Orders" icon={ShoppingCart} />
            
            {/* Feature: Quality Cost Integration */}
            <StatCard title="Cost of Quality" value={formatCompactCurrency(costOfQuality)} subtext="Rework & Defects Impact" icon={Coins} trend="down"/>
            
            <StatCard title="Forecast (EAC)" value={formatCompactCurrency(eac)} subtext={`Var: ${formatCompactCurrency(project.budget - eac)}`} icon={Layers} trend={project.budget - eac >= 0 ? 'up' : 'down'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="text-nexus-600" size={20}/> Risk-Adjusted S-Curve
                    </h3>
                </div>
                <ResponsiveContainer width="100%" height="85%">
                    <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(val) => formatCompactCurrency(val)} />
                        <Tooltip formatter={(val: number) => formatCurrency(val)} />
                        <Legend />
                        <Area type="monotone" dataKey="PV" fill="#f1f5f9" stroke="#94a3b8" strokeWidth={2} name="Planned Value" />
                        <Line type="monotone" dataKey="EV" stroke="#22c55e" strokeWidth={3} dot={false} name="Earned Value" />
                        <Line type="monotone" dataKey="AC" stroke="#ef4444" strokeWidth={3} dot={false} name="Actual Cost" />
                        <Line type="monotone" dataKey="Forecast" stroke="#eab308" strokeWidth={2} strokeDasharray="5 5" name="Forecast (Risk Adj)" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Feature: Performance Indices Gauge */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Zap size={18} className="text-purple-500"/> Efficiency Metrics</h3>
                
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">Cost Efficiency (CPI)</span>
                            <span className={`font-bold ${evm.cpi >= 1 ? 'text-green-600' : 'text-red-600'}`}>{evm.cpi.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className={`h-full ${evm.cpi >= 1 ? 'bg-green-500' : 'bg-red-500'}`} style={{width: `${Math.min(evm.cpi * 100, 100)}%`}}></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Target: 1.0+</p>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">Schedule Efficiency (SPI)</span>
                            <span className={`font-bold ${evm.spi >= 1 ? 'text-green-600' : 'text-yellow-600'}`}>{evm.spi.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className={`h-full ${evm.spi >= 1 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{width: `${Math.min(evm.spi * 100, 100)}%`}}></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">To Complete (TCPI)</span>
                            <span className={`font-bold ${evm.tcpi <= 1 ? 'text-green-600' : 'text-red-600'}`}>{evm.tcpi.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className={`h-full ${evm.tcpi <= 1 ? 'bg-green-500' : 'bg-red-500'}`} style={{width: `${Math.min(evm.tcpi * 100, 100)}%`}}></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Efficiency needed to finish on budget.</p>
                    </div>
                </div>

                <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Automated Analysis</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        CPI is currently <strong>{evm.cpi.toFixed(2)}</strong>. 
                        With risk exposure of <strong>{formatCompactCurrency(riskExposure)}</strong>, 
                        the projected overrun is <strong>{formatPercentage(((eac - project.budget)/project.budget)*100, 1)}</strong>. 
                        Recommend utilizing contingency for WBS 1.2 material escalation.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CostDashboard;