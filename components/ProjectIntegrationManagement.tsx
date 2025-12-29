
import React, { useMemo, useState } from 'react';
import { useProjectState } from '../hooks';
import { Briefcase, GanttChartSquare, DollarSign, AlertTriangle, ShieldCheck, Loader2, AlertOctagon, Zap, Anchor, BookOpen, FileText, ClipboardList, Lock } from 'lucide-react';
import StatCard from './shared/StatCard';
import { useTheme } from '../context/ThemeContext';
import { formatCompactCurrency, formatCurrency, formatDate, formatPercentage } from '../utils/formatters';
import { calculateScopeCreep, calculateUnmitigatedRiskExposure, checkTaskStagnation } from '../utils/integrationUtils';
import { usePermissions } from '../hooks/usePermissions';

interface ProjectIntegrationManagementProps {
  projectId: string;
}

const ProjectIntegrationManagement: React.FC<ProjectIntegrationManagementProps> = ({ projectId }) => {
  const { project, summary, financials, riskProfile, qualityProfile, changeOrders, procurement } = useProjectState(projectId);
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { canEditProject } = usePermissions();

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

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-300">
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
             <div className="flex justify-between"><dt className="font-medium text-slate-500">Project Manager</dt><dd className="text-slate-800 font-semibold text-right">{project.manager}</dd></div>
             <div className="flex justify-between"><dt className="font-medium text-slate-500">Start Date</dt><dd className="text-slate-800 text-right">{formatDate(project.startDate)}</dd></div>
             <div className="flex justify-between"><dt className="font-medium text-slate-500">End Date</dt><dd className="text-slate-800 text-right">{formatDate(project.endDate)}</dd></div>
             <div className="flex justify-between"><dt className="font-medium text-slate-500">Original Budget</dt><dd className="text-slate-800 text-right">{formatCurrency(financials.totalPlanned)}</dd></div>
             <div className="flex justify-between"><dt className="font-medium text-slate-500">Revised Budget</dt><dd className="text-slate-800 font-bold text-right">{formatCurrency(financials.revisedBudget)}</dd></div>
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

  const renderCharter = () => (
      <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-lg mb-4 text-slate-800">Project Charter Approval Workflow</h3>
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
                  <div className="flex gap-8">
                      <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">Current Stage</p>
                          <p className="font-semibold text-nexus-600">Sponsor Review</p>
                      </div>
                      <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">Version</p>
                          <p className="font-semibold">v1.2</p>
                      </div>
                      <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">Last Updated</p>
                          <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                      </div>
                  </div>
                  {canEditProject() ? (
                    <button className="px-4 py-2 bg-nexus-600 text-white rounded-md text-sm font-medium hover:bg-nexus-700">Approve Charter</button>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-slate-400 font-medium bg-white px-3 py-2 border rounded">
                        <Lock size={12} /> Approval Locked
                    </div>
                  )}
              </div>
              <div className="space-y-4">
                  <div>
                      <h4 className="font-medium text-slate-700 mb-2">Business Case</h4>
                      <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">{project.businessCase}</p>
                  </div>
                  <div>
                      <h4 className="font-medium text-slate-700 mb-2">Project Description</h4>
                      <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">Execution of phase 2 deliverables including scope validation and handover.</p>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderLogs = () => (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {/* Assumption Log */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2"><BookOpen size={16} className="text-blue-500"/> Assumption Log</h3>
                  {canEditProject() && <button className="text-xs font-bold text-blue-600 hover:underline">Add New</button>}
              </div>
              <div className="flex-1 overflow-auto">
                  <table className="min-w-full divide-y divide-slate-100">
                      <thead className="bg-white">
                          <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase w-20">Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                          {project.assumptions?.map(asm => (
                              <tr key={asm.id}>
                                  <td className="px-4 py-3 text-sm text-slate-700">
                                      {asm.description}
                                      <div className="text-xs text-slate-400 mt-1">Owner: {asm.owner}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                      <span className={`text-xs px-2 py-1 rounded-full ${asm.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{asm.status}</span>
                                  </td>
                              </tr>
                          ))}
                          {!project.assumptions?.length && <tr><td colSpan={2} className="p-4 text-center text-sm text-slate-400">No assumptions logged.</td></tr>}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Lessons Learned */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2"><ClipboardList size={16} className="text-green-500"/> Lessons Learned Register</h3>
                  {canEditProject() && <button className="text-xs font-bold text-green-600 hover:underline">Add Lesson</button>}
              </div>
              <div className="flex-1 overflow-auto">
                  <table className="min-w-full divide-y divide-slate-100">
                      <thead className="bg-white">
                          <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Observation / Recommendation</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                          {project.lessonsLearned?.map(ll => (
                              <tr key={ll.id}>
                                  <td className="px-4 py-3 text-sm font-medium text-slate-700">{ll.category}</td>
                                  <td className="px-4 py-3 text-sm text-slate-600">
                                      <div className="font-medium text-slate-800">{ll.situation}</div>
                                      <div className="mt-1 text-slate-500">{ll.recommendation}</div>
                                  </td>
                              </tr>
                          ))}
                           {!project.lessonsLearned?.length && <tr><td colSpan={2} className="p-4 text-center text-sm text-slate-400">No lessons learned recorded.</td></tr>}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  );

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
      <div className={theme.layout.header + " mb-6"}>
        <div>
          <h1 className={theme.typography.h1}>
            <Briefcase className="text-nexus-600" /> Integration Management
          </h1>
          <p className={theme.typography.small}>Coordinate all aspects of the project from initiation to closure.</p>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-lg p-1">
            {['dashboard', 'charter', 'logs'].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize ${activeTab === tab ? 'bg-nexus-100 text-nexus-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {tab}
                </button>
            ))}
        </div>
      </div>
      
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'charter' && renderCharter()}
      {activeTab === 'logs' && renderLogs()}
    </div>
  );
};

export default ProjectIntegrationManagement;