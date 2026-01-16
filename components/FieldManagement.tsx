
import React from 'react';
import { HardHat } from 'lucide-react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { useFieldManagementLogic } from '../hooks/domain/useFieldManagementLogic';
import { ModuleNavigation } from './common/ModuleNavigation';
import { EmptyGrid } from './common/EmptyGrid';

// Sub-components
import DailyLog from './field/DailyLog';
import SafetyIncidentLog from './field/SafetyIncidentLog';
import PunchList from './field/PunchList';

const FieldManagement: React.FC = () => {
  const { project } = useProjectWorkspace();
  const projectId = project?.id;
  
  const {
      activeGroup,
      activeView,
      isPending,
      navGroups,
      handleGroupChange,
      handleItemChange
  } = useFieldManagementLogic();
  
  if (!projectId) return <EmptyGrid title="Context Missing" description="No project selected" icon={HardHat} />;

  const renderContent = () => {
    switch (activeView) {
      case 'logs': return <DailyLog projectId={projectId} />;
      case 'incidents': return <SafetyIncidentLog projectId={projectId} />;
      case 'punchlist': return <PunchList projectId={projectId} />;
      default: return <DailyLog projectId={projectId} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
        <div className="flex-shrink-0 border-b border-slate-100">
             <ModuleNavigation 
                groups={navGroups}
                activeGroup={activeGroup}
                activeItem={activeView}
                onGroupChange={handleGroupChange}
                onItemChange={handleItemChange}
                className="bg-transparent border-0 shadow-none"
             />
        </div>
        <div className={`flex-1 overflow-hidden relative ${isPending ? 'opacity-70' : 'opacity-100'} transition-opacity duration-200`}>
            {renderContent()}
        </div>
    </div>
  );
};
export default FieldManagement;
