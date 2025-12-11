
import React, { useMemo } from 'react';
import { useProjectState } from '../hooks';
import { Briefcase, GanttChartSquare, DollarSign, AlertTriangle, ShieldCheck, Loader2, AlertOctagon, Zap, Anchor } from 'lucide-react';
import StatCard from './shared/StatCard';
import { useTheme } from '../context/ThemeContext';
import { formatCompactCurrency, formatCurrency, formatDate, formatPercentage } from '../utils/formatters';
import { calculateScopeCreep, calculateUnmitigatedRiskExposure, checkTaskStagnation } from '../utils/integrationUtils';

interface ProjectIntegrationManagementProps {
  projectId: string;
}

const ProjectIntegrationManagement: React.FC<ProjectIntegrationManagementProps> = ({ projectId }) => {
  const { project, summary, financials, riskProfile, qualityProfile, changeOrders, procurement } = useProjectState(projectId);
  const theme = useTheme();

  const phase2Metrics = useMemo(() => {
      if(!project) return null;
      
      const scopeCreep = calculateScopeCreep(project.originalBudget, changeOrders);
      // Integration #7: Claims Exposure
      const claimsExposure = procurement.reduce((sum, pkg) => sum + 0, 0); // Placeholder, normally sums open claims
      // Integration #4: Contingency Exposure
      const unmitigatedRisk = calculateUnmitigatedRiskExposure(project.risks || []);
      const stagnantTasks = project.tasks.filter(t => checkTaskStagnation(t)).length;
      
      return { scopeCreep, claimsExposure, unmitigatedRisk, stagnantTasks };
  }, [project, changeOrders, procurement]);

  if (!project || !summary || !financials || !riskProfile || !qualityProfile || !phase2Metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={24} className="animate-spin text-nexus-500" />
        <span className="ml-2 text-slate-500">Loading project overview...</span>
      </div>
    );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} animate-in fade-in duration-300`}>
      <div className={theme.layout.header + " mb-6"}>
        <div>
          <h1 className={theme.typography.h1}>
            <Briefcase className="text-nexus-600" /> Integration Management
          </h1>
          <p className={theme.typography.small}>A consolidated view of all project knowledge areas.</p>
        </div>
      </div>
      
      {/* Primary Stats */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap} mb-6`}>
        <StatCard title="Overall Progress" value={formatPercentage(summary.overallProgress)} subtext={`${summary.completedTasks} / ${summary.totalTasks} tasks complete`} icon={GanttChartSquare} />
        {/* Updated to show Committed Cost impact */}
        <StatCard title="Budget Variance" value={formatCompactCurrency(financials.variance)} subtext={`Includes ${formatCompactCurrency(financials.totalCommitted)} committed`} icon={DollarSign} trend={financials.variance >= 0 ? 'up' : 'down'} />
        <StatCard title="Open Risks" value={riskProfile.openRisks} subtext={`${riskProfile.highImpactRisks} high-impact`} icon={AlertTriangle} trend={riskProfile.openRisks > 5 ? 'down' : undefined} />
        <StatCard title="Quality Score" value={formatPercentage(qualityProfile.passRate)} subtext={`${qualityProfile.failedReports} failed inspections`} icon={ShieldCheck} trend={qualityProfile.passRate >= 95 ? 'up' : undefined} />
      </div>

      {/* Phase 2 Metrics Row (New Integrations) */}
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Advanced Diagnostics</h3>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap} mb-8`}>
         <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-center justify-between">
            <div>
               <p className="text-xs font-bold text-orange-700 uppercase">Scope Creep (Rate)</p>
               <p className="text-xl font-bold text-orange-900">{phase2Metrics.scopeCreep.toFixed(1)}%</p>
            </div>
            <AlertOctagon className="text-orange-400" size={24} />
         </div>
         <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center justify-between">
            <div>
               <p className="text-xs font-bold text-red-700 uppercase">Unmitigated Risk (EMV)</p>
               <p className="text-xl font-bold text-red-900">{formatCompactCurrency(riskProfile.exposure)}</p>
            </div>
            <ShieldCheck className="text-red-400" size={24} />
         </div>
         <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
            <div>
               <p className="text-xs font-bold text-blue-700 uppercase">Funding Solvency</p>
               <p className="text-xl font-bold text-blue-900">{financials.solvency}</p>
            </div>
            <Anchor className="text-blue-400" size={24} />
         </div>
         <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl flex items-center justify-between">
            <div>
               <p className="text-xs font-bold text-purple-700 uppercase">SPI (Schedule Perf)</p>
               <p className="text-xl font-bold text-purple-900">{financials.evm.spi.toFixed(2)}</p>
            </div>
            <Zap className="text-purple-400" size={24} />
         </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
        {/* Key Information Panel */}
        <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border}`}>
           <h3 className={`${theme.typography.h3} mb-4`}>Project Charter</h3>
           <dl className="space-y-3 text-sm">
             <div className="flex"><dt className="w-32 font-medium text-slate-500">Project Manager</dt><dd className="text-slate-800 font-semibold">{project.manager}</dd></div>
             <div className="flex"><dt className="w-32 font-medium text-slate-500">Start Date</dt><dd className="text-slate-800">{formatDate(project.startDate)}</dd></div>
             <div className="flex"><dt className="w-32 font-medium text-slate-500">End Date</dt><dd className="text-slate-800">{formatDate(project.endDate)}</dd></div>
             <div className="flex"><dt className="w-32 font-medium text-slate-500">Original Budget</dt><dd className="text-slate-800">{formatCurrency(financials.totalPlanned)}</dd></div>
             <div className="flex"><dt className="w-32 font-medium text-slate-500">Revised Budget</dt><dd className="text-slate-800 font-bold">{formatCurrency(financials.revisedBudget)}</dd></div>
           </dl>
        </div>
        
        {/* Change Management Panel */}
        <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border}`}>
           <h3 className={`${theme.typography.h3} mb-4`}>Change Control Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                 <span className="font-medium text-green-800">Approved Changes</span>
                 <span className="font-bold text-green-800">{formatCurrency(financials.approvedCOAmount)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                 <span className="font-medium text-yellow-800">Pending Changes</span>
                 <span className="font-bold text-yellow-800">{formatCurrency(financials.pendingCOAmount)}</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectIntegrationManagement;
