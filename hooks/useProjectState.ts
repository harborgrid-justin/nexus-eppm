
import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { calculateProjectData } from '../utils/projectSelectors';
import { ProjectWorkspaceData } from '../context/ProjectWorkspaceContext';

export const useProjectState = (projectId: string | null): ProjectWorkspaceData | null => {
    const { state } = useData();

    // Comprehensive dependency array ensures UI refreshes on any related record change
    const projectData = useMemo(() => {
        if (!projectId) return null;
        const project = state.projects.find(p => p.id === projectId);
        if (!project) return null;

        return calculateProjectData(project, state);
    }, [
        projectId, 
        state.projects, 
        state.risks, 
        state.budgetItems, 
        state.expenses, 
        state.changeOrders, 
        state.purchaseOrders, 
        state.qualityReports, 
        state.nonConformanceReports, 
        state.communicationLogs, 
        state.resources, 
        state.stakeholders,
        state.activityCodes,
        state.userDefinedFields
    ]);

    return projectData;
};
