import React, { useState } from 'react';
import { useProjectState } from '../../hooks/useProjectState';
import { DollarSign, LayoutDashboard, FileText, Calculator, Landmark, FileDiff, Receipt, BarChart2, Banknote } from 'lucide-react';
import CostDashboard from './CostDashboard';
import CostPlanEditor from './CostPlanEditor';
import CostEstimating from './CostEstimating';
import CostBudgetView from './CostBudgetView';
import CostChangeOrders from './CostChangeOrders';
import CostExpenses from './CostExpenses';
import BudgetLog from './BudgetLog';
import ProjectFunding from './ProjectFunding';
import EarnedValue from './EarnedValue';


interface CostManagementProps {
  projectId: string;
}

const CostManagement: React.FC<CostManagementProps> = ({ projectId }) => {
  const { project } = useProjectState(projectId);
  const [activeView, setActiveView] = useState('dashboard');

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

  if (!project) return <div>Loading cost module...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full overflow-hidden flex flex-col p-6">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><DollarSign className="text-green-600"/> Cost Management</h1>
          <p className="text-slate-500">Plan, estimate, and control project costs with precision.</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50">
          <nav className="flex space-x-2 px-4 overflow-x-auto scrollbar-hide">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeView === item.id
                    ? 'border-nexus-600 text-nexus-600'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
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