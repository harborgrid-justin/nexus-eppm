
import React from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { ShieldAlert, Plus } from 'lucide-react';
import { Badge } from '../ui/Badge';

const PortfolioRisks: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();

    const getScoreVariant = (score: number): 'danger' | 'warning' | 'success' => {
        if (score >= 15) return 'danger';
        if (score >= 8) return 'warning';
        return 'success';
    };

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6`}>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className={theme.typography.h2}>Portfolio Risk Register</h2>
                    <p className={theme.typography.small}>Identify and manage systemic risks that impact multiple components or strategic goals.</p>
                </div>
                 <button className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-nexus-700`}>
                    <Plus size={16} /> Add Portfolio Risk
                </button>
            </div>
            
            <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Risk ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Owner</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {state.portfolioRisks.map(risk => (
                            <tr key={risk.id} className="hover:bg-slate-50">
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
                                <td className="px-6 py-4 text-sm text-slate-600">{risk.owner}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PortfolioRisks;
