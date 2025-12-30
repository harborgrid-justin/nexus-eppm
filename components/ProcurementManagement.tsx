
import React, { useState, useMemo } from 'react';
import { useProcurementData } from '../hooks';
import ProcurementDashboard from './procurement/ProcurementDashboard';
import VendorRegistry from './procurement/VendorRegistry';
import ContractLifecycle from './procurement/ContractLifecycle';
import ProcurementPlanning from './procurement/ProcurementPlanning';
import ProcurementSourcing from './procurement/ProcurementSourcing';
import ProcurementExecution from './procurement/ProcurementExecution';
import SupplierPerformance from './procurement/SupplierPerformance';
import { ShoppingCart, FileText, DollarSign, Award, Users, Briefcase, LayoutDashboard, Scale, ListChecks } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/formatters';
import { PageHeader } from './common/PageHeader';

interface ProcurementManagementProps {
  projectId: string;
}

const ProcurementManagement: React.FC<ProcurementManagementProps> = ({ projectId }) => {
  const theme = useTheme();
  const { state } = useData();
  const [activeGroup, setActiveGroup] = useState('overview');
  const [activeView, setActiveView] = useState('dashboard');
  
  const navStructure = useMemo(() => [
    { id: 'overview', label: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]},
    { id: 'pre-award', label: 'Pre-Award', items: [
      { id: 'planning', label: 'Planning', icon: FileText },
      { id: 'makebuy', label: 'Make-or-Buy', icon: Scale },
      { id: 'vendors', label: 'Vendors', icon: Users },
      { id: 'criteria', label: 'Source Selection', icon: ListChecks },
      { id: 'sourcing', label: 'Sourcing', icon: ShoppingCart },
    ]},
    { id: 'post-award', label: 'Post-Award', items: [
      { id: 'contracts', label: 'Contracts', icon: Briefcase },
      { id: 'execution', label: 'Execution & POs', icon: DollarSign },
    ]},
    { id: 'analysis', label: 'Analysis', items: [
      { id: 'performance', label: 'Performance', icon: Award },
    ]}
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

  const renderMakeOrBuy = () => (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 h-full overflow-y-auto">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Scale className="text-nexus-600"/> Make-or-Buy Analysis</h2>
          <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-100">
                  <tr>
                      <th className="px-4 py-2 text-left font-medium text-slate-500">Item</th>
                      <th className="px-4 py-2 text-right font-medium text-slate-500">Make Cost (Internal)</th>
                      <th className="px-4 py-2 text-right font-medium text-slate-500">Buy Cost (Vendor)</th>
                      <th className="px-4 py-2 text-left font-medium text-slate-500">Rationale</th>
                      <th className="px-4 py-2 text-left font-medium text-slate-500">Decision</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                  {state.makeOrBuyAnalysis.filter(i => i.projectId === projectId).map(item => (
                      <tr key={item.id}>
                          <td className="px-4 py-3 font-medium text-slate-800">{item.item}</td>
                          <td className="px-4 py-3 text-right font-mono">{formatCurrency(item.makeCost)}</td>
                          <td className="px-4 py-3 text-right font-mono">{formatCurrency(item.buyCost)}</td>
                          <td className="px-4 py-3 text-slate-600">{item.rationale}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-bold ${item.decision === 'Buy' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{item.decision}</span></td>
                      </tr>
                  ))}
                  {!state.makeOrBuyAnalysis.filter(i => i.projectId === projectId).length && <tr><td colSpan={5} className="p-4 text-center text-slate-400">No analysis items recorded.</td></tr>}
              </tbody>
          </table>
      </div>
  );

  const renderSourceSelection = () => (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 h-full">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><ListChecks className="text-nexus-600"/> Source Selection Criteria</h2>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600 mb-4">Criteria used to rate or score vendor proposals.</p>
              <ul className="space-y-3">
                  <li className="flex justify-between items-center p-2 bg-white rounded border border-slate-100">
                      <span className="text-sm font-medium">Technical Capability</span>
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold">Weight: 35%</span>
                  </li>
                  <li className="flex justify-between items-center p-2 bg-white rounded border border-slate-100">
                      <span className="text-sm font-medium">Past Performance</span>
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold">Weight: 25%</span>
                  </li>
                  <li className="flex justify-between items-center p-2 bg-white rounded border border-slate-100">
                      <span className="text-sm font-medium">Price / Cost</span>
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold">Weight: 40%</span>
                  </li>
              </ul>
          </div>
      </div>
  );

  const renderContent = () => {
    switch (activeView) {
        case 'dashboard': return <ProcurementDashboard projectId={projectId} />;
        case 'vendors': return <VendorRegistry projectId={projectId} />;
        case 'contracts': return <ContractLifecycle projectId={projectId} />;
        case 'makebuy': return renderMakeOrBuy();
        case 'criteria': return renderSourceSelection();
        case 'planning': return <ProcurementPlanning projectId={projectId} />;
        case 'sourcing': return <ProcurementSourcing projectId={projectId} />;
        case 'execution': return <ProcurementExecution projectId={projectId} />;
        case 'performance': return <SupplierPerformance projectId={projectId} />;
        default: return <ProcurementDashboard projectId={projectId} />;
    }
  };

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
       <PageHeader 
         title="Procurement Management"
         subtitle="End-to-end procurement lifecycle from planning to performance."
         icon={ShoppingCart}
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
                {renderContent()}
          </div>
       </div>
    </div>
  );
};

export default ProcurementManagement;
