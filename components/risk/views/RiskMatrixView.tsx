import React from 'react';
import { Risk } from '../../../types/index';
import { useTheme } from '../../../context/ThemeContext';
import { ShieldAlert } from 'lucide-react';
import { EmptyGrid } from '../../common/EmptyGrid';

interface RiskMatrixViewProps {
  risks: Risk[];
  onSelectRisk: (id: string) => void;
}

export const RiskMatrixView: React.FC<RiskMatrixViewProps> = ({ risks, onSelectRisk }) => {
  const theme = useTheme();

  if (risks.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-12">
               <EmptyGrid title="Matrix Model Silent" description="Populate the risk register to activate the qualitative probability-impact heatmap." icon={ShieldAlert} />
          </div>
      );
  }

  return (
    <div className={`h-full p-8 overflow-auto flex flex-col items-center ${theme.colors.background}`}>
        <div className={`w-full max-w-4xl ${theme.colors.surface} p-10 rounded-[2.5rem] shadow-sm border ${theme.colors.border}`}>
            <h3 className={`font-black text-slate-900 text-lg uppercase tracking-widest mb-10 text-center`}>Qualitative Performance Matrix</h3>
            <div className="grid grid-cols-[auto_1fr] gap-6">
                <div className={`flex items-center justify-center -rotate-90 font-black text-[10px] ${theme.colors.text.tertiary} uppercase tracking-[0.4em]`}>Probability</div>
                <div className="relative">
                    <div className={`grid grid-cols-5 grid-rows-5 gap-2 w-full aspect-square border-l-2 border-b-2 ${theme.colors.border} shadow-inner bg-slate-50/30 p-2 rounded-xl`}>
                        {[5,4,3,2,1].map(prob => 
                            [1,2,3,4,5].map(imp => {
                                const score = prob * imp;
                                const cellRisks = risks.filter(r => r.probabilityValue === prob && r.impactValue === imp);
                                
                                let bgClass = theme.colors.semantic.success.bg;
                                let hoverClass = 'hover:bg-green-100';
                                if (score >= 15) {
                                    bgClass = theme.colors.semantic.danger.bg;
                                    hoverClass = 'hover:bg-red-100';
                                } else if (score >= 8) {
                                    bgClass = theme.colors.semantic.warning.bg;
                                    hoverClass = 'hover:bg-amber-100';
                                }

                                return (
                                    <div 
                                        key={`${prob}-${imp}`} 
                                        className={`${bgClass} ${hoverClass} border border-white/50 p-2 relative group transition-all overflow-hidden cursor-pointer rounded-xl flex items-center justify-center shadow-sm`}
                                        title={`Score: ${score} (${cellRisks.length} Risks)`}
                                    >
                                        <div className="absolute inset-0 flex flex-wrap content-start p-1.5 gap-1.5 overflow-y-auto scrollbar-none">
                                            {cellRisks.map(r => (
                                                <div 
                                                    key={r.id} 
                                                    onClick={() => onSelectRisk(r.id)} 
                                                    className={`w-7 h-7 rounded-lg bg-white ${theme.colors.text.primary} border border-slate-200 text-[10px] flex items-center justify-center font-black cursor-pointer hover:scale-110 hover:shadow-md transition-all active:scale-90`}
                                                >
                                                    {cellRisks.length > 6 ? '' : r.id.split('-')[1] || r.id.substring(0,2)}
                                                </div>
                                            ))}
                                            {cellRisks.length > 6 && (
                                                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white text-[9px] flex items-center justify-center font-black">
                                                    +{cellRisks.length}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className={`text-center font-black text-[10px] ${theme.colors.text.tertiary} uppercase tracking-[0.4em] mt-6`}>Impact Severity</div>
                </div>
            </div>
        </div>
    </div>
  );
};