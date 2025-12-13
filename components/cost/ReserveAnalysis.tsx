
import React, { useMemo, useState } from 'react';
import { useProjectState } from '../../hooks';
import { useData } from '../../context/DataContext';
import { ShieldAlert, TrendingUp, AlertTriangle, Calculator, RefreshCw, Save, PieChart, ArrowRight, Lock } from 'lucide-react';
import { formatCurrency, formatCompactCurrency, formatPercentage } from '../../utils/formatters';
import { calculateRiskExposure } from '../../utils/integrationUtils';
import StatCard from '../shared/StatCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Cell, AreaChart, Area } from 'recharts';
import { BudgetLogItem } from '../../types';

interface ReserveAnalysisProps {
  projectId: string;
}

const ReserveAnalysis: React.FC<ReserveAnalysisProps> = ({ projectId }) => {
  const { project, risks, budgetItems } = useProjectState(projectId);
  const { dispatch } = useData();
  
  const [calculationMethod, setCalculationMethod] = useState<'Fixed' | 'Percentage' | 'EMV'>('EMV');
  const [percentInput, setPercentInput] = useState(10);

  // --- Derived Metrics ---

  const currentRiskExposure = useMemo(() => calculateRiskExposure(risks), [risks]);
  
  // Calculate Base Cost (Sum of all planned cost categories excluding reserves)
  const baseCost = useMemo(() => budgetItems.reduce((sum, b) => sum + b.planned, 0), [budgetItems]);

  // Current Planned Reserves (from Project Data)
  const contingencyReserve = project?.reserves?.contingencyReserve || 0;
  const managementReserve = project?.reserves?.managementReserve || 0;
  const totalReserves = contingencyReserve + managementReserve;

  // Calculate Drawdowns (Consumed Reserves) based on Budget Log
  // Assuming log items with specific sources imply drawdown
  const drawdowns = useMemo(() => {
      const contingencyDrawdown = (project?.budgetLog || [])
        .filter(log => log.source === 'Contingency' && log.status === 'Approved')
        .reduce((sum, log) => sum + log.amount, 0);

      const managementDrawdown = (project?.budgetLog || [])
        .filter(log => log.source === 'Management Reserve' && log.status === 'Approved')
        .reduce((sum, log) => sum + log.amount, 0);

      return { contingency: Math.abs(contingencyDrawdown), management: Math.abs(managementDrawdown) };
  }, [project?.budgetLog]);

  const remainingContingency = contingencyReserve - drawdowns.contingency;
  const remainingManagement = managementReserve - drawdowns.management;

  // Coverage Ratio: Remaining Contingency / Current Risk Exposure
  const coverageRatio = currentRiskExposure > 0 ? (remainingContingency / currentRiskExposure) : 2.0; // Cap at 200% for display logic if 0 risk

  // --- Chart Data ---

  // Waterfall Data: Base + Reserves = Total Budget
  const waterfallData = [
      { name: 'Base Cost', value: baseCost, fill: '#64748b' }, // Slate
      { name: 'Contingency', value: contingencyReserve, fill: '#eab308' }, // Yellow
      { name: 'Mgmt Reserve', value: managementReserve, fill: '#3b82f6' }, // Blue
      { name: 'Total Budget', value: baseCost + totalReserves, fill: '#0ea5e9', isTotal: true }, // Light Blue
  ];

  // Drawdown Trend Data (Mocked but plausible based on current state)
  const trendData = [
      { month: 'Jan', contingency: contingencyReserve, management: managementReserve, exposure: currentRiskExposure * 1.2 },
      { month: 'Feb', contingency: contingencyReserve, management: managementReserve, exposure: currentRiskExposure * 1.1 },
      { month: 'Mar', contingency: contingencyReserve - (drawdowns.contingency * 0.2), management: managementReserve, exposure: currentRiskExposure * 1.1 },
      { month: 'Apr', contingency: contingencyReserve - (drawdowns.contingency * 0.5), management: managementReserve, exposure: currentRiskExposure * 1.05 },
      { month: 'May', contingency: remainingContingency, management: remainingManagement, exposure: currentRiskExposure },
  ];

  // --- Actions ---

  const handleRecalculate = () => {
      if (!project) return;
      
      let newContingency = contingencyReserve;
      
      if (calculationMethod === 'EMV') {
          newContingency = currentRiskExposure;
      } else if (calculationMethod === 'Percentage') {
          newContingency = baseCost * (percentInput / 100);
      }

      // Dispatch update (Mock)
      const updatedProject = {
          ...project,
          reserves: {
              ...project.reserves,
              contingencyReserve: newContingency
          }
      };
      // In a real app: dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
      alert(`Recalculated Contingency to ${formatCurrency(newContingency)} based on ${calculationMethod}`);
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard 
                title="Remaining Reserves" 
                value={formatCompactCurrency(remainingContingency + remainingManagement)} 
                subtext={`of ${formatCompactCurrency(totalReserves)} allocated`} 
                icon={ShieldAlert} 
            />
            <StatCard 
                title="Risk Exposure (EMV)" 
                value={formatCompactCurrency(currentRiskExposure)} 
                subtext="Current aggregated threat" 
                icon={AlertTriangle} 
                trend={currentRiskExposure > remainingContingency ? 'down' : 'up'}
            />
            <StatCard 
                title="Coverage Ratio" 
                value={formatPercentage(Math.min(coverageRatio * 100, 200))} 
                subtext="Target: >100%" 
                icon={PieChart} 
                trend={coverageRatio < 1 ? 'down' : 'up'}
            />
            <StatCard 
                title="Drawdown Rate" 
                value={formatPercentage(((drawdowns.contingency + drawdowns.management) / totalReserves) * 100)} 
                subtext="Utilization to date" 
                icon={TrendingUp} 
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Visual: Waterfall */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <PieChart size={18} className="text-nexus-600"/> Budget Composition
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={waterfallData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(val) => formatCompactCurrency(val)} />
                        <Tooltip formatter={(val: number) => formatCurrency(val)} cursor={{fill: '#f8fafc'}} />
                        <Bar dataKey="value" barSize={60}>
                            {waterfallData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} radius={[4, 4, 0, 0]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Gap Analysis / Calculator Panel */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Calculator size={18} className="text-green-600"/> Reserve Calculator
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Calculation Method</label>
                            <div className="flex gap-2 mt-1">
                                {['Fixed', 'Percentage', 'EMV'].map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setCalculationMethod(method as any)}
                                        className={`flex-1 py-1.5 text-xs font-medium rounded border ${
                                            calculationMethod === method 
                                            ? 'bg-nexus-50 border-nexus-500 text-nexus-700' 
                                            : 'bg-white border-slate-200 text-slate-600'
                                        }`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {calculationMethod === 'Percentage' && (
                            <div className="flex items-center gap-3">
                                <input 
                                    type="number" 
                                    value={percentInput}
                                    onChange={(e) => setPercentInput(parseFloat(e.target.value))}
                                    className="w-20 p-2 border border-slate-300 rounded text-sm"
                                />
                                <span className="text-sm text-slate-600">% of Remaining Cost</span>
                            </div>
                        )}

                        <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Current Exposure (EMV):</span>
                                <span className="font-mono font-bold text-red-600">{formatCurrency(currentRiskExposure)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Allocated Contingency:</span>
                                <span className="font-mono font-bold text-slate-900">{formatCurrency(contingencyReserve)}</span>
                            </div>
                            <div className={`flex justify-between text-sm pt-2 border-t border-slate-200 ${coverageRatio < 1 ? 'text-red-700' : 'text-green-700'}`}>
                                <span className="font-bold">Delta:</span>
                                <span className="font-mono font-bold">
                                    {remainingContingency - currentRiskExposure < 0 ? '-' : '+'}{formatCurrency(Math.abs(remainingContingency - currentRiskExposure))}
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={handleRecalculate}
                            className="w-full py-2 bg-nexus-600 hover:bg-nexus-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
                        >
                            <RefreshCw size={16}/> Update Reserve Plan
                        </button>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2"><Lock size={14}/> Management Reserve</h4>
                    <p className="text-xs text-blue-800 mb-2">Held for unforeseen scope changes. Requires Change Control Board approval to release.</p>
                    <div className="flex justify-between items-center bg-white p-2 rounded border border-blue-100">
                        <span className="text-xs font-bold text-slate-500">Available</span>
                        <span className="font-mono font-bold text-blue-700">{formatCurrency(remainingManagement)}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Burndown Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[350px]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Reserve Burn-down vs. Risk Exposure</h3>
                <div className="flex gap-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><div className="w-3 h-1 bg-yellow-500"></div> Contingency</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-1 bg-red-500"></div> Risk Exposure</span>
                </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(val) => formatCompactCurrency(val)} />
                    <Tooltip formatter={(val: number) => formatCurrency(val)} />
                    <Legend />
                    <Area type="step" dataKey="contingency" name="Remaining Contingency" stroke="#eab308" fill="#fef08a" />
                    <Area type="monotone" dataKey="exposure" name="Risk Exposure" stroke="#ef4444" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default ReserveAnalysis;
