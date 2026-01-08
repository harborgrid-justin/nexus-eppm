
import React from 'react';
import { LayoutDashboard, Loader2, ArrowLeft, Layers, Map } from 'lucide-react';
import Dashboard from './Dashboard';
import PortfolioStrategyFramework from './portfolio/PortfolioStrategyFramework';
import PortfolioPrioritization from './portfolio/PortfolioPrioritization';
import PortfolioBalancing from './portfolio/PortfolioBalancing';
import PortfolioBenefits from './portfolio/PortfolioBenefits';
import PortfolioRisks from './portfolio/PortfolioRisks';
import PortfolioCapacity from './portfolio/PortfolioCapacity';
import PortfolioFinancials from './portfolio/PortfolioFinancials';
import PortfolioCommunications from './portfolio/PortfolioCommunications';
import PortfolioOptimization from './portfolio/PortfolioOptimization';
import PortfolioRoadmap from './portfolio/PortfolioRoadmap';
import PortfolioScenarios from './portfolio/PortfolioScenarios';
import PortfolioValue from './portfolio/PortfolioValue';
import PortfolioGovernance from './portfolio/PortfolioGovernance';
import PortfolioESG from './portfolio/PortfolioESG';
import PortfolioPrograms from './portfolio/PortfolioPrograms';
import { PortfolioMap } from './portfolio/PortfolioMap';
import { useData } from '../context/DataContext';
import { ModuleNavigation } from './common/ModuleNavigation';
import ProgramManager from './ProgramManager';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { ErrorBoundary } from './ErrorBoundary';
import { usePortfolioManagerLogic } from '../hooks/domain/usePortfolioManagerLogic';

const PortfolioManager: React.FC = () => {
  const { state } = useData();
  const theme = useTheme();

  const {
    activeGroup,
    activeTab,
    drilledProgramId,
    isPending,
    navGroups,
    handleGroupChange,
    handleItemChange,
    handleProgramDrillDown,
    clearDrillDown
  } = usePortfolioManagerLogic();

  const renderContent = () => {
    if (drilledProgramId) {
        return <ProgramManager forcedProgramId={drilledProgramId} />;
    }

    switch(activeTab) {
      case 'overview': return <Dashboard />;
      case 'map': return <PortfolioMap />;
      case 'programs': return <PortfolioPrograms onSelectProgram={handleProgramDrillDown} />;
      case 'esg': return <PortfolioESG />;
      case 'financials': return <PortfolioFinancials projects={state.projects} />;
      case 'capacity': return <PortfolioCapacity />;
      case 'communications': return <PortfolioCommunications />;
      case 'optimization': return <PortfolioOptimization />;
      case 'roadmap': return <PortfolioRoadmap />;
      case 'scenarios': return <PortfolioScenarios />;
      case 'framework': return <PortfolioStrategyFramework />;
      case 'prioritization': return <PortfolioPrioritization />;
      case 'balancing': return <PortfolioBalancing />;
      case 'benefits': return <PortfolioBenefits />;
      case 'value': return <PortfolioValue />;
      case 'governance': return <PortfolioGovernance />;
      case 'risks': return <PortfolioRisks />;
      default: return <div className="p-6 text-slate-500">Module under construction</div>;
    }
  };

  // Special case for full-screen drilldown to maintain context
  if (drilledProgramId) {
       return (
         <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full animate-in slide-in-from-bottom-4 fade-in`}>
             <PageHeader 
                title="Program Detail" 
                subtitle="Deep dive into program execution and governance."
                icon={Layers}
                actions={
                    <button 
                        onClick={clearDrillDown}
                        className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm"
                    >
                        <ArrowLeft size={16}/> Back to Portfolio
                    </button>
                }
             />
             <div className={theme.layout.panelContainer}>
                 {/* ProgramManager handles its own internal layout, but we wrap it in the panel for consistency */}
                 <ProgramManager forcedProgramId={drilledProgramId} />
             </div>
         </div>
       )
  }

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="Portfolio Management" 
        subtitle="Executive oversight, strategic alignment, and investment optimization."
        icon={LayoutDashboard}
      />
      
      <div className={theme.layout.panelContainer}>
        <div className={`flex-shrink-0 z-10 rounded-t-xl overflow-hidden ${theme.layout.headerBorder} bg-slate-50/50`}>
            <ModuleNavigation 
                groups={navGroups}
                activeGroup={activeGroup}
                activeItem={activeTab}
                onGroupChange={handleGroupChange}
                onItemChange={handleItemChange}
                className="bg-transparent border-0 shadow-none"
            />
        </div>
        
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
             {isPending && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] z-20">
                     <Loader2 className="animate-spin text-nexus-500" />
                 </div>
             )}
             <ErrorBoundary name="Portfolio Module">
                {renderContent()}
             </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default PortfolioManager;
