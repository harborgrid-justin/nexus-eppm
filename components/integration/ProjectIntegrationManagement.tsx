
import React, { useMemo, useState } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useData } from '../../context/DataContext';
import { ProjectHeader } from '../project/ProjectHeader';
import { ProjectControls } from '../project/ProjectControls';
import { IntegrationDashboardView } from './IntegrationDashboardView';
import { ProjectCharterSummary } from './ProjectCharterSummary';
import { ChangeSummary } from './ChangeSummary';
import ProjectCharter from './ProjectCharter';
import ChangeLog from './ChangeLog';
import { calculateScopeCreep } from '../../utils/integrations/cost';
import { checkTaskStagnation } from '../../utils/integrations/schedule';
import { formatCompactCurrency } from '../../utils/formatters';
import { EmptyGrid } from '../common/EmptyGrid';
import { Briefcase } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ProjectIntegrationManagement: React.FC = () => {
  const { project, summary, financials, riskProfile, qualityProfile, changeOrders } = useProjectWorkspace();
  const { state, dispatch } = useData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const theme = useTheme();

  const integrationMetrics = useMemo(() => {
    if (!project) return { scopeCreep: 0, stagnantTasks: 0 };
    return {
        scopeCreep: calculateScopeCreep(project.originalBudget, changeOrders),
        stagnantTasks: project.tasks.filter(t => checkTaskStagnation(t)).length
    };
  }, [project, changeOrders]);

  // Fix: Derive next board meeting from global governance state
  const boardMeetingInfo = useMemo(() => {
    const boardEvent = state.governanceEvents.find(e => e.type === 'Steering Committee');
    return boardEvent ? `${boardEvent.name} is scheduled for ${boardEvent.nextDate}.` : 'No upcoming board meetings scheduled.';
  }, [state.governanceEvents]);

  // Fix: Derive exposure status dynamically from financials
  const exposureInfo = useMemo(() => {
      if (!financials || !project) return '';
      const threshold = project.originalBudget * 0.15;
      const isWithin = financials.pendingCOAmount <= threshold;
      return `Current unapproved exposure (${formatCompactCurrency(financials.pendingCOAmount)}) is ${isWithin ? 'within' : 'exceeding'} the 15% contingency threshold.`;
  }, [financials, project]);

  if (!project) {
      return (
          <div className="h-full flex items-center justify-center p-12">
              <EmptyGrid 
                title="Project Registry Isolated" 
                description="This context has been isolated from the global ledger. Please re-synchronize."
                icon={Briefcase}
              />
          </div>
      );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.colors.background} scrollbar-thin animate-in fade-in duration-500`}>
      <ProjectHeader 
        project={project} 
        onCreateReflection={() => dispatch({ type: 'PROJECT_CREATE_REFLECTION', payload: { sourceProjectId: project.id } })} 
        onMergeReflection={() => dispatch({ type: 'PROJECT_MERGE_REFLECTION', payload: { reflectionId: project.id } })} 
      />
      
      <div className="mb-8">
        <ProjectControls activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      <div className="relative">
          {activeTab === 'dashboard' && summary && financials && (
            <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-400">
              <IntegrationDashboardView 
                summary={summary} 
                financials={financials} 
                riskProfile={riskProfile} 
                qualityProfile={qualityProfile} 
                phase2Metrics={integrationMetrics} 
              />
              <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
                <ProjectCharterSummary project={project} financials={financials} />
                {/* Fix: Pass dynamic governance data to ChangeSummary */}
                <ChangeSummary 
                    approvedCOAmount={financials.approvedCOAmount} 
                    pendingCOAmount={financials.pendingCOAmount} 
                    boardMeetingInfo={boardMeetingInfo}
                    exposureInfo={exposureInfo}
                />
              </div>
            </div>
          )}
          {activeTab === 'charter' && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                  <ProjectCharter />
              </div>
          )}
          {activeTab === 'logs' && (
               <div className="animate-in slide-in-from-right-4 duration-300 h-[600px]">
                  <ChangeLog />
              </div>
          )}
      </div>
    </div>
  );
};

export default ProjectIntegrationManagement;
