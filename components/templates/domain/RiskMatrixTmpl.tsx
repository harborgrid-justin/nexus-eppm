
import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Badge } from '../../ui/Badge';

export const RiskMatrixTmpl: React.FC = () => {
    const theme = useTheme();
    const [selectedRisk, setSelectedRisk] = useState<string | null>(null);

    const handleRiskClick = (riskId: string) => {
        setSelectedRisk(riskId === selectedRisk ? null : riskId);
    };

    return (
        <div className={`h-full p-8 overflow-auto flex flex-col items-center ${theme.colors.background}`}>
            <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-8">
                    <h2 className={theme.typography.h2}>Enterprise Risk Heatmap</h2>
                    <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"></div> Critical</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-400 rounded"></div> Major</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 rounded"></div> Low</span>
                    </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                    <div className="flex flex-col justify-center items-center">
                        <span className="font-bold text-slate-400 uppercase tracking-[0.2em] -rotate-90 whitespace-nowrap">Probability</span>
                    </div>
                    <div>
                        <div className="grid grid-cols-5 gap-1.5 mb-2">
                            {[5,4,3,2,1].map(row => 
                                [1,2,3,4,5].map(col => {
                                    const score = row * col;
                                    const color = score >= 15 ? 'bg-red-500' : score >= 8 ? 'bg-yellow-400' : 'bg-green-400';
                                    const hasRisk = score === 25 || score === 12;
                                    
                                    return (
                                        <div 
                                            key={`${row}-${col}`} 
                                            onClick={() => hasRisk && handleRiskClick(`${row}-${col}`)}
                                            className={`w-28 h-28 ${color} rounded-lg bg-opacity-90 hover:bg-opacity-100 hover:scale-105 transition-all relative cursor-pointer group shadow-sm flex items-center justify-center`}
                                        >
                                            <span className="absolute top-2 right-2 text-[10px] font-black text-white/50">{score}</span>
                                            {/* Mock Content */}
                                            {hasRisk && (
                                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-xs text-slate-800 shadow-md transform group-hover:-translate-y-1 transition-transform">
                                                    {score === 25 ? '3' : '1'}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                        <div className="text-center font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Impact</div>
                    </div>
                </div>
                
                {selectedRisk && (
                    <div className="mt-8 p-4 border border-slate-200 rounded-xl bg-slate-50 animate-in slide-in-from-top-2">
                         <h4 className="font-bold text-slate-800 mb-2">Risks in Selected Zone</h4>
                         <ul className="space-y-2 text-sm">
                             <li className="flex justify-between bg-white p-3 rounded border border-slate-200">
                                 <span>Supply Chain Failure</span>
                                 <Badge variant="danger">Critical</Badge>
                             </li>
                         </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
