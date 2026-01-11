import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';

interface PrioritizedItem {
    id: string;
    name: string;
    type: 'Project' | 'Program';
    category: string;
    score: number;
    budget: number;
    cumulativeBudget: number;
    isFunded: boolean;
}

export const usePortfolioPrioritizationLogic = () => {
    const { state } = useData();
    
    // Core Logic: Derived Priority Score
    // Score = SUM(AlignmentValue * DriverWeight)
    const calculateDynamicScore = (item: any) => {
        const drivers = state.strategicDrivers || [];
        if (drivers.length === 0) return item.calculatedPriorityScore || 50;

        // Use global weights from governance or default to equal distribution
        const weights = state.governance.strategicWeights || {};
        
        let score = 0;
        drivers.forEach(driver => {
            const weight = weights[driver.id] || (1 / drivers.length);
            // Project alignment score (1-10) or fallback
            const alignment = item.driverAlignments?.[driver.id] || 5;
            score += (alignment * weight);
        });

        // Scale to 0-100
        return Math.round(score * 10);
    };

    const rawItems = useMemo(() => {
        const projects = state.projects.map(p => ({ 
            ...p, 
            type: 'Project' as const,
            dynamicScore: calculateDynamicScore(p)
        }));
        const programs = state.programs.map(p => ({ 
            ...p, 
            type: 'Program' as const,
            dynamicScore: calculateDynamicScore(p)
        }));
        return [...projects, ...programs];
    }, [state.projects, state.programs, state.strategicDrivers, state.governance.strategicWeights]);

    const sortedItems = useMemo(() => {
        return [...rawItems].sort((a, b) => b.dynamicScore - a.dynamicScore);
    }, [rawItems]);

    const totalPortfolioValue = useMemo(() => 
        sortedItems.reduce((sum, item) => sum + item.budget, 0), 
    [sortedItems]);

    const [fundingLimit, setFundingLimit] = useState(totalPortfolioValue * 0.8);

    const prioritizedItems: PrioritizedItem[] = useMemo(() => {
        let runningTotal = 0;
        return sortedItems.map(item => {
            runningTotal += item.budget;
            return {
                id: item.id,
                name: item.name,
                type: item.type,
                category: item.category || 'Unassigned',
                score: item.dynamicScore,
                budget: item.budget,
                cumulativeBudget: runningTotal,
                isFunded: runningTotal <= fundingLimit
            };
        });
    }, [sortedItems, fundingLimit]);

    return {
        prioritizedItems,
        totalPortfolioValue,
        fundingLimit,
        setFundingLimit,
        isEmpty: prioritizedItems.length === 0
    };
};