
import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { useProjectState } from '../hooks';

// Sub-components
import ScopeDashboard from './scope/ScopeDashboard';
import ScopeStatement from './scope/ScopeStatement';
import WBSManager from './scope/WBSManager';
import RequirementsTraceability from './scope/RequirementsTraceability';

interface ScopeManagementProps {
  projectId: string;
}

const ScopeManagement: React.FC<ScopeManagementProps> = ({ projectId }) => {
  const { project } = useProjectState(projectId);
  const theme = useTheme();
  const [activeGroup, setActiveGroup] = useState('overview');
  const [activeView, setActiveView] = useState('dashboard');

  const navStructure = useMemo(() => [
    { id: 'overview', label: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', icon: LucideIcons.LayoutDashboard }
    ]},
    { id: 'definition', label: 'Definition', items: [
      { id: 'statement', label: 'Scope Statement', icon: LucideIcons.FileText },
      { id: 'requirements', label: 'Requirements (RTM)', icon: LucideIcons.List },
    ]},
    { id: 'breakdown', label: 'Breakdown', items: [
      { id: 'wbs', label: 'Work Breakdown Structure', icon: LucideIcons.Layers3 },
    ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navStructure.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      setActiveGroup(groupId);
      setActiveView(newGroup.items[0].id);
    }
  };

  const activeGroupItems = useMemo(() => {
    return navStructure.find(g => g.id === activeGroup)?.items || [];
  }, [activeGroup, navStructure]);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <ScopeDashboard projectId={projectId} />;
      case 'statement': return <ScopeStatement projectId={projectId} />;
      case 'wbs': return <WBSManager projectId={projectId} />;
      case 'requirements': return <RequirementsTraceability projectId={projectId} />;
      default: return <ScopeDashboard projectId={projectId} />;
    }
  };

  if (!project) return <div className={theme.layout.pagePadding}>Loading scope data...</div>;

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
      <PageHeader 
        title="Scope Management" 
        subtitle="Define, validate, and control project scope and deliverables."
        icon={LucideIcons.Sliders}
      />

      <div className={theme.layout.panelContainer}>
        <div className={`flex-shrink-0 border-b ${theme.colors.border} bg-white z-10`}>
          <div className="px-4 pt-3 pb-2 space-x-2 border-b border-slate-200">
              {navStructure.map(group => (
                  <button
                      key={group.id}
                      onClick={() => handleGroupChange(group.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                          activeGroup === group.id
                          ? 'bg-nexus-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                      {group.label}
                  </button>
              ))}
          </div>
          <nav className="flex space-x-2 px-4 overflow-x-auto scrollbar-hide">
            {activeGroupItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeView === item.id
                    ? 'border-nexus-600 text-nexus-600'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="flex-1 overflow-hidden">
          <ErrorBoundary>
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default ScopeManagement;
