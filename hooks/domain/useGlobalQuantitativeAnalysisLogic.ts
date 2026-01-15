import { useState, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { formatCompactCurrency } from '../../utils/formatters';

export const useGlobalQuantitativeAnalysisLogic = () => {
    const { state } = useData();
    const [isSimulating, setIsSimulating] = useState(false);
    const [result, setResult] = useState<any>(null);

    const runPortfolioSimulation = useCallback(() => {
        setIsSimulating(true);
        setTimeout(() => {
            const iterations = 1000;
            const portfolioBudget = state.projects.reduce((sum, p) => sum + p.budget, 0);
            const simResults = [];

            for(let i=0; i<iterations; i++) {
                let iterationCost = 0;
                state.projects.forEach(p => {
                    // Base cost + random risk variance
                    // Higher risk score = higher potential variance
                    const riskFactor = 1 + (Math.random() * (p.riskScore / 100)); // e.g. score 20 => 0-20% variance
                    iterationCost += p.budget * riskFactor;
                });
                simResults.push(iterationCost);
            }

            simResults.sort((a,b) => a - b);
            const p50 = simResults[Math.floor(iterations * 0.50)];
            const p80 = simResults[Math.floor(iterations * 0.80)];
            const maxCost = simResults[iterations - 1];
            
            // Histogram
            const min = simResults[0];
            const range = maxCost - min;
            const buckets = 20;
            const bucketSize = range / buckets;
            const histogramData = [];
            let cumulative = 0;

            for(let b=0; b<buckets; b++) {
                const start = min + (b * bucketSize);
                const end = start + bucketSize;
                const count = simResults.filter(r => r >= start && r < end).length;
                cumulative += count;
                histogramData.push({
                    range: formatCompactCurrency(start),
                    count,
                    cumulative: (cumulative / iterations) * 100,
                    rawVal: start
                });
            }

            setResult({
                deterministic: portfolioBudget,
                p50,
                p80,
                contingency: p80 - portfolioBudget,
                data: histogramData
            });
            setIsSimulating(false);
        }, 800);
    }, [state.projects]);

    return {
        isSimulating,
        result,
        runPortfolioSimulation
    };
};