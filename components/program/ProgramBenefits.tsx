
import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useProgramData } from '../../hooks/useProgramData';
import { Star, TrendingUp, DollarSign, Clock, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../shared/StatCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// Fixed: Added formatCompactCurrency to the import list
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';
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

  const programBenefits = useMemo(() => state.benefits.filter(b => 
    b.componentId === programId || projects.some(p => p.id === b.componentId)
  ), [state.benefits, programId, projects]);

  const realizedValue = useMemo(() => programBenefits.reduce((sum, b) => sum + (b.realizedValue || 0), 0), [programBenefits]);
  const plannedValue = useMemo(() => programBenefits.reduce((sum, b) => sum + b.value, 0), [programBenefits]);
  const realizationRate = plannedValue > 0 ? (realizedValue / plannedValue) * 100 : 0;

  const trendData = useMemo(() => {
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      const data = [];
      let cumulativePlanned = 0;
      let cumulativeRealized = 0;
      
      for(let i=0; i<4; i++) {
          cumulativePlanned += plannedValue * (i === 0 ? 0.1 : i === 1 ? 0.2 : i === 2 ? 0.3 : 0.4);
          cumulativeRealized += realizedValue * (i === 0 ? 0.05 : i === 1 ? 0.15 : i === 2 ? 0.3 : 0.5);
          
          data.push({
              month: quarters[i],
              planned: Math.round(cumulativePlanned),
              actual: Math.round(cumulativeRealized)
          });
      }
      return data;
  }, [plannedValue, realizedValue]);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300 scrollbar-thin`}>
        <div className="flex items-center gap-2 mb-2">
            <Star className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Benefits Realization Plan</h2>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
            <StatCard title="Total Planned Value" value={formatCurrency(plannedValue)} icon={DollarSign} />
            <StatCard title="Value Realized" value={formatCurrency(realizedValue)} icon={TrendingUp} trend="up" />
            <StatCard title="Realization Rate" value={`${realizationRate.toFixed(1)}%`} icon={Clock} />
            <StatCard title="Active Benefits" value={programBenefits.length} icon={Star} />
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-[2rem] border ${theme.colors.border} shadow-sm h-80 flex flex-col`}>
                <h3 className={`text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2 border-b pb-3`}><TrendingUp size={14}/> Realization Velocity Curve</h3>
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                            <XAxis dataKey="month" tick={{fontSize: 10, fontWeight: 'bold'}} />
                            {/* Fixed: formatCompactCurrency is now available */}
                            <YAxis tick={{fontSize: 10, fontWeight: 'bold'}} tickFormatter={(val) => formatCompactCurrency(val)} />
                            <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={theme.charts.tooltip} />
                            <Legend wrapperStyle={{fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', paddingTop: '10px'}} />
                            <Area type="monotone" dataKey="planned" stroke="#94a3b8" fill="#e2e8f0" name="Planned Value" strokeWidth={2} />
                            <Area type="monotone" dataKey="actual" stroke="#22c55e" fill="#dcfce7" name="Realized Value" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={`${theme.colors.surface} rounded-[2rem] border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col h-80`}>
                <div className={`bg-slate-50/50 px-6 py-4 border-b ${theme.colors.border} flex justify-between items-center`}>
                    <h3 className={`text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2`}><Star size={14} className="text-nexus-500"/> Value Ledger</h3>
                    <Button size="sm" variant="ghost" icon={Plus} onClick={() => setIsFormOpen(true)}>Identify Benefit</Button>
                </div>
                <div className="flex-1 overflow-auto scrollbar-thin">
                    {programBenefits.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-white sticky top-0 z-10 border-b">
                                <tr>
                                    <th className={theme.components.table.header + " pl-6"}>Benefit</th>
                                    <th className={theme.components.table.header + " text-right"}>Target</th>
                                    <th className={theme.components.table.header + " text-right"}>Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {programBenefits.map(b => (
                                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                                        <td className={`px-6 py-4`}>
                                            <div className="text-sm font-bold text-slate-800 uppercase tracking-tight">{b.description}</div>
                                            <div className="text-[9px] text-slate-400 font-mono mt-0.5">{b.id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-mono font-black text-slate-700">{b.type === 'Financial' ? formatCurrency(b.value) : b.value}</td>
                                        <td className="px-6 py-4 text-right">
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
                        <div className="h-full flex flex-col justify-center">
                            <EmptyGrid 
                                title="Harvest Stream Null" 
                                description="No strategic or operational benefits have been mapped to the program execution plan."
                                icon={Star}
                                actionLabel="Identify Strategic Benefit"
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
