
import React from 'react';
import { HardHat } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { useFieldManagementLogic } from '../hooks/domain/useFieldManagementLogic';
import { TabbedLayout } from './layout/standard/TabbedLayout';

// Sub-components
import DailyLog from './field/DailyLog';
import SafetyIncidentLog from './field/SafetyIncidentLog';
import PunchList from './field/PunchList';

const FieldManagement: React.FC = () => {
  const { project } = useProjectWorkspace();
  const projectId = project.id;
  
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
    <TabbedLayout
        title="Field Management"
        subtitle="Site operations, safety compliance, and daily reporting."
        icon={HardHat}
        navGroups={navGroups}
        activeGroup={activeGroup}
        activeItem={activeView}
        onGroupChange={handleGroupChange}
        onItemChange={handleItemChange}
    >
        <div className={`flex-1 overflow-hidden relative ${isPending ? 'opacity-70' : 'opacity-100'} transition-opacity duration-200`}>
          <ErrorBoundary name="Field Module">
            {renderContent()}
          </ErrorBoundary>
        </div>
    </TabbedLayout>
  );
};
export default FieldManagement;
