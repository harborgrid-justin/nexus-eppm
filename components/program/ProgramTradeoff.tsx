import React from 'react';
import { useProgramTradeoffLogic } from '../../hooks/domain/useProgramTradeoffLogic';
import { Scale, TrendingUp, Target, DollarSign } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis, ReferenceLine, Cell } from 'recharts';
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

  const chartData = tradeoffScenarios.map(s => ({
      id: s.id,
      name: s.name,
      benefit: s.benefitValue,
      exposure: s.costImpact + (s.riskScore * 10000), 
      score: s.riskScore
  }));

  if (tradeoffScenarios.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-8">
              <EmptyGrid 
                title="Trade-off Model Isolated"
                description="Synthesize cost-benefit scenarios to analyze delivery trade-offs. Predictive modeling is required for program rebalancing."
                icon={Scale}
                actionLabel="Initialize Modeling Scenario"
                onAdd={handleCreateScenario}
              />
          </div>
      );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300 scrollbar-thin`}>
        <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-nexus-600 text-white rounded-2xl shadow-xl shadow-nexus-500/20"><Scale size={24}/></div>
            <div>
                <h2 className={theme.typography.h1}>Trade-off & Strategic Rebalancing</h2>
                <p className={theme.typography.small}>Multidimensional analysis of benefit realization vs. capital exposure.</p>
            </div>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
            <div className={`lg:col-span-2 ${theme.colors.surface} p-8 rounded-[2.5rem] border ${theme.colors.border} shadow-sm h-[450px] flex flex-col`}>
                <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
                    <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <Target size={16} className="text-nexus-500"/> Frontier Distribution Analysis
                    </h3>
                </div>
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                            <XAxis type="number" dataKey="exposure" name="Exposure" tickFormatter={(val) => formatCompactCurrency(val)} label={{ value: 'Negative Exposure (Cost + Risk)', position: 'bottom', offset: 0, style: {fontSize: 10, fontStyle: 'bold', fill: '#94a3b8'} }} />
                            <YAxis type="number" dataKey="benefit" name="Benefit" tickFormatter={(val) => formatCompactCurrency(val)} label={{ value: 'Benefit Realization', angle: -90, position: 'insideLeft', style: {fontSize: 10, fontStyle: 'bold', fill: '#94a3b8'} }} />
                            <ZAxis type="number" dataKey="score" range={[100, 1000]} name="Risk Heat" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={theme.charts.tooltip} />
                            <ReferenceLine x={1000000} stroke="#cbd5e1" strokeDasharray="5 5" label={{value: 'CAP_MAX', position: 'top', fontSize: 9, fill: '#94a3b8'}} />
                            <Scatter name="Scenarios" data={chartData} onClick={(data) => setSelectedScenario(data.id)} cursor="pointer">
                                {chartData.map((entry, index) => (
                                    <Cell key={`c-${index}`} fill={entry.id === selectedScenario ? '#0ea5e9' : '#94a3b8'} fillOpacity={entry.id === selectedScenario ? 1 : 0.4} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="space-y-6">
                <div className={`${theme.colors.surface} rounded-[2rem] border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col h-[200px]`}>
                    <div className={`p-4 border-b ${theme.colors.border} bg-slate-50/50 flex justify-between items-center`}>
                        <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Modeling Sandbox</h3>
                        <button onClick={handleCreateScenario} className="text-[10px] font-black uppercase text-nexus-600 hover:text-nexus-800 transition-all">+ New Model</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
                        {tradeoffScenarios.map(s => (
                            <div 
                                key={s.id} 
                                onClick={() => setSelectedScenario(s.id)}
                                className={`p-3 rounded-xl border-2 transition-all cursor-pointer group ${
                                    selectedScenario === s.id ? 'bg-nexus-600 border-nexus-600 shadow-lg' : 'bg-white border-slate-100 hover:border-slate-200'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <h4 className={`font-black text-xs uppercase tracking-tight ${selectedScenario === s.id ? 'text-white' : 'text-slate-700'}`}>{s.name}</h4>
                                    <div className={`p-1 rounded bg-black/10 text-[9px] font-mono font-bold ${selectedScenario === s.id ? 'text-nexus-200' : 'text-slate-400'}`}>{s.id}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {activeScenario ? (
                    <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl animate-in slide-in-from-right-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-nexus-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-nexus-500/20 transition-colors"></div>
                        <div className="relative z-10">
                            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-nexus-400 mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
                                <TrendingUp size={16}/> Strategic Recommendation
                            </h4>
                            <div className="mb-8">
                                <span className={`text-2xl font-black uppercase tracking-tighter ${activeScenario.recommendation === 'Proceed' ? 'text-green-400' : 'text-red-400'}`}>
                                    {activeScenario.recommendation}
                                </span>
                                <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed uppercase tracking-tight">"{activeScenario.description}"</p>
                            </div>
                            
                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Net Value Score</span>
                                    <span className="font-mono font-black text-green-400 text-lg">+{formatCompactCurrency(activeScenario.benefitValue - activeScenario.costImpact)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Exposure Vector</span>
                                    <span className="font-mono font-bold text-red-400">-{formatCompactCurrency(activeScenario.costImpact)}</span>
                                </div>
                            </div>
                        </div>
                        <Scale size={200} className="absolute -right-16 -bottom-16 opacity-5 text-white pointer-events-none rotate-12" />
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-400 nexus-empty-pattern rounded-[2rem] border-2 border-dashed border-slate-200">
                        <Scale size={40} className="mx-auto mb-4 opacity-10"/>
                        <p className="text-xs font-black uppercase tracking-widest">Select Model Point</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ProgramTradeoff;