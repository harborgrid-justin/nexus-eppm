import React, { useState, useMemo } from 'react';
import { useProjectWorkspace } from './context/ProjectWorkspaceContext';
import { useData } from '../context/DataContext';
import { ProjectHeader } from './project/ProjectHeader';
import { ProjectControls } from './project/ProjectControls';
import { IntegrationDashboardView } from './integration/IntegrationDashboardView';
import { ProjectCharterSummary } from './integration/ProjectCharterSummary';
import { ChangeSummary } from './integration/ChangeSummary';
import ProjectCharter from './integration/ProjectCharter';
import ChangeLog from './integration/ChangeLog';
import { calculateScopeCreep } from '../utils/integrations/cost';
import { checkTaskStagnation } from '../utils/integrations/schedule';

const ProjectIntegrationManagement: React.FC = () => {
  const { project, summary, financials, riskProfile, qualityProfile, changeOrders } = useProjectWorkspace();
  const { dispatch } = useData();
  const [activeTab, setActiveTab] = useState('dashboard');

  // FIX: Replaced static zero metrics with dynamic calculations from integration utilities
  const integrationMetrics = useMemo(() => {
    if (!project) return { scopeCreep: 0, stagnantTasks: 0 };
    return {
        scopeCreep: calculateScopeCreep(project.originalBudget, changeOrders),
        stagnantTasks: project.tasks.filter(t => checkTaskStagnation(t)).length
    };
  }, [project, changeOrders]);

  if (!project || !summary || !financials) return null;

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 bg-slate-100/50">
      <ProjectHeader project={project} onCreateReflection={() => dispatch({ type: 'PROJECT_CREATE_REFLECTION', payload: { sourceProjectId: project.id } })} onMergeReflection={() => dispatch({ type: 'PROJECT_MERGE_REFLECTION', payload: { reflectionId: project.id } })} />
      <ProjectControls activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <IntegrationDashboardView summary={summary} financials={financials} riskProfile={riskProfile} qualityProfile={qualityProfile} phase2Metrics={integrationMetrics} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><ProjectCharterSummary project={project} financials={financials as any} /><ChangeSummary approvedCOAmount={financials.approvedCOAmount} pendingCOAmount={financials.pendingCOAmount} /></div>
        </div>
      )}
      {activeTab === 'charter' && <ProjectCharter />}
      {activeTab === 'logs' && <ChangeLog />}
    </div>
  );
};
export default ProjectIntegrationManagement;