
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BrainCircuit, Activity, RefreshCw, Settings, Play, Database, TrendingUp, AlertOctagon } from 'lucide-react';
import { Button } from '../ui/Button';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';

const TemplateHeader = ({ number, title, subtitle }: { number: string, title: string, subtitle?: string }) => (
    <div className="flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono text-lg font-bold shadow-lg shadow-slate-200 shrink-0">
            {number}
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
        </div>
    </div>
);

export const AiPredictionLab: React.FC = () => {
    const theme = useTheme();
    const [isTraining, setIsTraining] = useState(false);
    
    // Mock Training Data (Loss vs Accuracy)
    const trainingData = Array.from({length: 20}, (_, i) => ({
        epoch: i + 1,
        loss: Math.max(0.1, 1 - (i * 0.04) - (Math.random() * 0.1)),
        accuracy: Math.min(0.98, 0.5 + (i * 0.02) + (Math.random() * 0.05))
    }));

    const handleTrain = () => {
        setIsTraining(true);
        setTimeout(() => setIsTraining(false), 3000);
    };

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} bg-slate-950 text-white`}>
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                     <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/30 text-purple-400">
                         <BrainCircuit size={32} />
                     </div>
                     <div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase">Predictive Intelligence Lab</h2>
                        <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Model Training & Inference Engine</p>
                     </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" icon={Settings} className="bg-white/10 text-white border-white/10 hover:bg-white/20">Config</Button>
                    <Button icon={isTraining ? RefreshCw : Play} onClick={handleTrain} className={`bg-purple-600 hover:bg-purple-500 text-white border-0 ${isTraining ? 'animate-pulse' : ''}`}>
                        {isTraining ? 'Training Model...' : 'Run Simulation'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Main Performance Chart */}
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h3 className="font-bold text-lg flex items-center gap-3 text-slate-200">
                                <Activity className="text-purple-500"/> Model Convergence (Loss vs Accuracy)
                            </h3>
                            <div className="flex gap-2 text-xs font-mono text-slate-500 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                                <span>EPOCH: 420</span>
                                <span>|</span>
                                <span>BATCH: 64</span>
                            </div>
                        </div>
                        <div className="h-[350px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trainingData}>
                                    <defs>
                                        <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="epoch" tick={{fill: '#64748b', fontSize: 10}} />
                                    <YAxis tick={{fill: '#64748b', fontSize: 10}} />
                                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b'}} />
                                    <Legend />
                                    <Area type="monotone" dataKey="accuracy" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" name="Accuracy" />
                                    <Area type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} fillOpacity={0} name="Loss Function" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
                             <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Confidence Distribution</h4>
                             <div className="space-y-4">
                                 <div>
                                     <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                         <span>P90 (High Confidence)</span>
                                         <span className="text-green-400">94.2%</span>
                                     </div>
                                     <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                         <div className="bg-green-500 h-full w-[94.2%] shadow-[0_0_10px_#22c55e]"></div>
                                     </div>
                                 </div>
                                 <div>
                                     <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                         <span>P50 (Median)</span>
                                         <span className="text-blue-400">88.5%</span>
                                     </div>
                                     <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                         <div className="bg-blue-500 h-full w-[88.5%]"></div>
                                     </div>
                                 </div>
                             </div>
                         </div>

                         <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                             <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
                             <Database size={40} className="text-slate-600 mb-4 group-hover:text-purple-400 transition-colors"/>
                             <h3 className="text-2xl font-black text-white">1.4 TB</h3>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Training Dataset Size</p>
                         </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6">
                        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-6 border-b border-slate-700 pb-4">Feature Importance Weights</h4>
                        <div className="space-y-4">
                            {[
                                { label: 'Historical Cost Variance', weight: 85, color: 'bg-blue-500' },
                                { label: 'Schedule Slippage Rate', weight: 62, color: 'bg-pink-500' },
                                { label: 'Risk Register Volume', weight: 45, color: 'bg-orange-500' },
                                { label: 'Team Velocity Trend', weight: 78, color: 'bg-green-500' },
                                { label: 'Vendor Performance', weight: 34, color: 'bg-slate-500' }
                            ].map(v => (
                                <div key={v.label} className="group">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-xs font-bold text-slate-300">{v.label}</span>
                                        <span className="text-[10px] font-mono text-purple-300">{v.weight}%</span>
                                    </div>
                                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-700">
                                        <div className={`${v.color} h-full transition-all duration-1000`} style={{ width: `${v.weight}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-3xl border border-purple-500/30 p-8 shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="font-bold text-white mb-3 flex items-center gap-2 text-lg">
                                <AlertOctagon size={20} className="text-red-400"/> Anomaly Detection
                            </h4>
                            <p className="text-sm text-purple-100 leading-relaxed font-medium mb-6">
                                The inference engine detected <span className="text-white font-black">3 significant anomalies</span> in the Q3 cost projection data. Immediate review recommended.
                            </p>
                            <Button size="sm" className="w-full bg-white text-purple-900 hover:bg-purple-50 border-0 font-black uppercase tracking-widest">Review Anomalies</Button>
                        </div>
                        <div className="absolute -right-8 -bottom-8 opacity-20 rotate-12">
                             <TrendingUp size={120} className="text-white"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
