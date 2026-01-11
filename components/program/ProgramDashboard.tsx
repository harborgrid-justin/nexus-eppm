
import React, { useMemo } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useGeminiAnalysis } from '../../hooks/useGeminiAnalysis';
import { useData } from '../../context/DataContext';
import { SidePanel } from '../ui/SidePanel';
import { ProgramKPIs } from './ProgramKPIs';
import { ProgramVisuals } from './ProgramVisuals';
import { NarrativeField } from '../common/NarrativeField';
import { useTheme } from '../../context/ThemeContext';
// FIX: Added missing Layers icon import from lucide-react
import { Sparkles, Loader2, Target, Lightbulb, Briefcase, Plus, FileText, Layers } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { usePermissions } from '../../hooks/usePermissions';
import { generateId, formatCompactCurrency } from '../../utils/formatters';

const ProgramDashboard: React.FC<{ programId: string }> = ({ programId }) => {
  const { program, projects, aggregateMetrics, programRisks } = useProgramData(programId);
  const { generateProgramReport, report, isGenerating, reset } = useGeminiAnalysis();
  const { dispatch } = useData();
  const theme = useTheme();
  const { canEditProject } = usePermissions();
  
  const [isReportOpen, setIsReportOpen] = React.useState(false);

  const burnRate = useMemo(() => {
    if (!aggregateMetrics.totalBudget) return 0;
    return (aggregateMetrics.totalSpent / aggregateMetrics.totalBudget) * 100;
  }, [aggregateMetrics]);

  // Handlers for direct mutation
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
      const newProjectId = generateId('P');
      dispatch({
          type: 'PROJECT_IMPORT',
          payload: [{
              id: newProjectId,
              programId: programId,
              name: 'New Initiative',
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
    if (!program || projects.length === 0) return null;
    
    const totalBudget = program.budget || aggregateMetrics.totalBudget;
    const totalSpent = aggregateMetrics.totalSpent;
    const remaining = totalBudget - totalSpent;
    
    const criticalCount = projects.filter(p => p.health === 'Critical').length;
    const warningCount = projects.filter(p => p.health === 'Warning').length;
    
    if (criticalCount > 0) {
        return `Attention: ${criticalCount} component project(s) are in critical health. Program delivery risk is elevated; immediate governance review recommended.`;
    }
    
    if (totalBudget > 0 && (totalSpent / totalBudget) > 0.95) {
        return `Financial Alert: Program has utilized ${((totalSpent / totalBudget) * 100).toFixed(1)}% of total budget authority. Funding re-alignment may be required for upcoming phases.`;
    }

    if (warningCount > 3) {
        return `Trend Warning: ${warningCount} projects reporting warning status. Aggregated schedule drift may impact strategic roadmap milestones.`;
    }

    return `Operational Stability: Program is tracking within established performance parameters. Available fiscal authority remains healthy at ${formatCompactCurrency(remaining)}.`;
  }, [program, projects, aggregateMetrics]);

  if (!program) return null;

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in`}>
        {/* AI Sidecar */}
        <SidePanel 
            isOpen={isReportOpen} 
            onClose={() => { setIsReportOpen(false); reset(); }} 
            width="max-w-3xl" 
            title={
                <span className="flex items-center gap-2 font-black uppercase text-sm tracking-widest text-slate-900">
                    <FileText size={18} className="text-nexus-600" /> 
                    Enterprise Status Report (AI)
                </span>
            } 
            footer={<Button onClick={() => setIsReportOpen(false)}>Close Briefing</Button>}
        >
            {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-nexus-200 border-t-nexus-600 rounded-full animate-spin"></div>
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-nexus-500 animate-pulse" size={24}/>
                    </div>
                    <div className="text-center">
                        <p className="text-slate-800 font-bold uppercase tracking-widest text-xs">Synthesizing Program Artifacts...</p>
                        <p className="text-slate-400 text-[10px] mt-2 font-medium uppercase tracking-widest">Integrating Budget, Risk, and Schedule Ledger</p>
                    </div>
                </div>
            ) : (
                report && (
                    <div className="animate-in fade-in duration-700 bg-white">
                        <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                            <div>
                                <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest">Report Date</h4>
                                <p className="font-bold text-slate-800">{new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest">Source Entity</h4>
                                <p className="font-bold text-slate-800">{program.name}</p>
                            </div>
                        </div>
                        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                            {report}
                        </div>
                    </div>
                )
            )}
        </SidePanel>

        {/* Toolbar */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Layers className="text-nexus-600" size={24}/>
                    Program Dashboard
                </h2>
                <p className="text-sm text-slate-500 font-medium">Integrated control center for component project performance.</p>
            </div>
             <Button 
                variant="primary" 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                icon={Sparkles}
                className="shadow-xl shadow-nexus-500/10"
            >
                {isGenerating ? "Synthesizing..." : "Generate Status Report"}
            </Button>
        </div>
        
        {/* Top KPIs */}
        <ProgramKPIs 
            program={program} 
            projectCount={projects.length} 
            spent={aggregateMetrics.totalSpent} 
            total={aggregateMetrics.totalBudget} 
            riskCount={programRisks.length} 
        />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Strategic Narrative (The Cage) */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="p-8 border-l-4 border-l-nexus-500">
                    <h3 className={`text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b pb-3`}>
                        <Target size={14} className="text-nexus-600"/> Executive Strategy
                    </h3>
                    <div className="space-y-8">
                         <NarrativeField 
                            label="Business Case & Strategic Mandate"
                            value={program.businessCase}
                            placeholderLabel="Define the overarching strategic mandate and justification for this project."
                            onSave={(val) => handleUpdate('businessCase', val)}
                            isReadOnly={!canEditProject()}
                        />
                        <NarrativeField 
                            label="Benefits Realization Strategy"
                            value={program.benefits}
                            placeholderLabel="How will value be delivered and measured? Outline key KPIs."
                            onSave={(val) => handleUpdate('benefits', val)}
                            isReadOnly={!canEditProject()}
                        />
                    </div>
                </Card>

                {/* Visuals */}
                <ProgramVisuals projects={projects} />
            </div>

            {/* Right Column: Execution & Quick Actions */}
            <div className="space-y-6">
                 <Card className="p-6">
                    <h3 className={`text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b pb-3`}>
                        <Briefcase size={14} className="text-green-600"/> Component Initiatives
                    </h3>
                    <div className="space-y-3">
                        {projects.length > 0 ? projects.map(p => (
                            <div key={p.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-nexus-300 transition-colors group cursor-pointer">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-sm text-slate-800 group-hover:text-nexus-700">{p.name}</span>
                                    <span className={`w-2 h-2 rounded-full ${p.health === 'Good' ? 'bg-green-500' : p.health === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span className="font-mono">{p.code}</span>
                                    <span>{(p.progress || 0).toFixed(0)}%</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center p-6 text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-xl">
                                No active projects.
                            </div>
                        )}
                        <button 
                            onClick={handleAddProject}
                            className="w-full py-3 mt-2 border-2 border-dashed border-nexus-200 rounded-xl text-nexus-600 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-nexus-50 transition-all"
                        >
                            <Plus size={14}/> Add Initiative
                        </button>
                    </div>
                 </Card>

                 <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
                     <div className="relative z-10">
                         <h4 className="font-bold flex items-center gap-2 mb-2"><Lightbulb size={18} className="text-yellow-400"/> Program Insight</h4>
                         <p className="text-xs text-slate-300 leading-relaxed font-medium">
                             {programInsight || "Analyzing portfolio performance and burn rates..."}
                         </p>
                     </div>
                     <Target size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12"/>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default ProgramDashboard;
