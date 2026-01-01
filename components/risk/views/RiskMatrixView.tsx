
import React from 'react';
import { Risk } from '../../../types';

interface RiskMatrixViewProps {
  risks: Risk[];
  onSelectRisk: (id: string) => void;
}

export const RiskMatrixView: React.FC<RiskMatrixViewProps> = ({ risks, onSelectRisk }) => {
  return (
    <div className="h-full p-6 overflow-auto flex flex-col items-center">
        <div className="w-full max-w-4xl">
            <h3 className="font-bold text-slate-800 mb-6 text-center">Enterprise Probability-Impact Matrix</h3>
            <div className="grid grid-cols-[auto_1fr] gap-4">
                <div className="flex items-center justify-center -rotate-90 font-bold text-sm text-slate-500 uppercase tracking-widest">Probability</div>
                <div className="relative">
                    <div className="grid grid-cols-5 grid-rows-5 gap-1 w-full aspect-square border-l-2 border-b-2 border-slate-200">
                        {[5,4,3,2,1].map(prob => 
                            [1,2,3,4,5].map(imp => {
                                const score = prob * imp;
                                const cellRisks = risks.filter(r => r.probabilityValue === prob && r.impactValue === imp);
                                let bgClass = 'bg-green-50';
                                if (score >= 15) bgClass = 'bg-red-100'; else if (score >= 8) bgClass = 'bg-yellow-100';

                                return (
                                    <div key={`${prob}-${imp}`} className={`${bgClass} border border-white p-2 relative group hover:brightness-95 transition-all overflow-hidden`}>
                                        <div className="absolute inset-0 flex flex-wrap content-start p-1 gap-1">
                                            {cellRisks.map(r => (
                                                <div key={r.id} onClick={() => onSelectRisk(r.id)} className="w-6 h-6 rounded-full bg-slate-800 text-white text-[9px] flex items-center justify-center font-bold cursor-pointer hover:scale-110 transition-transform shadow-sm" title={`${r.id}: ${r.description}`}>
                                                    {cellRisks.length > 5 ? '' : r.id.split('-')[1] || r.id.substring(0,2)}
                                                </div>
                                            ))}
                                            {cellRisks.length > 5 && <span className="text-xs text-slate-500 font-bold pl-1">+{cellRisks.length}</span>}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="text-center font-bold text-sm text-slate-500 uppercase tracking-widest mt-2">Impact</div>
                </div>
            </div>
        </div>
    </div>
  );
};
