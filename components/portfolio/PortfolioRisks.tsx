
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { ShieldAlert, Plus, ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const PortfolioRisks: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();

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

    const getScoreVariant = (score: number): 'danger' | 'warning' | 'success' => {
        if (score >= 15) return 'danger';
        if (score >= 8) return 'warning';
        return 'success';
    };

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className={theme.typography.h2}>Portfolio Risk Register</h2>
                    <p className={theme.typography.small}>Systemic risks and escalated project threats.</p>
                </div>
                 <Button variant="primary" icon={Plus}>Add Portfolio Risk</Button>
            </div>
            
            <div className={`${theme.components.card} overflow-hidden`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Source</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Risk ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Owner</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {allRisks.map(risk => (
                                <tr key={risk.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        {risk.sourceType === 'Project' ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold border border-red-200">
                                                <ArrowUpRight size={10} /> {risk.sourceId}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-200">
                                                Portfolio
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm text-slate-500">{risk.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{risk.description}</div>
                                        <div className="text-xs text-slate-500 mt-1">Mitigation: {risk.mitigationPlan}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{risk.category}</td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge variant={getScoreVariant(risk.score)}>{risk.score}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{risk.status}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{risk.ownerId}</td>
                                </tr>
                            ))}
                            {allRisks.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-400 italic">No active risks found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PortfolioRisks;
