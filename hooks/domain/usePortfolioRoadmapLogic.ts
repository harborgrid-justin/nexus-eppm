import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';

export const usePortfolioRoadmapLogic = () => {
    const { state, dispatch } = useData();
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

    // Ensure we have lanes even if no drivers are defined
    const lanes = useMemo(() => {
        if (state.strategicDrivers.length > 0) {
            return state.strategicDrivers.map(d => d.name);
        }
        return ['Innovation & Growth', 'Operational Efficiency', 'Regulatory & Compliance', 'Keep the Lights On'];
    }, [state.strategicDrivers]);

    const handleEditAlignment = (id: string) => {
        setSelectedProjectId(id);
        setIsEditPanelOpen(true);
    };

    const handleMoveDriver = (projectId: string, newDriverId: string) => {
        // NOTE: In a real app, ensure 'category' matches driver 'name' or 'id'. 
        // Here we update the project 'category' to move it between lanes visually.
        dispatch({
            type: 'PROJECT_UPDATE',
            payload: { projectId, updatedData: { category: newDriverId } }
        });
    };

    return {
        drivers: state.strategicDrivers,
        lanes,
        projects: state.projects,
        selectedProjectId,
        isEditPanelOpen,
        setIsEditPanelOpen,
        handleEditAlignment,
        handleMoveDriver,
        isEmpty: state.projects.length === 0
    };
};