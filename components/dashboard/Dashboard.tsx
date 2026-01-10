import React, { useState, useTransition } from 'react';
import { Sparkles, Loader2, Globe, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { usePortfolioState } from '../../hooks/usePortfolioState';
import { useGeminiAnalysis } from '../../hooks/useGeminiAnalysis';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { DashboardHeader } from './DashboardHeader';
import { DashboardKPIs } from './DashboardKPIs';
import { DashboardVisuals } from './DashboardVisuals';
import { EmptyGrid } from '../common/EmptyGrid';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { PortfolioCommandBar } from './PortfolioCommandBar';
import { SystemPulse } from './SystemPulse';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { summary, healthDataForChart, budgetDataForChart, projects } = usePortfolioState();
  const { generateReport, report, isGenerating, reset } = useGeminiAnalysis();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [viewType, setViewType] = useState<'financial' | 'strategic'>('financial');
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const handleGenerateReport = () => { setIsReportOpen(true); generateReport(projects); };
  const handleViewChange = (t: 'financial' | 'strategic') => startTransition(() => setViewType(t));

  // Oracle P6 Parity: Check for Portfolio-level initialization (EPS presence)
  if (summary.totalProjects === 0) {
      return (
          <div className="h-full flex flex-col p-6 md:p-8 animate-in fade-in duration-500">
              <DashboardHeader 
                onGenerateReport={handleGenerateReport} 
                isGenerating={isGenerating} 
                viewType={viewType} 
                onViewChange={handleViewChange} 
              />
              <div className="flex-1 flex items-center justify-center">
                  <EmptyGrid 
                    title="Portfolio Not Initialized"
                    description="Your executive dashboard requires a defined Enterprise Project Structure (EPS) and active programs to generate insights. Establish your first strategic portfolio to activate real-time analytics."
                    icon={Globe}
                    actionLabel="Provision Strategic Portfolio"
                    onAdd={() => navigate('/getting-started?action=wizard')}
                  />
              </div>
          </div>
      );
  }

  const strategicInsight = React.useMemo(() => {
     const atRisk = summary.healthCounts.critical + summary.healthCounts.warning;
     const riskRatio = atRisk / summary.totalProjects;
     
     if (riskRatio > 0.3) return { type: 'critical', title: 'Portfolio Variance Detected', msg: `30%+ of active initiatives are tracking behind baseline. Recommend immediate review of ${summary.healthCounts.critical} critical projects.`};
     if (summary.budgetUtilization > 95) return { type: 'warning', title: 'Budget Saturation', msg: 'Portfolio budget utilization exceeds 95%. New initiatives may require capital re-allocation.' };
     return { type: 'good', title: 'Performance Optimal', msg: 'Portfolio execution is aligned with strategic objectives. Schedule Performance Index (SPI) remains healthy across major programs.' };
  }, [summary]);

  return (
    <div className={`h-full overflow-y-auto scrollbar-thin ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-500`}>
      <SidePanel isOpen={isReportOpen} onClose={() => { setIsReportOpen(false); reset(); }} width="max-w-xl" title={<span className="flex items-center gap-2"><Sparkles size={18} className="text-nexus-500" /> Executive AI Brief</span>} footer={<Button onClick={() => setIsReportOpen(false)}>Close</Button>}>
           {isGenerating ? <div className="flex flex-col items-center justify-center py-20"><Loader2 className="animate-spin text-nexus-500 mb-4" size={40} /><p className="text-slate-500 font-medium">Synthesizing Executive Summary...</p></div> : report && <div className="prose prose-sm max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed">{report}</div>}
      </SidePanel>

      <DashboardHeader onGenerateReport={handleGenerateReport} isGenerating={isGenerating} viewType={viewType} onViewChange={handleViewChange} />
      
      <div className={`p-4 rounded-xl border flex items-start gap-4 shadow-sm ${
          strategicInsight.type === 'critical' ? 'bg-red-50 border-red-200' : 
          strategicInsight.type === 'warning' ? 'bg-amber-50 border-amber-200' : 
          'bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700 text-white'
      }`}>
          <div className={`p-2 rounded-lg shrink-0 ${strategicInsight.type === 'good' ? 'bg-white/10 text-nexus-400' : 'bg-white/60'}`}>
              {strategicInsight.type === 'good' ? <Target size={20} /> : <AlertTriangle size={20} className={strategicInsight.type === 'critical' ? 'text-red-600' : 'text-amber-600'} />}
          </div>
          <div>
              <h4 className={`font-bold text-sm ${strategicInsight.type === 'good' ? 'text-white' : 'text-slate-900'}`}>{strategicInsight.title}</h4>
              <p className={`text-xs mt-1 leading-relaxed ${strategicInsight.type === 'good' ? 'text-slate-300' : 'text-slate-700'}`}>{strategicInsight.msg}</p>
          </div>
      </div>

      <div className="space-y-6">
          <DashboardKPIs summary={summary} />
          <PortfolioCommandBar />
      </div>
      
      <div className="relative space-y-6">
          <DashboardVisuals budgetData={budgetDataForChart} healthData={healthDataForChart} viewType={viewType} isPending={isPending} />
          <SystemPulse summary={summary} />
      </div>
    </div>
  );
};
export default Dashboard;