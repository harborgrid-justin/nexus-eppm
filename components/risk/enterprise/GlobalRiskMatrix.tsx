import React, { useMemo, useState } from 'react';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';
import { ShieldAlert } from 'lucide-react';
import { EmptyGrid } from '../../common/EmptyGrid';

export const GlobalRiskMatrix: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);

    const allRisks = useMemo(() => {
        return [
            ...state.risks,
            ...state.portfolioRisks.map(r => ({ ...r, probabilityValue: r.score >= 15 ? 5 : 3, impactValue: r.score >= 15 ? 5 : 3 })), 
            ...state.programRisks
        ];
    }, [state.risks, state.portfolioRisks, state.programRisks]);

    const matrix = useMemo(() => {
        const grid: Record<string, number> = {};
        allRisks.forEach(r => {
            const p = r.probabilityValue || 1;
            const i = r.impactValue || 1;
            const key = `${p}-${i}`;
            grid[key] = (grid[key] || 0) + 1;
        });
        return grid;
    }, [allRisks]);

    const getCellColor = (prob: number, imp: number) => {
        const score = prob * imp;
        if (score >= 15) return theme.colors.semantic.danger.solid; 
        if (score >= 8) return theme.colors.semantic.warning.solid; 
        return theme.colors.semantic.success.solid; 
    };

    if (allRisks.length === 0) {
        return (
            <div className="h-full flex flex-col justify-center p-12">
                <EmptyGrid title="Heatmap Idle" description="Identify enterprise or project risks to activate qualitative heat analysis." icon={ShieldAlert} />
            </div>
        );
    }

    return (
        <div className={`h-full flex flex-col items-center justify-center p-12 ${theme.colors.background} overflow-auto`}>
            <div className={`${theme.colors.surface} p-12 rounded-[3rem] shadow-2xl border ${theme.colors.border} max-w-5xl w-full`}>
                <div className="flex justify-between items-end mb-12 border-b border-slate-50 pb-8">
                    <div>
                        <h2 className={`text-2xl font-black text-slate-900 uppercase tracking-tighter`}>Global Qualitative Heatmap</h2>
                        <p className={`text-sm ${theme.colors.text.secondary} font-medium mt-1`}>Organizational risk density by probability and severity.</p>
                    </div>
                    {hoveredCell && (
                        <div className={`text-xs font-black uppercase tracking-widest ${theme.colors.text.secondary} bg-slate-900 text-white px-5 py-2 rounded-full animate-in fade-in shadow-xl`}>
                            {matrix[hoveredCell] || 0} Critical Threats
                        </div>
                    )}
                </div>
                
                <div className="flex gap-8">
                    <div className="flex flex-col justify-center items-center w-12">
                        <span className={`font-black ${theme.colors.text.tertiary} uppercase tracking-[0.4em] text-[10px] -rotate-90 whitespace-nowrap`}>Probability</span>
                    </div>
                    
                    <div className="flex-1">
                        <div className="grid grid-cols-5 grid-rows-5 gap-2.5 aspect-square border-l-4 border-b-4 border-slate-200 p-2 shadow-inner bg-slate-50/20 rounded-2xl">
                            {[5,4,3,2,1].map(prob => 
                                [1,2,3,4,5].map(imp => {
                                    const key = `${prob}-${imp}`;
                                    const count = matrix[key] || 0;
                                    const opacity = count > 0 ? 'opacity-100' : 'opacity-20';
                                    
                                    return (
                                        <div 
                                            key={key}
                                            className={`${getCellColor(prob, imp)} ${opacity} rounded-2xl flex items-center justify-center relative cursor-pointer transition-all hover:scale-105 hover:opacity-100 hover:shadow-xl active:scale-95 group`}
                                            onMouseEnter={() => setHoveredCell(key)}
                                            onMouseLeave={() => setHoveredCell(null)}
                                        >
                                            {count > 0 && (
                                                <span className="text-3xl font-black text-white drop-shadow-md">{count}</span>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <div className={`text-center font-black ${theme.colors.text.tertiary} uppercase tracking-[0.4em] text-[10px] mt-8`}>Impact Severity</div>
                    </div>
                </div>
            </div>
        </div>
    );
};