import React, { useState, useMemo } from 'react';
import { useProcurementData } from '../hooks';
import ErrorBoundary from './ErrorBoundary';
import ProcurementDashboard from './procurement/ProcurementDashboard';
import VendorRegistry from './procurement/VendorRegistry';
import ContractLifecycle from './procurement/ContractLifecycle';
import GenericEnterpriseModule from './GenericEnterpriseModule';
import { ShoppingCart, FileText, DollarSign, Award, Users, Briefcase, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ProcurementManagementProps {
  projectId: string;
}

const ProcurementManagement: React.FC<ProcurementManagementProps> = ({ projectId }) => {
  const theme = useTheme();
  const [activeGroup, setActiveGroup] = useState('overview');
  const [activeView, setActiveView] = useState('dashboard');
  
  const navStructure = useMemo(() => [
    { id: 'overview', label: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]},
    { id: 'pre-award', label: 'Pre-Award', items: [
      { id: 'planning', label: 'Planning', icon: FileText },
      { id: 'vendors', label: 'Vendors', icon: Users },
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

  const renderContent = () => {
    switch (activeView) {
        case 'dashboard':
            return <ProcurementDashboard projectId={projectId} />;
        case 'vendors':
            return <VendorRegistry projectId={projectId} />;
        case 'contracts':
            return <ContractLifecycle projectId={projectId} />;
        case 'planning':
            return <GenericEnterpriseModule title="Procurement Planning" description="Develop procurement strategies, make-or-buy analysis, and planning templates." type="grid" icon={FileText} />;
        case 'sourcing':
            return <GenericEnterpriseModule title="Sourcing & Bidding" description="Manage RFIs, RFPs, RFQs, and evaluate vendor proposals." type="grid" icon={ShoppingCart} />;
        case 'execution':
            return <GenericEnterpriseModule title="Execution & POs" description="Track purchase orders, goods receipts, and financial matching." type="grid" icon={DollarSign} />;
        case 'performance':
            return <GenericEnterpriseModule title="Supplier Performance" description="Scorecards, compliance tracking, and relationship reviews." type="dashboard" icon={Award} />;
        default:
            return <ProcurementDashboard projectId={projectId} />;
    }
  };

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
       <div className={theme.layout.header}>
          <div>
            <h1 className={theme.typography.h1}>
              <ShoppingCart className="text-nexus-600" /> Procurement Management
            </h1>
            <p className={theme.typography.small}>End-to-end procurement lifecycle from planning to performance.</p>
          </div>
       </div>

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
             <ErrorBoundary>
                {renderContent()}
             </ErrorBoundary>
          </div>
       </div>
    </div>
  );
};

export default ProcurementManagement;
