
import React, { useState, useMemo, useTransition } from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { ErrorBoundary } from './ErrorBoundary';
import ProcurementDashboard from './procurement/ProcurementDashboard';
import VendorRegistry from './procurement/VendorRegistry';
import ContractLifecycle from './procurement/ContractLifecycle';
import ProcurementPlanning from './procurement/ProcurementPlanning';
import ProcurementSourcing from './procurement/ProcurementSourcing';
import ProcurementExecution from './procurement/ProcurementExecution';
import SupplierPerformance from './procurement/SupplierPerformance';
import { ShoppingCart, FileText, DollarSign, Award, Users, Briefcase, LayoutDashboard, Scale, ListCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/formatters';
import { PageHeader } from './common/PageHeader';
import { MakeOrBuyAnalysisView } from './procurement/MakeOrBuyAnalysisView';
import { SourceSelectionView } from './procurement/SourceSelectionView';

const ProcurementManagement: React.FC = () => {
  const theme = useTheme();
  const { project } = useProjectWorkspace();
  const projectId = project.id;

  const [activeGroup, setActiveGroup] = useState('overview');
  const [activeView, setActiveView] = useState('dashboard');
  const [isPending, startTransition] = useTransition();
  
  const navStructure = useMemo(() => [
    { id: 'overview', label: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]},
    { id: 'pre-award', label: 'Pre-Award', items: [
      { id: 'planning', label: 'Planning', icon: FileText },
      { id: 'makebuy', label: 'Make-or-Buy', icon: Scale },
      { id: 'vendors', label: 'Vendors', icon: Users },
      { id: 'criteria', label: 'Source Selection', icon: ListCheck },
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
      startTransition(() => {
        setActiveGroup(groupId);
        setActiveView(newGroup.items[0].id);
      });
    }
  };
  
  const handleViewChange = (viewId: string) => {
      startTransition(() => {
          setActiveView(viewId);
      });
  };

  const activeGroupItems = useMemo(() => {
    return navStructure.find(g => g.id === activeGroup)?.items || [];
  }, [activeGroup, navStructure]);

  const renderContent = () => {
    switch (activeView) {
        case 'dashboard': return <ProcurementDashboard />;
        case 'vendors': return <VendorRegistry projectId={projectId} />;
        case 'contracts': return <ContractLifecycle projectId={projectId} />;
        case 'makebuy': return <MakeOrBuyAnalysisView projectId={projectId} />;
        case 'criteria': return <SourceSelectionView />;
        case 'planning': return <ProcurementPlanning projectId={projectId} />;
        case 'sourcing': return <ProcurementSourcing projectId={projectId} />;
        case 'execution': return <ProcurementExecution />;
        case 'performance': return <SupplierPerformance projectId={projectId} />;
        default: return <ProcurementDashboard />;
    }
  };

  return (
    <div className={`${theme.layout.pagePadding} flex flex-col h-full`}>
       <PageHeader 
         title="Procurement Management"
         subtitle="End-to-end procurement lifecycle from planning to performance."
         icon={ShoppingCart}
       />

       <div className={`${theme.components.card} flex-1 flex flex-col overflow-hidden`}>
          <div className={`flex-shrink-0 border-b ${theme.colors.border} z-10`}>
            <div className={`px-4 pt-3 pb-2 space-x-2 border-b ${theme.colors.border}`}>
                {navStructure.map(group => (
                    <button
                        key={group.id}
                        onClick={() => handleGroupChange(group.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                            activeGroup === group.id
                            ? `${theme.colors.primary} text-white shadow-sm`
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
                    onClick={() => handleViewChange(item.id)}
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
          <div className={`flex-1 overflow-hidden transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
             <ErrorBoundary>
                {renderContent()}
             </ErrorBoundary>
          </div>
       </div>
    </div>
  );
};

export default ProcurementManagement;
