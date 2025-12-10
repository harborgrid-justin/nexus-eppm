import React from 'react';
import { ShieldCheck, LayoutDashboard, FileText, BadgeCheck, ClipboardList, Bug, Truck } from 'lucide-react';
import { useQualityData } from '../hooks';
import ErrorBoundary from './ErrorBoundary';
import QualityDashboard from './quality/QualityDashboard';
import QualityPlanEditor from './quality/QualityPlanEditor';
import QualityControlLog from './quality/QualityControlLog';
import DefectTracking from './quality/DefectTracking';
import GenericEnterpriseModule from './GenericEnterpriseModule';

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

  if (!project) return <div>Loading quality module...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full overflow-hidden flex flex-col p-6">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><ShieldCheck className="text-nexus-600"/> Quality Management</h1>
          <p className="text-slate-500">Ensure project deliverables meet and exceed stakeholder expectations.</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50">
          <nav className="flex space-x-2 px-4 overflow-x-auto scrollbar-hide">
            {navItems.map(item => (
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