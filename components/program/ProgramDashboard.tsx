
import React, { useMemo } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useGeminiAnalysis } from '../../hooks/useGeminiAnalysis';
import { useData } from '../../context/DataContext';
import { SidePanel } from '../ui/SidePanel';
import { ProgramKPIs } from './ProgramKPIs';
import { ProgramVisuals } from './ProgramVisuals';
import { NarrativeField } from '../common/NarrativeField';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { Sparkles, Target, Lightbulb, Briefcase, Plus, FileText, Layers, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { usePermissions } from '../../hooks/usePermissions';
import { generateId, formatCompactCurrency } from '../../utils/formatters';
import { EmptyGrid } from '../common/EmptyGrid';

const ProgramDashboard: React.FC<{ programId: string }> = ({ programId }) => {
  const { program, projects, aggregateMetrics, programRisks } = useProgramData(programId);
  const { generateProgramReport, report, isGenerating, reset } = useGeminiAnalysis();
  const { dispatch } = useData();
  const theme = useTheme();
  const { t } = useI18n();
  const { canEditProject } = usePermissions();
  
  const [isReportOpen, setIsReportOpen] = React.useState(false);

  const burnRate = useMemo(() => {
    if (!aggregateMetrics.totalBudget) return 0;
    return (aggregateMetrics.totalSpent / aggregateMetrics.totalBudget) * 100;
  }, [aggregateMetrics]);

  const handleUpdate = (field: string, value: string) => {
    if (!program) return;
    dispatch({
        type: 'UPDATE_PROGRAM',
        payload: { ...program, [field]: value }
    });
  };

  const handleGenerateReport = async () => {
      if (!program) return;
      setIsReportOpen(true);
      await generateProgramReport(program, projects, {
          metrics: aggregateMetrics,
          burnRate: burnRate.toFixed(1)
      });
  };

  const handleAddProject = () => {
      dispatch({
          type: 'PROJECT_IMPORT',
          payload: [{
              id: generateId('P'),
              programId: programId,
              name: t('program.new_initiative', 'New Initiative'),
              code: `PRJ-${Date.now()}`,
              status: 'Planned',
              health: 'Good',
              budget: 0,
              spent: 0,
              startDate: new Date().toISOString().split('T')[0],
              endDate: '',
              managerId: 'Unassigned',
              tasks: [],
              epsId: 'EPS-ROOT',
              obsId: 'OBS-ROOT',
              calendarId: 'CAL-STD',
              category: 'General',
              strategicImportance: 5,
              financialValue: 5,
              riskScore: 0,
              resourceFeasibility: 5,
              calculatedPriorityScore: 50
          }]
      });
  };

  const programInsight = useMemo(() => {
    if (!program || projects.length === 0) return t('program.insights.pending', "Analyzing portfolio performance and burn rates...");
    
    const totalBudget = program.budget || aggregateMetrics.totalBudget;
    const totalSpent = aggregateMetrics.totalSpent;
    
    const criticalCount = projects.filter(p => p.health === 'Critical').length;
    
    if (criticalCount > 0) {
        return t('program.insights.critical', `Attention: ${criticalCount} component project(s) are in critical health. Program delivery risk is elevated.`);
    }
    
    if (totalBudget > 0 && (totalSpent / totalBudget) > 0.95) {
        return t('program.insights.budget', `Financial Alert: Program has utilized ${((totalSpent / totalBudget) * 100).toFixed(1)}% of total budget authority.`);
    }

    return t('program.insights.stable', `Operational Stability: Program is tracking within established performance parameters across ${projects.length} component initiatives.`);
  }, [program, projects, aggregateMetrics, t]);

  if (!program) return null;

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} flex flex-col ${theme.layout.gridGap} animate-in fade-in duration-500 scrollbar-thin`}>
        <SidePanel 
            isOpen={isReportOpen} 
            onClose={() => { setIsReportOpen(false); reset(); }} 
            width="max-w-3xl" 
            title={<span className="flex items-center gap-2 font-black uppercase text-sm tracking-widest text-slate-900"><FileText size={18} className="text-nexus-600" /> {t('program.status_report', 'Enterprise Status Report (AI)')}</span>} 
            footer={<Button onClick={() => setIsReportOpen(false)}>{t('common.close', 'Close Briefing')}</Button>}
        >
            {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-nexus-200 border-t-nexus-600 rounded-full animate-spin"></div>
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-nexus-500 animate-pulse" size={24}/>
                    </div>
                    <div className="text-center">
                        <p className="text-slate-800 font-bold uppercase tracking-widest text-xs">{t('common.analyzing', 'Synthesizing Program Artifacts...')}</p>
                    </div>
                </div>
            ) : (
                report && (
                    <div className="animate-in fade-in duration-700 bg-white">
                        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">{report}</div>
                    </div>
                )
            )}
        </SidePanel>

        <div className={`flex justify-between items-center border-b ${theme.colors.border} pb-4`}>
            <div>
                 <h2 className={`${theme.typography.h1} flex items-center gap-3`}><Layers className="text-nexus-600" size={24}/>{t('program.dashboard', 'Program Dashboard')}</h2>
                 <p className={`text-sm ${theme.colors.text.secondary} font-medium`}>{t('program.dashboard_desc', 'Integrated control center for component project performance.')}</p>
            </div>
             <Button variant="primary" onClick={handleGenerateReport} disabled={isGenerating} icon={Sparkles}>{isGenerating ? t('common.analyzing_short', 'Synthesizing...') : t('program.gen_report', 'Generate Status Report')}</Button>
        </div>
        
        <ProgramKPIs program={program} projectCount={projects.length} spent={aggregateMetrics.totalSpent} total={aggregateMetrics.totalBudget} riskCount={programRisks.length} />
        
        <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
            <div className={`lg:col-span-2 flex flex-col ${theme.layout.gridGap}`}>
                <Card className="p-8 border-l-4 border-l-nexus-500 shadow-sm">
                    <h3 className={`${theme.typography.label} mb-6 flex items-center gap-2 border-b pb-3`}><Target size={14} className="text-nexus-600"/>{t('program.strategy_cage', 'Executive Strategy')}</h3>
                    <div className="space-y-8">
                         <NarrativeField 
                            label={t('program.business_case', 'Business Case & Strategic Mandate')}
                            value={program.businessCase}
                            placeholderLabel={t('program.business_case_placeholder', 'Define the strategic mandate for this program to lock the performance baseline.')}
                            onSave={(val) => handleUpdate('businessCase', val)}
                            isReadOnly={!canEditProject()}
                        />
                        <NarrativeField 
                            label={t('program.benefits_strategy', 'Benefits Realization Strategy')}
                            value={program.benefits}
                            placeholderLabel={t('program.benefits_strategy_placeholder', 'Outline key value indicators and harvest targets.')}
                            onSave={(val) => handleUpdate('benefits', val)}
                            isReadOnly={!canEditProject()}
                        />
                    </div>
                </Card>
                <ProgramVisuals projects={projects} />
            </div>

            <div className={`flex flex-col ${theme.layout.gridGap}`}>
                 <Card className="p-6 shadow-sm">
                    <h3 className={`${theme.typography.label} mb-6 flex items-center gap-2 border-b pb-3`}><Briefcase size={14} className="text-green-600"/>{t('program.components', 'Component Initiatives')}</h3>
                    <div className="space-y-3">
                        {projects.length > 0 ? (
                            <>
                                {projects.map(p => (
                                    <div key={p.id} className={`p-3 ${theme.colors.background} rounded-lg border ${theme.colors.border} hover:border-nexus-300 transition-colors group cursor-pointer`}>
                                        <div className="flex justify-between items-start mb-1"><span className={`font-bold text-sm ${theme.colors.text.primary} group-hover:text-nexus-700`}>{p.name}</span><span className={`w-2 h-2 rounded-full ${p.health === 'Good' ? 'bg-green-500' : p.health === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></span></div>
                                        <div className={`flex justify-between text-xs ${theme.colors.text.tertiary}`}><span className="font-mono">{p.code}</span><span>{(p.spent/(p.budget||1)*100).toFixed(0)}%</span></div>
                                    </div>
                                ))}
                                {canEditProject() && (
                                    <button onClick={handleAddProject} className="w-full py-3 mt-2 border-2 border-dashed border-nexus-200 rounded-xl text-nexus-600 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-nexus-50 transition-all">
                                        <Plus size={14}/> {t('program.add_initiative', 'Add Initiative')}
                                    </button>
                                )}
                            </>
                        ) : (
                            <EmptyGrid 
                                title="No Component Projects" 
                                description="This program has no linked projects to aggregate performance data." 
                                onAdd={canEditProject() ? handleAddProject : undefined}
                                actionLabel="Align Project"
                                icon={Briefcase}
                            />
                        )}
                    </div>
                 </Card>

                 <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl">
                     <div className="relative z-10">
                        <h4 className="font-bold flex items-center gap-2 mb-2 text-sm uppercase tracking-widest">
                            <Lightbulb size={18} className="text-yellow-400"/> {t('program.ai_insight', 'Strategic Inference')}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium uppercase tracking-tight">{programInsight}</p>
                    </div>
                     <Target size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12 pointer-events-none"/>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default ProgramDashboard;
