
import React, { useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useData } from '../../context/DataContext';
import { ArrowRight, ArrowUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
// FIX: Corrected import path to avoid module resolution conflict.
import { Risk } from '../../types/index';

const RiskMatrix: React.FC = () => {
  const { risks } = useProjectWorkspace();
  const { dispatch } = useData();
  const theme = useTheme();

  const scale = [1, 2, 3, 4, 5];

  // Optimize: Pre-calculate the distribution of risks into the matrix cells (Rule 8)
  const matrixData = useMemo(() => {
      if (!risks) return {};
      const map: Record<string, Risk[]> = {};
      risks.forEach(r => {
          const key = `${r.probabilityValue}-${r.impactValue}`;
          if (!map[key]) map[key] = [];
          map[key].push(r);
      });
      return map;
  }, [risks]);

  const getCellColor = (prob: number, imp: number) => {
    const score = prob * imp;
    if (score >= 15) return 'bg-red-500/80 hover:bg-red-500 text-white';
    if (score >= 8) return 'bg-yellow-400/80 hover:bg-yellow-400 text-yellow-900';
    return 'bg-green-400/80 hover:bg-green-400 text-green-900';
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, riskId: string) => {
    e.dataTransfer.setData("riskId", riskId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, prob: number, imp: number) => {
    e.preventDefault();
    const riskId = e.dataTransfer.getData("riskId");
    if (!risks) return;
    const risk = risks.find(r => r.id === riskId);
    if (risk) {
      const updatedRisk = {
        ...risk,
        probabilityValue: prob,
        impactValue: imp,
        score: prob * imp
      };
      dispatch({ type: 'UPDATE_RISK', payload: { risk: updatedRisk } });
    }
  };

  if (!risks) return <div className={theme.layout.pagePadding}>Loading risks...</div>;

  return (
    <div className={`h-full overflow-auto ${theme.layout.pagePadding} ${theme.colors.background}`}>
        <h3 className={`${theme.typography.h3} mb-4`}>Probability-Impact Matrix</h3>
        <div className="overflow-x-auto pb-4">
            <div className="flex items-center justify-center min-w-[700px]">
                {/* Y Axis Label */}
                <div className="flex items-center justify-center -rotate-90 -ml-8 mr-2">
                <span className={theme.typography.label}>Probability</span>
                <ArrowUp size={14} className={`ml-1 ${theme.colors.text.secondary}`} />
                </div>
                
                <div className={`grid grid-cols-5 grid-rows-5 gap-1 border-l border-b ${theme.colors.border}`}>
                    {scale.slice().reverse().map(prob => 
                        scale.map(imp => {
                            const cellRisks = matrixData[`${prob}-${imp}`] || [];
                            return (
                                <div 
                                    key={`${prob}-${imp}`} 
                                    className={`w-32 h-32 border border-transparent hover:border-white/50 relative p-2 flex flex-wrap gap-1 content-start ${getCellColor(prob, imp)} transition-colors rounded-sm`}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, prob, imp)}
                                >
                                    {cellRisks.map(risk => (
                                        <div 
                                            key={risk.id} 
                                            className={`w-8 h-8 rounded-full ${theme.colors.surface} ${theme.colors.text.primary} text-[10px] flex items-center justify-center font-bold cursor-grab active:cursor-grabbing shadow-md border ${theme.colors.border}`}
                                            title={risk.description}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, risk.id)}
                                        >
                                            {risk.id.split('-')[1] || risk.id.substring(0,2)}
                                        </div>
                                    ))}
                                    {cellRisks.length > 5 && <span className="text-xs font-bold pl-1 opacity-70">+{cellRisks.length - 5}</span>}
                                    <span className="absolute top-1 right-1 text-[9px] font-black opacity-30">{prob * imp}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            
            {/* X Axis Label */}
            <div className="flex items-center justify-center mt-2 ml-16 min-w-[700px]">
                <span className={theme.typography.label}>Impact</span>
                <ArrowRight size={14} className={`ml-1 ${theme.colors.text.secondary}`} />
            </div>
        </div>
    </div>
  );
};

export default RiskMatrix;
