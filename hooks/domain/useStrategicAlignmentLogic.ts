
import { useMemo } from 'react';
import { useData } from '../../context/DataContext';

export const useStrategicAlignmentLogic = () => {
    const { state } = useData();

    // Group projects by category (Strategic Driver)
    const boardData = useMemo(() => {
        const drivers = ['Innovation & Growth', 'Operational Efficiency', 'Regulatory & Compliance', 'Keep the Lights On'];
        const groups: Record<string, typeof state.projects> = {};
        
        drivers.forEach(d => groups[d] = []);
        
        state.projects.forEach(p => {
            const category = p.category || 'Keep the Lights On';
            if (!groups[category]) groups[category] = [];
            groups[category].push(p);
        });

        return drivers.map(driver => ({
            id: driver,
            title: driver,
            projects: groups[driver] || [],
            totalBudget: (groups[driver] || []).reduce((sum, p) => sum + p.budget, 0)
        }));
    }, [state.projects]);

    const totalPortfolioBudget = useMemo(() => 
        state.projects.reduce((s, p) => s + p.budget, 0)
    , [state.projects]);

    return {
        boardData,
        totalPortfolioBudget
    };
};
