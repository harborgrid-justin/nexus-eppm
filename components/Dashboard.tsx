
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { TrendingDown, TrendingUp, AlertOctagon, DollarSign, Sparkles, Loader2, X } from 'lucide-react';
import { usePortfolioState } from '../hooks';
import StatCard from './shared/StatCard';
import { useTheme } from '../context/ThemeContext';
import { useGeminiAnalysis } from '../hooks/useGeminiAnalysis';

const Dashboard: React.FC = () => {
  const { summary, healthDataForChart, budgetDataForChart, projects } = usePortfolioState();
  const theme = useTheme();
  const { generateReport, report, isGenerating, error, reset } = useGeminiAnalysis();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleGenerateReport = () => {
    setIsReportModalOpen(true);
    generateReport(projects);
  };

  const handleCloseReport = () => {
    setIsReportModalOpen(false);
    reset();
  };

  const ReportModal = () => (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
         <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 flex-shrink-0">
           <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Sparkles size={18} className="text-nexus-500" /> AI Portfolio Analysis</h3>
           <button onClick={handleCloseReport} className="p-1 rounded-full hover:bg-slate-200"><X size={20} /></button>
         </div>
         <div className="p-6 overflow-y-auto">
           {isGenerating && (
             <div className="flex flex-col items-center justify-center py-10">
               <Loader2 className="animate-spin text-nexus-500 mb-2" size={32} />
               <p className="text-slate-500">Analyzing portfolio data...</p>
             </div>
           )}
           
           {error && (
             <div className="text-red-500 text-center py-10">
               {error}
             </div>
           )}

           {report && !isGenerating && report.split('\n').filter(line => line.trim() !== '').map((line, i) => {
               if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold mt-4 mb-1 text-slate-800">{line.substring(4)}</h3>;
               if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-6 mb-2 text-slate-900 border-b pb-1">{line.substring(3)}</h2>;
               if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-extrabold mt-2 mb-4 text-slate-900">{line.substring(2)}</h1>;
               if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) return (
                   <div key={i} className="flex items-start my-1 pl-4">
                     <span className="text-nexus-500 mr-2 mt-1 font-bold">•</span>
                     <p className="text-sm text-slate-700 flex-1">{line.trim().substring(2)}</p>
                   </div>
               );
               if (line.match(/^\d+\./)) return (
                  <div key={i} className="flex items-start my-1 pl-4">
                     <span className="text-slate-600 mr-2 mt-1 font-semibold">{line.match(/^\d+\./)![0]}</span>
                     <p className="text-sm text-slate-700 flex-1">{line.replace(/^\d+\.\s*/, '')}</p>
                   </div>
               );
               return <p key={i} className="text-sm text-slate-600 my-3 leading-relaxed">{line}</p>;
           })}
        </div>
       </div>
    </div>
  );


  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
      {isReportModalOpen && <ReportModal />}
      <div className={`${theme.layout.header} mb-6`}>
        <div>
          <h1 className={theme.typography.h1}>Portfolio Overview</h1>
          <p className={theme.typography.small}>Welcome back, Sarah. Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={handleGenerateReport}
             disabled={isGenerating}
             className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50"
           >
            <Sparkles size={16} className="text-yellow-500"/>
            Generate AI Summary
           </button>
           <button className={`px-4 py-2 ${theme.colors.accentBg} rounded-lg text-sm font-medium text-white hover:bg-nexus-700`}>New Project</button>
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
          <h3 className={`${theme.typography.h3} mb-6`}>Budget vs Actuals by Project</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetDataForChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} tickFormatter={(value) => `$${value/1000000}M`} />
                <RechartsTooltip formatter={(value: number) => `$${(value/1000000).toFixed(2)}M`} />
                <Bar dataKey="Budget" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
          <h3 className={`${theme.typography.h3} mb-6`}>Portfolio Health Distribution</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthDataForChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {healthDataForChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-[-20px]">
            {healthDataForChart.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: d.color }}></div>
                <span className="text-sm text-slate-600">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
