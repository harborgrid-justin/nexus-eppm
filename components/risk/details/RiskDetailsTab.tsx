
import React from 'react';
import { Risk } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { AlertTriangle, DollarSign } from 'lucide-react';

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
          className="w-full p-3 border border-slate-300 rounded-lg text-sm h-24 focus:ring-2 focus:ring-nexus-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${theme.components.card} p-4`}>
           <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
             <AlertTriangle size={16} className="text-orange-500"/> Qualitative Analysis
           </h4>
           <div className="space-y-4">
             <div>
               <label className="text-xs font-bold text-slate-500">Probability (1-5)</label>
               <input 
                 type="range" min="1" max="5" 
                 value={risk.probabilityValue} 
                 onChange={(e) => setRisk({ ...risk, probabilityValue: parseInt(e.target.value) })}
                 disabled={isReadOnly}
                 className="w-full"
               />
               <div className="text-center font-bold">{risk.probabilityValue}</div>
             </div>
             <div>
               <label className="text-xs font-bold text-slate-500">Impact (1-5)</label>
               <input 
                 type="range" min="1" max="5" 
                 value={risk.impactValue} 
                 onChange={(e) => setRisk({ ...risk, impactValue: parseInt(e.target.value) })}
                 disabled={isReadOnly}
                 className="w-full"
               />
               <div className="text-center font-bold">{risk.impactValue}</div>
             </div>
           </div>
        </div>

        <div className={`${theme.components.card} p-4`}>
           <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
             <DollarSign size={16} className="text-green-600"/> Financial Impact
           </h4>
           <div>
             <label className="text-xs font-bold text-slate-500">Potential Cost ($)</label>
             <input 
                type="number"
                value={risk.financialImpact}
                onChange={(e) => setRisk({ ...risk, financialImpact: parseFloat(e.target.value) })}
                disabled={isReadOnly}
                className="w-full p-2 border border-slate-300 rounded-md font-mono text-sm mt-1"
             />
           </div>
           <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-100">
              <span className="text-xs text-slate-500">Expected Monetary Value (EMV):</span>
              <div className="text-lg font-bold text-slate-900">${((risk.emv || 0)).toLocaleString()}</div>
           </div>
        </div>
      </div>
    </div>
  );
};
