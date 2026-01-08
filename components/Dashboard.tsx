
import React, { useState, useTransition } from 'react';
import { Sparkles, Loader2, Plus, Briefcase, ShieldAlert, Target, Zap } from 'lucide-react';
import { usePortfolioState } from '../hooks/usePortfolioState';
import { useGeminiAnalysis } from '../hooks/useGeminiAnalysis';
import { SidePanel } from './ui/SidePanel';
import { Button } from './ui/Button';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardKPIs } from './dashboard/DashboardKPIs';
import { DashboardVisuals } from './dashboard/DashboardVisuals';
import { EmptyGrid } from './common/EmptyGrid';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

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

  if (summary.totalProjects === 0) {
      return (
          <div className="h-full flex flex-col p-6 md:p-8">
              <DashboardHeader 
                onGenerateReport={handleGenerateReport} 
                isGenerating={isGenerating} 
                viewType={viewType} 
                onViewChange={handleViewChange} 
              />
              <div className="flex-1 flex items-center justify-center">
                  <EmptyGrid 
                    title="Portfolio Not Initialized"
                    description="Your executive dashboard is waiting for data. Launch your first project to activate real-time analytics."
                    icon={Briefcase}
                    actionLabel="Launch First Project"
                    onAdd={() => navigate('/projectList?action=create')}
                  />
              </div>
          </div>
      );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6 md:p-8">
      <SidePanel isOpen={isReportOpen} onClose={() => { setIsReportOpen(false); reset(); }} width="max-w-xl" title={<span className="flex items-center gap-2"><Sparkles size={18} className="text-nexus-500" /> AI Analysis</span>} footer={<Button onClick={() => setIsReportOpen(false)}>Close</Button>}>
           {isGenerating ? <div className="flex flex-col items-center justify-center py-20"><Loader2 className="animate-spin text-nexus-500 mb-4" size={40} /><p>Analyzing Portfolio...</p></div> : report && <div className="prose prose-sm max-w-none text-slate-600">{report.split('\n').map((l, i) => <p key={i}>{l}</p>)}</div>}
      </SidePanel>

      <DashboardHeader onGenerateReport={handleGenerateReport} isGenerating={isGenerating} viewType={viewType} onViewChange={handleViewChange} />
      
      {/* Portfolio Command Bar - New Actionable Area */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/projectList?action=create')}
            className={`p-4 rounded-xl border border-dashed border-nexus-300 bg-nexus-50/50 hover:bg-nexus-50 transition-all flex items-center gap-4 group text-left`}
          >
              <div className="w-10 h-10 rounded-full bg-white border border-nexus-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Briefcase className="text-nexus-600" size={18}/>
              </div>
              <div>
                  <h4 className="font-bold text-slate-800 text-sm">Initiate Project</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Start a new charter from template</p>
              </div>
          </button>

          <button 
            onClick={() => navigate('/enterpriseRisks?view=register')}
            className={`p-4 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 hover:bg-orange-50 transition-all flex items-center gap-4 group text-left`}
          >
              <div className="w-10 h-10 rounded-full bg-white border border-orange-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <ShieldAlert className="text-orange-600" size={18}/>
              </div>
              <div>
                  <h4 className="font-bold text-slate-800 text-sm">Log Strategic Risk</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Escalate threat to portfolio level</p>
              </div>
          </button>

          <button 
             onClick={() => navigate('/portfolio?tab=scenarios')}
             className={`p-4 rounded-xl border border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-50 transition-all flex items-center gap-4 group text-left`}
          >
              <div className="w-10 h-10 rounded-full bg-white border border-purple-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Target className="text-purple-600" size={18}/>
              </div>
              <div>
                  <h4 className="font-bold text-slate-800 text-sm">Model Scenario</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Run what-if analysis on budget</p>
              </div>
          </button>
      </div>

      <DashboardKPIs summary={summary} />
      
      <div className="relative">
          <DashboardVisuals budgetData={budgetDataForChart} healthData={healthDataForChart} viewType={viewType} isPending={isPending} />
          
          {/* Quick Stats Overlay for Engagement */}
          <div className="mt-6 p-4 bg-slate-900 rounded-xl text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-nexus-600 rounded-lg"><Zap size={20}/></div>
                  <div>
                      <p className="font-bold text-sm">System Pulse</p>
                      <p className="text-xs text-slate-400">Real-time data stream active</p>
                  </div>
              </div>
              <div className="flex gap-6 text-xs text-slate-300 font-mono">
                  <span><strong className="text-white">{summary.totalTasks}</strong> Tasks</span>
                  <span><strong className="text-white">{summary.totalCriticalIssues}</strong> Critical Issues</span>
                  <span><strong className="text-white">{summary.healthCounts.critical}</strong> Projects At Risk</span>
              </div>
          </div>
      </div>
    </div>
  );
};
export default Dashboard;
