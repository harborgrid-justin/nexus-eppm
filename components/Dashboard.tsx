
import React, { useState, useMemo, useTransition, useDeferredValue, Suspense } from 'react';
import { TrendingDown, TrendingUp, AlertOctagon, DollarSign, Sparkles, Loader2, X, Plus, FileText, BarChart3, Filter } from 'lucide-react';
import StatCard from './shared/StatCard';
import { useTheme } from '../context/ThemeContext';
import { useGeminiAnalysis } from '../hooks/useGeminiAnalysis';
import { usePermissions } from '../hooks/usePermissions';
import { usePortfolioState } from '../hooks/usePortfolioState';
import { CustomBarChart } from './charts/CustomBarChart';
import { CustomPieChart } from './charts/CustomPieChart';
import { SidePanel } from './ui/SidePanel';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Skeleton } from './ui/Skeleton';
import { formatCompactCurrency } from '../utils/formatters';
import { ErrorBoundary } from './ErrorBoundary';
import { useDeterministicLoading } from '../hooks/useDeterministicLoading';
import { useNavigate } from 'react-router-dom';

// Widget Fallbacks ensuring Zero Layout Shift (Principle 1)
const StatCardSkeleton = () => (
  <Card className="p-5 md:p-6 flex flex-col h-full justify-between">
    <div className="flex justify-between items-start mb-4 gap-4">
       <div className="flex-1 space-y-2">
         <Skeleton height={12} width="60%" />
         <Skeleton height={32} width="80%" />
       </div>
       <Skeleton width={40} height={40} variant="rect" className="rounded-xl" />
    </div>
    <div className="pt-3 border-t border-slate-50">
        <Skeleton height={12} width="40%" />
    </div>
  </Card>
);

