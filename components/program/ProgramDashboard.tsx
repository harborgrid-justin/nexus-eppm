
import React, { useMemo, useState } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useTheme } from '../../context/ThemeContext';
import { 
  Activity, TrendingUp, AlertTriangle, CheckCircle, 
  Calendar, DollarSign, Layers, PieChart as PieIcon, ArrowUpRight, Sparkles, Loader2
} from 'lucide-react';
import StatCard from '../shared/StatCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ComposedChart, Line } from 'recharts';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';
import { useGeminiAnalysis } from '../../hooks/useGeminiAnalysis';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';

interface ProgramDashboardProps {
  programId: string;
}

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
  
  // AI Integration
  const { generateProgramReport, report, isGenerating, error, reset } = useGeminiAnalysis();
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleGenerateReport = () => {
    if (program) {
        setIsReportOpen(true);
        generateProgramReport(program, projects);
    }
  };

  const { activeRisks, highRisks } = useMemo(() => {
    const active = programRisks.filter(r => r.status === 'Open').length;
    const high = programRisks.filter(r => r.score >= 12).length;
    return { activeRisks: active, highRisks: high };
  }, [programRisks]);
  
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
  const financialChartData = useMemo(() => {
    return programFinancials.allocations
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
  }, [programFinancials.allocations, projects]);

  if (!program) return null;

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in duration-300`}>
        {/* AI Report SidePanel */}
        <SidePanel
            isOpen={isReportOpen}
            onClose={() => setIsReportOpen(false)}
            width="md:w-[600px]"
            title={
            <span className="flex items-center gap-2">
                <Sparkles size={18} className="text-nexus-500" /> AI Program Status Report
            </span>
            }
            footer={<Button onClick={() => setIsReportOpen(false)}>Close Report</Button>}
        >
            {isGenerating && (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-nexus-500 mb-4" size={40} />
                    <p className="text-slate-500 font-medium">Analyzing program performance...</p>
                </div>
            )}
            
            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {report && !isGenerating && (
                <div className="prose prose-sm prose-slate max-w-none">
                    {report.split('\n').filter(line => line.trim() !== '').map((line, i) => {
                        if (line.startsWith('### ')) return <h3 key={i} className={`text-lg font-bold mt-6 mb-2 ${theme.colors.text.primary}`}>{line.substring(4)}</h3>;
                        if (line.startsWith('## ')) return <h2 key={i} className={`text-xl font-extrabold mt-8 mb-4 ${theme.colors.text.primary} border-b pb-2`}>{line.substring(3)}</h2>;
                        if (line.startsWith('# ')) return <h1 key={i} className={`text-2xl font-black mt-4 mb-6 ${theme.colors.text.primary}`}>{line.substring(2)}</h1>;
                        
                        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) return (
                            <div key={i} className="flex items-start my-2 pl-4">
                                <span className="text-nexus-600 mr-3 mt-1.5 text-xs">●</span>
                                <p className={`${theme.colors.text.primary} flex-1 leading-relaxed`}>{line.trim().substring(2)}</p>
                            </div>
                        );
                        
                        return <p key={i} className={`my-4 leading-relaxed ${theme.colors.text.secondary}`}>{line}</p>;
                    })}
                </div>
            )}
        </SidePanel>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
                 <h1 className={theme.typography.h1}>Program Dashboard</h1>
                 <p className={theme.typography.small}>Executive oversight of {program.name}</p>
             </div>
             <button 
                 onClick={handleGenerateReport}
                 disabled={isGenerating}
                 className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50 shadow-sm transition-all"
             >
                <Sparkles size={16} className="text-yellow-500"/>
                AI Status Report
             </button>
        </div>

        {/* Top Level KPI Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
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

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
            {/* Financial Performance Chart */}
            <div className={`lg:col-span-2 ${theme.components.card} p-6`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`font-bold ${theme.colors.text.primary} flex items-center gap-2`}>
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
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                            <YAxis tickFormatter={(val) => formatCompactCurrency(val)} tick={{fontSize: 12}} />
                            <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={theme.charts.tooltip} />
                            <Bar dataKey="Budget" fill="#cbd5e1" barSize={20} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Actuals" fill={theme.charts.palette[0]} barSize={20} radius={[4, 4, 0, 0]} />
                            <Line type="monotone" dataKey="Forecast" stroke={theme.charts.palette[5]} strokeWidth={2} dot={{r: 4}} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Strategic Alignment / Health */}
            <div className="space-y-6">
                {/* Health Distribution */}
                <div className={`${theme.components.card} p-6`}>
                    <h3 className={`font-bold ${theme.colors.text.primary} mb-4 flex items-center gap-2`}>
                        <PieIcon size={18} className="text-nexus-600"/> Project Health
                    </h3>
                    <div className="space-y-3">
                        {healthData.map(item => (
                            <div key={item.name} className="flex items-center justify-between">
                                <span className={`text-sm font-medium ${theme.colors.text.secondary} flex items-center gap-2`}>
                                    <span className={`w-2.5 h-2.5 rounded-full ${
                                        item.name === 'Good' ? 'bg-green-500' : 
                                        item.name === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}></span>
                                    {item.name}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-24 h-2 ${theme.colors.background} rounded-full overflow-hidden`}>
                                        <div 
                                            className={`h-full ${
                                                item.name === 'Good' ? 'bg-green-500' : 
                                                item.name === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`} 
                                            style={{ width: `${projects.length > 0 ? (item.value / projects.length) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                    <span className={`text-xs font-bold ${theme.colors.text.primary}`}>{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key Objectives */}
                <div className={`${theme.components.card} p-6`}>
                    <h3 className={`font-bold ${theme.colors.text.primary} mb-4 flex items-center gap-2`}>
                        <Layers size={18} className="text-nexus-600"/> Strategic Objectives
                    </h3>
                    <ul className="space-y-3">
                        {programObjectives.map(obj => (
                            <li key={obj.id} className="text-sm border-l-2 border-nexus-300 pl-3 py-1">
                                <p className={`font-medium ${theme.colors.text.primary}`}>{obj.description}</p>
                                <p className={`text-xs ${theme.colors.text.secondary} mt-0.5`}>Linked to: {obj.linkedStrategicGoalId}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Recent Timeline / Gates */}
        <div className={`${theme.components.card} overflow-hidden`}>
            <div className={`px-6 py-4 border-b ${theme.colors.border} ${theme.colors.background} flex justify-between items-center`}>
                <h3 className={`font-bold ${theme.colors.text.primary} flex items-center gap-2`}>
                    <Calendar size={18} className="text-nexus-600"/> Upcoming Milestones & Gates
                </h3>
                <button className="text-xs font-medium text-nexus-600 hover:text-nexus-700 flex items-center gap-1">
                    View Roadmap <ArrowUpRight size={14}/>
                </button>
            </div>
            <div className="p-6">
                <div className="relative flex items-center justify-between">
                    {/* Line */}
                    <div className={`absolute left-0 right-0 top-4 h-1 ${theme.colors.background} z-0`}></div>
                    
                    {/* Items */}
                    {[
                        { label: 'Q1 Review', date: 'Mar 15', status: 'Complete' },
                        { label: 'Design Freeze', date: 'Apr 01', status: 'Complete' },
                        { label: 'Budget Cycle', date: 'May 15', status: 'In Progress' },
                        { label: 'Phase 2 Gate', date: 'Jun 30', status: 'Pending' },
                        { label: 'Go-Live', date: 'Dec 15', status: 'Pending' },
                    ].map((m) => (
                        <div key={m.label} className="relative z-10 flex flex-col items-center">
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
                                <p className={`text-xs font-bold ${theme.colors.text.primary}`}>{m.label}</p>
                                <p className={`text-[10px] ${theme.colors.text.secondary}`}>{m.date}</p>
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
