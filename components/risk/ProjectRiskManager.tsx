
import React from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { ShieldAlert, Plus } from 'lucide-react';
import { useProjectRiskManagerLogic } from '../../hooks/domain/useProjectRiskManagerLogic';
import { Button } from '../ui/Button';
import { ModuleNavigation } from '../common/ModuleNavigation';
import { EmptyGrid } from '../common/EmptyGrid';

// Sub-components
import RiskDashboard from './RiskDashboard';
import { RiskRegisterGrid } from './RiskRegisterGrid';
import RiskMatrix from './RiskMatrix';
import QuantitativeAnalysis from './QuantitativeAnalysis';
import RiskPlanEditor from './RiskPlanEditor';
import RiskBreakdownStructure from './RiskBreakdownStructure';

const ProjectRiskManager: React.FC = () => {
  const { project } = useProjectWorkspace();
  
  const {
      activeGroup,
      activeView,
      isPending,
      navGroups,
      handleGroupChange,
      handleItemChange
  } = useProjectRiskManagerLogic();

  if (!project) return <EmptyGrid title="Context Missing" description="No project selected" icon={ShieldAlert} />;

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <RiskDashboard />;
      case 'register': return <RiskRegisterGrid />;
      case 'matrix': return <RiskMatrix />;
      case 'plan': return <RiskPlanEditor />;
      case 'rbs': return <RiskBreakdownStructure projectId={project.id} />;
      case 'quantitative': return <QuantitativeAnalysis />;
      default: return <RiskDashboard />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
        <div className="flex-shrink-0 border-b border-slate-100 flex items-center justify-between pr-4 bg-slate-50/50">
             <div className="flex-1">
                 <ModuleNavigation 
                    groups={navGroups}
                    activeGroup={activeGroup}
                    activeItem={activeView}
                    onGroupChange={handleGroupChange}
                    onItemChange={handleItemChange}
                    className="bg-transparent border-0 shadow-none"
                 />
             </div>
             {/* Context Action Button injected into header */}
             <Button variant="primary" icon={Plus} size="sm" className="shadow-sm">Identify Risk</Button>
        </div>
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            {renderContent()}
        </div>
    </div>
  );
};

export default ProjectRiskManager;
