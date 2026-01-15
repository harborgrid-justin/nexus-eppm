
import React from 'react';
import { Globe, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import ProgramManager from './ProgramManager';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { PageHeader } from './common/PageHeader';
import { ErrorBoundary } from './ErrorBoundary';
import { usePortfolioManagerLogic } from '../hooks/domain/usePortfolioManagerLogic';
import { PortfolioContent } from './portfolio/PortfolioContent';
import { EmptyGrid } from './common/EmptyGrid';
import { TabbedLayout } from './layout/standard/TabbedLayout';
import { PageLayout } from './layout/standard/PageLayout';
import { PanelContainer } from './layout/standard/PanelContainer';

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
         <PageLayout
            title={t('program.detail.title', 'Program Detail')}
            subtitle={t('program.detail.subtitle', 'Deep dive into program execution.')}
            icon={Globe}
            actions={
                <button onClick={clearDrillDown} className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${theme.colors.surface} ${theme.colors.border} ${theme.colors.text.secondary}`}>
                    <ArrowLeft size={16}/> {t('common.back', 'Back')}
                </button>
            }
         >
             <PanelContainer>
                 <ProgramManager forcedProgramId={drilledProgramId} />
             </PanelContainer>
         </PageLayout>
       )
  }

  return (
    <TabbedLayout
        title={t('nav.portfolio', 'Strategic Portfolio')}
        subtitle={t('portfolio.subtitle', 'Organizational investment oversight.')}
        icon={Globe}
        navGroups={navGroups}
        activeGroup={activeGroup}
        activeItem={activeTab}
        onGroupChange={handleGroupChange}
        onItemChange={handleItemChange}
    >
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
             <ErrorBoundary name="Portfolio Module">
                {state.projects.length === 0 ? (
                    <div className="h-full flex items-center justify-center p-8">
                        <EmptyGrid 
                            title={t('portfolio.empty', 'Investment Ledger Neutral')}
                            description={t('portfolio.empty_desc', 'Construct your portfolio branches to begin strategic alignment.')}
                            icon={Globe}
                        />
                    </div>
                ) : (
                    <PortfolioContent activeTab={activeTab} projects={state.projects} onSelectProgram={handleProgramDrillDown} />
                )}
             </ErrorBoundary>
        </div>
    </TabbedLayout>
  );
};
export default PortfolioManager;
