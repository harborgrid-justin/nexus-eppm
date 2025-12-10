
import React, { useState } from 'react';
import { useProjectState } from '../hooks/useProjectState';
import { DollarSign, LayoutDashboard, FileText, Calculator, Landmark, FileDiff, Receipt, BarChart2, Banknote } from 'lucide-react';
import CostDashboard from './cost/CostDashboard';
import CostPlanEditor from './cost/CostPlanEditor';
import CostEstimating from './cost/CostEstimating';
import CostBudgetView from './cost/CostBudgetView';
import CostChangeOrders from './cost/CostChangeOrders';
import CostExpenses from './cost/CostExpenses';
import BudgetLog from './cost/BudgetLog';
import ProjectFunding from './cost/ProjectFunding';
import EarnedValue from './cost/EarnedValue';
import { useTheme } from '../context/ThemeContext';

interface CostManagementProps {
  projectId: string;
}

const CostManagement: React.FC<CostManagementProps> = ({ projectId }) => {
  const { project } = useProjectState(projectId);
  const [activeView, setActiveView] = useState('dashboard');
  const theme = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'plan', label: 'Plan', icon: FileText },
    { id: 'budgetLog', label: 'Budget Log', icon: Landmark },
    { id: 'funding', label: 'Funding', icon: Banknote },
    { id: 'estimating', label: 'Estimating', icon: Calculator },
    { id: 'cbs', label: 'Budget (CBS)', icon: BarChart2 },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'changes', label: 'Change Orders', icon: FileDiff },
    { id: 'evm', label: 'Earned Value', icon: BarChart2 },
  ];

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard':
        return <CostDashboard projectId={projectId} />;
      case 'plan':
        return <CostPlanEditor projectId={projectId} />;
      case 'budgetLog':
        return <BudgetLog projectId={projectId} />;
      case 'funding':
        return <ProjectFunding projectId={projectId} />;
      case 'estimating':
        return <CostEstimating projectId={projectId} />;
      case 'cbs':
        return <CostBudgetView projectId={projectId} />;
      case 'expenses':
        return <CostExpenses projectId={projectId} />;
      case 'changes':
        return <CostChangeOrders projectId={projectId} />;
      case 'evm':
        return <EarnedValue projectId={projectId} />;
      default:
        return <CostDashboard projectId={projectId} />;
    }
  };

  if (!project) return <div className={theme.layout.pagePadding}>Loading cost module...</div>;

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
      <div className={theme.layout.header}>
        <div>
          <h1 className={theme.typography.h1}><DollarSign className="text-green-600"/> Cost Management</h1>
          <p className={theme.typography.small}>Plan, estimate, and control project costs with precision.</p>
        </div>
      </div>

      <div className={theme.layout.panelContainer}>
        <div className={`flex-shrink-0 ${theme.layout.headerBorder} ${theme.colors.background}`}>
          <nav className="flex space-x-2 px-4 overflow-x-auto scrollbar-hide">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeView === item.id
                    ? `${theme.colors.border.replace('slate-200', 'nexus-600')} text-nexus-600`
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
                style={{ borderColor: activeView === item.id ? '#0284c7' : 'transparent' }}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CostManagement;
