
import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useProgramData } from '../../hooks/useProgramData';
import { Star, TrendingUp, DollarSign, Clock, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../shared/StatCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyGrid } from '../common/EmptyGrid';
import { BenefitForm } from './BenefitForm';

interface ProgramBenefitsProps {
  programId: string;
}

const ProgramBenefits: React.FC<ProgramBenefitsProps> = ({ programId }) => {
  const { state } = useData();
  const { projects } = useProgramData(programId);
  const theme = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter benefits for this program (via projects)
  const programBenefits = state.benefits.filter(b => 
    b.componentId === programId || projects.some(p => p.id === b.componentId)
  );

  const realizedValue = programBenefits.reduce((sum, b) => sum + (b.realizedValue || 0), 0);
  const plannedValue = programBenefits.reduce((sum, b) => sum + b.value, 0);
  const realizationRate = plannedValue > 0 ? (realizedValue / plannedValue) * 100 : 0;

  // Calculate Trend Data (Simulated S-Curve based on actual totals)
  const trendData = useMemo(() => {
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      const data = [];
      let cumulativePlanned = 0;
      let cumulativeRealized = 0;
      
      for(let i=0; i<4; i++) {
          const incrementPlanned = plannedValue * (i === 0 ? 0.1 : i === 1 ? 0.2 : i === 2 ? 0.3 : 0.4);
          const incrementRealized = realizedValue * (i === 0 ? 0.05 : i === 1 ? 0.15 : i === 2 ? 0.3 : 0.5);
          
          cumulativePlanned += incrementPlanned;
          cumulativeRealized += incrementRealized;
          
          data.push({
              month: quarters[i],
              planned: Math.round(cumulativePlanned),
              actual: Math.round(cumulativeRealized)
          });
      }
      return data;
  }, [plannedValue, realizedValue]);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <Star className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Benefits Realization Plan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Planned Value" value={formatCurrency(plannedValue)} icon={DollarSign} />
            <StatCard title="Value Realized" value={formatCurrency(realizedValue)} icon={TrendingUp} trend="up" />
            <StatCard title="Realization Rate" value={`${realizationRate.toFixed(1)}%`} icon={Clock} />
            <StatCard title="Active Benefits" value={programBenefits.length} icon={Star} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
                <h3 className="font-bold text-slate-800 mb-4">Realization Curve (Planned vs Actual)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(val: number) => formatCurrency(val)} />
                            <Legend />
                            <Area type="monotone" dataKey="planned" stroke="#94a3b8" fill="#e2e8f0" name="Planned Value" />
                            <Area type="monotone" dataKey="actual" stroke="#22c55e" fill="#dcfce7" name="Realized Value" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Benefits Register</h3>
                    <Button size="sm" icon={Plus} onClick={() => setIsFormOpen(true)}>Add Benefit</Button>
                </div>
                <div className="flex-1 overflow-auto max-h-72">
                    {programBenefits.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Benefit</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Source</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Target</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {programBenefits.map(b => (
                                    <tr key={b.id}>
                                        <td className="px-6 py-3 text-sm font-medium text-slate-900">{b.description}</td>
                                        <td className="px-6 py-3 text-xs text-slate-500">{b.componentId}</td>
                                        <td className="px-6 py-3 text-sm text-right font-mono">{b.type === 'Financial' ? formatCurrency(b.value) : b.value}</td>
                                        <td className="px-6 py-3 text-right">
                                            <Badge variant={
                                                b.status === 'Realized' ? 'success' : 
                                                b.status === 'In Progress' ? 'info' : 'neutral'
                                            }>{b.status}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="h-full">
                            <EmptyGrid 
                                title="No Benefits Defined" 
                                description="Define financial or non-financial benefits to track program value."
                                icon={Star}
                                actionLabel="Add Benefit"
                                onAdd={() => setIsFormOpen(true)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
        <BenefitForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} programId={programId} projects={projects} />
    </div>
  );
};

export default ProgramBenefits;