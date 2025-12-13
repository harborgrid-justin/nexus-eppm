
import React, { useState, useMemo } from 'react';
import { useProjectState } from '../../hooks';
import { BarChart2, RefreshCw, TrendingUp, Info, Play, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { getDaysDiff } from '../../utils/dateUtils';
import StatCard from '../shared/StatCard';

interface QuantitativeAnalysisProps {
  projectId: string;
}

const QuantitativeAnalysis: React.FC<QuantitativeAnalysisProps> = ({ projectId }) => {
  const { project, risks } = useProjectState(projectId);
  const theme = useTheme();
  const [iterations, setIterations] = useState(1000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any | null>(null);

  // Helper: PERT Random Generator using Box-Muller transform approximation or simple triangular distribution
  const pertRandom = (min: number, likely: number, max: number) => {
    // Simple triangular distribution approximation
    const u = Math.random();
    const f = (likely - min) / (max - min);
    if (u <= f) {
      return min + Math.sqrt(u * (max - min) * (likely - min));
    } else {
      return max - Math.sqrt((1 - u) * (max - min) * (max - likely));
    }
  };

  const runSimulation = () => {
    if (!project) return;
    setIsSimulating(true);

    // Use setTimeout to allow UI to update to "Running..." state
    setTimeout(() => {
        const simResults = [];
        const baseDuration = getDaysDiff(project.startDate, project.endDate);
        
        // Identify tasks impacting duration (Simplified Critical Path)
        const criticalTasks = project.tasks.filter(t => t.critical || t.duration > 15);

        for (let i = 0; i < iterations; i++) {
            let iterationDuration = 0;
            
            // 1. Aleatory Uncertainty (Task Variance)
            criticalTasks.forEach(task => {
                // Assume -10% (Opt) to +25% (Pess) variance for demo if no specific risk data
                const opt = task.duration * 0.9;
                const likely = task.duration;
                const pess = task.duration * 1.25;
                iterationDuration += pertRandom(opt, likely, pess);
            });

            // 2. Epistemic Uncertainty (Discrete Risk Events)
            risks.filter(r => r.status === 'Open').forEach(risk => {
                const trigger = Math.random();
                const probThreshold = risk.probability === 'High' ? 0.7 : risk.probability === 'Medium' ? 0.4 : 0.1;
                
                if (trigger < probThreshold) {
                    // Risk occurred: Add impact delay (Mock impact based on score)
                    // Score 1-25. Assume 1 score point = 1 day delay for simplicity
                    iterationDuration += (risk.score * 0.5); 
                }
            });

            simResults.push(Math.round(iterationDuration));
        }

        simResults.sort((a, b) => a - b);

        // Calculate Percentiles
        const p50 = simResults[Math.floor(simResults.length * 0.50)];
        const p80 = simResults[Math.floor(simResults.length * 0.80)];
        const p90 = simResults[Math.floor(simResults.length * 0.90)];

        // Generate Histogram Buckets
        const minVal = simResults[0];
        const maxVal = simResults[simResults.length - 1];
        const bucketCount = 20;
        const bucketSize = (maxVal - minVal) / bucketCount;
        
        const histogramData = [];
        let cumulativeCount = 0;

        for (let b = 0; b < bucketCount; b++) {
            const start = minVal + (b * bucketSize);
            const end = start + bucketSize;
            const count = simResults.filter(r => r >= start && r < end).length;
            cumulativeCount += count;
            
            histogramData.push({
                range: `${Math.round(start)}d`,
                frequency: count,
                cumulative: (cumulativeCount / iterations) * 100,
                rawRange: start
            });
        }

        setResults({
            p50, p80, p90,
            minVal, maxVal,
            data: histogramData,
            deterministic: baseDuration
        });
        setIsSimulating(false);
    }, 500);
  };

  if (!project) return <div className="p-6">Loading project context...</div>;

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in`}>
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
             <button 
                onClick={runSimulation}
                disabled={isSimulating}
                className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium disabled:opacity-50 transition-all`}
             >
                {isSimulating ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                {isSimulating ? 'Running Model...' : 'Run Simulation'}
             </button>
          </div>
       </div>

       {!results ? (
           <div className="flex flex-col items-center justify-center h-[400px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                <BarChart2 size={64} className="mb-4 opacity-20" />
                <h3 className="text-lg font-semibold text-slate-500">No Simulation Data</h3>
                <p className="max-w-md text-center mt-2 text-sm">Run the Monte Carlo simulation to analyze schedule risk based on task variance (PERT) and active risk register events.</p>
                <button onClick={runSimulation} className="mt-6 text-nexus-600 hover:text-nexus-800 font-medium text-sm flex items-center gap-2">
                    Start Analysis <TrendingUp size={14} />
                </button>
           </div>
       ) : (
           <div className="space-y-6">
                {/* Confidence Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

                {/* Main Chart */}
                <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm h-[500px]`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Duration Frequency & Cumulative Probability (S-Curve)</h3>
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
                                contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0'}}
                                labelStyle={{fontWeight: 'bold', color: '#1e293b'}}
                            />
                            <Bar yAxisId="left" dataKey="frequency" fill="#cbd5e1" name="Frequency" barSize={30} radius={[4, 4, 0, 0]} />
                            <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#0ea5e9" strokeWidth={3} name="Cumulative Probability" dot={false} />
                            
                            {/* Reference Lines for P-Values */}
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
