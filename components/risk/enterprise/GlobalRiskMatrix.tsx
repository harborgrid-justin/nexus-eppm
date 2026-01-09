
import React, { useMemo, useState } from 'react';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';
import { ArrowUp, ArrowRight } from 'lucide-react';

export const GlobalRiskMatrix: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);

    const allRisks = useMemo(() => {
        return [
            ...state.risks,
            ...state.portfolioRisks.map(r => ({ ...r, probabilityValue: r.score >= 15 ? 5 : 3, impactValue: r.score >= 15 ? 5 : 3 })), // Mock values for portfolio items if missing
            ...state.programRisks
        ];
    }, [state.risks, state.portfolioRisks, state.programRisks]);

    // Group risks into 5x5 grid
    const matrix = useMemo(() => {
        const grid: Record<string, number> = {};
        allRisks.forEach(r => {
            // Default to 1 if value missing
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

    return (
        <div className={`h-full flex flex-col items-center justify-center p-8 ${theme.colors.background} overflow-auto`}>
            <div className={`${theme.colors.surface} p-8 rounded-2xl shadow-sm border ${theme.colors.border} max-w-4xl w-full`}>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className={theme.typography.h2}>Global Risk Heatmap</h2>
                        <p className={theme.typography.small}>Density of risks across probability and impact dimensions.</p>
                    </div>
                    {hoveredCell && (
                        <div className={`text-sm font-bold ${theme.colors.text.secondary} ${theme.colors.background} px-3 py-1 rounded animate-in fade-in`}>
                            {matrix[hoveredCell] || 0} Risks in this zone
                        </div>
                    )}
                </div>
                
                <div className="flex gap-4">
                    <div className="flex flex-col justify-center items-center w-8">
                        <span className={`font-bold ${theme.colors.text.tertiary} uppercase tracking-widest text-xs -rotate-90 whitespace-nowrap`}>Probability</span>
                    </div>
                    
                    <div className="flex-1">
                        <div className="grid grid-cols-5 grid-rows-5 gap-1.5 aspect-square max-h-[500px]">
                            {[5,4,3,2,1].map(prob => 
                                [1,2,3,4,5].map(imp => {
                                    const key = `${prob}-${imp}`;
                                    const count = matrix[key] || 0;
                                    const opacity = count > 0 ? 'opacity-100' : 'opacity-30';
                                    
                                    return (
                                        <div 
                                            key={key}
                                            className={`${getCellColor(prob, imp)} ${opacity} rounded-lg flex items-center justify-center relative cursor-pointer transition-all hover:scale-105 hover:opacity-100 hover:shadow-lg`}
                                            onMouseEnter={() => setHoveredCell(key)}
                                            onMouseLeave={() => setHoveredCell(null)}
                                        >
                                            {count > 0 && (
                                                <span className="text-2xl font-black">{count}</span>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <div className={`text-center font-bold ${theme.colors.text.tertiary} uppercase tracking-widest text-xs mt-4`}>Impact</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
