import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Risk } from '../../types/index';
import { useRiskMatrixLogic } from '../../hooks/domain/useRiskMatrixLogic';

const RiskMatrix: React.FC = () => {
  const theme = useTheme();
  const { 
    matrixData, 
    hoveredCell, 
    setHoveredCell, 
    handleRiskClick 
  } = useRiskMatrixLogic();

  return (
    <div className={`h-full flex flex-col items-center justify-center p-8 ${theme.colors.background} overflow-auto`}>
        <div className={`${theme.colors.surface} p-8 rounded-2xl shadow-sm border ${theme.colors.border} max-w-4xl w-full`}>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className={theme.typography.h2}>Project Risk Matrix</h2>
                    <p className={theme.typography.small}>Probability vs. Impact Heatmap</p>
                </div>
                {hoveredCell && (
                    <div className={`text-sm font-bold ${theme.colors.text.secondary} ${theme.colors.background} px-3 py-1 rounded animate-in fade-in`}>
                        {matrixData[hoveredCell]?.length || 0} Risks in this zone
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
                                const cellRisks = matrixData[key] || [];
                                const score = prob * imp;
                                let bgClass = 'bg-green-500/20 hover:bg-green-500/30';
                                if (score >= 15) bgClass = 'bg-red-500/20 hover:bg-red-500/30'; else if (score >= 8) bgClass = 'bg-yellow-500/20 hover:bg-yellow-500/30';

                                return (
                                    <div 
                                        key={key} 
                                        className={`${bgClass} border border-transparent p-2 relative group transition-all overflow-hidden cursor-pointer rounded-sm`} 
                                        title={`Score: ${score}`}
                                        onMouseEnter={() => setHoveredCell(key)}
                                        onMouseLeave={() => setHoveredCell(null)}
                                    >
                                        <div className="absolute inset-0 flex flex-wrap content-start p-1 gap-1">
                                            {cellRisks.map(r => (
                                                <div 
                                                    key={r.id} 
                                                    onClick={() => handleRiskClick(r.id)} 
                                                    className={`w-6 h-6 rounded-full ${theme.colors.surface} ${theme.colors.text.primary} border ${theme.colors.border} text-[9px] flex items-center justify-center font-bold cursor-pointer hover:scale-110 transition-transform shadow-sm`} 
                                                    title={`${r.id}: ${r.description}`}
                                                >
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
                    <div className={`text-center font-bold ${theme.colors.text.tertiary} uppercase tracking-widest text-xs mt-4`}>Impact</div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default RiskMatrix;
