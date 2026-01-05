
import React, { useState, useMemo } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useData } from '../../context/DataContext';
import { TrendingUp, Lock, Unlock, DollarSign, PieChart as PieIcon, Edit2, Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../shared/StatCard';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { ProgramBudgetAllocation } from '../../types';

interface ProgramFinancialsProps {
  programId: string;
}

const ProgramFinancials: React.FC<ProgramFinancialsProps> = ({ programId }) => {
  const { programFinancials, aggregateMetrics, projects } = useProgramData(programId);
  const { dispatch } = useData();
  const theme = useTheme();

  const [isAllocationPanelOpen, setIsAllocationPanelOpen] = useState(false);
  const [editAllocations, setEditAllocations] = useState<ProgramBudgetAllocation[]>([]);

  const remainingBudget = aggregateMetrics.totalBudget - aggregateMetrics.totalSpent;
  const projectNamesMap = new Map(projects.map(p => [p.id, p.name]));

  // Live aggregation: Link chart data directly to Project current state
  // Fallback: If no allocations exist, create a virtual list from projects for visualization
  const chartData = useMemo(() => {
      if (programFinancials.allocations.length > 0) {
          return programFinancials.allocations.map(a => {
              const liveProject = projects.find(p => p.id === a.projectId);
              return {
                  name: liveProject ? liveProject.code : a.projectId,
                  Allocated: a.allocated,
                  Spent: liveProject ? liveProject.spent : a.spent,
                  Forecast: liveProject ? liveProject.budget * 1.05 : a.forecast
              };
          });
      } else {
          return projects.map(p => ({
              name: p.code,
              Allocated: p.budget,
              Spent: p.spent,
              Forecast: p.budget * 1.05
          }));
      }
  }, [programFinancials.allocations, projects]);

  const handleOpenAllocationPanel = () => {
      // If no allocations exist, initialize them from projects
      const allocationsToEdit = programFinancials.allocations.length > 0 
          ? JSON.parse(JSON.stringify(programFinancials.allocations))
          : projects.map(p => ({
              id: `ALLOC-${p.id}`,
              programId,
              projectId: p.id,
              allocated: p.budget,
              spent: p.spent,
              forecast: p.budget * 1.05
          }));

      setEditAllocations(allocationsToEdit);
      setIsAllocationPanelOpen(true);
  };

  const handleSaveAllocations = () => {
      editAllocations.forEach(alloc => {
          dispatch({ type: 'PROGRAM_UPDATE_ALLOCATION', payload: alloc });
      });
      setIsAllocationPanelOpen(false);
  };

  const handleAllocationChange = (id: string, value: number) => {
      setEditAllocations(prev => prev.map(a => a.id === id ? { ...a, allocated: value } : a));
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Program Financial Management</h2>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Program Budget" value={formatCompactCurrency(aggregateMetrics.totalBudget)} icon={DollarSign} />
            <StatCard title="Actual Spend" value={formatCompactCurrency(aggregateMetrics.totalSpent)} subtext={`${((aggregateMetrics.totalSpent / (aggregateMetrics.totalBudget || 1)) * 100).toFixed(1)}% consumed`} icon={TrendingUp} />
            <StatCard title="Remaining Funding" value={formatCompactCurrency(remainingBudget)} icon={Lock} />
            <StatCard title="Forecast at Completion" value={formatCompactCurrency(aggregateMetrics.totalBudget * 1.05)} subtext="Estimated variance +5%" icon={PieIcon} trend="down" />
        </div>

        {/* Budget Allocation & Forecast */}
        <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm h-[400px]`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Budget Allocation & Cost-to-Complete</h3>
                <button onClick={handleOpenAllocationPanel} className="text-xs flex items-center gap-1 text-nexus-600 font-medium hover:underline">
                    <Edit2 size={14}/> Adjust Allocations
                </button>
            </div>
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
            {programFinancials.gates.length > 0 ? (
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
                            <div className={`mt-3 px-3 py-1 text-xs font-bold rounded-full cursor-pointer ${
                                gate.status === 'Released' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                            }`} onClick={() => {
                                if(gate.status !== 'Released' && confirm("Release this funding gate?")) {
                                    dispatch({type: 'PROGRAM_UPDATE_GATE', payload: {...gate, status: 'Released'}});
                                }
                            }}>
                                {gate.status}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center text-slate-400 italic">No funding gates defined for this program.</div>
            )}
        </div>

        {/* Edit Allocation Panel */}
        <SidePanel
            isOpen={isAllocationPanelOpen}
            onClose={() => setIsAllocationPanelOpen(false)}
            width="md:w-[500px]"
            title="Adjust Budget Allocations"
            footer={
                <>
                    <Button variant="secondary" onClick={() => setIsAllocationPanelOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveAllocations}>Save Allocations</Button>
                </>
            }
        >
            <div className="space-y-4">
                <p className="text-sm text-slate-600 mb-4">Rebalance funding across active projects based on latest forecasts.</p>
                {editAllocations.map(alloc => (
                    <div key={alloc.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-slate-700">
                                {projectNamesMap.get(alloc.projectId) || alloc.projectId}
                            </span>
                            <span className="text-xs text-slate-500">Current Forecast: {formatCompactCurrency(alloc.forecast)}</span>
                         </div>
                         
                         <div className="flex items-center gap-3">
                             <div className="relative flex-1">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                                 <input 
                                    type="number" 
                                    value={alloc.allocated} 
                                    onChange={e => handleAllocationChange(alloc.id, parseFloat(e.target.value))}
                                    className="w-full pl-6 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-nexus-500"
                                 />
                             </div>
                         </div>
                    </div>
                ))}
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-xs text-blue-800 flex gap-2">
                    <div className="font-bold">Total Allocated:</div>
                    <div>{formatCurrency(editAllocations.reduce((s,a) => s + a.allocated, 0))}</div>
                </div>
            </div>
        </SidePanel>
    </div>
  );
};

export default ProgramFinancials;
