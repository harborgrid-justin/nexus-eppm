import React from 'react';
import { LayoutDashboard, Loader2, ArrowLeft, Layers, Globe } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ModuleNavigation } from './common/ModuleNavigation';
import ProgramManager from './ProgramManager';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { ErrorBoundary } from './ErrorBoundary';
import { usePortfolioManagerLogic } from '../hooks/domain/usePortfolioManagerLogic';
import { PortfolioContent } from './portfolio/PortfolioContent';
import { EmptyGrid } from './common/EmptyGrid';

const PortfolioManager: React.FC = () => {
  const { state } = useData();
  const theme = useTheme();

  const {
    activeGroup, activeTab, drilledProgramId, isPending,
    navGroups, handleGroupChange, handleItemChange,
    handleProgramDrillDown, clearDrillDown
  } = usePortfolioManagerLogic();

  // Pattern: Verify EPS initialization before rendering complex strategy modules
  const hasPortfolioStructure = state.eps.length > 1;

  if (drilledProgramId) {
       return (
         <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full animate-in slide-in-from-bottom-4 fade-in`}>
             <PageHeader 
                title="Program Detail" 
                subtitle="Deep dive into program execution and governance."
                icon={Layers}
                actions={
                    <button onClick={clearDrillDown} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-all active:scale-95">
                        <ArrowLeft size={16}/> Back to Portfolio
                    </button>
                }
             />
             <div className={theme.layout.panelContainer}>
                 <ProgramManager forcedProgramId={drilledProgramId} />
             </div>
         </div>
       )
  }

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="Strategic Portfolio Management" 
        subtitle="Executive oversight, strategic alignment, and investment optimization."
        icon={Globe}
      />
      
      <div className={theme.layout.panelContainer}>
        <div className={`flex-shrink-0 z-10 rounded-t-xl overflow-hidden ${theme.layout.headerBorder} bg-slate-50/50`}>
            <ModuleNavigation 
                groups={navGroups} activeGroup={activeGroup} activeItem={activeTab}
                onGroupChange={handleGroupChange} onItemChange={handleItemChange}
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
                {!hasPortfolioStructure && (activeTab === 'framework' || activeTab === 'alignment') ? (
                    <EmptyGrid 
                        title="Strategic Structure Isolated"
                        description="Global strategy mapping requires a defined Enterprise Project Structure (EPS). Organize your portfolio branches to begin alignment."
                        actionLabel="Initialize Portfolio Hierarchy"
                        onAdd={() => handleItemChange('framework')}
                        icon={Layers}
                    />
                ) : (
                    <PortfolioContent activeTab={activeTab} projects={state.projects} onSelectProgram={handleProgramDrillDown} />
                )}
             </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default PortfolioManager;