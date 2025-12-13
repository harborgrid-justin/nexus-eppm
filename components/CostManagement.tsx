
import React, { useState, useMemo } from 'react';
import { useProjectState } from '../hooks';
import { DollarSign, LayoutDashboard, FileText, Calculator, Landmark, FileDiff, Receipt, BarChart2, Banknote, ShieldAlert, TrendingUp } from 'lucide-react';
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
import ErrorBoundary from './ErrorBoundary';
import { formatCurrency } from '../utils/formatters';
import { PageHeader } from './common/PageHeader';

interface CostManagementProps {
  projectId: string;
}

const CostManagement: React.FC<CostManagementProps> = ({ projectId }) => {
  const { project } = useProjectState(projectId);
  const [activeGroup, setActiveGroup] = useState('overview');
  const [activeView, setActiveView] = useState('dashboard');
  const theme = useTheme();

  const navStructure = useMemo(() => [
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
        { id: 'expenses', label: 'Expenses', icon: Receipt },
        { id: 'changes', label: 'Change Orders', icon: FileDiff },
    ]},
    { id: 'analysis', label: 'Analysis', items: [
        { id: 'evm', label: 'Earned Value', icon: BarChart2 },
    ]},
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navStructure.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      setActiveGroup(groupId);
      setActiveView(newGroup.items[0].id);
    }
  };

  const activeGroupItems = useMemo(() => {
    return navStructure.find(g => g.id === activeGroup)?.items || [];
  }, [activeGroup, navStructure]);

  const renderReserveAnalysis = () => (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 h-full">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><ShieldAlert className="text-red-500"/> Reserve Analysis</h2>
          <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <h3 className="text-sm font-bold text-slate-500 uppercase">Contingency Reserve</h3>
                  <p className="text-xs text-slate-400 mb-4">(Known Unknowns)</p>
                  <div className="text-3xl font-bold text-slate-800 mb-2">{formatCurrency(project?.reserves?.contingencyReserve || 0)}</div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '15%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">15% Utilized</p>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <h3 className="text-sm font-bold text-slate-500 uppercase">Management Reserve</h3>
                  <p className="text-xs text-slate-400 mb-4">(Unknown Unknowns)</p>
                  <div className="text-3xl font-bold text-slate-800 mb-2">{formatCurrency(project?.reserves?.managementReserve || 0)}</div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '0%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">0% Utilized</p>
              </div>
          </div>
          <div className="mt-8 border-t border-slate-200 pt-6">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><TrendingUp size={16}/> Funding Limit Reconciliation</h3>
              <div className="h-48 bg-slate-50 rounded border border-slate-200 flex items-center justify-center text-slate-400">
                  [Step Chart: Funding vs. Cumulative Cost expenditures would render here]
              </div>
              <p className="text-xs text-slate-500 mt-2 italic">Ensure expenditure does not exceed funding limits in any given period.</p>
          </div>
      </div>
  );

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
      case 'reserves': return renderReserveAnalysis();
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
        <div className={`flex-shrink-0 border-b ${theme.colors.border} bg-white z-10`}>
            <div className="px-4 pt-3 pb-2 space-x-2 border-b border-slate-200">
                {navStructure.map(group => (
                    <button
                        key={group.id}
                        onClick={() => handleGroupChange(group.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                            activeGroup === group.id
                            ? 'bg-nexus-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {group.label}
                    </button>
                ))}
            </div>
            <nav className="flex space-x-2 px-4 overflow-x-auto scrollbar-hide">
                {activeGroupItems.map(item => (
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
          <ErrorBoundary name="Cost Module">
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default CostManagement;
