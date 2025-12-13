
import React, { useState, useMemo } from 'react';
import { ShieldCheck, LayoutDashboard, FileText, BadgeCheck, ClipboardList, Bug, Truck, Coins } from 'lucide-react';
import { useQualityData } from '../hooks';
import ErrorBoundary from './ErrorBoundary';
import QualityDashboard from './quality/QualityDashboard';
import QualityPlanEditor from './quality/QualityPlanEditor';
import QualityControlLog from './quality/QualityControlLog';
import DefectTracking from './quality/DefectTracking';
import QualityStandards from './quality/QualityStandards';
import SupplierQuality from './quality/SupplierQuality';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/formatters';

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
      { id: 'coq', label: 'Cost of Quality', icon: Coins },
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

  const renderCoQ = () => (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 h-full">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Coins className="text-yellow-600"/> Cost of Quality (CoQ)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-bold text-green-800 mb-4 border-b border-green-200 pb-2">Cost of Good Quality</h3>
                  <div className="space-y-4">
                      <div className="flex justify-between">
                          <span className="text-sm text-green-700">Prevention Costs (Training, Planning)</span>
                          <span className="font-mono font-bold">{formatCurrency(project?.costOfQuality?.preventionCosts || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-sm text-green-700">Appraisal Costs (Testing, Inspections)</span>
                          <span className="font-mono font-bold">{formatCurrency(project?.costOfQuality?.appraisalCosts || 0)}</span>
                      </div>
                  </div>
              </div>
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-bold text-red-800 mb-4 border-b border-red-200 pb-2">Cost of Poor Quality</h3>
                  <div className="space-y-4">
                      <div className="flex justify-between">
                          <span className="text-sm text-red-700">Internal Failure (Rework, Scrap)</span>
                          <span className="font-mono font-bold">{formatCurrency(project?.costOfQuality?.internalFailureCosts || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-sm text-red-700">External Failure (Warranty, Returns)</span>
                          <span className="font-mono font-bold">{formatCurrency(project?.costOfQuality?.externalFailureCosts || 0)}</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <QualityDashboard projectId={projectId} />;
      case 'plan':
        return <QualityPlanEditor projectId={projectId} />;
      case 'control':
        return <QualityControlLog qualityReports={qualityReports} />;
      case 'defects':
        return <DefectTracking projectId={projectId} />;
      case 'standards':
        return <QualityStandards />;
      case 'supplier':
        return <SupplierQuality />;
      case 'coq':
        return renderCoQ();
      default:
        return <QualityDashboard projectId={projectId} />;
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
