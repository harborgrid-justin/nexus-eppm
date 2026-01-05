
import React from 'react';
import { ShieldCheck } from 'lucide-react';
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
import { ModuleNavigation } from './common/ModuleNavigation';
import { useQualityManagementLogic } from '../hooks/domain/useQualityManagementLogic';

const QualityManagement: React.FC = () => {
  const { project, qualityReports } = useProjectWorkspace();
  const projectId = project.id;
  const theme = useTheme();
  
  const {
      activeGroup,
      activeView,
      isPending,
      navGroups,
      handleGroupChange,
      handleViewChange
  } = useQualityManagementLogic();
  
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

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="Quality Management"
        subtitle="Ensure project deliverables meet standards and requirements."
        icon={ShieldCheck}
      />

      <div className={theme.layout.panelContainer}>
        <div className={`flex-shrink-0 z-10 rounded-t-xl overflow-hidden ${theme.layout.headerBorder} bg-slate-50/50`}>
            <ModuleNavigation 
                groups={navGroups}
                activeGroup={activeGroup}
                activeItem={activeView}
                onGroupChange={handleGroupChange}
                onItemChange={handleViewChange}
                className="bg-transparent border-0 shadow-none"
            />
        </div>
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <ErrorBoundary name="Quality Module">
                {renderContent()}
            </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default QualityManagement;