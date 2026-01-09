
import React from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { DollarSign } from 'lucide-react';
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

const CostManagement: React.FC = () => {
  const workspace = useProjectWorkspace();
  const project = workspace?.project;
  const theme = useTheme();

  const {
      activeGroup,
      activeView,
      isPending,
      navGroups,
      handleGroupChange,
      handleItemChange
  } = useCostManagementLogic();

  if (!project) return (
    <div className={`p-6 space-y-4 flex flex-col h-full ${theme.colors.background}`}>
        <PageHeader title="Cost Management" subtitle="Staffing and allocation hub" icon={DollarSign} />
        <div className="flex-1 bg-slate-100 border border-slate-200 rounded-xl animate-pulse flex flex-col items-center justify-center text-slate-400">
            <DollarSign size={48} className="mb-4 opacity-10" />
            <p className="font-bold uppercase tracking-widest text-xs">Initializing Cost Context...</p>
        </div>
    </div>
  );

  const projectId = project.id;

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

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="Cost Management" 
        subtitle="Plan, estimate, and control project costs with precision."
        icon={DollarSign}
      />

      <div className={theme.layout.panelContainer}>
        <div className={`flex-shrink-0 z-10 rounded-t-xl overflow-hidden border-b ${theme.colors.border} bg-slate-50/50`}>
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
