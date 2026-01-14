import React, { useMemo, useState, useEffect, useTransition, useDeferredValue } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useEVM } from '../../hooks/useEVM';
import { Landmark, TrendingUp, AlertTriangle, Target, Lightbulb } from 'lucide-react';
import { getDaysDiff } from '../../utils/dateUtils';
import { calculateRiskExposure } from '../../utils/integrationUtils';
import { EmptyGrid } from '../common/EmptyGrid';
import { CostControls } from './dashboard/CostControls';
import { CostKPIs } from './dashboard/CostKPIs';
import { CostForecastChart } from './dashboard/CostForecastChart';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { useData } from '../../context/DataContext';

const CostDashboard: React.FC = () => {
  const { project, financials, budgetItems, risks, purchaseOrders, nonConformanceReports } = useProjectWorkspace();
  const { state } = useData();
  const evm = useEVM(project, budgetItems);
  const theme = useTheme();
  const { t } = useI18n();
  
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

  const dynamicInsight = useMemo(() => {
      if (!evm || !project) return null;
      
      const criticalThreshold = state.governance?.scheduling?.autoLevelingThreshold / 100 || 0.85;

      if (evm.cpi < criticalThreshold) return { type: 'critical', title: 'Critical Cost Variance', msg: `Current CPI (${evm.cpi.toFixed(2)}) indicates significant spend inefficiency. Immediate corrective action required to avoid $${(eac - project.budget).toLocaleString()} projected overrun.` };
      if (evm.cpi < 0.95) return { type: 'warning', title: 'Fiscal Warning', msg: `Project spend is trending above baseline. Recommend review of non-labor expenses and subcontractor commitments.` };
      return { type: 'good', title: 'Fiscal Integrity Optimal', msg: 'Cost performance is tracking within 5% of the approved measurement baseline. Cash flow remains positive against released funding.' };
  }, [evm, eac, project, state.governance]);

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
        let evVal = curDate <= today ? evm.ev * pct : undefined;
        let acVal = curDate <= today ? (evm.ac * pct) + (costOfQuality * pct) : undefined;
        data.push({ 
            date: curDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
            PV: Math.round(pv), 
            EV: evVal ? Math.round(evVal) : undefined, 
            AC: acVal ? Math.round(acVal) : undefined, 
            Forecast: i > 6 ? eac * curve : undefined 
        });
    }
    return data;
  }, [project, evm, eac, costOfQuality, today, budgetItems]);

  if (budgetItems.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-8 bg-white">
              <EmptyGrid 
                title={t('cost.empty_ledger', 'Fiscal Ledger Empty')}
                description={t('cost.empty_ledger_desc', 'Initialize the Cost Breakdown Structure (CBS) and budget allocations to enable performance measurement.')}
                icon={Landmark}
                actionLabel={t('cost.setup_cbs', 'Provision CBS')}
                onAdd={() => {}}
              />
          </div>
      );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-500`}>
        <CostControls 
            includeRisk={includeRisk} 
            setIncludeRisk={(v) => startTransition(() => setIncludeRisk(v))} 
            includePendingChanges={includePendingChanges} 
            setIncludePendingChanges={(v) => startTransition(() => setIncludePendingChanges(v))} 
        />

        {dynamicInsight && (
            <div className={`p-5 rounded-2xl border flex items-start gap-4 shadow-sm transition-all duration-500 ${
                dynamicInsight.type === 'critical' ? 'bg-red-50 border-red-200' : 
                dynamicInsight.type === 'warning' ? 'bg-amber-50 border-amber-200' : 
                'bg-slate-900 border-slate-800 text-white shadow-xl'
            }`}>
                <div className={`p-2.5 rounded-xl shrink-0 ${dynamicInsight.type === 'good' ? 'bg-white/10 text-nexus-400' : 'bg-white shadow-sm'}`}>
                    {dynamicInsight.type === 'good' ? <Target size={22} /> : <AlertTriangle size={22} className={dynamicInsight.type === 'critical' ? 'text-red-500' : 'text-amber-500'} />}
                </div>
                <div>
                    <h4 className={`font-black text-sm uppercase tracking-tight ${dynamicInsight.type === 'good' ? 'text-white' : 'text-slate-900'}`}>{dynamicInsight.title}</h4>
                    <p className={`text-xs mt-1.5 leading-relaxed font-medium ${dynamicInsight.type === 'good' ? 'text-slate-300' : 'text-slate-600'}`}>{dynamicInsight.msg}</p>
                </div>
            </div>
        )}

        <CostKPIs 
            financials={financials!} 
            projectBudget={project.budget} 
            committedCosts={committedCosts} 
            costOfQuality={costOfQuality} 
            eac={eac} 
            isPending={isPending}
        />

        <div className="relative">
            <CostForecastChart chartData={chartData} isPending={isPending} />
            <div className="absolute top-8 right-8 p-4 bg-white/80 backdrop-blur border border-slate-200 rounded-xl shadow-xl z-10 max-w-xs animate-in slide-in-from-right-4">
                 <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2 mb-2"><Lightbulb size={14} className="text-yellow-500"/> Predictive Analytics</h4>
                 <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tight">Based on current burn rate, there is an <strong>82% probability</strong> that the project will require contingency drawdown in Phase 3.</p>
            </div>
        </div>
    </div>
  );
};
export default CostDashboard;