
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
import { ProjectHeader } from '../project/ProjectHeader';
import { ProjectControls } from '../project/ProjectControls';
import { IntegrationDashboardView } from './IntegrationDashboardView';
import { ProjectCharterSummary } from './ProjectCharterSummary';
import { ChangeSummary } from './ChangeSummary';

const ProjectDashboard: React.FC = () => {
  const { project, summary, financials, riskProfile, qualityProfile, changeOrders } = useProjectWorkspace();
  const { state, dispatch } = useData();
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
      <IntegrationDashboardView 
        summary={summary} 
        financials={financials} 
        riskProfile={riskProfile} 
        qualityProfile={qualityProfile} 
        phase2Metrics={phase2Metrics} 
      />

      <div className="mb-2">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <ActivityIcon size={12}/> Global Health Indicators
        </h3>
      </div>
      
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
         <div className={`${theme.colors.surface} border ${theme.colors.border} p-5 rounded-2xl shadow-sm flex items-center justify-between group hover:border-orange-300 transition-all`}>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Scope Creep Rate</p>
               <p className="text-xl font-black text-slate-900 mt-0.5">{phase2Metrics.scopeCreep.toFixed(1)}%</p>
            </div>
            <div className="p-2 bg-orange-50 rounded-xl text-orange-500 group-hover:scale-110 transition-transform"><AlertOctagon size={22} /></div>
         </div>
         <div className={`${theme.colors.surface} border ${theme.colors.border} p-5 rounded-2xl shadow-sm flex items-center justify-between group hover:border-red-300 transition-all`}>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Risk EMV</p>
               <p className="text-xl font-black text-slate-900 mt-0.5">{formatCompactCurrency(riskProfile.exposure)}</p>
            </div>
            <div className="p-2 bg-red-50 rounded-xl text-red-500 group-hover:scale-110 transition-transform"><ShieldCheck size={22} /></div>
         </div>
         <div className={`${theme.colors.surface} border ${theme.colors.border} p-5 rounded-2xl shadow-sm flex items-center justify-between group hover:border-blue-300 transition-all`}>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Funding Health</p>
               <p className="text-xl font-black text-slate-900 mt-0.5">{financials.solvency}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-xl text-blue-500 group-hover:scale-110 transition-transform"><Anchor size={22} /></div>
         </div>
         <div className={`${theme.colors.surface} border ${theme.colors.border} p-5 rounded-2xl shadow-sm flex items-center justify-between group hover:border-purple-300 transition-all`}>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Schedule (SPI)</p>
               <p className="text-xl font-black text-slate-900 mt-0.5">{financials.evm.spi.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-xl text-purple-500 group-hover:scale-110 transition-transform"><Zap size={22} /></div>
         </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
        <ProjectCharterSummary project={project} financials={financials} />
        <ChangeSummary 
            approvedCOAmount={financials.approvedCOAmount} 
            pendingCOAmount={financials.pendingCOAmount} 
            boardMeetingInfo={boardMeetingInfo}
            exposureInfo={exposureInfo}
        />
      </div>
    </div>
  );

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} bg-slate-50/50 scrollbar-thin`}>
      <ProjectHeader 
        project={project} 
        onCreateReflection={() => dispatch({ type: 'PROJECT_CREATE_REFLECTION', payload: { sourceProjectId: project.id } })} 
        onMergeReflection={() => dispatch({ type: 'PROJECT_MERGE_REFLECTION', payload: { reflectionId: project.id } })} 
      />
      
      <div className="mb-8">
        <ProjectControls activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'charter' && <ProjectCharter />}
      {activeTab === 'logs' && <ChangeLog />}
    </div>
  );
};

export default ProjectDashboard;
