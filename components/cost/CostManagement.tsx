
import React from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { DollarSign, Loader2 } from 'lucide-react';
import CostDashboard from './CostDashboard';
import CostPlanEditor from './CostPlanEditor';
import CostEstimating from './CostEstimating';
import CostBudgetView from './CostBudgetView';
import CostChangeOrders from './CostChangeOrders';
import CostExpenses from './CostExpenses';
import { BudgetLog } from './BudgetLog';
import { ProjectFunding } from './ProjectFunding';
import EarnedValue from './EarnedValue';
import ReserveAnalysis from './ReserveAnalysis';
import CostProcurement from './CostProcurement';
import CostCommunications from './CostCommunications'; 
import { ErrorBoundary } from '../ErrorBoundary';
import { TabbedLayout } from '../layout/standard/TabbedLayout';
import { useCostManagementLogic } from '../../hooks/domain/useCostManagementLogic';
import { useI18n } from '../../context/I18nContext';
import { EmptyGrid } from '../common/EmptyGrid';

const CostManagement: React.FC = () => {
  const { project } = useProjectWorkspace();
  const { t } = useI18n();

  const {
      activeGroup,
      activeView,
      isPending,
      navGroups,
      handleGroupChange,
      handleItemChange
  } = useCostManagementLogic();

  if (!project) return (
      <div className="h-full flex items-center justify-center p-8">
          <EmptyGrid 
              title={t('cost.initializing', 'Initializing Financial Context...')} 
              description={t('common.loading_context', 'Mounting Financial Context...')}
              icon={DollarSign}
          />
      </div>
  );

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <CostDashboard />;
      case 'plan': return <CostPlanEditor projectId={project.id} />;
      case 'budgetLog': return <BudgetLog />;
      case 'funding': return <ProjectFunding />;
      case 'estimating': return <CostEstimating projectId={project.id} />;
      case 'cbs': return <CostBudgetView />;
      case 'expenses': return <CostExpenses projectId={project.id} />;
      case 'changes': return <CostChangeOrders />;
      case 'evm': return <EarnedValue />;
      case 'reserves': return <ReserveAnalysis />;
      case 'procurement': return <CostProcurement projectId={project.id} />;
      case 'communications': return <CostCommunications projectId={project.id} />;
      default: return <CostDashboard />;
    }
  };

  return (
    <TabbedLayout
        title={t('cost.title', 'Strategic Cost Management')}
        subtitle={t('cost.subtitle', 'Plan, estimate, and control project costs with precision.')}
        icon={DollarSign}
        navGroups={navGroups}
        activeGroup={activeGroup}
        activeItem={activeView}
        onGroupChange={handleGroupChange}
        onItemChange={handleItemChange}
    >
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <ErrorBoundary name="Cost Module">
                {renderContent()}
            </ErrorBoundary>
        </div>
    </TabbedLayout>
  );
};

export default CostManagement;
