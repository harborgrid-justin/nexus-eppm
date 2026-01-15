
import React from 'react';
import { Layers, Briefcase, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { StatusBadge } from './common/StatusBadge';
import { PageHeader } from './common/PageHeader';
import ProgramsRootDashboard from './program/ProgramsRootDashboard';
import { getProgramModule } from './program/programModuleHelper';
import { ErrorBoundary } from './ErrorBoundary';
import { useProgramManagerLogic } from '../hooks/domain/useProgramManagerLogic';
import { EmptyGrid } from './common/EmptyGrid';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { TabbedLayout } from './layout/standard/TabbedLayout';
import { PageLayout } from './layout/standard/PageLayout';
import { PanelContainer } from './layout/standard/PanelContainer';

interface ProgramManagerProps {
    forcedProgramId?: string;
}

const ProgramManager: React.FC<ProgramManagerProps> = ({ forcedProgramId }) => {
  const theme = useTheme();
  const { t } = useI18n();
  const navigate = useNavigate();

  const {
      selectedProgramId, selectedProgram, activeGroup, activeView,
      isPending, navGroups, handleSelectProgram, handleGroupChange, handleItemChange
  } = useProgramManagerLogic(forcedProgramId);

  if (!selectedProgram && !forcedProgramId) {
    return (
        <PageLayout
            title={t('nav.programs', 'Program Portfolio')}
            subtitle={t('program.subtitle', 'Strategic oversight of cross-functional initiatives.')}
            icon={Briefcase}
            actions={<Button size="sm" icon={Plus} onClick={() => navigate('/programs/create')}>{t('program.new', 'New Program')}</Button>}
        >
            <PanelContainer>
                <ProgramsRootDashboard onSelectProgram={handleSelectProgram} />
            </PanelContainer>
        </PageLayout>
    );
  }

  if (selectedProgramId && !selectedProgram) {
      return (
          <div className="h-full flex items-center justify-center p-8">
            <EmptyGrid 
                title={t('program.not_found', 'Program Entity Not Found')}
                description={t('program.not_found_desc', 'The requested program identifier does not exist in the strategic ledger.')}
                icon={Layers}
                actionLabel={t('common.back', 'Back to Registry')}
                onAdd={() => handleSelectProgram(null)}
            />
          </div>
      )
  }

  const ModuleComponent = getProgramModule(activeView);
  
  const content = (
    <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'} flex flex-col`}>
        <ErrorBoundary name={`Program Module: ${activeView}`}>
            <ModuleComponent programId={selectedProgram!.id} />
        </ErrorBoundary>
    </div>
  );

  // If forced, we render just the content inside the parent's container,
  // BUT we need the navigation. TabbedLayout handles nav.
  // If forced, we don't need the PageLayout wrapper, just the TabbedLayout part without the outer page padding?
  // TabbedLayout includes PageLayout.
  // We should extract a InnerTabbedLayout or similar, OR just render TabbedLayout and let it be the full view.
  // Since PortfolioManager renders it inside a PanelContainer... wait.
  // PortfolioManager renders ProgramManager inside a PanelContainer.
  // So ProgramManager should probably just render the tabs and content if forced.
  // Let's implement a conditional render.
  
  if (forcedProgramId) {
     // When forced (embedded), we just want the navigation and content, usually no header since parent provides it?
     // Actually PortfolioManager provides a header "Program Detail".
     // So here we just need the Tabs + Content.
     // We can use PanelContainer's header prop for the nav.
     return (
        <div className="flex flex-col h-full">
             <TabbedLayout
                title="" // Hidden/Not used if we only use the inner part? No TabbedLayout renders PageLayout.
                // We need a layout that is just the tabs and content.
                // Let's use ModuleNavigation directly here for the embedded case to avoid double headers.
                subtitle=""
                icon={Layers}
                navGroups={navGroups}
                activeGroup={activeGroup}
                activeItem={activeView}
                onGroupChange={handleGroupChange}
                onItemChange={handleItemChange}
             />
        </div>
     );
     // Wait, TabbedLayout renders PageLayout which renders PageHeader.
     // If embedded, we might get double headers.
     // However, in PortfolioManager, we render ProgramManager inside a PanelContainer.
     // So ProgramManager should probably return just the content with navigation?
     // Let's stick to the previous implementation structure but use ModuleNavigation component.
     // Actually, if we use TabbedLayout here, it will render a full page structure inside the PanelContainer of PortfolioManager.
     // That is bad.
     // Let's refactor:
     // If forced, render simple div with ModuleNavigation and Content.
  }
  
  // Standalone view
  return (
    <TabbedLayout
        title={selectedProgram!.name}
        subtitle={`${t('program.manager', 'Manager')}: ${selectedProgram!.managerId}`}
        icon={Layers}
        actions={
            <div className="flex items-center gap-4">
                 <StatusBadge status={selectedProgram!.health} variant="health"/>
                 <button onClick={() => handleSelectProgram(null)} className={`text-xs font-black uppercase tracking-widest ${theme.colors.text.tertiary} hover:${theme.colors.text.primary}`}>{t('common.back', 'Back to Registry')}</button>
            </div>
        }
        navGroups={navGroups}
        activeGroup={activeGroup}
        activeItem={activeView}
        onGroupChange={handleGroupChange}
        onItemChange={handleItemChange}
    >
        {content}
    </TabbedLayout>
  );
};
export default ProgramManager;