const ChartSkeleton = ({ height = 300 }: { height?: number }) => (
  <div className="w-full flex flex-col items-center justify-center animate-pulse space-y-4" style={{ height }}>
    <div className="flex items-end gap-2 w-full h-3/4 px-4 pb-4 border-b border-slate-100">
       {[...Array(6)].map((_, i) => (
         <Skeleton key={i} width="100%" height={`${Math.random() * 80 + 20}%`} className="rounded-t-md" />
       ))}
    </div>
    <div className="flex justify-between w-full px-4">
        <Skeleton width={40} height={10} />
        <Skeleton width={40} height={10} />
        <Skeleton width={40} height={10} />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { summary, healthDataForChart: rawHealthData, budgetDataForChart: rawBudgetData, projects } = usePortfolioState();
  const { tokens } = useTheme();
  const { generateReport, report, isGenerating, error, reset } = useGeminiAnalysis();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  const [isPending, startTransition] = useTransition();
  // Deterministic loading prevents flicker on fast transitions (Principle 4)
  const displayLoading = useDeterministicLoading(isPending, 300);

  const [viewType, setViewType] = useState<'financial' | 'strategic'>('financial');

  const deferredBudgetData = useDeferredValue(rawBudgetData);
  const deferredHealthData = useDeferredValue(rawBudgetData);

  const healthDataForChart = useMemo(() => rawHealthData.map((d: { name: string; value: number }) => {
      let color;
      if (d.name === 'Good') color = tokens.colors.success;
      else if (d.name === 'Warning') color = tokens.colors.warning;
      else color = tokens.colors.error;
      return { ...d, color };
  }), [rawHealthData, tokens]);

  const handleGenerateReport = () => {
    setIsReportOpen(true);
    generateReport(projects);
  };

  const handleViewChange = (type: 'financial' | 'strategic') => {
      startTransition(() => {
          setViewType(type);
      });
  };

  const aiPanelTitle = (
    <span className="flex items-center gap-2">
      <Sparkles size={18} className="text-nexus-500" /> AI Analysis
    </span>
  );

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-[var(--spacing-gutter)]">
      <SidePanel 
        isOpen={isReportOpen} 
        onClose={() => { setIsReportOpen(false); reset(); }} 
        width="max-w-xl" 
        title={aiPanelTitle} 
        footer={<Button onClick={() => setIsReportOpen(false)}>Close</Button>}
      >
           {isGenerating ? (
               <div className="flex flex-col items-center justify-center py-20">
                   <Loader2 className="animate-spin text-nexus-500 mb-4" size={40} />
                   <p>Analyzing Portfolio...</p>
               </div>
           ) : (
               report && (
                   <div className="prose prose-sm max-w-none text-text-secondary">
                       {report.split('\n').map((l, i) => <p key={i}>{l}</p>)}
                   </div>
               )
           )}
      </SidePanel>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
           <h3 className="text-lg font-bold text-text-primary">Executive Overview</h3>
           <p className="text-sm text-text-secondary">Key performance indicators across the enterprise.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
           <div className="bg-background p-1 rounded-lg flex border border-border">
              <button onClick={() => handleViewChange('financial')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewType === 'financial' ? 'bg-surface shadow-sm text-nexus-700' : 'text-text-secondary'}`}>Financial</button>
              <button onClick={() => handleViewChange('strategic')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewType === 'strategic' ? 'bg-surface shadow-sm text-nexus-700' : 'text-text-secondary'}`}>Strategic</button>
           </div>
           <button onClick={handleGenerateReport} disabled={isGenerating} className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm hover:bg-background text-text-primary"><Sparkles size={16} className="text-yellow-500"/> AI Summary</button>
           {hasPermission('project:create') && <button onClick={() => navigate('/projectList?action=create')} className="px-4 py-2 bg-primary rounded-lg text-sm font-bold text-white flex items-center gap-2 shadow-sm hover:bg-primary-dark"><Plus size={16} /> New Project</button>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Suspense fallback={<><StatCardSkeleton/><StatCardSkeleton/><StatCardSkeleton/><StatCardSkeleton/></>}>
            <StatCard title="Total Portfolio Value" value={formatCompactCurrency(summary.totalBudget)} subtext={`Across ${summary.totalProjects} components`} icon={DollarSign} />
            <StatCard title="Budget Utilization" value={`${summary.budgetUtilization.toFixed(1)}%`} subtext="Actuals + Commitments" icon={TrendingUp} trend="up" />
            <StatCard title="Critical Issues" value={summary.totalCriticalIssues} subtext="Requires attention" icon={AlertOctagon} trend={summary.totalCriticalIssues > 0 ? 'down' : "up"} />
            <StatCard title="Schedule Health" value={`SPI ${summary.portfolioSpi.toFixed(2)}`} subtext={`${Math.abs(1 - summary.portfolioSpi) * 100 > 1 ? `${(Math.abs(1 - summary.portfolioSpi) * 100).toFixed(0)}% ${summary.portfolioSpi < 1 ? 'behind' : 'ahead'}` : 'On track'}`} icon={summary.portfolioSpi < 1 ? TrendingDown : TrendingUp} trend={summary.portfolioSpi < 1 ? "down" : "up"} />
        </Suspense>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity duration-300 ${displayLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <Card className="p-[var(--spacing-cardPadding)] flex flex-col min-w-0 h-[400px]">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-base font-bold text-text-primary">{viewType === 'financial' ? 'Spend by Project' : 'Strategic ROI'}</h3>
             <Button variant="ghost" size="sm" icon={Filter} />
          </div>
          <div className="flex-1 min-h-0">
            <ErrorBoundary name="Budget Chart">
                <Suspense fallback={<ChartSkeleton height={300} />}>
                <CustomBarChart data={deferredBudgetData} xAxisKey="name" dataKey="Spent" height={300} barColor={tokens.colors.info} formatTooltip={(val) => formatCompactCurrency(val)} />
                </Suspense>
            </ErrorBoundary>
          </div>
        </Card>

        <Card className="p-[var(--spacing-cardPadding)] flex flex-col min-w-0 h-[400px]">
          <h3 className="text-base font-bold text-text-primary mb-6 flex-shrink-0">Portfolio Health Distribution</h3>
          <div className="flex-1 min-h-0 flex items-center justify-center">
             <ErrorBoundary name="Health Chart">
                <Suspense fallback={<Skeleton variant="circle" width={200} height={200} />}>
                    <CustomPieChart data={healthDataForChart} height={300} />
                </Suspense>
             </ErrorBoundary>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;
