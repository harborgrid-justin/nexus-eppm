import React, { useState } from 'react';
import { useProjectState } from '../hooks/useProjectState';
import { AlertTriangle, LayoutDashboard, FileText, List, Columns, BarChart2, Sigma } from 'lucide-react';
import RiskDashboard from './risk/RiskDashboard';
import RiskPlanEditor from './risk/RiskPlanEditor';
import RiskRegisterGrid from './risk/RiskRegisterGrid';
import RiskBreakdownStructure from './risk/RiskBreakdownStructure';
import RiskMatrix from './risk/RiskMatrix';
import QuantitativeAnalysis from './risk/QuantitativeAnalysis';

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

  if (!project) return <div>Loading risk module...</div>;

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
          <nav className="flex space-x-2 px-4">
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
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default RiskManagement;