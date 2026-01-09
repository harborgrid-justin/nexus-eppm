
import React, { useMemo, useState, useEffect, useTransition, useDeferredValue } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useEVM } from '../../hooks/useEVM';
import { Landmark } from 'lucide-react';
import { getDaysDiff } from '../../utils/dateUtils';
import { calculateRiskExposure } from '../../utils/integrationUtils';
import { EmptyGrid } from '../common/EmptyGrid';
import { CostControls } from './dashboard/CostControls';
import { CostKPIs } from './dashboard/CostKPIs';
import { CostForecastChart } from './dashboard/CostForecastChart';

const CostDashboard: React.FC = () => {
  const { project, financials, budgetItems, risks, purchaseOrders, nonConformanceReports } = useProjectWorkspace();
  const evm = useEVM(project, budgetItems);
  
  const [includeRisk, setIncludeRisk] = useState(true);
  const [includePendingChanges, setIncludePendingChanges] = useState(false);
  const [isPending, startTransition] = useTransition();

  const deferredIncludeRisk = useDeferredValue(includeRisk);
  const deferredIncludePending = useDeferredValue(includePendingChanges);

  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => { setToday(new Date()); }, []);

  const riskExposure = useMemo(() => calculateRiskExposure(risks), [risks]);
  const costOfQuality = useMemo(() => nonConformanceReports.reduce((sum, ncr) => sum + (ncr.severity === 'Critical' ? 5000 : 1000), 0), [nonConformanceReports]);
  const committedCosts = useMemo(() => purchaseOrders.filter(po => po.status === 'Issued').reduce((sum, po) => sum + po.amount, 0), [purchaseOrders]);

  const eac = useMemo(() => {
      if (!project || !financials || !evm) return 0;
      let projectedCost = evm.eac;
      if (deferredIncludeRisk) projectedCost += riskExposure;
      if (deferredIncludePending) projectedCost += financials.pendingCOAmount;
      return projectedCost;
  }, [project, financials, evm, deferredIncludeRisk, deferredIncludePending, riskExposure]);

  const chartData = useMemo(() => {
    if (!project || !evm || !today || budgetItems.length === 0) return [];
    const startDate = new Date(project.startDate);
    const totalDays = getDaysDiff(project.startDate, project.endDate);
    const data = [];
    for (let i = 0; i <= 12; i++) {
        const curDate = new Date(startDate);
        curDate.setDate(curDate.getDate() + (i * Math.floor(totalDays / 12)));
        const pct = i / 12;
        const curve = (1 - Math.cos(pct * Math.PI)) / 2;
        const pv = (project.originalBudget * curve) * Math.pow(1.03, (i * 30 / 365));
        let ev = curDate <= today ? evm.ev * pct : undefined;
        let ac = curDate <= today ? (evm.ac * pct) + (costOfQuality * pct) : undefined;
        data.push({ 
            date: curDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
            PV: Math.round(pv), 
            EV: ev ? Math.round(ev) : undefined, 
            AC: ac ? Math.round(ac) : undefined, 
            Forecast: i > 6 ? eac * curve : undefined 
        });
    }
    return data;
  }, [project, evm, eac, costOfQuality, today, budgetItems]);

  if (budgetItems.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-8 bg-slate-50">
              <EmptyGrid 
                title="Fiscal Ledger Empty"
                description="Initialize the Cost Breakdown Structure (CBS) and budget allocations to enable performance measurement."
                icon={Landmark}
                actionLabel="Setup CBS"
                onAdd={() => {}}
              />
          </div>
      );
  }

  if (!financials || !today) return <div className="h-full w-full flex items-center justify-center animate-pulse text-slate-300 font-black tracking-widest uppercase">Initializing Fiscal Ledger...</div>;

  return (
    <div className="h-full overflow-y-auto p-8 space-y-8 scrollbar-thin animate-in fade-in duration-500">
        <CostControls 
            includeRisk={includeRisk} 
            setIncludeRisk={(v) => startTransition(() => setIncludeRisk(v))} 
            includePendingChanges={includePendingChanges} 
            setIncludePendingChanges={(v) => startTransition(() => setIncludePendingChanges(v))} 
        />

        <CostKPIs 
            financials={financials} 
            projectBudget={project.budget} 
            committedCosts={committedCosts} 
            costOfQuality={costOfQuality} 
            eac={eac} 
            isPending={isPending}
        />

        <CostForecastChart chartData={chartData} isPending={isPending} />
    </div>
  );
};
export default CostDashboard;
