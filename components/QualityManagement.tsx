
import React from 'react';
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
    activeView,
    qualityProfile,
    qualityReports,
    setActiveView,
    navItems,
  } = useQualityData(projectId);
  const theme = useTheme();

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
        <div className={`flex-shrink-0 ${theme.layout.headerBorder} ${theme.colors.background}`}>
          <nav className="flex space-x-2 px-4 overflow-x-auto scrollbar-hide">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeView === item.id
                    ? `${theme.colors.border.replace('slate-200', 'nexus-600')} text-nexus-600`
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
                style={{ borderColor: activeView === item.id ? '#0284c7' : 'transparent' }}
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
