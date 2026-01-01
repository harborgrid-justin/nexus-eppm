
import React from 'react';
import { Check, X, Clock } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { formatCompactCurrency } from '../../../utils/formatters';

interface DecisionWorkbenchProps {
    projects: any[];
    decisions: Record<string, string>;
    onDecision: (decisions: Record<string, string>) => void;
}

export const DecisionWorkbench: React.FC<DecisionWorkbenchProps> = ({ projects, decisions, onDecision }) => {
    const theme = useTheme();

    const handleDecision = (id: string, decision: string) => {
        onDecision({ ...decisions, [id]: decision });
    };

    return (
        <div className={`${theme.components.card} overflow-hidden`}>
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700">Optimization Workbench</div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Project</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Budget</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">CPI</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Rec. Action</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Decision</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {projects.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                                <td className="px-6 py-4 text-right font-mono text-slate-600">{formatCompactCurrency(p.budget)}</td>
                                <td className={`px-6 py-4 text-center font-bold ${parseFloat(p.cpi) < 0.9 ? 'text-red-500' : 'text-green-500'}`}>{p.cpi}</td>
                                <td className="px-6 py-4 text-center text-xs font-medium text-slate-500">
                                    {parseFloat(p.cpi) < 0.9 ? 'Descope' : 'Maintain'}
                                </td>
                                <td className="px-6 py-4 flex justify-center gap-2">
                                    <button 
                                        onClick={() => handleDecision(p.id, 'Approve')}
                                        className={`p-1.5 rounded ${decisions[p.id] === 'Approve' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400 hover:text-green-600'}`}
                                    >
                                        <Check size={16}/>
                                    </button>
                                    <button 
                                        onClick={() => handleDecision(p.id, 'Hold')}
                                        className={`p-1.5 rounded ${decisions[p.id] === 'Hold' ? 'bg-yellow-500 text-white' : 'bg-slate-100 text-slate-400 hover:text-yellow-600'}`}
                                    >
                                        <Clock size={16}/>
                                    </button>
                                    <button 
                                        onClick={() => handleDecision(p.id, 'Reject')}
                                        className={`p-1.5 rounded ${decisions[p.id] === 'Reject' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400 hover:text-red-600'}`}
                                    >
                                        <X size={16}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
