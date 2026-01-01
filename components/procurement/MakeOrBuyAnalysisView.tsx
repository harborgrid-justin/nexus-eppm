
import React from 'react';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/formatters';
import { Scale } from 'lucide-react';

interface MakeOrBuyAnalysisViewProps {
  projectId: string;
}

export const MakeOrBuyAnalysisView: React.FC<MakeOrBuyAnalysisViewProps> = ({ projectId }) => {
    const { state } = useData();
    const analysisItems = state.makeOrBuyAnalysis.filter(i => i.projectId === projectId);

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border h-full overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Scale /> Make-or-Buy Analysis</h2>
            <table className="min-w-full divide-y text-sm">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="px-4 py-2 text-left">Item</th>
                        <th className="px-4 py-2 text-right">Make Cost</th>
                        <th className="px-4 py-2 text-right">Buy Cost</th>
                        <th className="px-4 py-2 text-left">Rationale</th>
                        <th className="px-4 py-2 text-left">Decision</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {analysisItems.map(item => (
                        <tr key={item.id}>
                            <td className="px-4 py-3 font-medium">{item.item}</td>
                            <td className="px-4 py-3 text-right font-mono">{formatCurrency(item.makeCost)}</td>
                            <td className="px-4 py-3 text-right font-mono">{formatCurrency(item.buyCost)}</td>
                            <td className="px-4 py-3">{item.rationale}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-bold ${item.decision === 'Buy' ? 'bg-blue-100' : 'bg-green-100'}`}>{item.decision}</span></td>
                        </tr>
                    ))}
                    {!analysisItems.length && <tr><td colSpan={5} className="p-4 text-center">No analysis items.</td></tr>}
                </tbody>
            </table>
        </div>
    );
};
