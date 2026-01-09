
import React from 'react';
import { BarChart2, Play, RefreshCw, AlertCircle, Info, TrendingUp, ShieldAlert } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useQuantitativeAnalysisLogic } from '../../hooks/domain/useQuantitativeAnalysisLogic';
import { Button } from '../ui/Button';
import { EmptyGrid } from '../common/EmptyGrid';
import StatCard from '../shared/StatCard';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

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

  if (!project) return null;

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in`}>
       {/* Header & Controls */}
       <div className={`${theme.components.card} p-4 flex flex-col md:flex-row justify-between items-center gap-4`}>
          <div>
              <h2 className={`${theme.typography.h2} flex items-center gap-2`}>
                  <BarChart2 className="text-nexus-600" size={24}/> Quantitative Risk Analysis
              </h2>
              <p className={theme.typography.small}>Monte Carlo Simulation (Schedule Risk)</p>
          </div>
          <div className="flex items-center gap-3">
              <select 
                  className={`p-2 border ${theme.colors.border} rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none font-medium text-slate-700`}
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                  disabled={isSimulating}
              >
                  <option value="500">500 Iterations</option>
                  <option value="1000">1,000 Iterations</option>
                  <option value="5000">5,000 Iterations</option>
              </select>
              <Button 
                  onClick={runSimulation} 
                  disabled={isSimulating}
                  icon={isSimulating ? RefreshCw : Play}
                  className={isSimulating ? 'animate-pulse' : ''}
              >
                  {isSimulating ? 'Running Model...' : 'Run Simulation'}
              </Button>
          </div>
       </div>

       {/* Results Area */}
       {!results ? (
           <div className="h-[500px] flex flex-col items-center justify-center">
               <EmptyGrid 
                   title="Simulation Required"
                   description="Run the Monte Carlo simulation to analyze schedule risk based on task variance (PERT) and active risk register events."
                   icon={BarChart2}
                   actionLabel="Start Analysis"
                   onAdd={runSimulation}
               />
           </div>
       ) : (
           <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
               {/* KPI Cards */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   <StatCard 
                       title="Deterministic Duration" 
                       value={`${results.deterministic} Days`} 
                       icon={Info} 
                       subtext="CPM Base Schedule"
                   />
                   <StatCard 
                       title="P50 Confidence" 
                       value={`${results.p50} Days`} 
                       icon={TrendingUp} 
                       subtext="50% Probability"
                       trend={results.p50 > results.deterministic ? 'down' : 'up'}
                   />
                   <StatCard 
                       title="P80 Confidence" 
                       value={`${results.p80} Days`} 
                       icon={AlertCircle} 
                       subtext="Target for Reliability"
                   />
                    <StatCard 
                       title="Risk Contingency" 
                       value={`+${results.p80 - results.deterministic} Days`} 
                       icon={ShieldAlert}
                       subtext="Required Schedule Buffer"
                   />
               </div>

               {/* Chart */}
               <div className={`${theme.components.card} ${theme.layout.cardPadding} h-[500px] flex flex-col`}>
                   <h3 className={`${theme.typography.h3} mb-6`}>Duration Frequency & Cumulative Probability (S-Curve)</h3>
                   <div className="flex-1 min-h-0">
                       <ResponsiveContainer width="100%" height="100%">
                           <ComposedChart data={results.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                               <XAxis 
                                   dataKey="range" 
                                   label={{ value: 'Project Duration (Days)', position: 'bottom', offset: 0, style: { fontSize: 12, fill: '#64748b' } }} 
                                   tick={{ fontSize: 11 }}
                               />
                               <YAxis yAxisId="left" label={{ value: 'Frequency', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }} />
                               <YAxis yAxisId="right" orientation="right" unit="%" />
                               <Tooltip 
                                   labelStyle={{ fontWeight: 'bold' }}
                                   contentStyle={theme.charts.tooltip}
                               />
                               <Bar yAxisId="left" dataKey="frequency" fill="#cbd5e1" name="Frequency" barSize={30} radius={[4, 4, 0, 0]} />
                               <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#0ea5e9" strokeWidth={3} name="Cumulative Probability" dot={false} />
                               
                               {/* P-Value Reference Lines */}
                               <ReferenceLine x={results.data.find(d => d.rawRange >= results.p50)?.range} stroke="#eab308" strokeDasharray="3 3" label={{ value: 'P50', fill: '#eab308', fontSize: 12, position: 'top' }} yAxisId="left" />
                               <ReferenceLine x={results.data.find(d => d.rawRange >= results.p80)?.range} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'P80', fill: '#ef4444', fontSize: 12, position: 'top' }} yAxisId="left" />
                           </ComposedChart>
                       </ResponsiveContainer>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default QuantitativeAnalysis;
