
import React, { useMemo, useState } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { ShieldAlert, RefreshCw, Loader2 } from 'lucide-react';
import { calculateRiskExposure } from '../../utils/integrationUtils';
import { Button } from '../ui/Button';
import { ReserveKPIs } from './reserves/ReserveKPIs';
import { CompositionChart } from './reserves/CompositionChart';
import { BurndownChart } from './reserves/BurndownChart';
import { UpdateReservePanel } from './reserves/UpdateReservePanel';
import { GapAnalysis } from './reserves/GapAnalysis';

const ReserveAnalysis: React.FC = () => {
  const { project, risks, budgetItems } = useProjectWorkspace();
  const [isUpdatePanelOpen, setIsUpdatePanelOpen] = useState(false);

  const analysisData = useMemo(() => {
    if (!project) return null;
    const currentRiskExposure = calculateRiskExposure(risks);
    const baseCost = budgetItems.reduce((sum, b) => sum + b.planned, 0);
    const contingencyReserve = project.reserves?.contingencyReserve || 0;
    const managementReserve = project.reserves?.managementReserve || 0;

    const drawdowns = (project.budgetLog || []).reduce((acc, log) => {
        if (log.status === 'Approved') {
            // Simple heuristic mapping
            if (log.source === 'Contingency' || log.description.toLowerCase().includes('contingency')) acc.contingency += Math.abs(log.amount);
            if (log.source === 'Management Reserve' || log.description.toLowerCase().includes('management')) acc.management += Math.abs(log.amount);
        }
        return acc;
    }, { contingency: 0, management: 0 });

    return {
        currentRiskExposure, baseCost, contingencyReserve, managementReserve,
        totalReserves: contingencyReserve + managementReserve, drawdowns,
        remainingContingency: contingencyReserve - drawdowns.contingency,
        remainingManagement: managementReserve - drawdowns.management,
        coverageRatio: currentRiskExposure > 0 ? ((contingencyReserve - drawdowns.contingency) / currentRiskExposure) : 2.0
    };
  }, [project, risks, budgetItems]);

  // FIX: Replaced simple "Loading..." text with professional grey-fill and pulse pattern for production readiness
  if (!project || !analysisData) {
      return (
          <div className="h-full flex flex-col items-center justify-center nexus-empty-pattern">
              <Loader2 className="animate-spin text-slate-300 mb-4" size={40}/>
              <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synthesizing Reserve Data...</span>
          </div>
      );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 animate-nexus-in">
        <ReserveKPIs data={analysisData} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <CompositionChart data={analysisData} />
            </div>
            <div className="space-y-6">
                <GapAnalysis data={analysisData} onAdjust={() => setIsUpdatePanelOpen(true)} />
            </div>
        </div>
        <BurndownChart data={analysisData} />
        <UpdateReservePanel 
            isOpen={isUpdatePanelOpen}
            onClose={() => setIsUpdatePanelOpen(false)}
            reserves={project.reserves || { contingencyReserve: 0, managementReserve: 0 }}
            onSave={() => setIsUpdatePanelOpen(false)}
        />
    </div>
  );
};

export default ReserveAnalysis;
