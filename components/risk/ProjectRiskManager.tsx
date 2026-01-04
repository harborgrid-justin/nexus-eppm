
import React, { useState, useMemo, useTransition } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { ShieldAlert, LayoutDashboard, List, Sigma, Target } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { PageHeader } from '../common/PageHeader';
import { ModuleNavigation, NavGroup } from '../common/ModuleNavigation';
import { ErrorBoundary } from '../ErrorBoundary';

// Sub-components
import RiskDashboard from './RiskDashboard';
import { RiskRegisterGrid } from './RiskRegisterGrid';
import RiskMatrix from './RiskMatrix';

const ProjectRiskManager: React.FC = () => {
  const { project } = useProjectWorkspace();
  const theme = useTheme();
  
  const [activeGroup, setActiveGroup] = useState('monitoring');
  const [activeView, setActiveView] = useState('dashboard');
  const [isPending, startTransition] = useTransition();

  const navGroups: NavGroup[] = useMemo(() => [
    { id: 'monitoring', label: 'Risk Monitoring', items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'register', label: 'Risk Register', icon: List },
    ]},
    { id: 'analysis', label: 'Analysis', items: [
      { id: 'matrix', label: 'P-I Matrix', icon: Sigma },
    ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navGroups.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      startTransition(() => {
        setActiveGroup(groupId);
        setActiveView(newGroup.items[0].id);
      });
    }
  };

  const handleItemChange = (viewId: string) => {
    startTransition(() => {
        setActiveView(viewId);
    });
  };

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <RiskDashboard />;
      case 'register': return <RiskRegisterGrid />;
      case 'matrix': return <RiskMatrix />;
      default: return <RiskDashboard />;
    }
  };

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="Project Risk Management" 
        subtitle={`Risk governance for ${project.name} (${project.code})`}
        icon={ShieldAlert}
      />

      <div className={theme.layout.panelContainer}>
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
          <ErrorBoundary name="Project Risk">
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default ProjectRiskManager;
