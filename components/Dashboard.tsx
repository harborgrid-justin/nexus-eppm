
import React, { useState, useMemo, useTransition, useDeferredValue, Suspense } from 'react';
import { useLoaderData } from 'react-router-dom';
import { TrendingDown, TrendingUp, AlertOctagon, DollarSign, Sparkles, Loader2, X, Plus, FileText, BarChart3 } from 'lucide-react';
import StatCard from './shared/StatCard';
import { useTheme } from '../context/ThemeContext';
import { useGeminiAnalysis } from '../hooks/useGeminiAnalysis';
import { usePermissions } from '../hooks/usePermissions';
import { CustomBarChart } from './charts/CustomBarChart';
import { CustomPieChart } from './charts/CustomPieChart';
import { SidePanel } from './ui/SidePanel';
import { Button } from './ui/Button';
// FIX: Added missing import for Card component.
import { Card } from './ui/Card';
import { formatCompactCurrency } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const { summary, healthDataForChart: rawHealthData, budgetDataForChart: rawBudgetData, projects } = useLoaderData() as any;
  const theme = useTheme();
  const { generateReport, report, isGenerating, error, reset } = useGeminiAnalysis();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { hasPermission } = usePermissions();

  // Pattern 16: useTransition for view-switching within the dashboard
  const [isPending, startTransition] = useTransition();
  const [viewType, setViewType] = useState<'financial' | 'strategic'>('financial');

  // Pattern 17: useDeferredValue for chart data to keep UI interactions snappy
  const deferredBudgetData = useDeferredValue(rawBudgetData);
  const deferredHealthData = useDeferredValue(rawHealthData);

  const healthDataForChart = useMemo(() => deferredHealthData.map((d: { name: string; value: number }) => {
      let color;
      if (d.name === 'Good') color = theme.charts.palette[1];
      else if (d.name === 'Warning') color = theme.charts.palette[2];
      else color = theme.charts.palette[3];
      return { ...d, color };
  }), [deferredHealthData, theme]);

  const handleGenerateReport = () => {
    setIsReportOpen(true);
    generateReport(projects);
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} scrollbar-thin`}>
      <SidePanel isOpen={isReportOpen} onClose={() => { setIsReportOpen(false); reset(); }} width="md:w-[600px]" title={<span className="flex items-center gap-2"><Sparkles size={18} className="text-nexus-500" /> AI Analysis</span>} footer={<Button onClick={() => setIsReportOpen(false)}>Close</Button>}>
           {isGenerating ? <div className="flex flex-col items-center justify-center py-20"><Loader2 className="animate-spin text-nexus-500 mb-4" size={40} /><p>Analyzing Portfolio...</p></div> : 
            report && <div className="prose prose-sm max-w-none">{report.split('\n').map((l, i) => <p key={i}>{l}</p>)}</div>}
      </SidePanel>

      <div className={`${theme.layout.header} mb-6 flex-wrap gap-4`}>
        <div className="min-w-0 flex-1">
          <h1 className={`${theme.typography.h1} truncate`}>Portfolio Workspace</h1>
          <p className={theme.typography.small}>Executive oversight of strategic investments.</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
           <div className="bg-slate-200/50 p-1 rounded-lg flex mr-4">
              <button onClick={() => startTransition(() => setViewType('financial'))} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewType === 'financial' ? 'bg-white shadow-sm text-nexus-700' : 'text-slate-500'}`}>Financial</button>
              <button onClick={() => startTransition(() => setViewType('strategic'))} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewType === 'strategic' ? 'bg-white shadow-sm text-nexus-700' : 'text-slate-500'}`}>Strategic</button>
           </div>
           <button onClick={handleGenerateReport} disabled={isGenerating} className={`px-4 py-2 ${theme.colors.surface} border rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm`}><Sparkles size={16} className="text-yellow-500"/> AI Summary</button>
           {hasPermission('project:create') && <button className={`px-4 py-2 ${theme.colors.primary} rounded-lg text-sm font-bold text-white flex items-center gap-2 shadow-sm`}><Plus size={16} /> New Project</button>}
        </div>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        <StatCard title="Total Portfolio Value" value={`$${(summary.totalBudget / 1000000).toFixed(1)}M`} subtext={`Across ${summary.totalProjects} components`} icon={DollarSign} />
        <StatCard title="Budget Utilization" value={`${summary.budgetUtilization.toFixed(1)}%`} subtext="Actuals + Commitments" icon={TrendingUp} trend="up" />
        <StatCard title="Critical Issues" value={summary.healthCounts.critical} subtext="Requires attention" icon={AlertOctagon} trend="down" />
        <StatCard title="Schedule Health" value="SPI 0.92" subtext="14% behind baseline" icon={TrendingDown} trend="down" />
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 flex-1 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        <Card className={`${theme.layout.cardPadding} flex flex-col min-w-0`}>
          <h3 className={`${theme.typography.h3} mb-6 flex-shrink-0`}>{viewType === 'financial' ? 'Spend by Project' : 'Strategic ROI'}</h3>
          <div className="flex-1 min-h-[300px]">
            <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-slate-50 rounded-lg animate-pulse"><BarChart3 className="text-slate-200" size={48}/></div>}>
              <CustomBarChart data={deferredBudgetData} xAxisKey="name" dataKey="Spent" height={300} barColor={theme.charts.palette[0]} formatTooltip={(val) => formatCompactCurrency(val)} />
            </Suspense>
          </div>
        </Card>

        <Card className={`${theme.layout.cardPadding} flex flex-col min-w-0`}>
          <h3 className={`${theme.typography.h3} mb-6 flex-shrink-0`}>Portfolio Risk Distribution</h3>
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
             <Suspense fallback={<div className="w-48 h-48 rounded-full border-8 border-slate-100 border-t-nexus-200 animate-spin"></div>}>
                <CustomPieChart data={healthDataForChart} height={300} />
             </Suspense>
          </div>
        {/* FIX: Corrected closing tag from </div> to </Card> to match the opening tag. */}
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;
