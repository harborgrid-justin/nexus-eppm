import React from 'react';
import { useProjectState } from '../hooks';
import { Briefcase, GanttChartSquare, DollarSign, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import StatCard from './shared/StatCard';
import { useTheme } from '../context/ThemeContext';
import { formatCompactCurrency, formatCurrency, formatDate, formatPercentage } from '../utils/formatters';

interface ProjectIntegrationManagementProps {
  projectId: string;
}

const ProjectIntegrationManagement: React.FC<ProjectIntegrationManagementProps> = ({ projectId }) => {
  const { project, summary, financials, riskProfile, qualityProfile } = useProjectState(projectId);
  const theme = useTheme();

  if (!project || !summary || !financials || !riskProfile || !qualityProfile) {
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
      
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
        <StatCard title="Overall Progress" value={formatPercentage(summary.overallProgress)} subtext={`${summary.completedTasks} / ${summary.totalTasks} tasks complete`} icon={GanttChartSquare} />
        <StatCard title="Budget Variance" value={formatCompactCurrency(financials.variance)} subtext={`${formatPercentage(financials.budgetUtilization, 1)} of budget spent`} icon={DollarSign} trend={financials.variance >= 0 ? 'up' : 'down'} />
        <StatCard title="Open Risks" value={riskProfile.openRisks} subtext={`${riskProfile.highImpactRisks} high-impact`} icon={AlertTriangle} trend={riskProfile.openRisks > 5 ? 'down' : undefined} />
        <StatCard title="Quality Score" value={formatPercentage(qualityProfile.passRate)} subtext={`${qualityProfile.failedReports} failed inspections`} icon={ShieldCheck} trend={qualityProfile.passRate >= 95 ? 'up' : undefined} />
      </div>

      <div className={`mt-8 grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
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
