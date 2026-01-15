
import React from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { ShieldAlert, Plus } from 'lucide-react';
import { ErrorBoundary } from '../ErrorBoundary';
import { useProjectRiskManagerLogic } from '../../hooks/domain/useProjectRiskManagerLogic';
import { Button } from '../ui/Button';
import { TabbedLayout } from '../layout/standard/TabbedLayout';

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
    <TabbedLayout
        title="Project Risk Management"
        subtitle={`Enterprise risk governance for ${project.code}: ${project.name}`}
        icon={ShieldAlert}
        actions={<Button variant="primary" icon={Plus} size="md">Identify New Risk</Button>}
        navGroups={navGroups}
        activeGroup={activeGroup}
        activeItem={activeView}
        onGroupChange={handleGroupChange}
        onItemChange={handleItemChange}
    >
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
          <ErrorBoundary name="Project Risk">
            {renderContent()}
          </ErrorBoundary>
        </div>
    </TabbedLayout>
  );
};

export default ProjectRiskManager;
