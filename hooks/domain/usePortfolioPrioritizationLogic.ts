import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Project, Program } from '../../types/index';

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
    
    // Combine Projects and Programs into a single rankable list
    const rawItems = useMemo(() => {
        const projects = state.projects.map(p => ({ ...p, type: 'Project' as const }));
        const programs = state.programs.map(p => ({ ...p, type: 'Program' as const }));
        return [...projects, ...programs];
    }, [state.projects, state.programs]);

    // Sort by priority score descending
    const sortedItems = useMemo(() => {
        return [...rawItems].sort((a, b) => b.calculatedPriorityScore - a.calculatedPriorityScore);
    }, [rawItems]);

    const totalPortfolioValue = useMemo(() => 
        sortedItems.reduce((sum, item) => sum + item.budget, 0), 
    [sortedItems]);

    const [fundingLimit, setFundingLimit] = useState(totalPortfolioValue * 0.8);

    // Calculate cumulative budget and funding status
    const prioritizedItems: PrioritizedItem[] = useMemo(() => {
        let runningTotal = 0;
        return sortedItems.map(item => {
            runningTotal += item.budget;
            return {
                id: item.id,
                name: item.name,
                type: item.type,
                category: item.category || 'Unassigned',
                score: item.calculatedPriorityScore,
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