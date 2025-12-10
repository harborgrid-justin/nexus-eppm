import React, { useState } from 'react';
import { useProjectState } from '../../hooks/useProjectState';
import { DollarSign, LayoutDashboard, FileText, Calculator, Landmark, FileDiff, Receipt } from 'lucide-react';
import CostDashboard from './CostDashboard';
import CostPlanEditor from './CostPlanEditor';
import CostEstimating from './CostEstimating';
import CostBudgetView from './CostBudgetView';
import CostChangeOrders from './CostChangeOrders';
import CostExpenses from './CostExpenses';

interface CostManagementProps {
  projectId: string;
}

const CostManagement: React.FC<CostManagementProps> = ({ projectId }) => {
  const { project } = useProjectState(projectId);
  const [activeView, setActiveView] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'plan', label: 'Plan', icon: FileText },
    { id: 'estimating', label: 'Estimating', icon: Calculator },
    { id: 'budget', label: 'Budget (CBS)', icon: Landmark },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'changes', label: 'Change Orders', icon: FileDiff },
  ];

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard':
        return <CostDashboard projectId={projectId} />;
      case 'plan':
        return <CostPlanEditor projectId={projectId} />;
      case 'estimating':
        return <CostEstimating projectId={projectId} />;
      case 'budget':
        return <CostBudgetView projectId={projectId} />;
      case 'expenses':
        return <CostExpenses projectId={projectId} />;
      case 'changes':
        return <CostChangeOrders projectId={projectId} />;
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
          <nav className="flex space-x-2 px-4">
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