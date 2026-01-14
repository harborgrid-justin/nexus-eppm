
import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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
    const theme = useTheme();

    return (
        <div className={`${theme.colors.surface} rounded-2xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
           <div className={`px-6 py-5 border-b ${theme.colors.border} ${theme.colors.background}/50`}>
             <h3 className={`font-bold ${theme.colors.text.primary} flex items-center gap-2`}><FileText size={18} /> Change Summary</h3>
           </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm transition-all hover:border-emerald-200">
                 <div className="flex items-center gap-3">
                    <div className={`p-2 ${theme.colors.surface} rounded-lg text-emerald-600 shadow-sm`}><CheckCircle size={18}/></div>
                    <span className="font-bold text-emerald-900 text-sm">Approved Changes</span>
                 </div>
                 <span className="font-mono font-black text-emerald-700">{formatCurrency(approvedCOAmount)}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100 shadow-sm transition-all hover:border-amber-200">
                 <div className="flex items-center gap-3">
                    <div className={`p-2 ${theme.colors.surface} rounded-lg text-amber-600 shadow-sm`}><Clock size={18}/></div>
                    <span className="font-bold text-amber-900 text-sm">Pending Approval</span>
                 </div>
                 <span className="font-mono font-black text-amber-700">{formatCurrency(pendingCOAmount)}</span>
              </div>
              
              {(boardMeetingInfo || exposureInfo) ? (
                  <div className={`mt-2 text-xs ${theme.colors.text.secondary} leading-relaxed italic text-center px-4`}>
                      "{boardMeetingInfo} {exposureInfo}"
                  </div>
              ) : (
                  <div className={`mt-2 h-10 nexus-empty-pattern rounded-lg border ${theme.colors.border} flex items-center justify-center`}>
                      <span className={`text-[10px] ${theme.colors.text.tertiary} font-bold uppercase tracking-widest italic`}>Governance Stream Pending</span>
                  </div>
              )}
            </div>
        </div>
    );
};
