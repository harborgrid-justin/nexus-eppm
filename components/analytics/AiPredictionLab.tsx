
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BrainCircuit, Activity, RefreshCw, Settings, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { ProgressBar } from '../common/ProgressBar';
import { Card } from '../ui/Card';

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
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} bg-slate-900 text-white`}>
            <div className="flex justify-between items-start mb-8">
                <TemplateHeader number="61" title="AI Prediction Lab" subtitle="Experimental model training & testing" />
                <div className="flex gap-2">
                    <Button variant="secondary" icon={Settings}>Config</Button>
                    <Button icon={Play} className="bg-purple-600 hover:bg-purple-500 text-white border-0">Run Model</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2"><BrainCircuit className="text-purple-400"/> Model Performance</h3>
                        <div className="flex gap-2">
                            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-700">v2.1.0-beta</span>
                        </div>
                    </div>
                    <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-700 p-4 flex items-center justify-center relative overflow-hidden min-h-[400px]">
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <Activity size={200} className="text-purple-500 animate-pulse"/>
                        </div>
                        <div className="z-10 text-center">
                             <div className="text-6xl font-black text-white mb-2">94.2%</div>
                             <div className="text-sm text-purple-300 font-mono">CONFIDENCE INTERVAL</div>
                             <div className="mt-8 grid grid-cols-3 gap-8 text-left">
                                 <div>
                                     <div className="text-xs text-slate-500 uppercase font-bold">Loss</div>
                                     <div className="text-xl font-mono text-white">0.042</div>
                                 </div>
                                 <div>
                                     <div className="text-xs text-slate-500 uppercase font-bold">Epoch</div>
                                     <div className="text-xl font-mono text-white">420</div>
                                 </div>
                                 <div>
                                     <div className="text-xs text-slate-500 uppercase font-bold">Batch</div>
                                     <div className="text-xl font-mono text-white">64</div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Input Variables (Features)</h4>
                        <div className="space-y-3">
                            {[
                                { label: 'Historical Cost Variance', weight: 85 },
                                { label: 'Schedule Slippage Rate', weight: 62 },
                                { label: 'Risk Register Volume', weight: 45 },
                                { label: 'Team Velocity Trend', weight: 78 }
                            ].map(v => (
                                <div key={v.label} className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-slate-200">{v.label}</span>
                                        <span className="text-xs font-mono text-purple-300">{v.weight}%</span>
                                    </div>
                                    <div className="w-full bg-slate-600 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-purple-500 h-full" style={{ width: `${v.weight}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-2xl border border-purple-500/30 p-6">
                        <h4 className="font-bold text-white mb-2 flex items-center gap-2"><RefreshCw size={16} className="animate-spin"/> Training Status</h4>
                        <p className="text-sm text-purple-200 leading-relaxed opacity-80 mb-4">
                            Model is currently retraining on last night's data warehouse snapshot. Estimated completion in 12 minutes.
                        </p>
                        <Button size="sm" className="w-full bg-white/10 hover:bg-white/20 text-white border-0">View Logs</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
