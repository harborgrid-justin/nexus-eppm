
import React, { useMemo, useState } from 'react';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';
import { ShieldAlert, Maximize2, AlertTriangle } from 'lucide-react';
import { EmptyGrid } from '../../common/EmptyGrid';

export const GlobalRiskMatrix: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);

    const allRisks = useMemo(() => {
        // Source all risk vectors across all EPS partitions
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
        if (score >= 15) return 'bg-red-500 shadow-[inset_0_0_15px_rgba(239,68,68,0.5)]'; 
        if (score >= 8) return 'bg-yellow-400 shadow-[inset_0_0_15px_rgba(245,158,11,0.5)]'; 
        return 'bg-green-500 shadow-[inset_0_0_15px_rgba(34,197,94,0.5)]'; 
    };

    if (allRisks.length === 0) {
        return (
            <div className="h-full flex flex-col justify-center p-12">
                <EmptyGrid title="Inference Heatmap Neutral" description="Enterprise and project risk identifiers are required to activate qualitative heat analysis." icon={ShieldAlert} />
            </div>
        );
    }

    return (
        <div className={`h-full flex flex-col items-center justify-center p-12 ${theme.colors.background}/50 overflow-auto scrollbar-thin animate-nexus-in`}>
            <div className={`w-full max-w-5xl bg-white p-16 rounded-[4rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-slate-200 relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 p-48 bg-nexus-500/5 rounded-full blur-[120px] -mr-24 -mt-24"></div>
                
                <div className="flex justify-between items-end mb-16 border-b border-slate-50 pb-10 relative z-10">
                    <div>
                        <h2 className={`text-3xl font-black text-slate-950 uppercase tracking-tighter flex items-center gap-5`}>
                            <AlertTriangle size={36} className="text-nexus-600" /> Organizational Risk Heatmap
                        </h2>
                        <p className={`text-sm text-slate-400 font-bold mt-2 uppercase tracking-widest`}>Global qualitative density across {allRisks.length} committed threads.</p>
                    </div>
                    {hoveredCell && (
                        <div className={`text-xs font-black uppercase tracking-[0.2em] bg-slate-950 text-white px-8 py-3 rounded-2xl animate-in zoom-in-95 shadow-2xl border border-white/10`}>
                            {matrix[hoveredCell] || 0} SEVERITY NODES
                        </div>
                    )}
                </div>
                
                <div className="flex gap-12 relative z-10">
                    <div className="flex flex-col justify-center items-center w-16">
                        <span className={`font-black text-slate-300 uppercase tracking-[0.5em] text-[11px] -rotate-90 whitespace-nowrap`}>PROBABILITY</span>
                    </div>
                    
                    <div className="flex-1">
                        <div className="grid grid-cols-5 grid-rows-5 gap-3.5 aspect-square border-l-8 border-b-8 border-slate-100 p-4 shadow-inner bg-slate-50/20 rounded-[2.5rem]">
                            {[5,4,3,2,1].map(prob => 
                                [1,2,3,4,5].map(imp => {
                                    const key = `${prob}-${imp}`;
                                    const count = matrix[key] || 0;
                                    const opacity = count > 0 ? 'opacity-100' : 'opacity-20';
                                    
                                    return (
                                        <div 
                                            key={key}
                                            className={`${getCellColor(prob, imp)} ${opacity} rounded-3xl flex items-center justify-center relative cursor-pointer transition-all duration-500 hover:scale-[1.08] hover:opacity-100 hover:shadow-2xl active:scale-95 group/cell border-4 border-white/50`}
                                            onMouseEnter={() => setHoveredCell(key)}
                                            onMouseLeave={() => setHoveredCell(null)}
                                        >
                                            {count > 0 && (
                                                <span className="text-4xl font-black text-white drop-shadow-2xl group-hover/cell:scale-125 transition-transform">{count}</span>
                                            )}
                                            {count === 0 && (
                                                 <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/cell:opacity-100 transition-opacity"></div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <div className={`text-center font-black text-slate-300 uppercase tracking-[0.5em] text-[11px] mt-10`}>IMPACT SEVERITY</div>
                    </div>
                </div>
                
                <div className="absolute bottom-8 right-12 flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-widest opacity-60">
                    <Maximize2 size={16}/> Interactive Spatial Model Active
                </div>
            </div>
        </div>
    );
};
