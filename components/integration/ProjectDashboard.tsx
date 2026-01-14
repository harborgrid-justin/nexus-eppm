import React, { useMemo, useState } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { Briefcase, GanttChartSquare, DollarSign, AlertTriangle, ShieldCheck, Loader2, AlertOctagon, Zap, Anchor, BookOpen, FileText, Activity as ActivityIcon, Lightbulb, CheckCircle, Clock } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency, formatCurrency, formatDate, formatPercentage } from '../../utils/formatters';
import { calculateScopeCreep } from '../../utils/integrations/cost';
import { checkTaskStagnation } from '../../utils/integrations/schedule';
import { usePermissions } from '../../hooks/usePermissions';
import { useData } from '../../context/DataContext';

// Sub-components
import ProjectCharter from './ProjectCharter';
import ChangeLog from './ChangeLog';

const ProjectDashboard: React.FC = () => {
  const { project, summary, financials, riskProfile, qualityProfile, changeOrders } = useProjectWorkspace();
  const { state } = useData();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { canEditProject } = usePermissions();

  const pmName = useMemo(() => {
      if(!project) return 'Unassigned';
      return state.resources.find(r => r.id === project.managerId)?.name || 'Unknown PM';
  }, [project, state.resources]);

  const phase2Metrics = useMemo(() => {
      if(!project) return null;
      const scopeCreepValue = calculateScopeCreep(project.originalBudget, changeOrders);
      const stagnantTasks = project.tasks.filter(t => checkTaskStagnation(t)).length;
      return { scopeCreep: scopeCreepValue, stagnantTasks };
  }, [project, changeOrders]);

  const boardMeetingInfo = useMemo(() => {
    const boardEvent = state.governanceEvents.find(e => e.type === 'Steering Committee');
    return boardEvent ? `${boardEvent.name} is scheduled for ${boardEvent.nextDate}.` : 'No upcoming board meetings scheduled.';
  }, [state.governanceEvents]);

  const exposureInfo = useMemo(() => {
      if (!financials || !project) return '';
      const threshold = project.originalBudget * 0.15;
      const isWithin = financials.pendingCOAmount <= threshold;
      return `Current unapproved exposure (${formatCompactCurrency(financials.pendingCOAmount)}) is ${isWithin ? 'within' : 'exceeding'} the 15% contingency threshold.`;
  }, [financials, project]);

  if (!project || !summary || !financials || !riskProfile || !qualityProfile || !phase2Metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={24} className="animate-spin text-nexus-600" />
        <span className="ml-3 text-slate-500 font-medium">Initializing project context...</span>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className={`animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col ${theme.layout.gridGap}`}>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
        <StatCard title="Overall Progress" value={formatPercentage(summary.overallProgress)} subtext={`${summary.completedTasks} / ${summary.totalTasks} tasks`} icon={GanttChartSquare} />
        <StatCard title="Budget Variance" value={formatCompactCurrency(financials.variance)} subtext={`Current working delta`} icon={DollarSign} trend={financials.variance >= 0 ? 'up' : 'down'} />
        <StatCard title="Open Risks" value={riskProfile.openRisks} subtext={`${riskProfile.highImpactRisks} critical path threats`} icon={AlertTriangle} trend={riskProfile.openRisks > 5 ? 'down' : undefined} />
        <StatCard title="Quality Pass Rate" value={formatPercentage(qualityProfile.passRate)} subtext="Overall inspection yield" icon={ShieldCheck} trend={qualityProfile.passRate >= 95 ? 'up' : undefined} />
      </div>

      <div className="mb-2">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <ActivityIcon size={12}/> Global Health Indicators
        </h3>
      </div>
      
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
         <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between group hover:border-orange-300 transition-all">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Scope Creep Rate</p>
               <p className="text-xl font-black text-slate-900 mt-0.5">{phase2Metrics.scopeCreep.toFixed(1)}%</p>
            </div>
            <div className="p-2 bg-orange-50 rounded-xl text-orange-500 group-hover:scale-110 transition-transform"><AlertOctagon size={22} /></div>
         </div>
         <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between group hover:border-red-300 transition-all">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Risk EMV</p>
               <p className="text-xl font-black text-slate-900 mt-0.5">{formatCompactCurrency(riskProfile.exposure)}</p>
            </div>
            <div className="p-2 bg-red-50 rounded-xl text-red-500 group-hover:scale-110 transition-transform"><ShieldCheck size={22} /></div>
         </div>
         <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between group hover:border-blue-300 transition-all">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Funding Health</p>
               <p className="text-xl font-black text-slate-900 mt-0.5">{financials.solvency}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-xl text-blue-500 group-hover:scale-110 transition-transform"><Anchor size={22} /></div>
         </div>
         <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between group hover:border-purple-300 transition-all">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Schedule (SPI)</p>
               <p className="text-xl font-black text-slate-900 mt-0.5">{financials.evm.spi.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-xl text-purple-500 group-hover:scale-110 transition-transform"><Zap size={22} /></div>
         </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
           <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h3 className="font-black text-slate-800 flex items-center gap-2 text-xs uppercase tracking-widest"><BookOpen size={18} className="text-nexus-600"/> High-Level Charter</h3>
             <button onClick={() => setActiveTab('charter')} className="text-[10px] font-black text-nexus-600 uppercase tracking-widest hover:underline">View Policy</button>
           </div>
           <div className="p-6">
               <dl className="space-y-4">
                 <div className="flex justify-between border-b border-slate-50 pb-3"><dt className="text-xs font-black text-slate-400 uppercase">Assigned Manager</dt><dd className="text-sm font-black text-slate-900">{pmName}</dd></div>
                 <div className="flex justify-between border-b border-slate-50 pb-3"><dt className="text-xs font-black text-slate-400 uppercase">Commencement</dt><dd className="text-sm font-bold text-slate-700">{formatDate(project.startDate)}</dd></div>
                 <div className="flex justify-between border-b border-slate-50 pb-3"><dt className="text-xs font-black text-slate-400 uppercase">Target Completion</dt><dd className="text-sm font-bold text-slate-700">{formatDate(project.endDate)}</dd></div>
                 <div className="flex justify-between border-b border-slate-50 pb-3"><dt className="text-xs font-black text-slate-400 uppercase">Baseline Budget</dt><dd className="text-sm font-mono font-black text-slate-900">{formatCurrency(financials.totalPlanned)}</dd></div>
                 <div className="flex justify-between pt-1"><dt className="text-xs font-black text-slate-400 uppercase">Working Budget</dt><dd className="text-base font-mono font-black text-nexus-700">{formatCurrency(financials.revisedBudget)}</dd></div>
               </dl>
           </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
           <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h3 className="font-black text-slate-800 flex items-center gap-2 text-xs uppercase tracking-widest"><FileText size={18} className="text-nexus-600"/> Change Summary</h3>
             <button onClick={() => setActiveTab('logs')} className="text-[10px] font-black text-nexus-600 uppercase tracking-widest hover:underline">Full Log</button>
           </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm"><CheckCircle size={18}/></div>
                    <span className="font-black text-emerald-900 text-sm uppercase tracking-tight">Approved Changes</span>
                 </div>
                 <span className="font-mono font-black text-emerald-700">{formatCurrency(financials.approvedCOAmount)}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100 shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-amber-600 shadow-sm"><Clock size={18}/></div>
                    <span className="font-black text-amber-900 text-sm uppercase tracking-tight">Pending Board Approval</span>
                 </div>
                 <span className="font-mono font-black text-amber-700">{formatCurrency(financials.pendingCOAmount)}</span>
              </div>
              <div className="mt-2 text-xs text-slate-500 leading-relaxed italic text-center px-4 font-medium uppercase tracking-tight">
                  "{boardMeetingInfo} {exposureInfo}"
              </div>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} bg-slate-50/50 scrollbar-thin`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
            <Briefcase className="inline-block mr-3 text-nexus-600 mb-1" size={28} />
            {project.name}
          </h1>
          <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">{project.code} • {project.category}</p>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-[2rem] p-1.5 shadow-xl">
            {['dashboard', 'charter', 'logs'].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}
                >
                    {tab}
                </button>
            ))}
        </div>
      </div>
      
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'charter' && <ProjectCharter />}
      {activeTab === 'logs' && <ChangeLog />}
    </div>
  );
};

export default ProjectDashboard;