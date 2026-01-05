
import React, { useMemo, useState, Suspense } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useTheme } from '../../context/ThemeContext';
import { 
  Activity, TrendingUp, AlertTriangle, 
  DollarSign, Layers, PieChart as PieIcon, ArrowUpRight, Sparkles, Loader2, BarChart2, Target
} from 'lucide-react';
import StatCard from '../shared/StatCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Line, ComposedChart } from 'recharts';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';
import { useGeminiAnalysis } from '../../hooks/useGeminiAnalysis';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { calculateProjectProgress } from '../../utils/calculations';

interface ProgramDashboardProps {
  programId: string;
}

const ChartSkeleton = () => (
    <div className="w-full h-full flex items-end gap-2 p-4 animate-pulse">
        <div className="w-full h-[40%] bg-slate-100 rounded-t"></div>
        <div className="w-full h-[70%] bg-slate-100 rounded-t"></div>
        <div className="w-full h-[50%] bg-slate-100 rounded-t"></div>
        <div className="w-full h-[85%] bg-slate-100 rounded-t"></div>
        <div className="w-full h-[60%] bg-slate-100 rounded-t"></div>
    </div>
);

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
  const { generateProgramReport, report, isGenerating, error } = useGeminiAnalysis();
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
  
  // Project Health Distribution (Live Data)
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

  // Financial Chart Data (Calculated from Projects, NOT Allocations if missing)
  const financialChartData = useMemo(() => {
      // Prioritize actual projects for the visual chart
      return projects.map(p => {
          const progress = calculateProjectProgress(p) / 100;
          return {
              name: p.code,
              Budget: p.budget,
              Actuals: p.spent,
              // Simple forecast: Spent / Progress (CPI=1 assumption)
              Forecast: progress > 0 ? p.spent / progress : p.budget
          };
      });
  }, [projects]);

  if (!program) return (
      <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} height={120} />)}
      </div>
  );

  // Fallback metrics if projects list is empty but program exists
  const displayTotalBudget = aggregateMetrics.totalBudget || program.budget;
  const displayTotalSpent = aggregateMetrics.totalSpent;
  const burnRate = displayTotalBudget > 0 ? (displayTotalSpent / displayTotalBudget) * 100 : 0;

  return (
    <div className={`h-full overflow-y-auto p-6 space-y-6 animate-in fade-in duration-300`}>
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
                <div className={`prose prose-sm max-w-none ${theme.colors.text.secondary}`}>
                    {report.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                        <p key={i} className="my-4 leading-relaxed">{line}</p>
                    ))}
                </div>
            )}
        </SidePanel>

        {/* Header - AI Button */}
        <div className="flex justify-end">
             <button 
                 onClick={handleGenerateReport}
                 disabled={isGenerating}
                 className={`px-4 py-2 ${theme.colors.surface} border ${theme.colors.border} rounded-lg text-sm font-medium ${theme.colors.text.secondary} hover:${theme.colors.background} flex items-center gap-2 disabled:opacity-50 shadow-sm transition-all`}
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
                value={formatCompactCurrency(displayTotalSpent)} 
                subtext={`of ${formatCompactCurrency(displayTotalBudget)} Total`} 
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
                title="Portfolio Burn" 
                value={`${burnRate.toFixed(1)}%`} 
                subtext="Utilization" 
                icon={TrendingUp} 
                trend="up"
            />
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
            {/* Financial Performance Chart */}
            <div className={`lg:col-span-2 ${theme.components.card} p-6 flex flex-col h-[400px]`}>
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
                <div className="flex-1 w-full min-h-0">
                    <Suspense fallback={<ChartSkeleton />}>
                        {financialChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={financialChartData} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                                    <XAxis dataKey="name" tick={{fontSize: 12, fill: theme.colors.text.secondary}} />
                                    <YAxis tickFormatter={(val) => formatCompactCurrency(val)} tick={{fontSize: 12, fill: theme.colors.text.secondary}} />
                                    <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={theme.charts.tooltip} />
                                    <Bar dataKey="Budget" fill="#cbd5e1" barSize={20} radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Actuals" fill={theme.charts.palette[0]} barSize={20} radius={[4, 4, 0, 0]} />
                                    <Line type="monotone" dataKey="Forecast" stroke={theme.charts.palette[5]} strokeWidth={2} dot={{r: 4}} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState 
                                title="No Financial Data" 
                                description="Allocate budgets to projects to see financial performance."
                                icon={BarChart2}
                            />
                        )}
                    </Suspense>
                </div>
            </div>

            {/* Strategic Alignment / Health */}
            <div className="space-y-6">
                {/* Health Distribution */}
                <div className={`${theme.components.card} p-6 h-[190px] flex flex-col`}>
                    <h3 className={`font-bold ${theme.colors.text.primary} mb-4 flex items-center gap-2`}>
                        <PieIcon size={18} className="text-nexus-600"/> Project Health
                    </h3>
                    {projects.length > 0 ? (
                        <div className="space-y-3 overflow-auto">
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
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                             <p className="text-xs text-slate-400 italic">No projects linked.</p>
                        </div>
                    )}
                </div>

                {/* Key Objectives */}
                <div className={`${theme.components.card} p-6 h-[186px] flex flex-col`}>
                    <h3 className={`font-bold ${theme.colors.text.primary} mb-4 flex items-center gap-2`}>
                        <Layers size={18} className="text-nexus-600"/> Strategic Objectives
                    </h3>
                    {programObjectives.length > 0 ? (
                        <ul className="space-y-3 overflow-auto pr-1">
                            {programObjectives.map(obj => (
                                <li key={obj.id} className="text-sm border-l-2 border-nexus-300 pl-3 py-1">
                                    <p className={`font-medium ${theme.colors.text.primary} line-clamp-2`}>{obj.description}</p>
                                    <p className={`text-xs ${theme.colors.text.secondary} mt-0.5`}>Linked to: {obj.linkedStrategicGoalId}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                             <Target size={24} className="text-slate-300 mb-2"/>
                             <p className="text-xs text-slate-400">No objectives defined.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProgramDashboard;
