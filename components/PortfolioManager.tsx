import React from 'react';
import { Layers, Globe, Loader2, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ModuleNavigation } from './common/ModuleNavigation';
import ProgramManager from './ProgramManager';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { ErrorBoundary } from './ErrorBoundary';
import { usePortfolioManagerLogic } from '../hooks/domain/usePortfolioManagerLogic';
import { PortfolioContent } from './portfolio/PortfolioContent';
import { EmptyGrid } from './common/EmptyGrid';
import { useI18n } from '../context/I18nContext';

const PortfolioManager: React.FC = () => {
  const { state } = useData();
  const theme = useTheme();
  const { t } = useI18n();

  const {
    activeGroup, activeTab, drilledProgramId, isPending,
    navGroups, handleGroupChange, handleItemChange,
    handleProgramDrillDown, clearDrillDown
  } = usePortfolioManagerLogic();

  const hasPortfolioStructure = state.eps.length > 1;

  if (drilledProgramId) {
       return (
         <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in slide-in-from-bottom-4 fade-in`}>
             <PageHeader 
                title={t('program.detail.title', 'Program Detail')} 
                subtitle={t('program.detail.subtitle', 'Deep dive into program execution and governance.')}
                icon={Layers}
                actions={
                    <button 
                      onClick={clearDrillDown} 
                      className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95 ${theme.colors.surface} ${theme.colors.border} ${theme.colors.text.secondary} hover:${theme.colors.background}`}
                    >
                        <ArrowLeft size={16}/> {t('common.back_to_portfolio', 'Back to Portfolio')}
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
    <div className={`${theme.layout.pageContainer} ${theme.colors.background}`}>
      <div className={`${theme.layout.pagePadding} pb-0`}>
        <PageHeader 
          title={t('nav.portfolio', 'Strategic Portfolio Management')} 
          subtitle={t('portfolio.subtitle', 'Executive oversight, strategic alignment, and investment optimization.')}
          icon={Globe}
        />
      </div>
      
      <div className={`${theme.layout.panelContainer} m-6 md:m-8 mt-4 flex-1 flex flex-col overflow-hidden`}>
        <div className={`flex-shrink-0 z-10 border-b ${theme.colors.border} bg-slate-50/50`}>
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
                {!hasPortfolioStructure && (activeTab === 'framework' || activeTab === 'alignment') ? (
                    <EmptyGrid 
                        title={t('portfolio.structure.empty', 'Strategic Structure Isolated')}
                        description={t('portfolio.structure.empty_desc', 'Global strategy mapping requires a defined Enterprise Project Structure (EPS). Organize your portfolio branches to begin alignment.')}
                        actionLabel={t('portfolio.structure.action', 'Initialize Portfolio Hierarchy')}
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