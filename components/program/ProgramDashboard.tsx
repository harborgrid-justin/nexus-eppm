import React, { useState } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useGeminiAnalysis } from '../../hooks/useGeminiAnalysis';
import { SidePanel } from '../ui/SidePanel';
import { ProgramKPIs } from './ProgramKPIs';
import { ProgramVisuals } from './ProgramVisuals';

const ProgramDashboard: React.FC<{ programId: string }> = ({ programId }) => {
  const { program, projects, aggregateMetrics, programRisks } = useProgramData(programId);
  const { generateProgramReport, report, isGenerating, reset } = useGeminiAnalysis();
  const [isReportOpen, setIsReportOpen] = useState(false);

  if (!program) return null;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
        <SidePanel isOpen={isReportOpen} onClose={() => { setIsReportOpen(false); reset(); }} width="max-w-xl" title="AI Status Report" footer={null}>
            {isGenerating ? <p>Generating...</p> : report && <div className="prose prose-sm text-slate-600">{report}</div>}
        </SidePanel>

        <div className="flex justify-end"><button onClick={() => { setIsReportOpen(true); generateProgramReport(program, projects); }} className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-slate-50">AI Status Report</button></div>
        <ProgramKPIs program={program} projectCount={projects.length} spent={aggregateMetrics.totalSpent} total={aggregateMetrics.totalBudget} riskCount={programRisks.length} />
        <ProgramVisuals projects={projects} />
    </div>
  );
};
export default ProgramDashboard;