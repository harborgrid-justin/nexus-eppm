import React from 'react';
import { useProjectState } from '../hooks';
import { Briefcase, GanttChartSquare, DollarSign, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import StatCard from './shared/StatCard';

interface ProjectIntegrationManagementProps {
  projectId: string;
}

const ProjectIntegrationManagement: React.FC<ProjectIntegrationManagementProps> = ({ projectId }) => {
  const { project, summary, financials, riskProfile, qualityProfile } = useProjectState(projectId);

  if (!project || !summary || !financials || !riskProfile || !qualityProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={24} className="animate-spin text-nexus-500" />
        <span className="ml-2 text-slate-500">Loading project overview...</span>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="text-nexus-600" /> Integration Management
          </h1>
          <p className="text-slate-500">A consolidated view of all project knowledge areas.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Overall Progress" value={`${summary.overallProgress}%`} subtext={`${summary.completedTasks} / ${summary.totalTasks} tasks complete`} icon={GanttChartSquare} />
        <StatCard title="Budget Variance" value={`$${(financials.variance / 1000).toFixed(0)}k`} subtext={`${financials.budgetUtilization.toFixed(0)}% of budget spent`} icon={DollarSign} trend={financials.variance >= 0 ? 'up' : 'down'} />
        <StatCard title="Open Risks" value={riskProfile.openRisks} subtext={`${riskProfile.highImpactRisks} high-impact`} icon={AlertTriangle} trend={riskProfile.openRisks > 5 ? 'down' : undefined} />
        <StatCard title="Quality Score" value={`${qualityProfile.passRate.toFixed(0)}%`} subtext={`${qualityProfile.failedReports} failed inspections`} icon={ShieldCheck} trend={qualityProfile.passRate >= 95 ? 'up' : undefined} />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Key Information Panel */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-4">Project Charter</h3>
           <dl className="space-y-3 text-sm">
             <div className="flex"><dt className="w-32 font-medium text-slate-500">Project Manager</dt><dd className="text-slate-800 font-semibold">{project.manager}</dd></div>
             <div className="flex"><dt className="w-32 font-medium text-slate-500">Start Date</dt><dd className="text-slate-800">{project.startDate}</dd></div>
             <div className="flex"><dt className="w-32 font-medium text-slate-500">End Date</dt><dd className="text-slate-800">{project.endDate}</dd></div>
             <div className="flex"><dt className="w-32 font-medium text-slate-500">Original Budget</dt><dd className="text-slate-800">${financials.totalPlanned.toLocaleString()}</dd></div>
             <div className="flex"><dt className="w-32 font-medium text-slate-500">Revised Budget</dt><dd className="text-slate-800 font-bold">${financials.revisedBudget.toLocaleString()}</dd></div>
           </dl>
        </div>
        
        {/* Change Management Panel */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-4">Change Control Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                 <span className="font-medium text-green-800">Approved Changes</span>
                 <span className="font-bold text-green-800">${financials.approvedCOAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                 <span className="font-medium text-yellow-800">Pending Changes</span>
                 <span className="font-bold text-yellow-800">${financials.pendingCOAmount.toLocaleString()}</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectIntegrationManagement;