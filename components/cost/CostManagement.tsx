
import React, { useState, useMemo, useTransition } from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { DollarSign, LayoutDashboard, FileText, Calculator, Landmark, FileDiff, Receipt, BarChart2, Banknote, ShieldAlert, ShoppingCart, MessageSquare } from 'lucide-react';
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
import { useTheme } from '../context/ThemeContext';
import { ErrorBoundary } from '../ErrorBoundary';
import { PageHeader } from '../common/PageHeader';
import { ModuleNavigation, NavGroup } from '../common/ModuleNavigation';

const CostManagement: React.FC = () => {
  const { project } = useProjectWorkspace();
  const projectId = project.id;
  const [activeGroup, setActiveGroup] = useState('overview');
  const [activeView, setActiveView] = useState('dashboard');
  
  // Transition pattern for sub-module views
  const [isPending, startTransition] = useTransition();
  const theme = useTheme();

  const navGroups: NavGroup[] = useMemo(() => [
    { id: 'overview', label: 'Overview', items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]},
    { id: 'planning', label: 'Planning & Setup', items: [
        { id: 'plan', label: 'Cost Plan', icon: FileText },
        { id: 'estimating', label: 'Estimating', icon: Calculator },
        { id: 'cbs', label: 'Budget View', icon: BarChart2 },
        { id: 'reserves', label: 'Reserve Analysis', icon: ShieldAlert },
    ]},
    { id: 'control', label: 'Control & Execution', items: [
        { id: 'budgetLog', label: 'Budget Log', icon: Landmark },
        { id: 'funding', label: 'Funding & Reconciliation', icon: Banknote },
        { id: 'procurement', label: 'Procurement (Fin)', icon: ShoppingCart },
        { id: 'expenses', label: 'Expenses', icon: Receipt },
        { id: 'changes', label: 'Change Orders', icon: FileDiff },
    ]},
    { id: 'monitoring', label: 'Monitoring', items: [
        { id: 'evm', label: 'Earned Value', icon: BarChart2 },
        { id: 'communications', label: 'Communications', icon: MessageSquare },
    ]},
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navGroups.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      startTransition(() => {
        setActiveGroup(groupId);
        setActiveView(newGroup.items[0].id);
      });
    }
  };

  const handleItemChange = (viewId: string) => {
      startTransition(() => {
          setActiveView(viewId);
      });
  };

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
    <div className={`${theme.layout.pagePadding} flex flex-col h-full`}>
      <PageHeader 
        title="Cost Management" 
        subtitle="Plan, estimate, and control project costs with precision."
        icon={DollarSign}
      />

      <div className={`${theme.components.card} flex-1 flex flex-col overflow-hidden`}>
        <div className="flex-shrink-0 z-10 rounded-t-xl overflow-hidden">
            <ModuleNavigation 
                groups={navGroups}
                activeGroup={activeGroup}
                activeItem={activeView}
                onGroupChange={handleGroupChange}
                onItemChange={handleItemChange}
                className="border-b border-slate-200"
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
