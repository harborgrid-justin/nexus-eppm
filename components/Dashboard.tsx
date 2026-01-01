
import React, { useState, useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';
import { TrendingDown, TrendingUp, AlertOctagon, DollarSign, Sparkles, Loader2, X, Plus, FileText } from 'lucide-react';
import StatCard from './shared/StatCard';
import { useTheme } from '../context/ThemeContext';
import { useGeminiAnalysis } from '../hooks/useGeminiAnalysis';
import { usePermissions } from '../hooks/usePermissions';
import { CustomBarChart } from './charts/CustomBarChart';
import { CustomPieChart } from './charts/CustomPieChart';
import { SidePanel } from './ui/SidePanel';
import { Button } from './ui/Button';
import { formatCompactCurrency } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const { summary, healthDataForChart: rawHealthData, budgetDataForChart, projects } = useLoaderData() as any;
  const theme = useTheme();
  const { generateReport, report, isGenerating, error, reset } = useGeminiAnalysis();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { hasPermission } = usePermissions();

  const healthDataForChart = useMemo(() => rawHealthData.map((d: { name: string; value: number }) => {
      let color;
      if (d.name === 'Good') color = theme.charts.palette[1];
      else if (d.name === 'Warning') color = theme.charts.palette[2];
      else color = theme.charts.palette[3];
      return { ...d, color };
  }), [rawHealthData, theme]);

  const handleGenerateReport = () => {
    setIsReportOpen(true);
    generateReport(projects);
  };

  const handleCloseReport = () => {
    setIsReportOpen(false);
    reset();
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} scrollbar-thin`}>
      <SidePanel
        isOpen={isReportOpen}
        onClose={handleCloseReport}
        width="md:w-[600px]"
        title={
          <span className="flex items-center gap-2">
             <Sparkles size={18} className="text-nexus-500" /> AI Portfolio Analysis
          </span>
        }
        footer={<Button onClick={handleCloseReport}>Close Report</Button>}
      >
           {isGenerating && (
             <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="animate-spin text-nexus-500 mb-4" size={40} />
               <p className={theme.colors.text.secondary}>Analyzing portfolio data...</p>
             </div>
           )}
           
           {error && (
             <div className={`p-4 ${theme.colors.semantic.danger.bg} ${theme.colors.semantic.danger.text} rounded-lg border ${theme.colors.semantic.danger.border}`}>
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
                            <span className="text-nexus-500 mr-3 mt-1.5 text-xs">●</span>
                            <p className={`${theme.colors.text.primary} flex-1 leading-relaxed`}>{line.trim().substring(2)}</p>
                        </div>
                    );
                    
                    if (line.match(/^\d+\./)) return (
                        <div key={i} className={`flex items-start my-3 pl-4 ${theme.colors.background} p-3 rounded-lg border ${theme.colors.border}`}>
                            <span className="text-nexus-600 mr-3 font-bold">{line.match(/^\d+\./)![0]}</span>
                            <p className={`${theme.colors.text.primary} flex-1 leading-relaxed`}>{line.replace(/^\d+\.\s*/, '')}</p>
                        </div>
                    );

                    return <p key={i} className={`my-4 leading-relaxed ${theme.colors.text.secondary}`}>{line}</p>;
                 })}
             </div>
           )}
      </SidePanel>

      <div className={`${theme.layout.header} mb-6 flex-wrap gap-4`}>
        <div className="min-w-0 flex-1">
          <h1 className={`${theme.typography.h1} truncate`}>Portfolio Workspace</h1>
          <p className={theme.typography.small}>Executive oversight of strategic investments and health.</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
           <button 
             onClick={handleGenerateReport}
             disabled={isGenerating}
             className={`px-4 py-2 ${theme.colors.surface} border ${theme.colors.border} rounded-lg text-sm font-medium ${theme.colors.text.primary} hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50 shadow-sm transition-all`}
           >
            <Sparkles size={16} className="text-yellow-500"/>
            AI Summary
           </button>
           {hasPermission('project:create') && (
             <button className={`px-4 py-2 ${theme.colors.primary} rounded-lg text-sm font-bold ${theme.colors.text.inverted} ${theme.colors.primaryHover} flex items-center gap-2 shadow-sm transition-all active:scale-95`}>
                <Plus size={16} /> <span className="hidden sm:inline">New Project</span>
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Portfolio Value" 
          value={`$${(summary.totalBudget / 1000000).toFixed(1)}M`}
          subtext={`Across ${summary.totalProjects} components`}
          icon={DollarSign}
        />
        <StatCard 
          title="Budget Utilization" 
          value={`${summary.budgetUtilization.toFixed(1)}%`}
          subtext="Actuals + Commitments"
          icon={TrendingUp}
          trend="up"
        />
        <StatCard 
          title="Critical Issues" 
          value={summary.healthCounts.critical}
          subtext="Immediate review required"
          icon={AlertOctagon}
          trend="down"
        />
        <StatCard 
          title="Schedule Health" 
          value="SPI 0.92"
          subtext="14% behind baseline"
          icon={TrendingDown}
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 flex-1">
        <div className={`${theme.components.card} ${theme.layout.cardPadding} flex flex-col min-w-0`}>
          <h3 className={`${theme.typography.h3} mb-6 flex-shrink-0`}>Spend by Project Code</h3>
          <div className="flex-1 min-h-[300px]">
            <CustomBarChart 
                data={budgetDataForChart}
                xAxisKey="name"
                dataKey="Spent"
                height={300}
                barColor={theme.charts.palette[0]}
                formatTooltip={(val) => formatCompactCurrency(val)}
            />
          </div>
        </div>

        <div className={`${theme.components.card} ${theme.layout.cardPadding} flex flex-col min-w-0`}>
          <h3 className={`${theme.typography.h3} mb-6 flex-shrink-0`}>Portfolio Risk Distribution</h3>
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
            <CustomPieChart 
                data={healthDataForChart}
                height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
