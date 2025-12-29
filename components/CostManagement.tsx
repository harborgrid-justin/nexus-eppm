
import React, { useState, useMemo } from 'react';
import { useProjectState } from '../hooks';
import { DollarSign, LayoutDashboard, FileText, Calculator, Landmark, FileDiff, Receipt, BarChart2, Banknote, ShieldAlert, ShoppingCart, MessageSquare } from 'lucide-react';
import CostDashboard from './cost/CostDashboard';
import CostPlanEditor from './cost/CostPlanEditor';
import CostEstimating from './cost/CostEstimating';
import CostBudgetView from './cost/CostBudgetView';
import CostChangeOrders from './cost/CostChangeOrders';
import CostExpenses from './cost/CostExpenses';
import BudgetLog from './cost/BudgetLog';
import ProjectFunding from './cost/ProjectFunding';
import EarnedValue from './cost/EarnedValue';
import ReserveAnalysis from './cost/ReserveAnalysis';
import CostProcurement from './cost/CostProcurement';
import CostCommunications from './cost/CostCommunications'; 
import { useTheme } from '../context/ThemeContext';
import ErrorBoundary from './ErrorBoundary';
import { PageHeader } from './common/PageHeader';
import { ModuleNavigation, NavGroup } from './common/ModuleNavigation';

interface CostManagementProps {
  projectId: string;
}

const CostManagement: React.FC<CostManagementProps> = ({ projectId }) => {
  const { project } = useProjectState(projectId);
  const [activeGroup, setActiveGroup] = useState('overview');
  const [activeView, setActiveView] = useState('dashboard');
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
      setActiveGroup(groupId);
      setActiveView(newGroup.items[0].id);
    }
  };

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <CostDashboard projectId={projectId} />;
      case 'plan': return <CostPlanEditor projectId={projectId} />;
      case 'budgetLog': return <BudgetLog projectId={projectId} />;
      case 'funding': return <ProjectFunding projectId={projectId} />;
      case 'estimating': return <CostEstimating projectId={projectId} />;
      case 'cbs': return <CostBudgetView projectId={projectId} />;
      case 'expenses': return <CostExpenses projectId={projectId} />;
      case 'changes': return <CostChangeOrders projectId={projectId} />;
      case 'evm': return <EarnedValue projectId={projectId} />;
      case 'reserves': return <ReserveAnalysis projectId={projectId} />;
      case 'procurement': return <CostProcurement projectId={projectId} />;
      case 'communications': return <CostCommunications projectId={projectId} />;
      default: return <CostDashboard projectId={projectId} />;
    }
  };

  if (!project) return <div className={theme.layout.pagePadding}>Loading cost module...</div>;

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
      <PageHeader 
        title="Cost Management" 
        subtitle="Plan, estimate, and control project costs with precision."
        icon={DollarSign}
      />

      <div className={theme.layout.panelContainer}>
        <div className="flex-shrink-0 z-10 rounded-t-xl overflow-hidden">
            <ModuleNavigation 
                groups={navGroups}
                activeGroup={activeGroup}
                activeItem={activeView}
                onGroupChange={handleGroupChange}
                onItemChange={setActiveView}
                className="border-b border-slate-200"
            />
        </div>
        <div className="flex-1 overflow-hidden relative">
          <ErrorBoundary name="Cost Module">
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default CostManagement;
