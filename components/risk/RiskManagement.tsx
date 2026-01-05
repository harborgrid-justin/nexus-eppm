
import React, { useState, useMemo, useTransition } from 'react';
import { LayoutDashboard, List, Sigma, BarChart2, ShieldAlert } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { PageHeader } from '../common/PageHeader';
import { ModuleNavigation, NavGroup } from '../common/ModuleNavigation';
import { ErrorBoundary } from '../ErrorBoundary';

// Internal Views
import RiskDashboard from './RiskDashboard';
import { RiskRegisterGrid } from './RiskRegisterGrid';
import RiskMatrix from './RiskMatrix';
import QuantitativeAnalysis from './QuantitativeAnalysis';

// Enterprise Views (Sibling Directory)
import PortfolioRisks from '../portfolio/PortfolioRisks';
import { SystemicRiskDashboard } from './enterprise/SystemicRiskDashboard';
import { GlobalRiskRegister } from './enterprise/GlobalRiskRegister';
import { GlobalRiskMatrix } from './enterprise/GlobalRiskMatrix';
import { GlobalQuantitativeAnalysis } from './enterprise/GlobalQuantitativeAnalysis';

const RiskManagement: React.FC = () => {
  const theme = useTheme();
  
  const [activeGroup, setActiveGroup] = useState('enterprise');
  const [activeView, setActiveView] = useState('dashboard');
  const [isPending, startTransition] = useTransition();

  const navGroups: NavGroup[] = useMemo(() => [
    { id: 'enterprise', label: 'Enterprise & Portfolio', items: [
      { id: 'dashboard', label: 'Systemic Dashboard', icon: LayoutDashboard },
      { id: 'portfolio', label: 'Portfolio Risks', icon: ShieldAlert },
    ]},
    { id: 'analysis', label: 'Analysis & Aggregation', items: [
      { id: 'register', label: 'Global Risk Register', icon: List },
      { id: 'matrix', label: 'Global Heatmap', icon: Sigma },
      { id: 'quantitative', label: 'Quantitative Model', icon: BarChart2 },
    ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navGroups.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      startTransition(() => {
        setActiveGroup(groupId);
        setActiveView(newGroup.items[0].id);
      });
    }
  };

  const handleItemChange = (viewId: string) => {
    startTransition(() => {
        setActiveView(viewId);
    });
  };

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
        icon={ShieldAlert}
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
