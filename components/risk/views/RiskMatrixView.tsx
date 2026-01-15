
import React from 'react';
import { Risk } from '../../../types/index';
import { useTheme } from '../../../context/ThemeContext';
import { ShieldAlert, Maximize2, AlertOctagon } from 'lucide-react';
import { EmptyGrid } from '../../common/EmptyGrid';

interface RiskMatrixViewProps {
  risks: Risk[];
  onSelectRisk: (id: string) => void;
}

export const RiskMatrixView: React.FC<RiskMatrixViewProps> = ({ risks, onSelectRisk }) => {
  const theme = useTheme();
  const [hoveredCell, setHoveredCell] = React.useState<string | null>(null);

  if (risks.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-12">
               <EmptyGrid title="Matrix Model Isolated" description="Populate the organizational risk register to activate the qualitative probability-impact heatmap." icon={ShieldAlert} />
          </div>
      );
  }

  return (
    <div className={`h-full p-10 overflow-auto flex flex-col items-center ${theme.colors.background} scrollbar-thin`}>
        <div className={`w-full max-w-5xl bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-200 relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-32 bg-nexus-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-nexus-500/10 transition-all duration-700"></div>
            
            <div className="flex justify-between items-end mb-12 border-b border-slate-50 pb-8 relative z-10">
                <div>
                    <h3 className={`font-black text-slate-900 text-2xl uppercase tracking-tighter flex items-center gap-4`}>
                        <AlertOctagon size={32} className="text-red-500 animate-pulse"/> Qualitative Risk Heatmap
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">Multi-dimensional assessment of likelihood vs technical consequence.</p>
                </div>
                {hoveredCell && (
                    <div className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] animate-in fade-in zoom-in-95 shadow-xl">
                        {risks.filter(r => `${r.probabilityValue}-${r.impactValue}` === hoveredCell).length} CLUSTERS DETECTED
                    </div>
                )}
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-10 relative z-10">
                <div className={`flex items-center justify-center -rotate-90 font-black text-[11px] text-slate-400 uppercase tracking-[0.5em] h-full`}>Probability</div>
                <div className="relative">
                    <div className={`grid grid-cols-5 grid-rows-5 gap-3 w-full aspect-square border-l-4 border-b-4 border-slate-200 shadow-inner bg-slate-50/30 p-3 rounded-2xl`}>
                        {[5,4,3,2,1].map(prob => 
                            [1,2,3,4,5].map(imp => {
                                const score = prob * imp;
                                const cellRisks = risks.filter(r => r.probabilityValue === prob && r.impactValue === imp);
                                
                                let bgClass = 'bg-green-500/10 hover:bg-green-500/30';
                                let borderClass = 'border-green-500/20';
                                if (score >= 15) {
                                    bgClass = 'bg-red-500/10 hover:bg-red-500/30 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]';
                                    borderClass = 'border-red-500/30';
                                } else if (score >= 8) {
                                    bgClass = 'bg-amber-500/10 hover:bg-amber-500/30 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)]';
                                    borderClass = 'border-amber-500/30';
                                }

                                return (
                                    <div 
                                        key={`${prob}-${imp}`} 
                                        className={`${bgClass} border ${borderClass} rounded-2xl relative transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-center group/cell hover:scale-[1.03] hover:z-20 hover:shadow-2xl`}
                                        onMouseEnter={() => setHoveredCell(`${prob}-${imp}`)}
                                        onMouseLeave={() => setHoveredCell(null)}
                                    >
                                        <div className="absolute inset-0 flex flex-wrap content-start p-2 gap-2 overflow-y-auto scrollbar-none">
                                            {cellRisks.map(r => (
                                                <div 
                                                    key={r.id} 
                                                    onClick={() => onSelectRisk(r.id)} 
                                                    className={`w-8 h-8 rounded-xl bg-white text-slate-800 border-2 border-slate-100 text-[10px] flex items-center justify-center font-black cursor-pointer hover:scale-110 hover:border-nexus-500 hover:shadow-xl transition-all active:scale-90 shadow-md`}
                                                    title={r.description}
                                                >
                                                    {r.id.split('-')[1] || r.id.substring(0,2)}
                                                </div>
                                            ))}
                                        </div>
                                        {cellRisks.length === 0 && (
                                            <div className="text-[10px] font-mono font-black text-slate-300 opacity-20">{score}</div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className={`text-center font-black text-[11px] text-slate-400 uppercase tracking-[0.5em] mt-8`}>Impact Severity</div>
                </div>
            </div>
            
            <div className="absolute bottom-6 right-10 text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Maximize2 size={12}/> Interaction: Pan & Zoom Enabled
            </div>
        </div>
    </div>
  );
};
