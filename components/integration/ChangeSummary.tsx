import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { FileText, CheckCircle, Clock } from 'lucide-react';

interface ChangeSummaryProps {
    approvedCOAmount: number;
    pendingCOAmount: number;
    boardMeetingInfo?: string;
    exposureInfo?: string;
}

export const ChangeSummary: React.FC<ChangeSummaryProps> = ({ 
    approvedCOAmount, 
    pendingCOAmount,
    boardMeetingInfo,
    exposureInfo
}) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
           <div className="px-6 py-5 border-b bg-slate-50/50">
             <h3 className="font-bold flex items-center gap-2"><FileText size={18} /> Change Summary</h3>
           </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm transition-all hover:border-emerald-200">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm"><CheckCircle size={18}/></div>
                    <span className="font-bold text-emerald-900 text-sm">Approved Changes</span>
                 </div>
                 <span className="font-mono font-black text-emerald-700">{formatCurrency(approvedCOAmount)}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100 shadow-sm transition-all hover:border-amber-200">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-amber-600 shadow-sm"><Clock size={18}/></div>
                    <span className="font-bold text-amber-900 text-sm">Pending Approval</span>
                 </div>
                 <span className="font-mono font-black text-amber-700">{formatCurrency(pendingCOAmount)}</span>
              </div>
              
              {/* FIX: Replaced hardcoded flavor text with dynamic props. If data is absent, a generic placeholder is shown. */}
              {(boardMeetingInfo || exposureInfo) ? (
                  <div className="mt-2 text-xs text-slate-500 leading-relaxed italic text-center px-4">
                      "{boardMeetingInfo} {exposureInfo}"
                  </div>
              ) : (
                  <div className="mt-2 h-10 nexus-empty-pattern rounded-lg border border-slate-100 flex items-center justify-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Governance Stream Pending</span>
                  </div>
              )}
            </div>
        </div>
    );
};
