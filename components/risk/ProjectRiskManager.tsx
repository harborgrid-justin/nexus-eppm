
import React from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { ShieldAlert } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { PageHeader } from '../common/PageHeader';
import { ModuleNavigation } from '../common/ModuleNavigation';
import { ErrorBoundary } from '../ErrorBoundary';
import { useProjectRiskManagerLogic } from '../../hooks/domain/useProjectRiskManagerLogic';

// Sub-components
import RiskDashboard from './RiskDashboard';
import { RiskRegisterGrid } from './RiskRegisterGrid';
import RiskMatrix from './RiskMatrix';
import QuantitativeAnalysis from './QuantitativeAnalysis';
import RiskPlanEditor from './RiskPlanEditor';
import RiskBreakdownStructure from './RiskBreakdownStructure';

const ProjectRiskManager: React.FC = () => {
  const { project } = useProjectWorkspace();
  const theme = useTheme();
  
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
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="Project Risk Management" 
        subtitle={`Risk governance for ${project.name} (${project.code})`}
        icon={ShieldAlert}
      />

      <div className={theme.layout.panelContainer}>
        <div className={`flex-shrink-0 z-10 rounded-t-xl overflow-hidden ${theme.layout.headerBorder} bg-slate-50/50`}>
            <ModuleNavigation 
                groups={navGroups}
                activeGroup={activeGroup}
                activeItem={activeView}
                onGroupChange={handleGroupChange}
                onItemChange={handleItemChange}
                className="bg-transparent border-0 shadow-none"
            />
        </div>
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
          <ErrorBoundary name="Project Risk">
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default ProjectRiskManager;
