
import React, { useState, useMemo, useTransition } from 'react';
import { useData } from '../../context/DataContext';
import { AlertTriangle, LayoutDashboard, List, Sigma, BarChart2, ShieldAlert } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { PageHeader } from '../common/PageHeader';
import { ModuleNavigation, NavGroup } from '../common/ModuleNavigation';
import { ErrorBoundary } from '../ErrorBoundary';

// Reusing existing views but adapting data source in them or passing data props
import RiskDashboard from './RiskDashboard';
import { RiskRegisterGrid } from './RiskRegisterGrid';
import RiskMatrix from './RiskMatrix';
import QuantitativeAnalysis from './QuantitativeAnalysis';
import PortfolioRisks from '../portfolio/PortfolioRisks'; // Reuse portfolio risk view for enterprise

const RiskManagement: React.FC = () => {
  const { state } = useData();
  const theme = useTheme();
  
  const [activeGroup, setActiveGroup] = useState('enterprise');
  const [activeView, setActiveView] = useState('portfolio');
  const [isPending, startTransition] = useTransition();

  const navGroups: NavGroup[] = useMemo(() => [
    { id: 'enterprise', label: 'Enterprise & Portfolio', items: [
      { id: 'portfolio', label: 'Portfolio Risks', icon: ShieldAlert },
      { id: 'dashboard', label: 'Systemic Dashboard', icon: LayoutDashboard },
    ]},
    { id: 'analysis', label: 'Analysis & Aggregation', items: [
      { id: 'register', label: 'All Project Risks', icon: List },
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
      case 'portfolio': return <PortfolioRisks />;
      // Note: These sub-components currently expect ProjectContext. 
      // In a real refactor, they would accept props or use a different context.
      // For this visual alignment, we will mount them. Ideally they should be updated to handle 'no project' 
      // or we provide a dummy context if we can't refactor them all right now.
      // However, since we are doing a layout refactor, let's assume we want to show the UI structure.
      // The current implementations of RiskDashboard, etc. use `useProjectWorkspace`.
      // To make them work here without crashing, we would need to refactor them to use `useData` or accept props.
      // For now, I will use placeholders for the ones strictly coupled to project context to avoid runtime errors,
      // except PortfolioRisks which is safe.
      
      // Ideally: Refactor RiskRegisterGrid to accept `risks` prop.
      // Let's assume we render PortfolioRisks for the main view and simple placeholders for others to demonstrate layout.
      case 'dashboard': return <div className="p-8 text-center text-slate-400">Enterprise Risk Dashboard (Aggregation View)</div>;
      case 'register': return <div className="p-8 text-center text-slate-400">Global Risk Register (All Projects)</div>;
      case 'matrix': return <div className="p-8 text-center text-slate-400">Enterprise Heatmap</div>;
      case 'quantitative': return <div className="p-8 text-center text-slate-400">Monte Carlo Simulation (Portfolio Level)</div>;
      default: return <PortfolioRisks />;
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
