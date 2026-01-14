import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ShieldAlert, Plus, ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { usePortfolioRisksLogic } from '../../hooks/domain/usePortfolioRisksLogic';
import { EmptyGrid } from '../common/EmptyGrid';
import { PortfolioRiskForm } from './PortfolioRiskForm';

const PortfolioRisks: React.FC = () => {
    const theme = useTheme();
    const { allRisks, isEmpty } = usePortfolioRisksLogic();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const getScoreVariant = (score: number): 'danger' | 'warning' | 'success' => {
        if (score >= 15) return 'danger';
        if (score >= 8) return 'warning';
        return 'success';
    };

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300 scrollbar-thin`}>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className={theme.typography.h2}>Portfolio Risk Management</h2>
                    <p className={theme.typography.small}>Aggregated systemic threats and project-level escalations.</p>
                </div>
                 <Button variant="primary" icon={Plus} onClick={() => setIsFormOpen(true)}>Identify Systemic Risk</Button>
            </div>
            
            <div className={`flex-1 flex flex-col overflow-hidden`}>
                {!isEmpty ? (
                    <div className={`${theme.colors.surface} rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm`}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                                <thead className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10 shadow-sm border-b">
                                    <tr>
                                        <th className={theme.components.table.header + " py-6 px-8"}>Source Artifact</th>
                                        <th className={theme.components.table.header}>Identity</th>
                                        <th className={theme.components.table.header}>Risk Narrative</th>
                                        <th className={theme.components.table.header}>RBS Domain</th>
                                        <th className={theme.components.table.header + " text-center"}>Heat</th>
                                        <th className={theme.components.table.header}>Lifecycle</th>
                                        <th className={theme.components.table.header}>Responsible</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 bg-white">
                                    {allRisks.map(risk => (
                                        <tr key={risk.id} className="nexus-table-row transition-all hover:bg-slate-50/50 group">
                                            <td className="px-8 py-4">
                                                {risk.sourceType === 'Project' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-[10px] font-black uppercase rounded-lg border border-red-100 shadow-sm">
                                                        <ArrowUpRight size={10} className="animate-pulse"/> {risk.sourceId}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-nexus-50 text-nexus-700 text-[10px] font-black uppercase rounded-lg border border-nexus-100 shadow-sm">
                                                        Portfolio
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-[11px] font-black text-slate-400 group-hover:text-nexus-600 transition-colors">{risk.id}</td>
                                            <td className="px-6 py-4">
                                                <div className={`font-black text-sm text-slate-800 uppercase tracking-tight line-clamp-1`} title={risk.description}>{risk.description}</div>
                                                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">Mtg: {risk.mitigationPlan}</div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{risk.category}</td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant={getScoreVariant(risk.score)}>{risk.score}</Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                 <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border shadow-inner ${theme.colors.background} ${theme.colors.border}`}>{risk.status}</span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-600">{risk.ownerId}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex h-full">
                        <EmptyGrid 
                            title="Risk Portfolio Neutral" 
                            description="No systemic threats or project-level escalations currently active in the organizational registry." 
                            icon={ShieldAlert}
                            actionLabel="Identify Systemic Threat"
                            onAdd={() => setIsFormOpen(true)}
                        />
                    </div>
                )}
            </div>
            <PortfolioRiskForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
        </div>
    );
};

export default PortfolioRisks;