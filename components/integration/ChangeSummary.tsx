
import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { FileText, CheckCircle, Clock } from 'lucide-react';

interface ChangeSummaryProps {
    approvedCOAmount: number;
    pendingCOAmount: number;
}

export const ChangeSummary: React.FC<ChangeSummaryProps> = ({ approvedCOAmount, pendingCOAmount }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
           <div className="px-6 py-5 border-b bg-slate-50/50">
             <h3 className="font-bold flex items-center gap-2"><FileText size={18} /> Change Summary</h3>
           </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg"><CheckCircle size={18}/></div>
                    <span className="font-bold text-sm">Approved Changes</span>
                 </div>
                 <span className="font-mono font-black">{formatCurrency(approvedCOAmount)}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg"><Clock size={18}/></div>
                    <span className="font-bold text-sm">Pending Approval</span>
                 </div>
                 <span className="font-mono font-black">{formatCurrency(pendingCOAmount)}</span>
              </div>
            </div>
        </div>
    );
};
