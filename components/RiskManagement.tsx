
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { ModuleNavigation } from './common/ModuleNavigation';
import { ErrorBoundary } from './ErrorBoundary';

import PortfolioRisks from './portfolio/PortfolioRisks';
import { SystemicRiskDashboard } from './risk/enterprise/SystemicRiskDashboard';
import { GlobalRiskRegister } from './risk/enterprise/GlobalRiskRegister';
import { GlobalRiskMatrix } from './risk/enterprise/GlobalRiskMatrix';
import { GlobalQuantitativeAnalysis } from './risk/enterprise/GlobalQuantitativeAnalysis';
import { useRiskManagementLogic } from '../hooks/domain/useRiskManagementLogic';

const RiskManagement: React.FC = () => {
  const theme = useTheme();
  
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
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="Enterprise Risk Management" 
        subtitle="Identify, analyze, and mitigate systemic threats across the organization."
        icon={AlertTriangle}
      />

      <div className={theme.layout.panelContainer}>
        <div className={`flex-shrink-0 z-10 rounded-t-xl overflow-hidden ${theme.layout.headerBorder} bg-slate-50/50`}>
            <ModuleNavigation 
                groups={navGroups}
                activeGroup={activeGroup}
                activeItem={activeView}
                onGroupChange={handleGroupChange}
                onItemChange={handleItemChange}
                className="bg-transparent border-0 shadow-none"
            />
        </div>
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
          <ErrorBoundary name="Enterprise Risk">
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default RiskManagement;