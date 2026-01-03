
import React from 'react';
import { Layers, Loader2, Briefcase } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ModuleNavigation } from './common/ModuleNavigation';
import { StatusBadge } from './common/StatusBadge';
import { PageHeader } from './common/PageHeader';
import ProgramsRootDashboard from './program/ProgramsRootDashboard';
import { getProgramModule } from './program/programModuleHelper';
import { ErrorBoundary } from './ErrorBoundary';
import { useProgramManagerLogic } from '../hooks/domain/useProgramManagerLogic';

interface ProgramManagerProps {
    forcedProgramId?: string;
}

const ProgramManager: React.FC<ProgramManagerProps> = ({ forcedProgramId }) => {
  const theme = useTheme();

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

  // If no program selected, show list view
  if (!selectedProgram) {
    return (
        <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
            <PageHeader 
                title="Program Portfolio" 
                subtitle="Strategic oversight of cross-functional initiatives."
                icon={Briefcase}
            />
            <div className={theme.layout.panelContainer}>
                <div className="flex-1 overflow-hidden">
                    <ProgramsRootDashboard onSelectProgram={handleSelectProgram} />
                </div>
            </div>
        </div>
    );
  }

  const ModuleComponent = getProgramModule(activeView);
  
  // Inner content (Navigation + Module View)
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
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            {isPending && <div className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center"><Loader2 className="animate-spin text-nexus-500" /></div>}
            <ErrorBoundary name={`Program: ${activeView}`}>
                <ModuleComponent programId={selectedProgram.id} />
            </ErrorBoundary>
        </div>
      </>
  );

  // If embedded (forcedId), the parent handles the container/header structure.
  // We just return the inner content flex column.
  if (forcedProgramId) {
      return <div className="flex flex-col h-full">{panelContent}</div>;
  }

  // Standalone View
  return (
      <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
          <PageHeader 
            title={selectedProgram.name} 
            subtitle={`Program Manager: ${selectedProgram.managerId} • ${selectedProgram.category}`}
            icon={Layers}
            actions={
                <div className="flex items-center gap-2">
                     <StatusBadge status={selectedProgram.health} variant="health"/>
                     <button onClick={() => handleSelectProgram(null)} className="text-sm text-slate-500 hover:text-slate-800 underline ml-4">Back to List</button>
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
