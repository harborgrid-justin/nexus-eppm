
import React from 'react';
import { Risk } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';

interface RiskMatrixViewProps {
  risks: Risk[];
  onSelectRisk: (id: string) => void;
}

export const RiskMatrixView: React.FC<RiskMatrixViewProps> = ({ risks, onSelectRisk }) => {
  const theme = useTheme();
  return (
    <div className={`h-full p-6 overflow-auto flex flex-col items-center ${theme.colors.background}`}>
        <div className="w-full max-w-4xl">
            <h3 className={`font-bold ${theme.colors.text.primary} mb-6 text-center`}>Enterprise Probability-Impact Matrix</h3>
            <div className="grid grid-cols-[auto_1fr] gap-4">
                <div className={`flex items-center justify-center -rotate-90 font-bold text-sm ${theme.colors.text.secondary} uppercase tracking-widest`}>Probability</div>
                <div className="relative">
                    <div className={`grid grid-cols-5 grid-rows-5 gap-1 w-full aspect-square border-l-2 border-b-2 ${theme.colors.border.replace('border-', 'border-slate-')}300`}>
                        {[5,4,3,2,1].map(prob => 
                            [1,2,3,4,5].map(imp => {
                                const score = prob * imp;
                                const cellRisks = risks.filter(r => r.probabilityValue === prob && r.impactValue === imp);
                                let bgClass = 'bg-green-500/20 hover:bg-green-500/30';
                                if (score >= 15) bgClass = 'bg-red-500/20 hover:bg-red-500/30'; else if (score >= 8) bgClass = 'bg-yellow-500/20 hover:bg-yellow-500/30';

                                return (
                                    <div key={`${prob}-${imp}`} className={`${bgClass} border border-transparent p-2 relative group transition-all overflow-hidden cursor-pointer rounded-sm`} title={`Score: ${score}`}>
                                        <div className="absolute inset-0 flex flex-wrap content-start p-1 gap-1">
                                            {cellRisks.map(r => (
                                                <div key={r.id} onClick={() => onSelectRisk(r.id)} className={`w-6 h-6 rounded-full ${theme.colors.surface} ${theme.colors.text.primary} border ${theme.colors.border} text-[9px] flex items-center justify-center font-bold cursor-pointer hover:scale-110 transition-transform shadow-sm`} title={`${r.id}: ${r.description}`}>
                                                    {cellRisks.length > 5 ? '' : r.id.split('-')[1] || r.id.substring(0,2)}
                                                </div>
                                            ))}
                                            {cellRisks.length > 5 && <span className={`text-xs ${theme.colors.text.secondary} font-bold pl-1`}>+{cellRisks.length}</span>}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className={`text-center font-bold text-sm ${theme.colors.text.secondary} uppercase tracking-widest mt-2`}>Impact</div>
                </div>
            </div>
        </div>
    </div>
  );
};
