
import React from 'react';
import { BarChart2, TrendingUp, Info, Play, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import StatCard from '../shared/StatCard';
import { Button } from '../ui/Button';
import { useQuantitativeAnalysisLogic } from '../../hooks/domain/useQuantitativeAnalysisLogic';
import { formatCompactCurrency } from '../../utils/formatters';

const QuantitativeAnalysis: React.FC = () => {
  const theme = useTheme();
  const {
      project,
      iterations,
      setIterations,
      isSimulating,
      results,
      runSimulation
  } = useQuantitativeAnalysisLogic();

  if (!project) return <div className="p-6">Loading project context...</div>;

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in`}>
        <div className={theme.layout.header}>
          <div>
            <h1 className={theme.typography.h1}>
              <BarChart2 className="text-nexus-600" /> Quantitative Risk Analysis
            </h1>
            <p className={theme.typography.small}>Monte Carlo Simulation (Schedule Risk)</p>
          </div>
          <div className="flex gap-2 items-center">
             <select 
                className="bg-white border border-slate-300 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-nexus-500 outline-none"
                value={iterations}
                onChange={(e) => setIterations(parseInt(e.target.value))}
             >
                 <option value="500">500 Iterations</option>
                 <option value="1000">1,000 Iterations</option>
                 <option value="5000">5,000 Iterations</option>
             </select>
             <Button 
                onClick={runSimulation}
                disabled={isSimulating}
                isLoading={isSimulating}
                icon={Play}
             >
                {isSimulating ? 'Running Model...' : 'Run Simulation'}
             </Button>
          </div>
       </div>

       {!results ? (
           <div className={`flex flex-col items-center justify-center h-[400px] ${theme.colors.background} border-2 border-dashed ${theme.colors.border} rounded-xl text-slate-400`}>
                <BarChart2 size={64} className="mb-4 opacity-20" />
                <h3 className="text-lg font-semibold text-slate-500">No Simulation Data</h3>
                <p className="max-w-md text-center mt-2 text-sm">Run the Monte Carlo simulation to analyze schedule risk based on task variance (PERT) and active risk register events.</p>
                <Button variant="ghost" onClick={runSimulation} className="mt-6" icon={TrendingUp}>
                    Start Analysis
                </Button>
           </div>
       ) : (
           <div className={theme.layout.sectionSpacing}>
                <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
                    <StatCard 
                        title="Deterministic Duration" 
                        value={`${results.deterministic} Days`} 
                        subtext="Based on Critical Path only" 
                        icon={AlertCircle} 
                    />
                    <StatCard 
                        title="P50 Confidence" 
                        value={`${results.p50} Days`} 
                        subtext="50% likelihood of meeting" 
                        icon={TrendingUp} 
                        trend={results.p50 > results.deterministic ? 'down' : 'up'}
                    />
                    <StatCard 
                        title="P80 Confidence" 
                        value={`${results.p80} Days`} 
                        subtext="Target for High Reliability" 
                        icon={TrendingUp} 
                    />
                    <StatCard 
                        title="Risk Contingency" 
                        value={`+${results.p80 - results.deterministic} Days`} 
                        subtext="Recommended Schedule Buffer" 
                        icon={Info} 
                    />
                </div>

                <div className={`${theme.components.card} ${theme.layout.cardPadding} h-[500px]`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={theme.typography.h3}>Duration Frequency & Cumulative Probability (S-Curve)</h3>
                        <div className="flex gap-4 text-xs">
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-300"></div> Frequency</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-1 bg-nexus-500"></div> Probability %</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={results.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="range" tick={{fontSize: 10}} label={{ value: 'Project Duration (Days)', position: 'bottom', offset: 0 }} />
                            <YAxis yAxisId="left" label={{ value: 'Frequency', angle: -90, position: 'insideLeft', style: {fontSize: 12} }} />
                            <YAxis yAxisId="right" orientation="right" unit="%" label={{ value: 'Probability', angle: 90, position: 'insideRight', style: {fontSize: 12} }} />
                            <Tooltip 
                                contentStyle={theme.charts.tooltip}
                                labelStyle={{fontWeight: 'bold', color: '#1e293b'}}
                            />
                            <Bar yAxisId="left" dataKey="frequency" fill="#cbd5e1" name="Frequency" barSize={30} radius={[4, 4, 0, 0]} />
                            <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#0ea5e9" strokeWidth={3} name="Cumulative Probability" dot={false} />
                            
                            <ReferenceLine x={results.data.find((d:any) => d.cumulative >= 50)?.range} stroke="#22c55e" strokeDasharray="3 3" label={{ value: 'P50', fill: '#22c55e', fontSize: 12 }} yAxisId="left" />
                            <ReferenceLine x={results.data.find((d:any) => d.cumulative >= 80)?.range} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'P80', fill: '#f59e0b', fontSize: 12 }} yAxisId="left" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
           </div>
       )}
    </div>
  );
};

export default QuantitativeAnalysis;
