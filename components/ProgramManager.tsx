import React from 'react';
import { Layers, Loader2, Briefcase, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ModuleNavigation } from './common/ModuleNavigation';
import { StatusBadge } from './common/StatusBadge';
import { PageHeader } from './common/PageHeader';
import ProgramsRootDashboard from './program/ProgramsRootDashboard';
import { getProgramModule } from './program/programModuleHelper';
import { ErrorBoundary } from './ErrorBoundary';
import { useProgramManagerLogic } from '../hooks/domain/useProgramManagerLogic';
import { EmptyGrid } from './common/EmptyGrid';
import { useNavigate } from 'react-router-dom';
// Added missing Button import
import { Button } from './ui/Button';

interface ProgramManagerProps {
    forcedProgramId?: string;
}

const ProgramManager: React.FC<ProgramManagerProps> = ({ forcedProgramId }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const {
      selectedProgramId,
      selectedProgram,
      activeGroup,
      activeView,
      isPending,
      navGroups,
      handleSelectProgram,
      handleGroupChange,
      handleItemChange
  } = useProgramManagerLogic(forcedProgramId);

  // If no program selected, show list view or empty state
  if (!selectedProgram && !forcedProgramId) {
    return (
        <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
            <PageHeader 
                title="Program Portfolio" 
                subtitle="Strategic oversight of cross-functional initiatives."
                icon={Briefcase}
                actions={<Button size="sm" icon={Plus} onClick={() => navigate('/programs/create')}>New Program</Button>}
            />
            <div className={theme.layout.panelContainer}>
                <div className="flex-1 overflow-hidden flex flex-col">
                    <ProgramsRootDashboard onSelectProgram={handleSelectProgram} />
                </div>
            </div>
        </div>
    );
  }

  // Handle case where specific program is requested but not found
  if (selectedProgramId && !selectedProgram) {
      return (
          <div className="h-full flex items-center justify-center p-12">
              <EmptyGrid 
                title="Program Entity Not Found"
                description="The requested program identifier does not exist in the strategic ledger."
                icon={Layers}
                actionLabel="Back to Portfolio"
                onAdd={() => handleSelectProgram(null)}
              />
          </div>
      )
  }

  const ModuleComponent = getProgramModule(activeView);
  
  const panelContent = (
      <>
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
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'} flex flex-col`}>
            {isPending && <div className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center"><Loader2 className="animate-spin text-nexus-500" /></div>}
            <ErrorBoundary name={`Program Module: ${activeView}`}>
                <ModuleComponent programId={selectedProgram!.id} />
            </ErrorBoundary>
        </div>
      </>
  );

  if (forcedProgramId) {
      return <div className="flex flex-col h-full">{panelContent}</div>;
  }

  return (
      <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
          <PageHeader 
            title={selectedProgram!.name} 
            subtitle={`Program Manager: ${selectedProgram!.managerId} • ${selectedProgram!.category}`}
            icon={Layers}
            actions={
                <div className="flex items-center gap-2">
                     <StatusBadge status={selectedProgram!.health} variant="health"/>
                     <button onClick={() => handleSelectProgram(null)} className="text-xs font-bold text-slate-500 hover:text-slate-800 underline ml-4 uppercase tracking-widest">Back to Registry</button>
                </div>
            }
          />
          <div className={theme.layout.panelContainer}>
            {panelContent}
          </div>
      </div>
  );
};
export default ProgramManager;