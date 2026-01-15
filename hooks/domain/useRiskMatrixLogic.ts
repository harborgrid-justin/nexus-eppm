import { useMemo, useState } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { Risk } from '../../types';

export const useRiskMatrixLogic = () => {
    const { risks } = useProjectWorkspace();
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);

    const matrixData = useMemo(() => {
        if (!risks) return {};
        const map: Record<string, Risk[]> = {};
        risks.forEach(r => {
            const key = `${r.probabilityValue}-${r.impactValue}`;
            if (!map[key]) map[key] = [];
            map[key].push(r);
        });
        return map;
    }, [risks]);

    const handleRiskClick = (riskId: string) => {
        // Placeholder for future detail view opening
        console.log("Selected risk:", riskId);
    };

    return {
        matrixData,
        hoveredCell,
        setHoveredCell,
        handleRiskClick
    };
};