import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { calculateProjectData } from '../utils/projectSelectors';
import { ProjectWorkspaceData } from '../context/ProjectWorkspaceContext';

export const useProjectState = (projectId: string | null): ProjectWorkspaceData | null => {
    const { state } = useData();

    const projectData = useMemo(() => {
        if (!projectId) return null;
        const project = state.projects.find(p => p.id === projectId);
        if (!project) return null;
        // This function aggregates all necessary data for a project view
        return calculateProjectData(project, state);
    }, [projectId, state]);

    return projectData;
};
