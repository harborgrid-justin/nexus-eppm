
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BrainCircuit, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { ProgressBar } from '../common/ProgressBar';

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
            <TemplateHeader number="61" title="AI Prediction Lab" subtitle="Experimental model training & testing" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2"><BrainCircuit className="text-purple-400"/> Model Performance</h3>
                        <div className="flex gap-2">
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white border-none">Retrain</Button>
                            <Button size="sm" variant="ghost-white">Parameters</Button>
                        </div>
                    </div>
                    <div className="h-[400px] w-full bg-slate-900/50 rounded-xl border border-slate-700 p-4 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <Activity size={200} className="text-purple-500 animate-pulse"/>
                        </div>
                        <p className="z-10 font-mono text-purple-300">Training Epoch 42/100... Loss: 0.042</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Input Variables</h4>
                        <div className="space-y-3">
                            {['Historical Cost', 'Schedule Variance', 'Risk Factors', 'Team Velocity'].map(v => (
                                <div key={v} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                                    <span className="text-sm font-medium">{v}</span>
                                    <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-2xl border border-purple-500/30 p-6">
                        <h4 className="font-bold text-white mb-2">Prediction Confidence</h4>
                        <div className="text-5xl font-black text-purple-400 mb-2">94.2%</div>
                        <ProgressBar value={94.2} colorClass="bg-purple-500" className="bg-slate-700"/>
                        <p className="text-xs text-purple-200 mt-2 opacity-70">Based on validation set (n=402)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
