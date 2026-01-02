
import React, { useState, useMemo, useTransition } from 'react';
import { Sliders, LayoutDashboard, FileText, List, Layers, Lock } from 'lucide-react';
// FIX: Changed import to a named import as ErrorBoundary does not have a default export.
import { ErrorBoundary } from './ErrorBoundary';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';

// Sub-components
import ScopeDashboard from './scope/ScopeDashboard';
import ScopeStatement from './scope/ScopeStatement';
import WBSManager from './scope/WBSManager';
import RequirementsTraceability from './scope/RequirementsTraceability';

const ScopeManagement: React.FC = () => {
  const { project } = useProjectWorkspace();
  const projectId = project.id;
  const theme = useTheme();
  const [activeGroup, setActiveGroup] = useState('overview');
  const [activeView, setActiveView] = useState('dashboard');
  const [isPending, startTransition] = useTransition();

  const navStructure = useMemo(() => [
    { id: 'overview', label: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]},
    { id: 'definition', label: 'Definition', items: [
      { id: 'statement', label: 'Scope Statement', icon: FileText },
      { id: 'requirements', label: 'Requirements (RTM)', icon: List },
    ]},
    { id: 'breakdown', label: 'Breakdown', items: [
      { id: 'wbs', label: 'Work Breakdown Structure', icon: Layers },
    ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navStructure.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      startTransition(() => {
        setActiveGroup(groupId);
        setActiveView(newGroup.items[0].id);
      });
    }
  };

  const handleViewChange = (viewId: string) => {
      startTransition(() => {
          setActiveView(viewId);
      });
  };

  const activeGroupItems = useMemo(() => {
    return navStructure.find(g => g.id === activeGroup)?.items || [];
  }, [activeGroup, navStructure]);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <ScopeDashboard />;
      case 'statement': return <ScopeStatement projectId={projectId} />;
      case 'wbs': return <WBSManager projectId={projectId} />;
      case 'requirements': return <RequirementsTraceability />;
      default: return <ScopeDashboard />;
    }
  };

  if (!project) return <div className={theme.layout.pagePadding}>Loading scope data...</div>;

  return (
    <div className={`${theme.layout.pagePadding} flex flex-col h-full`}>
      <PageHeader 
        title="Scope Management" 
        subtitle="Define, validate, and control project scope and deliverables."
        icon={Sliders}
      />

      <div className={`${theme.components.card} flex-1 flex flex-col overflow-hidden`}>
        <div className={`flex-shrink-0 border-b ${theme.colors.border} z-10`}>
          <div className={`px-4 pt-3 pb-2 space-x-2 border-b ${theme.colors.border}`}>
              {navStructure.map(group => (
                  <button
                      key={group.id}
                      onClick={() => handleGroupChange(group.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                          activeGroup === group.id
                          ? `${theme.colors.primary} text-white shadow-sm`
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
                onClick={() => handleViewChange(item.id)}
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
        <div className={`flex-1 overflow-hidden transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
          <ErrorBoundary>
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
export default ScopeManagement;
