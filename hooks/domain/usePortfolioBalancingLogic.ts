import { useState, useMemo, useDeferredValue } from 'react';
import { useData } from '../../context/DataContext';

export const usePortfolioBalancingLogic = () => {
    const { state } = useData();
    
    // Initial weights configuration
    const [weights, setWeights] = useState({ financial: 0.5, strategic: 0.3, risk: 0.2 });
    const deferredWeights = useDeferredValue(weights);
    
    const [budgetConstraint, setBudgetConstraint] = useState(50000000);

    const portfolioData = useMemo(() => {
        const components = [...state.projects, ...state.programs];
        
        return components.map(item => {
            // Inverse risk: Higher risk score lowers the overall value in this model
            // Scale: Risk 0-25. 25 reduces value to 0. 0 keeps value at 100%.
            const riskFactor = Math.max(0, 1 - (item.riskScore / 25)); 
            
            // Weighted Value Calculation
            const rawValue = (item.financialValue * deferredWeights.financial) + 
                           (item.strategicImportance * deferredWeights.strategic);
            
            return {
                id: item.id, 
                name: item.name, 
                risk: item.riskScore,
                // Normalized Value Score (0-100)
                value: Math.round(rawValue * riskFactor * 100), 
                budget: item.budget, 
                category: item.category || 'Unassigned',
            };
        }).sort((a, b) => b.value - a.value); // Sort descending by value for frontier calc
    }, [state.projects, state.programs, deferredWeights]);

    const isEmpty = portfolioData.length === 0;

    return {
        portfolioData,
        weights,
        setWeights,
        budgetConstraint,
        setBudgetConstraint,
        isEmpty
    };
};