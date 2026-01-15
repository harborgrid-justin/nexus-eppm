
import React from 'react';
import { CostEstimate, CostEstimateItem } from '../../../types/index';
import { Plus, Trash2, Book, Calculator, Zap } from 'lucide-react';
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
    <div className={`${theme.components.card} overflow-hidden flex flex-col h-full bg-white shadow-xl rounded-[2.5rem] border-slate-200`}>
        <div className={`p-6 ${theme.colors.background} border-b ${theme.colors.border} flex flex-col md:flex-row justify-between items-center gap-6 shadow-inner`}>
            <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                {['Deterministic', 'Three-Point'].map(method => (
                    <button 
                        key={method} 
                        onClick={() => setEstimate({...estimate, method: method as any})}
                        className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${estimate.method === method ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {method} Model
                    </button>
                ))}
            </div>
            <div className="flex gap-3">
                <button onClick={onOpenLookup} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-nexus-50 border border-nexus-200 px-6 py-2.5 rounded-xl hover:bg-nexus-100 text-nexus-700 transition-all shadow-sm active:scale-95">
                    <Book size={14}/> Catalog Lookup
                </button>
                <button onClick={onAddCustom} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-white border border-slate-200 px-6 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-all shadow-sm active:scale-95`}>
                    <Plus size={14}/> Custom Entry
                </button>
            </div>
        </div>
        <div className="flex-1 overflow-auto bg-white scrollbar-thin">
            <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                <thead className={`${theme.colors.background} sticky top-0 z-20 shadow-sm`}>
                    <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Narrative Description</th>
                        <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Category</th>
                        <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Qty / UOM</th>
                        {estimate.method === 'Deterministic' ? (
                            <th className="px-4 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Std Unit Rate</th>
                        ) : (
                            <>
                                <th className="px-4 py-4 text-right text-[10px] font-black text-green-600 uppercase tracking-[0.2em] border-b border-slate-100 bg-green-50/30">Opt</th>
                                <th className="px-4 py-4 text-right text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-slate-100 bg-blue-50/30">ML</th>
                                <th className="px-4 py-4 text-right text-[10px] font-black text-red-600 uppercase tracking-[0.2em] border-b border-slate-100 bg-red-50/30">Pess</th>
                            </>
                        )}
                        <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Fiscal Total</th>
                        <th className="px-4 py-4 w-12 border-b border-slate-100"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                    {estimate.items.map(item => (
                        <tr key={item.id} className={`hover:${theme.colors.background}/50 transition-colors group`}>
                            <td className="px-6 py-4">
                                <input type="text" className="w-full bg-transparent font-bold text-sm text-slate-800 outline-none border-b border-transparent focus:border-nexus-500 transition-colors" value={item.description} onChange={e => onUpdateItem(item.id, 'description', e.target.value)} />
                            </td>
                            <td className="px-4 py-4">
                                <select className="bg-slate-50 border border-slate-100 rounded-lg py-1 px-2 text-[10px] font-black uppercase text-slate-500 outline-none focus:ring-4 focus:ring-nexus-500/5 transition-all" value={item.resourceType} onChange={e => onUpdateItem(item.id, 'resourceType', e.target.value)}>
                                    {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </td>
                            <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                    <input type="number" className="w-16 bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-mono font-bold text-right focus:ring-4 focus:ring-nexus-500/5 outline-none" value={item.quantity} onChange={e => onUpdateItem(item.id, 'quantity', parseFloat(e.target.value))} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter w-8">{item.uom}</span>
                                </div>
                            </td>
                            {estimate.method === 'Deterministic' ? (
                                <td className="px-4 py-4">
                                    <input type="number" className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-mono font-bold text-right focus:ring-4 focus:ring-nexus-500/5 outline-none" value={item.unitRate} onChange={e => onUpdateItem(item.id, 'unitRate', parseFloat(e.target.value))} />
                                </td>
                            ) : (
                                <>
                                    <td className="px-4 py-4"><input type="number" className={`w-full bg-green-50/50 border border-green-100 rounded-lg p-1.5 text-xs font-mono font-bold text-right text-green-700`} value={item.optimistic || 0} onChange={e => onUpdateItem(item.id, 'optimistic', parseFloat(e.target.value))} /></td>
                                    <td className="px-4 py-4"><input type="number" className={`w-full bg-blue-50/50 border border-blue-100 rounded-lg p-1.5 text-xs font-mono font-bold text-right text-blue-700`} value={item.mostLikely || 0} onChange={e => onUpdateItem(item.id, 'mostLikely', parseFloat(e.target.value))} /></td>
                                    <td className="px-4 py-4"><input type="number" className={`w-full bg-red-50/50 border border-red-100 rounded-lg p-1.5 text-xs font-mono font-bold text-right text-red-700`} value={item.pessimistic || 0} onChange={e => onUpdateItem(item.id, 'pessimistic', parseFloat(e.target.value))} /></td>
                                </>
                            )}
                            <td className="px-6 py-4 text-right font-mono text-sm font-black text-slate-900">{formatCurrency(item.total)}</td>
                            <td className="px-4 py-4 text-center">
                                <button onClick={() => onDeleteItem(item.id)} className="text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 active:scale-90"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    ))}
                    {/* Visual spacer rows */}
                    {[...Array(5)].map((_, i) => (
                        <tr key={`row-${i}`} className="nexus-empty-pattern opacity-10 h-12">
                            <td colSpan={10}></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className={`p-4 ${theme.colors.background} border-t ${theme.colors.border} flex justify-between items-center px-10`}>
             <div className="flex gap-8">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Computation</span>
                    <span className="text-lg font-black text-slate-900 font-mono">{formatCurrency(estimate.baseCost)}</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reserve Load</span>
                    <span className="text-lg font-black text-blue-600 font-mono">+{estimate.contingencyPercent}%</span>
                 </div>
             </div>
             <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center gap-4 px-6 shadow-2xl border border-white/5">
                 <Calculator size={20} className="text-nexus-400"/>
                 <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Validated Total</p>
                    <p className="text-xl font-black font-mono tracking-tight text-white">{formatCurrency(estimate.totalCost)}</p>
                 </div>
             </div>
        </div>
    </div>
  );
};
