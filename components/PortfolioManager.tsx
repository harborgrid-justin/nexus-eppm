import React from 'react';
import { Globe, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ModuleNavigation } from './common/ModuleNavigation';
import ProgramManager from './ProgramManager';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { PageHeader } from './common/PageHeader';
import { ErrorBoundary } from './ErrorBoundary';
import { usePortfolioManagerLogic } from '../hooks/domain/usePortfolioManagerLogic';
import { PortfolioContent } from './portfolio/PortfolioContent';
import { EmptyGrid } from './common/EmptyGrid';

const PortfolioManager: React.FC = () => {
  const { state } = useData();
  const theme = useTheme();
  const { t } = useI18n();

  const {
    activeGroup, activeTab, drilledProgramId, isPending,
    navGroups, handleGroupChange, handleItemChange,
    handleProgramDrillDown, clearDrillDown
  } = usePortfolioManagerLogic();

  if (drilledProgramId) {
       return (
         <div className={`h-full flex flex-col ${theme.layout.pagePadding} ${theme.colors.background}`}>
             <PageHeader 
                title={t('program.detail.title', 'Program Detail')} 
                subtitle={t('program.detail.subtitle', 'Deep dive into program execution.')}
                icon={Globe}
                actions={
                    <button onClick={clearDrillDown} className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${theme.colors.surface} ${theme.colors.border} ${theme.colors.text.secondary}`}>
                        <ArrowLeft size={16}/> {t('common.back', 'Back')}
                    </button>
                }
             />
             <div className={`mt-8 flex-1 flex flex-col ${theme.colors.surface} rounded-2xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
                 <ProgramManager forcedProgramId={drilledProgramId} />
             </div>
         </div>
       )
  }

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding} ${theme.colors.background}`}>
      <PageHeader 
        title={t('nav.portfolio', 'Strategic Portfolio')} 
        subtitle={t('portfolio.subtitle', 'Organizational investment oversight.')}
        icon={Globe}
      />
      
      <div className={`mt-8 flex-1 flex flex-col ${theme.colors.surface} rounded-2xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
        <div className={`flex-shrink-0 border-b ${theme.colors.border} bg-slate-50/50`}>
            <ModuleNavigation 
                groups={navGroups} activeGroup={activeGroup} activeItem={activeTab}
                onGroupChange={handleGroupChange} onItemChange={handleItemChange}
                className="bg-transparent border-0 shadow-none"
            />
        </div>
        
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
             <ErrorBoundary name="Portfolio Module">
                {state.projects.length === 0 ? (
                    <EmptyGrid 
                        title={t('portfolio.empty', 'Investment Ledger Neutral')}
                        description={t('portfolio.empty_desc', 'Construct your portfolio branches to begin strategic alignment.')}
                        icon={Globe}
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