
import React, { useMemo } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useTheme } from '../../context/ThemeContext';
import { 
  Activity, TrendingUp, AlertTriangle, CheckCircle, 
  Calendar, DollarSign, Layers, PieChart as PieIcon, ArrowUpRight
} from 'lucide-react';
import StatCard from '../shared/StatCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell, ComposedChart, Line } from 'recharts';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';
import { Badge } from '../ui/Badge';

interface ProgramDashboardProps {
  programId: string;
}

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444'];

const ProgramDashboard: React.FC<ProgramDashboardProps> = ({ programId }) => {
  const { 
    program, 
    projects, 
    aggregateMetrics, 
    programRisks, 
    programFinancials, 
    programObjectives 
  } = useProgramData(programId);
  const theme = useTheme();

  const activeRisks = programRisks.filter(r => r.status === 'Open').length;
  const highRisks = programRisks.filter(r => r.score >= 12).length;
  
  // Calculate Benefit Realization (Mock Logic based on Objectives)
  const benefitData = [
    { name: 'Planned', value: 100 },
    { name: 'Realized', value: 65 }
  ];

  // Project Health Distribution
  const healthData = useMemo(() => {
    const counts = { Good: 0, Warning: 0, Critical: 0 };
    projects.forEach(p => {
        if (p.health === 'Good') counts.Good++;
        else if (p.health === 'Warning') counts.Warning++;
        else counts.Critical++;
    });
    return [
        { name: 'Good', value: counts.Good },
        { name: 'Warning', value: counts.Warning },
        { name: 'Critical', value: counts.Critical }
    ];
  }, [projects]);

  // Financial Chart Data
  const financialChartData = programFinancials.allocations
    .filter(a => a.projectId !== 'Unallocated Reserve')
    .map(a => {
        const proj = projects.find(p => p.id === a.projectId);
        return {
            name: proj?.code || a.projectId,
            Budget: a.allocated,
            Actuals: a.spent,
            Forecast: a.forecast
        };
    });

  if (!program) return null;

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in duration-300`}>
        {/* Top Level KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard 
                title="Program Health" 
                value={program.health} 
                subtext={`${projects.length} Active Projects`} 
                icon={Activity} 
                trend={program.health === 'Good' ? 'up' : 'down'}
            />
            <StatCard 
                title="Budget Consumed" 
                value={formatCompactCurrency(aggregateMetrics.totalSpent)} 
                subtext={`of ${formatCompactCurrency(aggregateMetrics.totalBudget)} Total`} 
                icon={DollarSign} 
            />
            <StatCard 
                title="Risk Exposure" 
                value={activeRisks} 
                subtext={`${highRisks} Critical/High Risks`} 
                icon={AlertTriangle} 
                trend={highRisks > 0 ? 'down' : 'up'}
            />
            <StatCard 
                title="Benefits Realized" 
                value="65%" 
                subtext="Target: 75% by Q4" 
                icon={TrendingUp} 
                trend="up"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Financial Performance Chart */}
            <div className={`lg:col-span-2 ${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <DollarSign size={18} className="text-nexus-600"/> Financial Performance by Project
                    </h3>
                    <div className="flex gap-2 text-xs">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-300 rounded-sm"></span> Budget</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-nexus-500 rounded-sm"></span> Actuals</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-400 rounded-sm"></span> Forecast</span>
                    </div>
                </div>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={financialChartData} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                            <YAxis tickFormatter={(val) => formatCompactCurrency(val)} tick={{fontSize: 12}} />
                            <Tooltip formatter={(val: number) => formatCurrency(val)} />
                            <Bar dataKey="Budget" fill="#cbd5e1" barSize={20} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Actuals" fill="#0ea5e9" barSize={20} radius={[4, 4, 0, 0]} />
                            <Line type="monotone" dataKey="Forecast" stroke="#fb923c" strokeWidth={2} dot={{r: 4}} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Strategic Alignment / Health */}
            <div className="space-y-6">
                {/* Health Distribution */}
                <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm`}>
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <PieIcon size={18} className="text-nexus-600"/> Project Health
                    </h3>
                    <div className="space-y-3">
                        {healthData.map(item => (
                            <div key={item.name} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${
                                        item.name === 'Good' ? 'bg-green-500' : 
                                        item.name === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}></span>
                                    {item.name}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${
                                                item.name === 'Good' ? 'bg-green-500' : 
                                                item.name === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`} 
                                            style={{ width: `${(item.value / projects.length) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key Objectives */}
                <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm`}>
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Layers size={18} className="text-nexus-600"/> Strategic Objectives
                    </h3>
                    <ul className="space-y-3">
                        {programObjectives.map(obj => (
                            <li key={obj.id} className="text-sm border-l-2 border-nexus-300 pl-3 py-1">
                                <p className="font-medium text-slate-800">{obj.description}</p>
                                <p className="text-xs text-slate-500 mt-0.5">Linked to: {obj.linkedStrategicGoalId}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Recent Timeline / Gates */}
        <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Calendar size={18} className="text-nexus-600"/> Upcoming Milestones & Gates
                </h3>
                <button className="text-xs font-medium text-nexus-600 hover:text-nexus-700 flex items-center gap-1">
                    View Roadmap <ArrowUpRight size={14}/>
                </button>
            </div>
            <div className="p-6">
                <div className="relative flex items-center justify-between">
                    {/* Line */}
                    <div className="absolute left-0 right-0 top-4 h-1 bg-slate-100 z-0"></div>
                    
                    {/* Items */}
                    {[
                        { label: 'Q1 Review', date: 'Mar 15', status: 'Complete' },
                        { label: 'Design Freeze', date: 'Apr 01', status: 'Complete' },
                        { label: 'Budget Cycle', date: 'May 15', status: 'In Progress' },
                        { label: 'Phase 2 Gate', date: 'Jun 30', status: 'Pending' },
                        { label: 'Go-Live', date: 'Dec 15', status: 'Pending' },
                    ].map((m, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center bg-white ${
                                m.status === 'Complete' ? 'border-green-500' :
                                m.status === 'In Progress' ? 'border-blue-500' : 'border-slate-300'
                            }`}>
                                <div className={`w-2.5 h-2.5 rounded-full ${
                                    m.status === 'Complete' ? 'bg-green-500' :
                                    m.status === 'In Progress' ? 'bg-blue-500' : 'bg-slate-300'
                                }`}></div>
                            </div>
                            <div className="mt-2 text-center">
                                <p className="text-xs font-bold text-slate-700">{m.label}</p>
                                <p className="text-[10px] text-slate-500">{m.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProgramDashboard;
