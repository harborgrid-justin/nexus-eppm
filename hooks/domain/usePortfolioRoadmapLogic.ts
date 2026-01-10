import { useState, useMemo, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { generateId } from '../../utils/formatters';
import { StrategicDriver, ProgramDependency } from '../../types';

export const usePortfolioRoadmapLogic = () => {
    const { state, dispatch } = useData();
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [isDependencyModalOpen, setIsDependencyModalOpen] = useState(false);

    // Dynamic lanes derived from state. If empty, we provide the requested "Market Expansion", etc as starters
    const lanes = useMemo(() => {
        if (state.strategicDrivers && state.strategicDrivers.length > 0) {
            return state.strategicDrivers.map(d => d.name);
        }
        return ['Market Expansion', 'Operational Efficiency', 'Innovation'];
    }, [state.strategicDrivers]);

    const handleEditAlignment = (id: string) => {
        setSelectedProjectId(id);
        setIsEditPanelOpen(true);
    };

    const handleMoveDriver = (projectId: string, newDriverId: string) => {
        dispatch({
            type: 'PROJECT_UPDATE',
            payload: { projectId, updatedData: { category: newDriverId } }
        });
    };

    const handleAddDriver = useCallback((name: string) => {
        const newDriver: StrategicDriver = {
            id: generateId('SD'),
            name,
            description: `Strategy pillar: ${name}`
        };
        dispatch({ type: 'ADD_STRATEGIC_DRIVER', payload: newDriver });
    }, [dispatch]);

    const handleAddDependency = useCallback((dep: Partial<ProgramDependency>) => {
        const newDep: ProgramDependency = {
            id: generateId('DEP'),
            sourceProjectId: dep.sourceProjectId || '',
            targetProjectId: dep.targetProjectId || '',
            description: dep.description || 'Systemic link',
            type: dep.type || 'Technical',
            status: dep.status || 'Active'
        };
        dispatch({ type: 'ADD_PROGRAM_DEPENDENCY', payload: newDep });
        setIsDependencyModalOpen(false);
    }, [dispatch]);

    const handleQuickAlign = (laneName: string) => {
        // If driver doesn't exist in state, create it
        if (!state.strategicDrivers.find(d => d.name === laneName)) {
            handleAddDriver(laneName);
        }
        // Then open project selector to assign to this lane
        // (UI implementation would follow)
        alert(`Initializing workflow to align project to ${laneName}`);
    };

    return {
        drivers: state.strategicDrivers,
        lanes,
        projects: state.projects,
        selectedProjectId,
        isEditPanelOpen,
        setIsEditPanelOpen,
        isDependencyModalOpen,
        setIsDependencyModalOpen,
        handleEditAlignment,
        handleMoveDriver,
        handleAddDriver,
        handleQuickAlign,
        handleAddDependency,
        isEmpty: state.projects.length === 0
    };
};