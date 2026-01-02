
import React, { useState, useMemo, useTransition } from 'react';
import { ShieldCheck, LayoutDashboard, FileText, BadgeCheck, ClipboardList, Bug, Truck, Coins } from 'lucide-react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { ErrorBoundary } from './ErrorBoundary';
import QualityDashboard from './quality/QualityDashboard';
import QualityPlanEditor from './quality/QualityPlanEditor';
import QualityControlLog from './quality/QualityControlLog';
import DefectTracking from './quality/DefectTracking';
import { QualityStandards } from './quality/QualityStandards';
import SupplierQuality from './quality/SupplierQuality';
import CostOfQuality from './quality/CostOfQuality'; 
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';

const QualityManagement: React.FC = () => {
  const { project, qualityReports } = useProjectWorkspace();
  const projectId = project.id;
  const theme = useTheme();
  const [activeGroup, setActiveGroup] = useState('overview'); 
  const [activeView, setActiveView] = useState('dashboard');
  const [isPending, startTransition] = useTransition();

  const navStructure = useMemo(() => [
    { id: 'overview', label: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]},
    { id: 'planning', label: 'Planning', items: [
      { id: 'plan', label: 'Quality Plan', icon: FileText },
      { id: 'standards', label: 'Standards Registry', icon: BadgeCheck },
      { id: 'coq', label: 'Cost of Quality', icon: Coins },
    ]},
    { id: 'assurance', label: 'Assurance & Control', items: [
      { id: 'control', label: 'Control Log', icon: ClipboardList },
      { id: 'supplier', label: 'Supplier Quality', icon: Truck },
    ]},
    { id: 'issues', label: 'Issue Tracking', items: [
      { id: 'defects', label: 'Defect Log (NCR)', icon: Bug },
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
      case 'dashboard':
        return <QualityDashboard />;
      case 'plan':
        return <QualityPlanEditor projectId={projectId} />;
      case 'control':
        return <QualityControlLog qualityReports={qualityReports} />;
      case 'defects':
        return <DefectTracking />;
      case 'standards':
        return <QualityStandards />;
      case 'supplier':
        return <SupplierQuality />;
      case 'coq':
        return <CostOfQuality project={project} />;
      default:
        return <QualityDashboard />;
    }
  };

  if (!project) return <div className={theme.layout.pagePadding}>Loading quality module...</div>;

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="Quality Management" 
        subtitle="Ensure project deliverables meet and exceed stakeholder expectations."
        icon={ShieldCheck}
      />

      <div className={theme.layout.panelContainer}>
        <div className={`flex-shrink-0 ${theme.layout.headerBorder} z-10 bg-slate-50/50`}>
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
export default QualityManagement;
