
import React from 'react';
import { BudgetLineItem, PurchaseOrder } from '../../../types';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { formatCurrency } from '../../../utils/formatters';
import { Info, Search, Database } from 'lucide-react';

interface BudgetDetailPanelProps {
    item: (BudgetLineItem & { remaining: number }) | null | undefined;
    linkedPOs: PurchaseOrder[];
    onClose: () => void;
}

export const BudgetDetailPanel: React.FC<BudgetDetailPanelProps> = ({ item, linkedPOs, onClose }) => {
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
                     <div className="bg-slate-50 p-5 rounded-2xl"><span className="text-[10px] font-bold">Authorization</span><div className="text-2xl font-black font-mono">{formatCurrency(item.planned)}</div></div>
                     <div className="bg-slate-50 p-5 rounded-2xl"><span className="text-[10px] font-bold">Available</span><div className={`text-2xl font-black font-mono ${item.remaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}>{formatCurrency(item.remaining)}</div></div>
                 </div>
                 <div>
                     <h4 className="font-bold text-sm uppercase mb-4"><Info size={16} className="inline mr-2"/> Commitment Ledger</h4>
                     {linkedPOs.length > 0 ? (
                         <div className="bg-white border rounded-2xl overflow-hidden"><table className="min-w-full divide-y">
                             <thead className="bg-slate-50"><tr><th className="px-4 py-3 text-left text-[10px]">PO Ref</th><th className="px-4 py-3 text-left text-[10px]">Entity</th><th className="px-4 py-3 text-right text-[10px]">Commitment</th></tr></thead>
                             <tbody className="divide-y">{linkedPOs.map(po => (<tr key={po.id}><td className="px-4 py-3 text-xs font-mono">{po.number}</td><td className="px-4 py-3 text-xs">{po.vendorId}</td><td className="px-4 py-3 text-sm text-right font-black font-mono">{formatCurrency(po.amount)}</td></tr>))}</tbody>
                         </table></div>
                     ) : <div className="text-xs italic p-6 bg-slate-50 rounded-2xl">No active commitments.</div>}
                 </div>
                 <div>
                     <h4 className="font-bold text-sm uppercase mb-4"><Search size={16} className="inline mr-2"/> ERP Transaction Stream</h4>
                     <div className="text-xs p-10 bg-slate-900 rounded-2xl text-center"><Database size={40} className="mx-auto mb-4 text-slate-700"/><p className="font-bold text-slate-400">ERP Integration Offline</p></div>
                 </div>
              </div>
        </SidePanel>
    );
};
