
import React from 'react';
import { useProgramTradeoffLogic } from '../../hooks/domain/useProgramTradeoffLogic';
import { Scale, TrendingUp, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency } from '../../utils/formatters';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis, ReferenceLine } from 'recharts';
import { EmptyGrid } from '../common/EmptyGrid';

interface ProgramTradeoffProps {
  programId: string;
}

const ProgramTradeoff: React.FC<ProgramTradeoffProps> = ({ programId }) => {
  const { 
      tradeoffScenarios, 
      selectedScenario, 
      setSelectedScenario, 
      activeScenario,
      handleCreateScenario
  } = useProgramTradeoffLogic(programId);
  
  const theme = useTheme();

  // Transform data for chart
  const chartData = tradeoffScenarios.map(s => ({
      name: s.name,
      benefit: s.benefitValue,
      exposure: s.costImpact + (s.riskScore * 10000), // Simple heuristic for exposure
      score: s.riskScore
  }));

  if (tradeoffScenarios.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-8">
              <EmptyGrid 
                title="Trade-off Analysis Unavailable"
                description="Create scenarios to compare benefit vs. risk exposure."
                icon={Scale}
                actionLabel="Create Scenario"
                onAdd={handleCreateScenario}
              />
          </div>
      );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <Scale className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Benefit-Risk Tradeoff Analysis</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Impact Matrix */}
            <div className={`lg:col-span-2 ${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm h-[400px]`}>
                <h3 className="font-bold text-slate-800 mb-4">Value vs. Exposure Matrix</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" dataKey="exposure" name="Exposure (Cost + Risk)" unit="$" tickFormatter={(val) => formatCompactCurrency(val)} label={{ value: 'Negative Exposure', position: 'bottom', offset: 0 }} />
                        <YAxis type="number" dataKey="benefit" name="Benefit Value" unit="$" tickFormatter={(val) => formatCompactCurrency(val)} label={{ value: 'Benefit Value', angle: -90, position: 'insideLeft' }} />
                        <ZAxis type="number" dataKey="score" range={[60, 400]} name="Risk Score" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value: any, name: string) => {
                             if(typeof value === 'number') return formatCompactCurrency(value);
                             return value;
                        }} />
                        <ReferenceLine y={500000} stroke="green" strokeDasharray="3 3" label="Target Value" />
                        <Scatter name="Scenarios" data={chartData} fill="#8884d8" onClick={(data) => {
                             const scenario = tradeoffScenarios.find(s => s.name === data.name);
                             if(scenario) setSelectedScenario(scenario.id);
                        }} cursor="pointer" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            {/* Scenario Details */}
            <div className="space-y-6">
                <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Scenarios</h3>
                        <button onClick={handleCreateScenario} className="text-xs text-nexus-600 font-bold hover:underline">+ Add</button>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                        {tradeoffScenarios.map(s => (
                            <div 
                                key={s.id} 
                                onClick={() => setSelectedScenario(s.id)}
                                className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedScenario === s.id ? 'bg-nexus-50 border-l-4 border-nexus-500' : ''}`}
                            >
                                <h4 className="font-bold text-sm text-slate-900">{s.name}</h4>
                                <div className="flex justify-between mt-2 text-xs text-slate-500">
                                    <span className="flex items-center gap-1 text-green-600"><TrendingUp size={12}/> +{formatCompactCurrency(s.benefitValue)}</span>
                                    <span className="flex items-center gap-1 text-red-600"><AlertTriangle size={12}/> Score: {s.riskScore}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {activeScenario && (
                    <div className="p-5 bg-slate-800 text-white rounded-xl shadow-lg animate-in slide-in-from-right-4">
                        <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                            Recommendation: 
                            <span className={activeScenario.recommendation === 'Proceed' ? 'text-green-400' : 'text-red-400'}>
                                {activeScenario.recommendation}
                            </span>
                        </h4>
                        <p className="text-sm text-slate-300 mb-4">{activeScenario.description}</p>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b border-slate-700 pb-1">
                                <span className="text-slate-400">Net Value:</span>
                                <span className="font-mono font-bold text-green-400">+{formatCompactCurrency(activeScenario.benefitValue - activeScenario.costImpact)}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-700 pb-1">
                                <span className="text-slate-400">Cost Impact:</span>
                                <span className="font-mono text-red-300">-{formatCompactCurrency(activeScenario.costImpact)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ProgramTradeoff;
