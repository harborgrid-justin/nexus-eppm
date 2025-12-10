import React from 'react';
import { useProjectState } from '../../hooks/useProjectState';
import { useData } from '../../context/DataContext';
import { ArrowRight, ArrowUp } from 'lucide-react';

interface RiskMatrixProps {
  projectId: string;
}

const RiskMatrix: React.FC<RiskMatrixProps> = ({ projectId }) => {
  const { risks } = useProjectState(projectId);
  const { dispatch } = useData();

  const scale = [1, 2, 3, 4, 5];
  const labels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];

  const getCellColor = (prob: number, imp: number) => {
    const score = prob * imp;
    if (score >= 15) return 'bg-red-500/20';
    if (score >= 8) return 'bg-yellow-500/20';
    return 'bg-green-500/10';
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
        // You might also want to update the 'probability' and 'impact' string labels here
      };
      dispatch({ type: 'UPDATE_RISK', payload: { risk: updatedRisk } });
    }
  };

  if (!risks) return <div className="p-4">Loading risks...</div>;

  return (
    <div className="h-full overflow-auto p-6">
        <h3 className="font-bold text-lg text-slate-900 mb-4">Probability-Impact Matrix</h3>
        <div className="flex items-center justify-center">
            {/* Y Axis Label */}
            <div className="flex items-center justify-center -rotate-90 -ml-8 mr-2">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Probability</span>
               <ArrowUp size={14} className="ml-1" />
            </div>
            
            <div className="grid grid-cols-5 grid-rows-5 gap-0 border-l border-b border-slate-300">
                {scale.slice().reverse().map(prob => 
                    scale.map(imp => (
                        <div 
                            key={`${prob}-${imp}`} 
                            className={`w-32 h-32 border-r border-t border-slate-300 relative p-2 flex flex-wrap gap-1 content-start ${getCellColor(prob, imp)}`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, prob, imp)}
                        >
                             {risks.filter(r => r.probabilityValue === prob && r.impactValue === imp).map(risk => (
                                <div 
                                    key={risk.id} 
                                    className="w-8 h-8 rounded-full bg-slate-800 text-white text-[10px] flex items-center justify-center font-bold cursor-grab active:cursor-grabbing shadow-md" 
                                    title={risk.description}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, risk.id)}
                                >
                                    {risk.id.split('-')[1]}
                                </div>
                             ))}
                        </div>
                    ))
                )}
            </div>
        </div>
        
         {/* X Axis Label */}
        <div className="flex items-center justify-center mt-2 ml-16">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Impact</span>
            <ArrowRight size={14} className="ml-1" />
        </div>
    </div>
  );
};

export default RiskMatrix;
