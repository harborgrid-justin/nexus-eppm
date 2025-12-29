
import React, { useState } from 'react';
import { TrendingDown, TrendingUp, AlertOctagon, DollarSign, Sparkles, Loader2, X, Plus, FileText } from 'lucide-react';
import { usePortfolioState } from '../hooks';
import StatCard from './shared/StatCard';
import { useTheme } from '../context/ThemeContext';
import { useGeminiAnalysis } from '../hooks/useGeminiAnalysis';
import { usePermissions } from '../hooks/usePermissions';
import { CustomBarChart } from './charts/CustomBarChart';
import { CustomPieChart } from './charts/CustomPieChart';
import { SidePanel } from './ui/SidePanel';
import { Button } from './ui/Button';

const Dashboard: React.FC = () => {
  const { summary, healthDataForChart, budgetDataForChart, projects } = usePortfolioState();
  const theme = useTheme();
  const { generateReport, report, isGenerating, error, reset } = useGeminiAnalysis();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { hasPermission } = usePermissions();

  const handleGenerateReport = () => {
    setIsReportOpen(true);
    generateReport(projects);
  };

  const handleCloseReport = () => {
    setIsReportOpen(false);
    reset();
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
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
               <p className="text-slate-500 font-medium">Analyzing portfolio data...</p>
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
                    if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-6 mb-2 text-slate-800">{line.substring(4)}</h3>;
                    if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-extrabold mt-8 mb-4 text-slate-900 border-b pb-2">{line.substring(3)}</h2>;
                    if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-black mt-4 mb-6 text-slate-900">{line.substring(2)}</h1>;
                    
                    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) return (
                        <div key={i} className="flex items-start my-2 pl-4">
                            <span className="text-nexus-500 mr-3 mt-1.5 text-xs">●</span>
                            <p className="text-slate-700 flex-1 leading-relaxed">{line.trim().substring(2)}</p>
                        </div>
                    );
                    
                    if (line.match(/^\d+\./)) return (
                        <div key={i} className="flex items-start my-3 pl-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="text-nexus-600 mr-3 font-bold">{line.match(/^\d+\./)![0]}</span>
                            <p className="text-slate-700 flex-1 leading-relaxed">{line.replace(/^\d+\.\s*/, '')}</p>
                        </div>
                    );

                    return <p key={i} className="my-4 leading-relaxed text-slate-600">{line}</p>;
                 })}
             </div>
           )}
      </SidePanel>

      <div className={`${theme.layout.header} mb-6`}>
        <div>
          <h1 className={theme.typography.h1}>Portfolio Overview</h1>
          <p className={theme.typography.small}>Welcome back, Sarah. Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={handleGenerateReport}
             disabled={isGenerating}
             className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50 shadow-sm"
           >
            <Sparkles size={16} className="text-yellow-500"/>
            Generate AI Summary
           </button>
           {hasPermission('project:create') && (
             <button className={`px-4 py-2 ${theme.colors.accentBg} rounded-lg text-sm font-medium text-white hover:bg-nexus-700 flex items-center gap-2 shadow-sm`}>
                <Plus size={16} /> New Project
             </button>
           )}
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
        <StatCard 
          title="Total Portfolio Value" 
          value={`$${(summary.totalBudget / 1000000).toFixed(1)}M`}
          subtext={`Across ${summary.totalProjects} active projects`}
          icon={DollarSign}
        />
        <StatCard 
          title="Budget Utilization" 
          value={`${summary.budgetUtilization.toFixed(1)}%`}
          subtext="Within expected variance"
          icon={TrendingUp}
          trend="up"
        />
        <StatCard 
          title="Critical Issues" 
          value={summary.healthCounts.critical}
          subtext="Requires immediate attention"
          icon={AlertOctagon}
          trend="down"
        />
        <StatCard 
          title="Schedule Performance" 
          value="SPI 0.92"
          subtext="Slightly behind schedule"
          icon={TrendingDown}
          trend="down"
        />
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
        <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
          <h3 className={`${theme.typography.h3} mb-6`}>Budget Actuals by Project</h3>
          <CustomBarChart 
            data={budgetDataForChart}
            xAxisKey="name"
            dataKey="Spent"
            height={300}
            barColor="#0ea5e9"
            formatTooltip={(val) => `$${(val/1000000).toFixed(2)}M`}
          />
        </div>

        <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
          <h3 className={`${theme.typography.h3} mb-6`}>Portfolio Health Distribution</h3>
          <CustomPieChart 
            data={healthDataForChart}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
