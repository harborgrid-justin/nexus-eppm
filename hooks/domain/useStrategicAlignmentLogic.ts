
import { useMemo } from 'react';
import { useData } from '../../context/DataContext';

export const useStrategicAlignmentLogic = () => {
    const { state } = useData();
    const boardData = useMemo(() => {
        const drivers = state.strategicGoals.length > 0 
            ? state.strategicGoals.map(d => d.name)
            : ['Innovation & Growth', 'Operational Efficiency', 'Regulatory & Compliance', 'Keep the Lights On'];
            
        const groups: Record<string, typeof state.projects> = {};
        drivers.forEach(d => groups[d] = []);
        state.projects.forEach(p => {
            const category = p.category || 'Keep the Lights On';
            const targetGroup = drivers.includes(category) ? category : drivers[drivers.length - 1];
            if (!groups[targetGroup]) groups[targetGroup] = [];
            groups[targetGroup].push(p);
        });

        return drivers.map(driver => ({
            id: driver, title: driver, projects: groups[driver] || [],
            totalBudget: (groups[driver] || []).reduce((sum, p) => sum + p.budget, 0)
        }));
    }, [state.projects, state.strategicGoals]);

    const totalPortfolioBudget = useMemo(() => state.projects.reduce((s, p) => s + p.budget, 0), [state.projects]);
    return { boardData, totalPortfolioBudget };
};
