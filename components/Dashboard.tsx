
import React, { useState, useTransition, useMemo } from 'react';
import { Sparkles, Loader2, Globe, TrendingUp, AlertTriangle, Target, LayoutDashboard } from 'lucide-react';
import { usePortfolioState } from '../hooks/usePortfolioState';
import { useGeminiAnalysis } from '../hooks/useGeminiAnalysis';
import { SidePanel } from './ui/SidePanel';
import { Button } from './ui/Button';
import { DashboardKPIs } from './dashboard/DashboardKPIs';
import { DashboardVisuals } from './dashboard/DashboardVisuals';
import { EmptyGrid } from './common/EmptyGrid';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { PortfolioCommandBar } from './dashboard/PortfolioCommandBar';
import { SystemPulse } from './dashboard/SystemPulse';
import { useI18n } from '../context/I18nContext';
import { useData } from '../context/DataContext';
import { PageLayout } from './layout/standard/PageLayout';
import { usePermissions } from '../hooks/usePermissions';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { t } = useI18n();
  const { state } = useData();
  const { hasPermission } = usePermissions();
  const { summary, healthDataForChart, budgetDataForChart, projects } = usePortfolioState();
  const { generateReport, report, isGenerating, reset } = useGeminiAnalysis();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [viewType, setViewType] = useState<'financial' | 'strategic'>('financial');
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const handleGenerateReport = () => { setIsReportOpen(true); generateReport(projects); };
  const handleViewChange = (t: 'financial' | 'strategic') => startTransition(() => setViewType(t));

  const actions = (
      <div className="flex gap-2 items-center">
        <div className={`${theme.colors.background} p-1 rounded-lg flex border ${theme.colors.border} shadow-inner`}>
          <button 
            onClick={() => handleViewChange('financial')} 
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewType === 'financial' ? `${theme.colors.surface} shadow-sm text-nexus-700 ring-1 ring-black/5` : `${theme.colors.text.secondary} hover:${theme.colors.text.primary}`}`}
          >
            {t('common.financial', 'Financial')}
          </button>
          <button 
            onClick={() => handleViewChange('strategic')} 
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewType === 'strategic' ? `${theme.colors.surface} shadow-sm text-nexus-700 ring-1 ring-black/5` : `${theme.colors.text.secondary} hover:${theme.colors.text.primary}`}`}
          >
            {t('common.strategic', 'Strategic')}
          </button>
        </div>
        <div className={`h-6 w-px ${theme.colors.border} mx-1 hidden md:block`}></div>
        <Button 
            variant="outline"
            onClick={handleGenerateReport} 
            disabled={isGenerating} 
            icon={Sparkles}
            className={isGenerating ? "opacity-70 cursor-wait" : ""}
        >
            {isGenerating ? t('common.analyzing_short', 'Analyzing...') : t('dashboard.ai_briefing', 'AI Briefing')}
        </Button>
        {hasPermission('system:configure') && (
            <Button 
                onClick={() => navigate('/getting-started')} 
                className="bg-nexus-600 text-white shadow-md shadow-nexus-500/20"
                icon={Globe}
            >
                {t('portfolio.provision', 'Provision Portfolio')}
            </Button>
        )}
      </div>
  );

  if (summary.totalProjects === 0) {
      return (
        <PageLayout
            title={t('dashboard.title', 'Executive Portfolio Overview')}
            subtitle={t('dashboard.subtitle', 'Consolidated KPIs for organizational investment and delivery.')}
            icon={LayoutDashboard}
            actions={actions}
        >
              <div className="flex-1 flex items-center justify-center">
                  <EmptyGrid 
                    title={t('portfolio.not_init', 'Portfolio Not Initialized')}
                    description={t('portfolio.not_init_desc', 'Your executive dashboard requires a defined Enterprise Project Structure (EPS) and active programs.')}
                    icon={Globe}
                    actionLabel={t('portfolio.provision', 'Provision Strategic Portfolio')}
                    onAdd={() => navigate('/getting-started')}
                  />
              </div>
        </PageLayout>
      );
  }

  const strategicInsight = useMemo(() => {
     // Rule: Derive thresholds from organizational governance if available
     const varianceThreshold = state.governance?.scheduling?.autoLevelingThreshold / 100 || 0.3;
     const budgetThreshold = 95; 

     const atRisk = summary.healthCounts.critical + summary.healthCounts.warning;
     const riskRatio = atRisk / summary.totalProjects;
     
     if (riskRatio > varianceThreshold) return { type: 'critical', title: 'Portfolio Variance Detected', msg: `${(riskRatio * 100).toFixed(0)}%+ of active initiatives are tracking behind baseline.`};
     if (summary.budgetUtilization > budgetThreshold) return { type: 'warning', title: 'Budget Saturation', msg: `Portfolio budget utilization exceeds ${budgetThreshold}%.` };
     return { type: 'good', title: 'Performance Optimal', msg: 'Portfolio execution is aligned with strategic objectives.' };
  }, [summary, state.governance]);

  return (
    <PageLayout
        title={t('dashboard.title', 'Executive Portfolio Overview')}
        subtitle={t('dashboard.subtitle', 'Consolidated KPIs for organizational investment and delivery.')}
        icon={LayoutDashboard}
        actions={actions}
        isScrollable={true}
    >
      <SidePanel 
        isOpen={isReportOpen} 
        onClose={() => { setIsReportOpen(false); reset(); }} 
        width="max-w-xl" 
        title={<span className="flex items-center gap-2 font-black uppercase text-sm tracking-widest"><Sparkles size={18} className="text-nexus-500" /> {t('dashboard.ai_brief', 'Executive AI Brief')}</span>} 
        footer={<Button onClick={() => setIsReportOpen(false)}>{t('common.close', 'Close')}</Button>}
      >
           {isGenerating ? (
             <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="animate-spin text-nexus-500 mb-4" size={40} />
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{t('common.analyzing', 'Synthesizing Executive Summary...')}</p>
             </div>
           ) : (
             report && <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">{report}</div>
           )}
      </SidePanel>

      <div className={`flex flex-col ${theme.layout.gridGap} pb-20`}>
        
        <div className={`p-5 rounded-2xl border flex items-start gap-4 shadow-sm transition-all duration-500 ${
            strategicInsight.type === 'critical' ? 'bg-red-50 border-red-200' : 
            strategicInsight.type === 'warning' ? 'bg-amber-50 border-amber-200' : 
            'bg-slate-900 border-slate-800 text-white shadow-xl'
        }`}>
            <div className={`p-2.5 rounded-xl shrink-0 ${strategicInsight.type === 'good' ? 'bg-white/10 text-nexus-400' : 'bg-white shadow-sm'}`}>
                {strategicInsight.type === 'good' ? <Target size={22} /> : <AlertTriangle size={22} className={strategicInsight.type === 'critical' ? 'text-red-500' : 'text-amber-500'} />}
            </div>
            <div>
                <h4 className={`font-black text-sm uppercase tracking-tight ${strategicInsight.type === 'good' ? 'text-white' : 'text-slate-900'}`}>{strategicInsight.title}</h4>
                <p className={`text-xs mt-1.5 leading-relaxed font-medium ${strategicInsight.type === 'good' ? 'text-slate-300' : 'text-slate-600'}`}>{strategicInsight.msg}</p>
            </div>
        </div>

        <DashboardKPIs summary={summary} />
        <PortfolioCommandBar />
        
        <div className="relative">
            <DashboardVisuals budgetData={budgetDataForChart} healthData={healthDataForChart} viewType={viewType} isPending={isPending} />
        </div>

        <SystemPulse summary={summary} />
      </div>
    </PageLayout>
  );
};
export default Dashboard;
