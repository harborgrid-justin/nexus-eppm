
import React from 'react';
import { useProcurementData } from '../hooks/useProcurementData';
import ErrorBoundary from './ErrorBoundary';
import ProcurementDashboard from './procurement/ProcurementDashboard';
import VendorRegistry from './procurement/VendorRegistry';
import ContractLifecycle from './procurement/ContractLifecycle';
import GenericEnterpriseModule from './GenericEnterpriseModule';
import { ShoppingCart, FileText, DollarSign, Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ProcurementManagementProps {
  projectId: string;
}

const ProcurementManagement: React.FC<ProcurementManagementProps> = ({ projectId }) => {
  const { activeView, setActiveView, navItems } = useProcurementData(projectId);
  const theme = useTheme();

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
             <ErrorBoundary>
                {renderContent()}
             </ErrorBoundary>
          </div>
       </div>
    </div>
  );
};

export default ProcurementManagement;
