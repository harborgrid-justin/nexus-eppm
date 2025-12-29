
import React, { useMemo, useState } from 'react';
import { useProjectState } from '../../hooks';
import { useData } from '../../context/DataContext';
import { ShieldAlert, TrendingUp, AlertTriangle, Calculator, RefreshCw, Save, PieChart, ArrowRight, Lock } from 'lucide-react';
import { formatCurrency, formatCompactCurrency, formatPercentage } from '../../utils/formatters';
import { calculateRiskExposure } from '../../utils/integrationUtils';
import StatCard from '../shared/StatCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Cell, AreaChart, Area } from 'recharts';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';

interface ReserveAnalysisProps {
  projectId: string;
}

const ReserveAnalysis: React.FC<ReserveAnalysisProps> = ({ projectId }) => {
  const { project, risks, budgetItems } = useProjectState(projectId);
  const { dispatch } = useData();
  
  const [isUpdatePanelOpen, setIsUpdatePanelOpen] = useState(false);
  const [newReserves, setNewReserves] = useState({ contingency: 0, management: 0 });
  const [justification, setJustification] = useState('');

  // --- Derived Metrics ---

  const currentRiskExposure = useMemo(() => calculateRiskExposure(risks), [risks]);
  
  // Calculate Base Cost (Sum of all planned cost categories excluding reserves)
  const baseCost = useMemo(() => budgetItems.reduce((sum, b) => sum + b.planned, 0), [budgetItems]);

  // Current Planned Reserves (from Project Data)
  const contingencyReserve = project?.reserves?.contingencyReserve || 0;
  const managementReserve = project?.reserves?.managementReserve || 0;
  const totalReserves = contingencyReserve + managementReserve;

  // Calculate Drawdowns
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

  const coverageRatio = currentRiskExposure > 0 ? (remainingContingency / currentRiskExposure) : 2.0;

  // --- Chart Data ---
  const waterfallData = [
      { name: 'Base Cost', value: baseCost, fill: '#64748b' },
      { name: 'Contingency', value: contingencyReserve, fill: '#eab308' },
      { name: 'Mgmt Reserve', value: managementReserve, fill: '#3b82f6' },
      { name: 'Total Budget', value: baseCost + totalReserves, fill: '#0ea5e9', isTotal: true },
  ];

  const trendData = [
      { month: 'Jan', contingency: contingencyReserve, management: managementReserve, exposure: currentRiskExposure * 1.2 },
      { month: 'Feb', contingency: contingencyReserve, management: managementReserve, exposure: currentRiskExposure * 1.1 },
      { month: 'Mar', contingency: contingencyReserve - (drawdowns.contingency * 0.2), management: managementReserve, exposure: currentRiskExposure * 1.1 },
      { month: 'Apr', contingency: contingencyReserve - (drawdowns.contingency * 0.5), management: managementReserve, exposure: currentRiskExposure * 1.05 },
      { month: 'May', contingency: remainingContingency, management: remainingManagement, exposure: currentRiskExposure },
  ];

  const openUpdatePanel = () => {
      setNewReserves({ contingency: contingencyReserve, management: managementReserve });
      setIsUpdatePanelOpen(true);
  };

  const handleSaveReserves = () => {
      if (!project) return;
      // In real app, dispatch an update action.
      alert(`Updated Reserves: Contingency=${newReserves.contingency}, Mgmt=${newReserves.management}\nJustification: ${justification}`);
      setIsUpdatePanelOpen(false);
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
                        <Calculator size={18} className="text-green-600"/> Reserve Status
                    </h3>
                    
                    <div className="space-y-4">
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
                            onClick={openUpdatePanel}
                            className="w-full py-2 bg-nexus-600 hover:bg-nexus-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
                        >
                            <RefreshCw size={16}/> Adjust Reserves
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

        {/* Update SidePanel */}
        <SidePanel
            isOpen={isUpdatePanelOpen}
            onClose={() => setIsUpdatePanelOpen(false)}
            title="Adjust Reserve Allocation"
            width="md:w-[500px]"
            footer={
                <>
                    <Button variant="secondary" onClick={() => setIsUpdatePanelOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveReserves} icon={Save}>Update Plan</Button>
                </>
            }
        >
            <div className="space-y-6">
                <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded border border-blue-100">
                    Changes to the reserve plan will be logged in the project budget history.
                </p>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contingency Reserve</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input 
                            type="number" 
                            className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                            value={newReserves.contingency}
                            onChange={(e) => setNewReserves({...newReserves, contingency: parseFloat(e.target.value)})}
                        />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Management Reserve</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input 
                            type="number" 
                            className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                            value={newReserves.management}
                            onChange={(e) => setNewReserves({...newReserves, management: parseFloat(e.target.value)})}
                        />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Justification</label>
                    <textarea 
                        className="w-full p-3 border border-slate-300 rounded-lg text-sm h-32 resize-none"
                        placeholder="Reason for adjustment (e.g. Risk score increased, scope reduction)..."
                        value={justification}
                        onChange={(e) => setJustification(e.target.value)}
                    />
                </div>
            </div>
        </SidePanel>
    </div>
  );
};

export default ReserveAnalysis;
