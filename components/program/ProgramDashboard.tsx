
import React, { useMemo } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useGeminiAnalysis } from '../../hooks/useGeminiAnalysis';
import { useData } from '../../context/DataContext';
import { SidePanel } from '../ui/SidePanel';
import { ProgramKPIs } from './ProgramKPIs';
import { ProgramVisuals } from './ProgramVisuals';
import { NarrativeField } from '../common/NarrativeField';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, Loader2, Target, Lightbulb, Briefcase, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { usePermissions } from '../../hooks/usePermissions';
import { generateId } from '../../utils/formatters';

const ProgramDashboard: React.FC<{ programId: string }> = ({ programId }) => {
  const { program, projects, aggregateMetrics, programRisks } = useProgramData(programId);
  const { generateProgramReport, report, isGenerating, reset } = useGeminiAnalysis();
  const { dispatch } = useData();
  const theme = useTheme();
  const { canEditProject } = usePermissions(); // Assuming generic edit permission
  
  const [isReportOpen, setIsReportOpen] = React.useState(false);

  // Handlers for direct mutation
  const handleUpdate = (field: string, value: string) => {
    if (!program) return;
    dispatch({
        type: 'UPDATE_PROGRAM',
        payload: { ...program, [field]: value }
    });
  };

  const handleAddProject = () => {
      const newProjectId = generateId('P');
      // In a real app, this would open a modal or redirect.
      // For the "Cage" feel, we'll auto-provision a skeleton to allow immediate work.
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

  if (!program) return null;

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in`}>
        {/* AI Sidecar */}
        <SidePanel isOpen={isReportOpen} onClose={() => { setIsReportOpen(false); reset(); }} width="max-w-xl" title={<span className="flex items-center gap-2"><Sparkles size={18} className="text-nexus-500" /> Executive AI Brief</span>} footer={<Button onClick={() => setIsReportOpen(false)}>Close</Button>}>
            {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-nexus-500 mb-4" size={40} />
                    <p className="text-slate-500 font-medium">Synthesizing Program Status...</p>
                </div>
            ) : (
                report && <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">{report}</div>
            )}
        </SidePanel>

        {/* Toolbar */}
        <div className="flex justify-end">
             <Button 
                variant="outline" 
                onClick={() => { setIsReportOpen(true); generateProgramReport(program, projects); }}
                icon={Sparkles}
            >
                Generate Status Report
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
                            placeholderLabel="Define the overarching strategic mandate and justification for this program."
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

                 <div className="bg-indigo-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
                     <div className="relative z-10">
                         <h4 className="font-bold flex items-center gap-2 mb-2"><Lightbulb size={18} className="text-yellow-400"/> Program Insight</h4>
                         <p className="text-xs text-indigo-200 leading-relaxed">
                             Based on current burn rates, this program is projected to complete <strong>14 days ahead of schedule</strong>, but requires <strong>$1.2M</strong> additional funding for Q4.
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
