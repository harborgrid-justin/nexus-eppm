import { useState, useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { getDaysDiff } from '../../utils/dateUtils';

interface HistogramData {
    range: string;
    frequency: number;
    cumulative: number;
    rawRange: number;
}

interface SimulationResult {
    p50: number;
    p80: number;
    p90: number;
    minVal: number;
    maxVal: number;
    data: HistogramData[];
    deterministic: number;
}

export const useQuantitativeAnalysisLogic = () => {
    const { project, risks } = useProjectWorkspace();
    const [iterations, setIterations] = useState(1000);
    const [isSimulating, setIsSimulating] = useState(false);
    const [results, setResults] = useState<SimulationResult | null>(null);

    const pertRandom = (min: number, likely: number, max: number) => {
        const u = Math.random();
        const f = (likely - min) / (max - min);
        if (u <= f) {
            return min + Math.sqrt(u * (max - min) * (likely - min));
        } else {
            return max - Math.sqrt((1 - u) * (max - min) * (max - likely));
        }
    };

    const runSimulation = () => {
        if (!project) return;
        setIsSimulating(true);

        setTimeout(() => {
            const simResults = [];
            const baseDuration = getDaysDiff(project.startDate, project.endDate);
            
            const criticalTasks = project.tasks.filter(t => t.critical || t.duration > 15);

            for (let i = 0; i < iterations; i++) {
                let iterationDuration = 0;
                
                // 1. Aleatory Uncertainty (Task Variance)
                criticalTasks.forEach(task => {
                    const opt = task.duration * 0.9;
                    const likely = task.duration;
                    const pess = task.duration * 1.25;
                    iterationDuration += pertRandom(opt, likely, pess);
                });

                // 2. Epistemic Uncertainty (Discrete Risk Events)
                risks.filter(r => r.status === 'Open').forEach(risk => {
                    const trigger = Math.random();
                    const probThreshold = risk.probability === 'High' ? 0.7 : risk.probability === 'Medium' ? 0.4 : 0.1;
                    
                    if (trigger < probThreshold) {
                        iterationDuration += (risk.score * 0.5); 
                    }
                });

                simResults.push(Math.round(iterationDuration));
            }

            simResults.sort((a, b) => a - b);

            const p50 = simResults[Math.floor(simResults.length * 0.50)];
            const p80 = simResults[Math.floor(simResults.length * 0.80)];
            const p90 = simResults[Math.floor(simResults.length * 0.90)];

            const minVal = simResults[0];
            const maxVal = simResults[simResults.length - 1];
            const bucketCount = 20;
            const bucketSize = (maxVal - minVal) / bucketCount;
            
            const histogramData: HistogramData[] = [];
            let cumulativeCount = 0;

            for (let b = 0; b < bucketCount; b++) {
                const start = minVal + (b * bucketSize);
                const end = start + bucketSize;
                const count = simResults.filter(r => r >= start && r < end).length;
                cumulativeCount += count;
                
                histogramData.push({
                    range: `${Math.round(start)}d`,
                    frequency: count,
                    cumulative: (cumulativeCount / iterations) * 100,
                    rawRange: start
                });
            }

            setResults({
                p50, p80, p90,
                minVal, maxVal,
                data: histogramData,
                deterministic: baseDuration
            });
            setIsSimulating(false);
        }, 500);
    };

    return {
        project,
        iterations,
        setIterations,
        isSimulating,
        results,
        runSimulation
    };
};