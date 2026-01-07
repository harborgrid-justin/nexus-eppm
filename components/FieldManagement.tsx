
import React from 'react';
import { HardHat } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { ModuleNavigation } from './common/ModuleNavigation';
import { ErrorBoundary } from './ErrorBoundary';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { useFieldManagementLogic } from '../hooks/domain/useFieldManagementLogic';

// Sub-components
import DailyLog from './field/DailyLog';
import SafetyIncidentLog from './field/SafetyIncidentLog';
import PunchList from './field/PunchList';

const FieldManagement: React.FC = () => {
  const { project } = useProjectWorkspace();
  const projectId = project.id;
  const theme = useTheme();
  
  const {
      activeGroup,
      activeView,
      isPending,
      navGroups,
      handleGroupChange,
      handleItemChange
  } = useFieldManagementLogic();

  const renderContent = () => {
    switch (activeView) {
      case 'logs': return <DailyLog projectId={projectId} />;
      case 'incidents': return <SafetyIncidentLog projectId={projectId} />;
      case 'punchlist': return <PunchList projectId={projectId} />;
      default: return <DailyLog projectId={projectId} />;
    }
  };

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} space-y-4`}>
      <PageHeader 
        title="Field Management" 
        subtitle="Site operations, safety compliance, and daily reporting."
        icon={HardHat}
      />

      <div className={theme.layout.panelContainer}>
        <div className="flex-shrink-0 z-10 rounded-t-xl overflow-hidden">
            <ModuleNavigation 
                groups={navGroups}
                activeGroup={activeGroup}
                activeItem={activeView}
                onGroupChange={handleGroupChange}
                onItemChange={handleItemChange}
                className="border-b border-slate-200"
            />
        </div>
        <div className={`flex-1 overflow-hidden relative ${isPending ? 'opacity-70' : 'opacity-100'} transition-opacity duration-200`}>
          <ErrorBoundary name="Field Module">
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
export default FieldManagement;
