
import React, { useMemo, useState } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { calculateRiskExposure } from '../../utils/integrationUtils';
import { Button } from '../../ui/Button';
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
            if (log.source === 'Contingency') acc.contingency += Math.abs(log.amount);
            if (log.source === 'Management Reserve') acc.management += Math.abs(log.amount);
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

  if (!project || !analysisData) return <div>Loading...</div>;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
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
