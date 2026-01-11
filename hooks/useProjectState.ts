import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { calculateProjectData } from '../utils/projectSelectors';
import { ProjectWorkspaceData } from '../context/ProjectWorkspaceContext';

export const useProjectState = (projectId: string | null): ProjectWorkspaceData | null => {
    const { state } = useData();

    // Strategy: Index based memoization to prevent heavy recalculations on unrelated state updates
    const projectData = useMemo(() => {
        if (!projectId) return null;
        const project = state.projects.find(p => p.id === projectId);
        if (!project) return null;

        return calculateProjectData(project, state);
    }, [projectId, state]);

    return projectData;
};