
// ... existing imports
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { DollarSign, Globe, RefreshCw, Plus, TrendingUp, Info, Edit2, Trash2, Save, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatters';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const CurrencyRegistry: React.FC = () => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    const { exchangeRates, inflationRate } = state.governance;

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingCurrency, setEditingCurrency] = useState<{ code: string; rate: number } | null>(null);

    const handleSync = () => {
        // In real app, this dispatches a thunk to fetch from API. 
        // Here we simulate by just ensuring the button doesn't block.
        // Or we could dispatch a dummy action to log 'Rate Sync Requested'.
    };

    const handleOpenPanel = (code?: string, rate?: number) => {
        setEditingCurrency(code ? { code, rate: rate || 1.0 } : { code: '', rate: 1.0 });
        setIsPanelOpen(true);
    };

    const handleSave = () => {
        if (!editingCurrency?.code || editingCurrency.rate <= 0) return;
        dispatch({
            type: state.governance.exchangeRates[editingCurrency.code] ? 'GOVERNANCE_UPDATE_CURRENCY' : 'GOVERNANCE_ADD_CURRENCY',
            payload: editingCurrency
        });
        setIsPanelOpen(false);
    };

    const handleDelete = (code: string) => {
        if (code === 'USD') {
            alert("Base currency USD cannot be deleted.");
            return;
        }
        if (confirm(`Remove currency ${code}? All existing values will be converted using the last known rate.`)) {
            dispatch({ type: 'GOVERNANCE_DELETE_CURRENCY', payload: code });
        }
    };

    // ... rest of component
    return (
        <div className="h-full flex flex-col space-y-6 md:space-y-8 max-w-4xl mx-auto w-full">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 p-4 rounded-xl border ${theme.colors.border} shadow-sm gap-4`}>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Globe size={20} className="text-blue-500"/> Multi-Currency Registry
                    </h3>
                    <p className="text-sm text-slate-500">Corporate standardized exchange rates and fiscal parameters.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={handleSync} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm">
                        <RefreshCw size={16} /> 
                        Sync Rates
                    </button>
                    <Button size="sm" icon={Plus} onClick={() => handleOpenPanel()} className="flex-1 sm:flex-none">Add Currency</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${theme.components.card} p-6`}>
                    <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <TrendingUp size={16} className="text-green-600"/> Annual Inflation Rate
                    </h4>
                    <div className="flex items-center gap-4">
                        <input 
                            type="number" 
                            className="text-2xl font-black text-slate-900 w-24 border-b-2 border-slate-200 focus:border-nexus-600 outline-none"
                            value={(inflationRate * 100).toFixed(1)}
                            onChange={(e) => dispatch({ type: 'GOVERNANCE_UPDATE_INFLATION_RATE', payload: parseFloat(e.target.value)/100 })}
                        />
                        <span className="text-2xl font-bold text-slate-400">%</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Applied to long-range cost forecasting (EAC) models.</p>
                </div>

                <div className={`${theme.colors.semantic.info.bg} p-6 rounded-xl shadow-lg relative overflow-hidden border ${theme.colors.semantic.info.border}`}>
                    <div className="relative z-10">
                        <h4 className={`font-bold mb-4 flex items-center gap-2 ${theme.colors.semantic.info.text}`}><Info size={16}/> Reporting Standard</h4>
                        <p className={`text-xs ${theme.colors.semantic.info.text} uppercase tracking-widest font-bold`}>Consolidation Currency</p>
                        <p className={`text-3xl font-black mt-1 ${theme.colors.semantic.info.text}`}>USD - US Dollar</p>
                        <p className={`text-xs ${theme.colors.semantic.info.text} mt-4`}>All portfolios are reconciled into USD for executive reporting.</p>
                    </div>
                    <Globe className={`absolute -right-12 -bottom-12 ${theme.colors.semantic.info.text} opacity-10`} size={200}/>
                </div>
            </div>

            <div className={`${theme.components.card} overflow-hidden flex-1`}>
                <div className={`p-4 border-b ${theme.colors.border} bg-slate-50`}>
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest text-[10px]">Exchange Rate Matrix</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase whitespace-nowrap">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase whitespace-nowrap">Currency Name</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase whitespace-nowrap">Rate (to 1 USD)</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {Object.entries(exchangeRates).map(([code, rate]) => (
                                <tr key={code} className="hover:bg-slate-50 group">
                                    <td className="px-6 py-4 font-mono font-bold text-sm text-slate-900">{code}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {code === 'EUR' ? 'Euro' : code === 'GBP' ? 'British Pound' : code === 'USD' ? 'US Dollar' : 'Foreign Currency'}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono font-bold text-nexus-700">
                                        {(rate as number).toFixed(4)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenPanel(code, rate as number)} className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><Edit2 size={14}/></button>
                                            <button onClick={() => handleDelete(code)} className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 size={14}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingCurrency?.code ? "Edit Currency Rate" : "Add New Currency"}
                width="md:w-[450px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} icon={Save}>Commit Rate</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-slate-500 mb-1 uppercase tracking-widest">Currency Code (ISO)</label>
                        <Input 
                            value={editingCurrency?.code} 
                            onChange={e => setEditingCurrency(prev => prev ? ({...prev, code: e.target.value.toUpperCase()}) : null)} 
                            placeholder="e.g. AUD, CAD, JPY"
                            disabled={!!state.governance.exchangeRates[editingCurrency?.code || '']}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-500 mb-1 uppercase tracking-widest">Exchange Rate (vs 1.00 USD)</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                className="w-full pl-4 p-2.5 border border-slate-300 rounded-lg text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-nexus-500"
                                value={editingCurrency?.rate}
                                onChange={e => setEditingCurrency(prev => prev ? ({...prev, rate: parseFloat(e.target.value)}) : null)}
                                step="0.0001"
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 items-start">
                        <Info size={18} className="text-amber-600 mt-0.5 shrink-0"/>
                        <p className="text-[10px] text-amber-900 leading-relaxed font-bold uppercase tracking-tight">
                            Note: Updating the rate will immediately trigger a recalculation of all Project/Program financial summaries that use this currency for consolidation.
                        </p>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default CurrencyRegistry;
