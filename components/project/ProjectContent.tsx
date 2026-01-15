
import React, { lazy } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';

const ProjectIntegrationManagement = lazy(() => import('../integration/ProjectIntegrationManagement'));
const ProjectGantt = lazy(() => import('../ProjectGantt'));
const CostManagement = lazy(() => import('../cost/CostManagement'));
const ProjectRiskManager = lazy(() => import('../risk/ProjectRiskManager'));
const IssueLog = lazy(() => import('../IssueLog'));
const ScopeManagement = lazy(() => import('../ScopeManagement'));
const StakeholderManagement = lazy(() => import('../StakeholderManagement'));
const ProcurementManagement = lazy(() => import('../ProcurementManagement'));
const QualityManagement = lazy(() => import('../QualityManagement'));
const CommunicationsManagement = lazy(() => import('../CommunicationsManagement'));
const ResourceManagement = lazy(() => import('../ResourceManagement'));
const NetworkDiagram = lazy(() => import('../scheduling/NetworkDiagram'));
const DocumentControl = lazy(() => import('../DocumentControl'));
const BaselineManager = lazy(() => import('../scheduling/BaselineManager'));
const ScheduleHealthReport = lazy(() => import('../scheduling/ScheduleHealthReport'));
const FieldManagement = lazy(() => import('../FieldManagement'));

interface ProjectContentProps {
    activeArea: string;
    scheduleView: 'gantt' | 'network';
}

export const ProjectContent: React.FC<ProjectContentProps> = ({ activeArea, scheduleView }) => {
    const renderModule = () => {
        switch (activeArea) {
            case 'integration': return <ProjectIntegrationManagement />;
            case 'scope': return <ScopeManagement />;
            case 'schedule': return scheduleView === 'gantt' ? <ProjectGantt /> : <NetworkDiagram />;
            case 'cost': return <CostManagement />;
            case 'risk': return <ProjectRiskManager />;
            case 'issues': return <IssueLog />;
            case 'stakeholder': return <StakeholderManagement />;
            case 'procurement': return <ProcurementManagement />;
            case 'quality': return <QualityManagement />;
            case 'communications': return <CommunicationsManagement />;
            case 'resources': return <ResourceManagement />;
            case 'documents': return <DocumentControl />;
            case 'baseline': return <BaselineManager />;
            case 'health': return <ScheduleHealthReport />;
            case 'field': return <FieldManagement />;
            default: return <ProjectIntegrationManagement />;
        }
    };

    return (
        <ErrorBoundary name={`${activeArea.toUpperCase()} Partition`}>
            {renderModule()}
        </ErrorBoundary>
    );
};
