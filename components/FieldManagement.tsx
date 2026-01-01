
import React, { useState, useMemo } from 'react';
import { HardHat, Clipboard, AlertTriangle, CheckSquare, CloudRain } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { ModuleNavigation, NavGroup } from './common/ModuleNavigation';
// FIX: Changed import to a named import as ErrorBoundary does not have a default export.
import { ErrorBoundary } from './ErrorBoundary';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';

// Sub-components
import DailyLog from './field/DailyLog';
import SafetyIncidentLog from './field/SafetyIncidentLog';

const FieldManagement: React.FC = () => {
  const { project } = useProjectWorkspace();
  const projectId = project.id;
  const theme = useTheme();
  const [activeGroup, setActiveGroup] = useState('daily');
  const [activeView, setActiveView] = useState('logs');

  const navGroups: NavGroup[] = useMemo(() => [
    { id: 'daily', label: 'Daily Reporting', items: [
      { id: 'logs', label: 'Daily Logs', icon: Clipboard }
    ]},
    { id: 'safety', label: 'Safety (HSE)', items: [
      { id: 'incidents', label: 'Incident Log', icon: AlertTriangle }
    ]},
    { id: 'inspections', label: 'Field QA', items: [
      { id: 'punchlist', label: 'Punch List', icon: CheckSquare }
    ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navGroups.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      setActiveGroup(groupId);
      setActiveView(newGroup.items[0].id);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'logs': return <DailyLog projectId={projectId} />;
      case 'incidents': return <SafetyIncidentLog projectId={projectId} />;
      case 'punchlist': return <div className="p-8 text-center text-slate-500 italic">Punch List module loading...</div>;
      default: return <DailyLog projectId={projectId} />;
    }
  };

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
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
                onItemChange={setActiveView}
                className="border-b border-slate-200"
            />
        </div>
        <div className="flex-1 overflow-hidden relative">
          <ErrorBoundary name="Field Module">
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default FieldManagement;
