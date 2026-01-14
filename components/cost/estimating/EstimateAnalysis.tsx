import React from 'react';
import { CostEstimate, CostEstimateItem } from '../../../types/index';
import { PieChart, Calculator, ShieldCheck, Activity } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatCurrency, formatCompactCurrency } from '../../../utils/formatters';
import { useTheme } from '../../../context/ThemeContext';
import { Badge } from '../../ui/Badge';

interface EstimateAnalysisProps {
  estimate: CostEstimate;
  chartData: { name: string; value: number }[];
  colors: string[];
  estimateClasses: { id: string; accuracy: string; description?: string }[];
}

export const EstimateAnalysis: React.FC<EstimateAnalysisProps> = ({ estimate, chartData, colors, estimateClasses }) => {
  const theme = useTheme();
  
  const selectedClass = estimateClasses.find(c => c.id === estimate.class);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full animate-in fade-in duration-500">
        <div className={`${theme.components.card} p-10 rounded-[2.5rem] flex flex-col shadow-sm bg-white`}>
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-10 flex items-center gap-3 border-b border-slate-50 pb-4">
                <PieChart size={18} className="text-nexus-600"/> Resource Mix Allocation
            </h3>
            <div className="flex-1 min-h-[300px]">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="rgba(0,0,0,0)" />)}
                            </Pie>
                            <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.1em' }} />
                        </RePieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full nexus-empty-pattern rounded-3xl flex items-center justify-center italic text-slate-400">No cost data points.</div>
                )}
            </div>
        </div>

        <div className="space-y-8">
            <div className={`${theme.components.card} p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl group`}>
                <div className="absolute top-0 right-0 p-24 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors"></div>
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-nexus-400 mb-8 border-b border-white/10 pb-4 flex items-center gap-2">
                    <Calculator size={16}/> Estimating Precision Baseline
                </h3>
                <div className="space-y-8 relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">AACE Classification</p>
                            <p className="text-xl font-black tracking-tight">{estimate.class}</p>
                        </div>
                        <Badge variant="success" className="bg-green-500/20 text-green-400 border-green-500/20 uppercase tracking-widest font-black">VALIDATED ✓</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Model Variance</p>
                            <p className="text-2xl font-black font-mono text-nexus-400">{selectedClass?.accuracy || '---'}</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Item Volume</p>
                            <p className="text-2xl font-black font-mono">{estimate.items.length}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium uppercase tracking-tight italic">
                            "{selectedClass?.description || 'Definitive estimate based on certified vendor quotes and historical project artifacts.'}"
                        </p>
                    </div>
                </div>
            </div>

            <div className={`${theme.components.card} p-8 rounded-[2rem] bg-white border-slate-100 shadow-sm space-y-6`}>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} className="text-green-500"/> Governance Assertion
                </h4>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                        <span>Basis of Estimate Present</span>
                        <div className="w-5 h-5 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-200"><ShieldCheck size={12}/></div>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                        <span>Three-Point Model Applied</span>
                        <div className="w-5 h-5 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-200"><ShieldCheck size={12}/></div>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-slate-400 opacity-50">
                        <span>External Peer Review</span>
                        <div className="w-5 h-5 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center border border-slate-200 font-mono text-[8px]">--</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};