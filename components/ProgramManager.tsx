import React from 'react';
import { Layers, Briefcase, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { ModuleNavigation } from './common/ModuleNavigation';
import { StatusBadge } from './common/StatusBadge';
import { PageHeader } from './common/PageHeader';
import ProgramsRootDashboard from './program/ProgramsRootDashboard';
import { getProgramModule } from './program/programModuleHelper';
import { ErrorBoundary } from './ErrorBoundary';
import { useProgramManagerLogic } from '../hooks/domain/useProgramManagerLogic';
import { EmptyGrid } from './common/EmptyGrid';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';

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
        <div className={`h-full flex flex-col ${theme.layout.pagePadding} ${theme.colors.background}`}>
            <PageHeader 
                title={t('nav.programs', 'Program Portfolio')} 
                subtitle={t('program.subtitle', 'Strategic oversight of cross-functional initiatives.')}
                icon={Briefcase}
                actions={<Button size="sm" icon={Plus} onClick={() => navigate('/programs/create')}>{t('program.new', 'New Program')}</Button>}
            />
            <div className={`mt-8 flex-1 flex flex-col ${theme.colors.surface} rounded-2xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
                <ProgramsRootDashboard onSelectProgram={handleSelectProgram} />
            </div>
        </div>
    );
  }

  if (selectedProgramId && !selectedProgram) {
      return (
          <EmptyGrid 
            title={t('program.not_found', 'Program Entity Not Found')}
            description={t('program.not_found_desc', 'The requested program identifier does not exist in the strategic ledger.')}
            icon={Layers}
            actionLabel={t('common.back', 'Back to Registry')}
            onAdd={() => handleSelectProgram(null)}
          />
      )
  }

  const ModuleComponent = getProgramModule(activeView);
  
  const panelContent = (
      <>
        <div className={`flex-shrink-0 z-10 border-b ${theme.colors.border} bg-slate-50/50`}>
            <ModuleNavigation 
                groups={navGroups} activeGroup={activeGroup} activeItem={activeView} 
                onGroupChange={handleGroupChange} onItemChange={handleItemChange} 
                className="bg-transparent border-0 shadow-none"
            />
        </div>
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'} flex flex-col`}>
            <ErrorBoundary name={`Program Module: ${activeView}`}>
                <ModuleComponent programId={selectedProgram!.id} />
            </ErrorBoundary>
        </div>
      </>
  );

  if (forcedProgramId) return <div className="flex flex-col h-full">{panelContent}</div>;

  return (
      <div className={`h-full flex flex-col ${theme.layout.pagePadding} ${theme.colors.background}`}>
          <PageHeader 
            title={selectedProgram!.name} 
            subtitle={`${t('program.manager', 'Manager')}: ${selectedProgram!.managerId}`}
            icon={Layers}
            actions={
                <div className="flex items-center gap-4">
                     <StatusBadge status={selectedProgram!.health} variant="health"/>
                     <button onClick={() => handleSelectProgram(null)} className={`text-xs font-black uppercase tracking-widest ${theme.colors.text.tertiary} hover:${theme.colors.text.primary}`}>{t('common.back', 'Back to Registry')}</button>
                </div>
            }
          />
          <div className={`mt-8 flex-1 flex flex-col ${theme.colors.surface} rounded-2xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
            {panelContent}
          </div>
      </div>
  );
};
export default ProgramManager;