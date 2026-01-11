
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
import { useTheme } from '../context/ThemeContext';
import { ErrorBoundary } from './ErrorBoundary';
import { PageHeader } from './common/PageHeader';
import { ModuleNavigation } from './common/ModuleNavigation';
import { useCostManagementLogic } from '../hooks/domain/useCostManagementLogic';
import { useI18n } from '../context/I18nContext';

const CostManagement: React.FC = () => {
  const { project } = useProjectWorkspace();
  const theme = useTheme();
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
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} flex flex-col h-full bg-slate-50/50`}>
        <PageHeader 
          title={t('cost.title', 'Cost Management')} 
          subtitle={t('cost.initializing', 'Initializing Fiscal Ledger...')} 
          icon={DollarSign} 
        />
        <div className="flex-1 nexus-empty-pattern border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={48} className="mb-4 animate-spin opacity-20 text-nexus-600" />
            <p className="font-black uppercase tracking-widest text-[10px]">{t('common.loading_context', 'Mounting Financial Context...')}</p>
        </div>
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
    <div className={`${theme.layout.pageContainer} ${theme.colors.background}`}>
      <div className={`${theme.layout.pagePadding} pb-0`}>
        <PageHeader 
          title={t('cost.title', 'Strategic Cost Management')} 
          subtitle={t('cost.subtitle', 'Plan, estimate, and control project costs with precision.')}
          icon={DollarSign}
        />
      </div>

      <div className={`${theme.layout.panelContainer} m-6 md:m-8 mt-4 flex-1 flex flex-col overflow-hidden`}>
        <div className={`flex-shrink-0 z-10 border-b ${theme.colors.border} bg-slate-50/50`}>
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
