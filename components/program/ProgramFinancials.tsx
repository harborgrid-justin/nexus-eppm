import React, { useState, useMemo } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useData } from '../../context/DataContext';
import { TrendingUp, Lock, Unlock, DollarSign, Edit2, Save, FileText, Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../shared/StatCard';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgramBudgetAllocation } from '../../types';
import { EmptyGrid } from '../common/EmptyGrid';

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
  const burnRatio = aggregateMetrics.totalBudget > 0 ? (aggregateMetrics.totalSpent / aggregateMetrics.totalBudget) : 0;

  const chartData = useMemo(() => {
      if (projects.length === 0) return [];
      return projects.map(p => ({
          name: p.code || 'N/A',
          Allocated: p.budget || 0,
          Spent: p.spent || 0,
          Forecast: (p.spent / (new Date().getMonth() + 1 || 1)) * 12 
      }));
  }, [projects]);

  const handleOpenAllocationPanel = () => {
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

  if (projects.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-8">
              <EmptyGrid 
                title="Financial Stream Isolated"
                description="This program has no project components aligned to its budget authority. Link initiatives to activate financial aggregation."
                icon={DollarSign}
                actionLabel="Provision Project Alignment"
                onAdd={() => {}}
              />
          </div>
      );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300 scrollbar-thin`}>
        <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Program Fiscal Authority</h2>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
            <StatCard title="Total Budget Authority" value={formatCompactCurrency(aggregateMetrics.totalBudget)} icon={DollarSign} />
            <StatCard title="Portfolio Actuals" value={formatCompactCurrency(aggregateMetrics.totalSpent)} subtext={`${(burnRatio * 100).toFixed(1)}% Liquidation Rate`} icon={TrendingUp} trend={burnRatio > 0.9 ? 'down' : 'up'} />
            <StatCard title="Available Liquidity" value={formatCompactCurrency(remainingBudget)} icon={Lock} />
            <StatCard title="Strategic Health" value={burnRatio > 1 ? 'Overrun' : 'Within Cap'} icon={Activity} trend={burnRatio < 1 ? 'up' : 'down'} />
        </div>

        <Card className={`${theme.layout.cardPadding} h-[400px] flex flex-col shadow-sm`}>
            <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
                <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Budget Deployment vs. Linear Forecast</h3>
                <button onClick={handleOpenAllocationPanel} className="text-[10px] font-black uppercase text-nexus-600 hover:text-nexus-800 flex items-center gap-1.5 transition-all">
                    <Edit2 size={12}/> Adjust Allotments
                </button>
            </div>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                        <XAxis dataKey="name" tick={{fontSize: 10, fontStyle: 'bold'}} interval={0} />
                        <YAxis tickFormatter={(val) => formatCompactCurrency(val)} tick={{fontSize: 10}} />
                        <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={theme.charts.tooltip} />
                        <Legend wrapperStyle={{paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold'}} />
                        <Bar dataKey="Allocated" fill="#94a3b8" radius={[4,4,0,0]} />
                        <Bar dataKey="Spent" fill="#0ea5e9" radius={[4,4,0,0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>

        <div className={`${theme.colors.surface} rounded-[2.5rem] border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
            <div className={`p-6 border-b ${theme.colors.border} bg-slate-50/50 flex justify-between items-center`}>
                <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Lock size={16} className="text-nexus-600"/> Authorization Gates
                </h3>
            </div>
            {programFinancials.gates.length > 0 ? (
                <div className={`grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x ${theme.colors.border.replace('border-', 'divide-')}`}>
                    {programFinancials.gates.map(gate => (
                        <div key={gate.id} className="p-8 flex flex-col items-center text-center relative group hover:bg-slate-50/50 transition-colors">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-xl border-2 ${
                                gate.status === 'Released' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}>
                                {gate.status === 'Released' ? <Unlock size={24}/> : <Lock size={24}/>}
                            </div>
                            <h4 className={`font-black text-slate-800 text-sm uppercase tracking-tight`}>{gate.name}</h4>
                            <p className={`text-[10px] text-slate-400 font-bold uppercase mt-1`}>{gate.milestoneTrigger}</p>
                            <p className="text-2xl font-black text-slate-900 mt-4 font-mono">{formatCompactCurrency(gate.amount)}</p>
                            <div className={`mt-6 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl border shadow-sm transition-all ${
                                gate.status === 'Released' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-slate-400 border-slate-200 hover:border-nexus-300'
                            }`}>
                                {gate.status}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-20">
                     <EmptyGrid 
                        title="Funding Gates Undefined"
                        description="Establish multi-year capital release milestones to enable stage-gate budgeting."
                        icon={FileText}
                        actionLabel="Define Funding Milestone"
                        onAdd={() => {}}
                     />
                </div>
            )}
        </div>

        <SidePanel
            isOpen={isAllocationPanelOpen}
            onClose={() => setIsAllocationPanelOpen(false)}
            width="md:w-[500px]"
            title="Allotment Workbench"
            footer={<><Button variant="secondary" onClick={() => setIsAllocationPanelOpen(false)}>Cancel</Button><Button onClick={handleSaveAllocations}>Commit Changes</Button></>}
        >
            <div className="space-y-4">
                <p className={`text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 p-3 rounded-lg border mb-6`}>
                    Rebalance funding across project partitions. Total authority: {formatCurrency(aggregateMetrics.totalBudget)}
                </p>
                {editAllocations.map(alloc => (
                    <div key={alloc.id} className={`p-5 bg-white rounded-2xl border border-slate-200 shadow-sm group hover:border-nexus-300 transition-all`}>
                         <div className="flex justify-between items-center mb-3">
                            <span className={`text-sm font-black text-slate-800 uppercase tracking-tight`}>
                                {projects.find(p => p.id === alloc.projectId)?.code || alloc.projectId}
                            </span>
                         </div>
                         <div className="relative">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-bold">$</span>
                             <input 
                                type="number" 
                                value={alloc.allocated} 
                                onChange={e => setEditAllocations(prev => prev.map(a => a.id === alloc.id ? { ...a, allocated: parseFloat(e.target.value) } : a))}
                                className={`w-full pl-8 pr-4 py-3 text-lg font-mono font-black border border-slate-200 rounded-xl focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 outline-none transition-all`}
                             />
                         </div>
                    </div>
                ))}
            </div>
        </SidePanel>
    </div>
  );
};

export default ProgramFinancials;