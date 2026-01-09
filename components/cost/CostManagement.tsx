
import React from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { DollarSign } from 'lucide-react';
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
import { useTheme } from '../../context/ThemeContext';
import { ErrorBoundary } from '../ErrorBoundary';
import { PageHeader } from '../common/PageHeader';
import { ModuleNavigation } from '../common/ModuleNavigation';
import { useCostManagementLogic } from '../../hooks/domain/useCostManagementLogic';

const CostManagement: React.FC = () => {
  const { project } = useProjectWorkspace();
  const projectId = project.id;
  const theme = useTheme();

  const {
      activeGroup,
      activeView,
      isPending,
      navGroups,
      handleGroupChange,
      handleItemChange
  } = useCostManagementLogic();

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <CostDashboard />;
      case 'plan': return <CostPlanEditor projectId={projectId} />;
      case 'budgetLog': return <BudgetLog />;
      case 'funding': return <ProjectFunding />;
      case 'estimating': return <CostEstimating projectId={projectId} />;
      case 'cbs': return <CostBudgetView />;
      case 'expenses': return <CostExpenses projectId={projectId} />;
      case 'changes': return <CostChangeOrders />;
      case 'evm': return <EarnedValue />;
      case 'reserves': return <ReserveAnalysis />;
      case 'procurement': return <CostProcurement projectId={projectId} />;
      case 'communications': return <CostCommunications projectId={projectId} />;
      default: return <CostDashboard />;
    }
  };

  if (!project) return <div className={theme.layout.pagePadding}>Loading cost module...</div>;

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="Cost Management" 
        subtitle="Plan, estimate, and control project costs with precision."
        icon={DollarSign}
      />

      <div className={theme.layout.panelContainer}>
        <div className={`flex-shrink-0 z-10 rounded-t-xl overflow-hidden bg-slate-50/50 ${theme.layout.headerBorder}`}>
            <ModuleNavigation 
                groups={navGroups}
                activeGroup={activeGroup}
                activeItem={activeView}
                onGroupChange={handleGroupChange}
                onItemChange={handleItemChange}
                className="bg-transparent border-0 shadow-none"
            />
        </div>
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
          <ErrorBoundary name="Cost Module">
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default CostManagement;
