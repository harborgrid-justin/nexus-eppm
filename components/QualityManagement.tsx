
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
import { useQualityManagementLogic } from '../hooks/domain/useQualityManagementLogic';
import { TabbedLayout } from './layout/standard/TabbedLayout';

const QualityManagement: React.FC = () => {
  const { project, qualityReports } = useProjectWorkspace();
  const projectId = project.id;
  
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
    <TabbedLayout
        title="Quality Management"
        subtitle="Ensure project deliverables meet standards and requirements."
        icon={ShieldCheck}
        navGroups={navGroups}
        activeGroup={activeGroup}
        activeItem={activeView}
        onGroupChange={handleGroupChange}
        onItemChange={handleViewChange}
    >
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <ErrorBoundary name="Quality Module">
                {renderContent()}
            </ErrorBoundary>
        </div>
    </TabbedLayout>
  );
};

export default QualityManagement;
