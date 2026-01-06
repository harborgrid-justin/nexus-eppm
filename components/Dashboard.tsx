import React, { useState, useTransition, Suspense } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { usePortfolioState } from '../hooks/usePortfolioState';
import { useGeminiAnalysis } from '../hooks/useGeminiAnalysis';
import { SidePanel } from './ui/SidePanel';
import { Button } from './ui/Button';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardKPIs } from './dashboard/DashboardKPIs';
import { DashboardVisuals } from './dashboard/DashboardVisuals';

const Dashboard: React.FC = () => {
  const { summary, healthDataForChart, budgetDataForChart, projects } = usePortfolioState();
  const { generateReport, report, isGenerating, reset } = useGeminiAnalysis();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [viewType, setViewType] = useState<'financial' | 'strategic'>('financial');
  const [isPending, startTransition] = useTransition();

  const handleGenerateReport = () => { setIsReportOpen(true); generateReport(projects); };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6 md:p-8">
      <SidePanel isOpen={isReportOpen} onClose={() => { setIsReportOpen(false); reset(); }} width="max-w-xl" title={<span className="flex items-center gap-2"><Sparkles size={18} className="text-nexus-500" /> AI Analysis</span>} footer={<Button onClick={() => setIsReportOpen(false)}>Close</Button>}>
           {isGenerating ? <div className="flex flex-col items-center justify-center py-20"><Loader2 className="animate-spin text-nexus-500 mb-4" size={40} /><p>Analyzing Portfolio...</p></div> : report && <div className="prose prose-sm max-w-none text-slate-600">{report.split('\n').map((l, i) => <p key={i}>{l}</p>)}</div>}
      </SidePanel>

      <DashboardHeader onGenerateReport={handleGenerateReport} isGenerating={isGenerating} viewType={viewType} onViewChange={(t) => startTransition(() => setViewType(t))} />
      <DashboardKPIs summary={summary} />
      <DashboardVisuals budgetData={budgetDataForChart} healthData={healthDataForChart} viewType={viewType} isPending={isPending} />
    </div>
  );
};
export default Dashboard;