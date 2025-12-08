import React, { useState } from 'react';
import { useProjectState } from '../hooks/useProjectState';
import { 
  Briefcase, Sliders, GanttChartSquare, DollarSign, AlertTriangle, Users,
  MessageCircle, ShoppingCart, ShieldCheck, Zap, FileText, CheckCircle
} from 'lucide-react';

import ProjectGantt from './ProjectGantt';
import CostManagement from './CostManagement';
import RiskRegister from './RiskRegister';
import ScopeManagement from './ScopeManagement';
import StakeholderManagement from './StakeholderManagement';
import ProcurementManagement from './ProcurementManagement';
import GenericEnterpriseModule from './GenericEnterpriseModule';

interface ProjectWorkspaceProps {
  projectId: string;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ projectId }) => {
  const { project } = useProjectState(projectId);
  const [activeArea, setActiveArea] = useState('schedule');

  const knowledgeAreas = [
    { id: 'integration', label: 'Integration', icon: Briefcase },
    { id: 'scope', label: 'Scope', icon: Sliders },
    { id: 'schedule', label: 'Schedule', icon: GanttChartSquare },
    { id: 'cost', label: 'Cost', icon: DollarSign },
    { id: 'quality', label: 'Quality', icon: ShieldCheck },
    { id: 'resources', label: 'Resources', icon: Users },
    { id: 'communications', label: 'Communications', icon: MessageCircle },
    { id: 'risk', label: 'Risk', icon: AlertTriangle },
    { id: 'procurement', label: 'Procurement', icon: ShoppingCart },
    { id: 'stakeholder', label: 'Stakeholder', icon: Users },
  ];

  const renderContent = () => {
    switch (activeArea) {
      case 'scope':
        return <ScopeManagement projectId={projectId} />;
      case 'schedule':
        return <ProjectGantt project={project!} />;
      case 'cost':
        return <CostManagement projectId={projectId} />;
      case 'risk':
        return <RiskRegister projectId={projectId} />;
      case 'stakeholder':
        return <StakeholderManagement projectId={projectId} />;
      case 'procurement':
        return <ProcurementManagement projectId={projectId} />;
      case 'quality':
         return <GenericEnterpriseModule title="Quality Management" description="Manage ITPs, non-conformance reports, and quality audits." type="grid" icon={CheckCircle} />;
      case 'communications':
         return <GenericEnterpriseModule title="Communications Log" description="Track all formal project communications and stakeholder touchpoints." type="grid" icon={MessageCircle} />;
      case 'resources':
         return <GenericEnterpriseModule title="Resource Management" description="This is a placeholder for project-specific resource assignments." type="grid" icon={Users} />;
      default:
        return <GenericEnterpriseModule title={activeArea} description="This is a placeholder for a PMI Knowledge Area module." type="dashboard" icon={Briefcase} />;
    }
  };

  if (!project) {
    return <div>Loading Project Workspace...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col animate-in fade-in duration-300">
      {/* Knowledge Area Navigation */}
      <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50 overflow-x-auto scrollbar-hide">
        <nav className="flex space-x-2 px-4">
          {knowledgeAreas.map(area => (
            <button
              key={area.id}
              onClick={() => setActiveArea(area.id)}
              className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeArea === area.id
                  ? 'border-nexus-600 text-nexus-600'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              <area.icon size={16} />
              <span>{area.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden p-0">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProjectWorkspace;