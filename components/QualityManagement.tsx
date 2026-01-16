
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import QualityDashboard from './quality/QualityDashboard';
import QualityPlanEditor from './quality/QualityPlanEditor';
import QualityControlLog from './quality/QualityControlLog';
import DefectTracking from './quality/DefectTracking';
import { QualityStandards } from './quality/QualityStandards';
import SupplierQuality from './quality/SupplierQuality';
import CostOfQuality from './quality/CostOfQuality'; 
import { useQualityManagementLogic } from '../hooks/domain/useQualityManagementLogic';
import { ModuleNavigation } from './common/ModuleNavigation';
import { EmptyGrid } from './common/EmptyGrid';

const QualityManagement: React.FC = () => {
  const { project, qualityReports } = useProjectWorkspace();
  const projectId = project?.id;
  
  const {
      activeGroup,
      activeView,
      isPending,
      navGroups,
      handleGroupChange,
      handleViewChange
  } = useQualityManagementLogic();
  
  if (!project) return <EmptyGrid title="Context Missing" description="No project selected" icon={ShieldCheck} />;

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
    <div className="flex flex-col h-full bg-white">
        <div className="flex-shrink-0 border-b border-slate-100">
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
            {renderContent()}
        </div>
    </div>
  );
};

export default QualityManagement;
