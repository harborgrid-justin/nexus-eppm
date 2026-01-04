
import React from 'react';
import { BudgetLineItem, PurchaseOrder } from '../../../types';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { formatCurrency } from '../../../utils/formatters';
import { Info, Search, Database, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useData } from '../../../context/DataContext';

interface BudgetDetailPanelProps {
    item: (BudgetLineItem & { remaining: number }) | null | undefined;
    linkedPOs: PurchaseOrder[];
    onClose: () => void;
}

export const BudgetDetailPanel: React.FC<BudgetDetailPanelProps> = ({ item, linkedPOs, onClose }) => {
    const { state } = useData();
    // Simulate finding transactions related to this budget code
    // In a real app, this would filter by Cost Code
    const erpTransactions = state.extensionData.erpTransactions;
    
    if (!item) return null;

    return (
        <SidePanel
            isOpen={!!item}
            onClose={onClose}
            title={`CBS Analysis: ${item.category}`}
            width="md:w-[600px]"
            footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
        >
            <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
                 <div className="grid grid-cols-2 gap-6">
                     <div className="bg-slate-50 p-5 rounded-2xl"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Authorization</span><div className="text-2xl font-black font-mono text-slate-900">{formatCurrency(item.planned)}</div></div>
                     <div className="bg-slate-50 p-5 rounded-2xl"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Available</span><div className={`text-2xl font-black font-mono ${item.remaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}>{formatCurrency(item.remaining)}</div></div>
                 </div>
                 
                 <div>
                     <h4 className="font-bold text-sm uppercase mb-4 flex items-center gap-2 text-slate-700"><Info size={16}/> Commitment Ledger</h4>
                     {linkedPOs.length > 0 ? (
                         <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                             <table className="min-w-full divide-y divide-slate-100">
                                 <thead className="bg-slate-50"><tr><th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">PO Ref</th><th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Entity</th><th className="px-4 py-3 text-right text-[10px] font-bold text-slate-500 uppercase">Commitment</th></tr></thead>
                                 <tbody className="divide-y divide-slate-100">{linkedPOs.map(po => (<tr key={po.id}><td className="px-4 py-3 text-xs font-mono text-slate-600">{po.number}</td><td className="px-4 py-3 text-xs text-slate-700">{po.vendorId}</td><td className="px-4 py-3 text-sm text-right font-black font-mono text-slate-900">{formatCurrency(po.amount)}</td></tr>))}</tbody>
                             </table>
                         </div>
                     ) : <div className="text-xs italic p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-400">No active commitments found for this cost code.</div>}
                 </div>

                 <div>
                     <h4 className="font-bold text-sm uppercase mb-4 flex items-center gap-2 text-slate-700"><Search size={16}/> ERP Transaction Stream</h4>
                     {erpTransactions && erpTransactions.length > 0 ? (
                         <div className="space-y-3">
                             {erpTransactions.map(tx => (
                                 <div key={tx.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-nexus-300 transition-colors">
                                     <div className="flex items-center gap-3">
                                         {tx.status === 'Success' ? <CheckCircle size={16} className="text-green-500"/> : tx.status === 'Failed' ? <XCircle size={16} className="text-red-500"/> : <Clock size={16} className="text-yellow-500"/>}
                                         <div>
                                             <p className="text-xs font-bold text-slate-800">{tx.type}</p>
                                             <p className="text-[10px] text-slate-500 font-mono">{tx.id}</p>
                                         </div>
                                     </div>
                                     <div className="text-right">
                                         <p className="text-xs font-mono font-bold text-slate-900">{typeof tx.amount === 'number' ? formatCurrency(tx.amount) : tx.amount}</p>
                                         <p className="text-[10px] text-slate-500">{tx.response}</p>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     ) : (
                         <div className="text-xs p-10 bg-slate-900 rounded-2xl text-center"><Database size={40} className="mx-auto mb-4 text-slate-700"/><p className="font-bold text-slate-400">ERP Integration Offline</p></div>
                     )}
                 </div>
              </div>
        </SidePanel>
    );
};
