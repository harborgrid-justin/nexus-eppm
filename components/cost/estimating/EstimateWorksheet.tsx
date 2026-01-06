import React from 'react';
import { CostEstimate, CostEstimateItem } from '../../../types/index';
import { Plus, Trash2, Book } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import { useTheme } from '../../../context/ThemeContext';
import { RESOURCE_TYPES } from '../../../constants/index';

interface EstimateWorksheetProps {
  estimate: CostEstimate;
  setEstimate: (e: CostEstimate) => void;
  onOpenLookup: () => void;
  onAddCustom: () => void;
  onUpdateItem: (id: string, field: keyof CostEstimateItem, value: any) => void;
  onDeleteItem: (id: string) => void;
}

export const EstimateWorksheet: React.FC<EstimateWorksheetProps> = ({ 
    estimate, setEstimate, onOpenLookup, onAddCustom, onUpdateItem, onDeleteItem 
}) => {
  const theme = useTheme();
  return (
    <div className={`${theme.components.card} overflow-hidden`}>
        <div className={`p-3 ${theme.colors.background} border-b ${theme.colors.border} flex justify-between items-center`}>
            <div className="flex gap-4">
                {['Deterministic', 'Three-Point'].map(method => (
                    <label key={method} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input 
                            type="radio" 
                            name="method" 
                            checked={estimate.method === method} 
                            onChange={() => setEstimate({...estimate, method: method as any})}
                        /> {method}
                    </label>
                ))}
            </div>
            <div className="flex gap-2">
                <button onClick={onOpenLookup} className="text-xs flex items-center gap-1 bg-nexus-50 border border-nexus-200 px-3 py-1.5 rounded hover:bg-nexus-100 text-nexus-700 font-bold">
                    <Book size={12}/> Lookup Item
                </button>
                <button onClick={onAddCustom} className="text-xs flex items-center gap-1 bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50 text-slate-700 font-medium">
                    <Plus size={12}/> Custom Item
                </button>
            </div>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
            <thead className={`${theme.colors.background}`}>
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase w-1/3">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Qty / UOM</th>
                    {estimate.method === 'Deterministic' ? (
                        <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">Unit Rate</th>
                    ) : (
                        <>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase text-green-600">Opt</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase text-blue-600">Likely</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase text-red-600">Pess</th>
                        </>
                    )}
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">Total</th>
                    <th className="px-4 py-3 w-10"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {estimate.items.map(item => (
                    <tr key={item.id} className={`hover:${theme.colors.background}`}>
                        <td className="px-4 py-2">
                            <input type="text" className="w-full bg-transparent border-b border-transparent focus:border-nexus-500 outline-none text-sm" value={item.description} onChange={e => onUpdateItem(item.id, 'description', e.target.value)} />
                        </td>
                        <td className="px-4 py-2">
                            <select className="w-full bg-transparent text-sm text-slate-600 outline-none" value={item.resourceType} onChange={e => onUpdateItem(item.id, 'resourceType', e.target.value)}>
                                {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </td>
                        <td className="px-4 py-2">
                            <div className="flex gap-2">
                                <input type="number" className="w-16 bg-transparent border border-slate-200 rounded px-1 text-sm text-right" value={item.quantity} onChange={e => onUpdateItem(item.id, 'quantity', parseFloat(e.target.value))} />
                                <input type="text" className="w-12 bg-transparent border-b border-transparent focus:border-nexus-500 outline-none text-sm text-center uppercase" value={item.uom} onChange={e => onUpdateItem(item.id, 'uom', e.target.value)} />
                            </div>
                        </td>
                        {estimate.method === 'Deterministic' ? (
                            <td className="px-4 py-2">
                                <input type="number" className="w-full bg-transparent border border-slate-200 rounded px-1 text-sm text-right" value={item.unitRate} onChange={e => onUpdateItem(item.id, 'unitRate', parseFloat(e.target.value))} />
                            </td>
                        ) : (
                            <>
                                <td className="px-4 py-2"><input type="number" className={`w-full ${theme.colors.semantic.success.bg} border-green-200 rounded px-1 text-sm text-right`} value={item.optimistic || 0} onChange={e => onUpdateItem(item.id, 'optimistic', parseFloat(e.target.value))} /></td>
                                <td className="px-4 py-2"><input type="number" className={`w-full ${theme.colors.semantic.info.bg} border-blue-200 rounded px-1 text-sm text-right`} value={item.mostLikely || 0} onChange={e => onUpdateItem(item.id, 'mostLikely', parseFloat(e.target.value))} /></td>
                                <td className="px-4 py-2"><input type="number" className={`w-full ${theme.colors.semantic.danger.bg} border-red-200 rounded px-1 text-sm text-right`} value={item.pessimistic || 0} onChange={e => onUpdateItem(item.id, 'pessimistic', parseFloat(e.target.value))} /></td>
                            </>
                        )}
                        <td className="px-4 py-2 text-right font-mono text-sm font-bold text-slate-800">{formatCurrency(item.total)}</td>
                        <td className="px-4 py-2 text-center">
                            <button onClick={() => onDeleteItem(item.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};
