
import React from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { DollarSign, Loader2 } from 'lucide-react';
import CostDashboard from './cost/CostDashboard';
import CostPlanEditor from './cost/CostPlanEditor';
import CostEstimating from './cost/CostEstimating';
import CostBudgetView from './cost/CostBudgetView';
import CostChangeOrders from './cost/CostChangeOrders';
import CostExpenses from './cost/CostExpenses';
import { BudgetLog } from './cost/BudgetLog';
import { ProjectFunding } from './cost/ProjectFunding';
import EarnedValue from './cost/EarnedValue';
import ReserveAnalysis from './cost/ReserveAnalysis';
import CostProcurement from './cost/CostProcurement';
import CostCommunications from './cost/CostCommunications'; 
import { useCostManagementLogic } from '../hooks/domain/useCostManagementLogic';
import { useI18n } from '../context/I18nContext';
import { EmptyGrid } from './common/EmptyGrid';
import { ModuleNavigation } from './common/ModuleNavigation';

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
    <div className="flex flex-col h-full bg-white">
        <div className="flex-shrink-0 border-b border-slate-100">
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
            {renderContent()}
        </div>
    </div>
  );
};

export default CostManagement;
