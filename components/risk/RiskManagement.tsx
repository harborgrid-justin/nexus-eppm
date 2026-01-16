
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ErrorBoundary } from '../ErrorBoundary';
import { TabbedLayout } from '../layout/standard/TabbedLayout';

import PortfolioRisks from '../portfolio/PortfolioRisks';
import { SystemicRiskDashboard } from './enterprise/SystemicRiskDashboard';
import { GlobalRiskRegister } from './enterprise/GlobalRiskRegister';
import { GlobalRiskMatrix } from './enterprise/GlobalRiskMatrix';
import { GlobalQuantitativeAnalysis } from './enterprise/GlobalQuantitativeAnalysis';
import { useRiskManagementLogic } from '../../hooks/domain/useRiskManagementLogic';

const RiskManagement: React.FC = () => {
  const {
      activeGroup,
      activeView,
      isPending,
      navGroups,
      handleGroupChange,
      handleItemChange
  } = useRiskManagementLogic();

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <SystemicRiskDashboard />;
      case 'portfolio': return <PortfolioRisks />;
      case 'register': return <GlobalRiskRegister />;
      case 'matrix': return <GlobalRiskMatrix />;
      case 'quantitative': return <GlobalQuantitativeAnalysis />;
      default: return <SystemicRiskDashboard />;
    }
  };

  return (
    <TabbedLayout
        title="Enterprise Risk Management"
        subtitle="Identify, analyze, and mitigate systemic threats across the organization."
        icon={AlertTriangle}
        navGroups={navGroups}
        activeGroup={activeGroup}
        activeItem={activeView}
        onGroupChange={handleGroupChange}
        onItemChange={handleItemChange}
    >
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
          <ErrorBoundary name="Enterprise Risk">
            {renderContent()}
          </ErrorBoundary>
        </div>
    </TabbedLayout>
  );
};

export default RiskManagement;
