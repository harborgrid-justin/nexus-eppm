
import React from 'react';
import { Risk } from '../../../types/index';
import { useTheme } from '../../../context/ThemeContext';
import { AlertTriangle, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

interface RiskDetailsTabProps {
  risk: Risk;
  setRisk: (risk: Risk) => void;
  isReadOnly: boolean;
  projectId: string;
}

export const RiskDetailsTab: React.FC<RiskDetailsTabProps> = ({ risk, setRisk, isReadOnly }) => {
  const theme = useTheme();

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <label className={theme.typography.label}>Description</label>
        <textarea
          disabled={isReadOnly}
          value={risk.description}
          onChange={(e) => setRisk({ ...risk, description: e.target.value })}
          className={`w-full p-3 border ${theme.colors.border} rounded-lg text-sm h-24 focus:ring-2 focus:ring-nexus-500 outline-none resize-none bg-slate-50 focus:bg-white transition-all`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${theme.components.card} p-6 border-slate-200`}>
           <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
             <AlertTriangle size={16} className="text-orange-500"/> Qualitative Analysis
           </h4>
           <div className="space-y-6">
             <div>
               <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Probability</label>
                    <span className="font-bold text-slate-900">{risk.probabilityValue || 1}</span>
               </div>
               <input 
                 type="range" min="1" max="5" 
                 value={risk.probabilityValue || 1} 
                 onChange={(e) => setRisk({ ...risk, probabilityValue: parseInt(e.target.value) })}
                 disabled={isReadOnly}
                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
               />
             </div>
             <div>
               <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Impact</label>
                    <span className="font-bold text-slate-900">{risk.impactValue || 1}</span>
               </div>
               <input 
                 type="range" min="1" max="5" 
                 value={risk.impactValue || 1} 
                 onChange={(e) => setRisk({ ...risk, impactValue: parseInt(e.target.value) })}
                 disabled={isReadOnly}
                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
               />
             </div>
           </div>
        </div>

        <div className={`${theme.components.card} p-6 border-slate-200`}>
           <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
             <DollarSign size={16} className="text-green-600"/> Financial Impact
           </h4>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Potential Cost ($)</label>
             <input 
                type="number"
                value={risk.financialImpact}
                onChange={(e) => setRisk({ ...risk, financialImpact: parseFloat(e.target.value) })}
                disabled={isReadOnly}
                className={`w-full p-2 border ${theme.colors.border} rounded-md font-mono text-sm font-bold bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-nexus-500`}
             />
           </div>
           <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Expected Monetary Value (EMV)</span>
              <div className="text-lg font-black text-slate-900 font-mono">{formatCurrency(risk.emv || 0)}</div>
           </div>
        </div>
      </div>
    </div>
  );
};
