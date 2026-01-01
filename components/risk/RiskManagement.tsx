
import React, { useState, useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { AlertTriangle, LayoutDashboard, FileText, List, Columns, BarChart2, Sigma } from 'lucide-react';
import { ErrorBoundary } from '../ErrorBoundary';
import RiskDashboard from './RiskDashboard';
import RiskPlanEditor from './RiskPlanEditor';
import { RiskRegisterGrid } from './RiskRegisterGrid';
import RiskBreakdownStructure from './RiskBreakdownStructure';
import RiskMatrix from './RiskMatrix';
import QuantitativeAnalysis from './QuantitativeAnalysis';
import { useTheme } from '../../context/ThemeContext';
import { PageHeader } from '../common/PageHeader';

const RiskManagement: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState('overview');
  const [activeView, setActiveView] = useState('dashboard');
  const { project } = useProjectWorkspace();
  const projectId = project.id;
  const theme = useTheme();

  const navStructure = useMemo(() => [
    { id: 'overview', label: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]},
    { id: 'planning', label: 'Planning', items: [
      { id: 'plan', label: 'Risk Plan', icon: FileText },
      { id: 'rbs', label: 'RBS', icon: Columns },
    ]},
    { id: 'analysis', label: 'Identification & Analysis', items: [
      { id: 'register', label: 'Register', icon: List },
      { id: 'matrix', label: 'P-I Matrix', icon: Sigma },
    ]},
    { id: 'advanced', label: 'Advanced', items: [
      { id: 'quantitative', label: 'Quantitative', icon: BarChart2 },
    ]},
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
    if (!project) {
        return <div className={theme.layout.pagePadding + " text-slate-500"}>Loading project data...</div>;
    }

    switch(activeView) {
      case 'dashboard': return <RiskDashboard />;
      case 'plan': return <RiskPlanEditor />;
      case 'register': return <RiskRegisterGrid />;
      case 'rbs': return <RiskBreakdownStructure projectId={projectId} />;
      case 'matrix': return <RiskMatrix />;
      case 'quantitative': return <QuantitativeAnalysis />;
      default: return <RiskDashboard />;
    }
  };

  return (
    <div className={`${theme.layout.pagePadding} flex flex-col h-full`}>
      <PageHeader 
        title="Risk Management" 
        subtitle="Identify, analyze, and respond to project uncertainty."
        icon={AlertTriangle}
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
          <ErrorBoundary name="Risk Module">
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default RiskManagement;
