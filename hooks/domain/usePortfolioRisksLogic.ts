
import { useMemo } from 'react';
import { useData } from '../../context/DataContext';

export const usePortfolioRisksLogic = () => {
    const { state } = useData();

    const allRisks = useMemo(() => {
        // 1. Portfolio Risks (Native)
        const portfolioLevel = state.portfolioRisks.map(r => ({
            ...r,
            sourceType: 'Portfolio',
            sourceId: 'Global'
        }));

        // 2. Escalated Project Risks
        const escalated = state.risks
            .filter(r => r.isEscalated)
            .map(r => {
                const project = state.projects.find(p => p.id === r.projectId);
                return {
                    id: r.id,
                    description: r.description,
                    category: r.category,
                    score: r.score,
                    status: r.status,
                    ownerId: r.ownerId,
                    mitigationPlan: r.mitigationPlan || 'Review required',
                    sourceType: 'Project',
                    sourceId: project ? project.code : r.projectId
                };
            });

        return [...portfolioLevel, ...escalated].sort((a,b) => b.score - a.score);
    }, [state.portfolioRisks, state.risks, state.projects]);

    const isEmpty = allRisks.length === 0;

    return {
        allRisks,
        isEmpty
    };
};
