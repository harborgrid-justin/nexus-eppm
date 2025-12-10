import React, { useState, useMemo } from 'react';
import { ShieldCheck, LayoutDashboard, FileText, BadgeCheck, ClipboardList, Bug, Truck } from 'lucide-react';
import { useQualityData } from '../hooks';
import ErrorBoundary from './ErrorBoundary';
import QualityDashboard from './quality/QualityDashboard';
import QualityPlanEditor from './quality/QualityPlanEditor';
import QualityControlLog from './quality/QualityControlLog';
import DefectTracking from './quality/DefectTracking';
import GenericEnterpriseModule from './GenericEnterpriseModule';
import { useTheme } from '../context/ThemeContext';

interface QualityManagementProps {
  projectId: string;
}

const QualityManagement: React.FC<QualityManagementProps> = ({ projectId }) => {
  const {
    project,
    qualityProfile,
    qualityReports,
  } = useQualityData(projectId);
  const theme = useTheme();
  const [activeGroup, setActiveGroup] = useState('overview');
  const [activeView, setActiveView] = useState('dashboard');

  const navStructure = useMemo(() => [
    { id: 'overview', label: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]},
    { id: 'planning', label: 'Planning', items: [
      { id: 'plan', label: 'Quality Plan', icon: FileText },
      { id: 'standards', label: 'Standards', icon: BadgeCheck },
    ]},
    { id: 'execution', label: 'Assurance & Control', items: [
      { id: 'control', label: 'Control Log', icon: ClipboardList },
      { id: 'supplier', label: 'Supplier Quality', icon: Truck },
    ]},
    { id: 'defects', label: 'Issue Tracking', items: [
      { id: 'defects', label: 'Defect Log', icon: Bug },
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
      case 'dashboard':
        return <QualityDashboard qualityProfile={qualityProfile} />;
      case 'plan':
        return <QualityPlanEditor projectId={projectId} />;
      case 'control':
        return <QualityControlLog qualityReports={qualityReports} />;
      case 'defects':
        return <DefectTracking projectId={projectId} />;
      case 'standards':
        return <GenericEnterpriseModule title="Standards & Compliance" description="Manage organizational and project-specific quality standards." type="grid" icon={BadgeCheck} />;
      case 'supplier':
        return <GenericEnterpriseModule title="Supplier Quality" description="Track incoming material inspections and supplier performance." type="grid" icon={Truck} />;
      default:
        return <QualityDashboard qualityProfile={qualityProfile} />;
    }
  };

  if (!project) return <div className={theme.layout.pagePadding}>Loading quality module...</div>;

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
      <div className={theme.layout.header}>
        <div>
          <h1 className={theme.typography.h1}><ShieldCheck className="text-nexus-600"/> Quality Management</h1>
          <p className={theme.typography.small}>Ensure project deliverables meet and exceed stakeholder expectations.</p>
        </div>
      </div>

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

export default QualityManagement;
