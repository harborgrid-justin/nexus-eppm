import React, { useState } from 'react';
import { useProjectState } from '../../hooks';
import { AlertTriangle, LayoutDashboard, FileText, List, Columns, BarChart2, Sigma } from 'lucide-react';
import ErrorBoundary from '../ErrorBoundary';
import RiskDashboard from './RiskDashboard';
import RiskPlanEditor from './RiskPlanEditor';
import RiskRegisterGrid from './RiskRegisterGrid';
import RiskBreakdownStructure from './RiskBreakdownStructure';
import RiskMatrix from './RiskMatrix';
import QuantitativeAnalysis from './QuantitativeAnalysis';

interface RiskManagementProps {
  projectId: string;
}

const RiskManagement: React.FC<RiskManagementProps> = ({ projectId }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const { project } = useProjectState(projectId);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'plan', label: 'Plan', icon: FileText },
    { id: 'register', label: 'Register', icon: List },
    { id: 'rbs', label: 'RBS', icon: Columns },
    { id: 'matrix', label: 'P-I Matrix', icon: Sigma },
    { id: 'quantitative', label: 'Quantitative', icon: BarChart2 },
  ];
  
  const renderContent = () => {
    if (!project) {
        return <div className="p-6 text-slate-500">Loading project data...</div>;
    }

    switch(activeView) {
      case 'dashboard': return <RiskDashboard projectId={projectId} />;
      case 'plan': return <RiskPlanEditor projectId={projectId} />;
      case 'register': return <RiskRegisterGrid projectId={projectId} />;
      case 'rbs': return <RiskBreakdownStructure projectId={projectId} />;
      case 'matrix': return <RiskMatrix projectId={projectId} />;
      case 'quantitative': return <QuantitativeAnalysis projectId={projectId} />;
      default: return <RiskDashboard projectId={projectId} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full overflow-hidden flex flex-col p-6">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><AlertTriangle className="text-red-500"/> Risk Management</h1>
          <p className="text-slate-500">Identify, analyze, and respond to project uncertainty.</p>
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

export default RiskManagement;