
import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Card } from '../../ui/Card';

export const ComparisonTmpl: React.FC = () => {
    const theme = useTheme();
    const [mode, setMode] = useState<'Side' | 'Overlay'>('Side');

    return (
        <div className="h-full flex flex-col bg-slate-100">
            <div className="p-4 border-b bg-white flex justify-between items-center gap-8 shadow-sm z-10 sticky top-0">
                <div className="flex items-center gap-8">
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Baseline 1</p>
                        <p className="font-bold text-slate-800">Jan 01, 2024</p>
                    </div>
                    <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500">VS</div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Forecast</p>
                        <p className="font-bold text-nexus-600">Live Data</p>
                    </div>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setMode('Side')} className={`px-3 py-1 rounded text-xs font-bold ${mode === 'Side' ? 'bg-white shadow' : 'text-slate-500'}`}>Side-by-Side</button>
                    <button onClick={() => setMode('Overlay')} className={`px-3 py-1 rounded text-xs font-bold ${mode === 'Overlay' ? 'bg-white shadow' : 'text-slate-500'}`}>Overlay</button>
                </div>
            </div>
            
            <div className={`flex-1 flex overflow-hidden p-6 gap-6 ${mode === 'Overlay' ? 'items-center justify-center' : ''}`}>
                {/* Left Card */}
                <div className={`flex-1 flex flex-col transition-all ${mode === 'Overlay' ? 'absolute w-2/3 h-2/3 z-0 translate-x-4 translate-y-4 opacity-50' : ''}`}>
                     <Card className="flex-1 p-0 overflow-hidden border-dashed border-2">
                        <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-600 text-sm">Original Plan</div>
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                                <span className="text-sm text-slate-500">Total Budget</span>
                                <span className="text-xl font-mono font-bold text-slate-700">$500,000</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                                <span className="text-sm text-slate-500">Finish Date</span>
                                <span className="text-xl font-mono font-bold text-slate-700">Dec 15</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                                <span className="text-sm text-slate-500">Duration</span>
                                <span className="text-xl font-mono font-bold text-slate-700">240 Days</span>
                            </div>
                        </div>
                     </Card>
                </div>

                {/* Right Card */}
                <div className={`flex-1 flex flex-col transition-all ${mode === 'Overlay' ? 'absolute w-2/3 h-2/3 z-10 -translate-x-4 -translate-y-4 shadow-2xl' : ''}`}>
                    <Card className="flex-1 p-0 overflow-hidden border-nexus-200 shadow-md ring-1 ring-nexus-500/10">
                        <div className="bg-nexus-50 p-4 border-b border-nexus-100 font-bold text-nexus-800 text-sm">Current Trajectory</div>
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                                <span className="text-sm text-slate-500">Forecast Cost (EAC)</span>
                                <span className="text-xl font-mono font-bold text-red-600">$550,000</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                                <span className="text-sm text-slate-500">Forecast Finish</span>
                                <span className="text-xl font-mono font-bold text-green-600">Dec 10</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                                <span className="text-sm text-slate-500">Remaining Duration</span>
                                <span className="text-xl font-mono font-bold text-slate-800">180 Days</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            
            <div className="p-4 text-center text-xs text-slate-500 italic">
                Delta: <span className="text-red-600 font-bold">+$50k Cost</span>, <span className="text-green-600 font-bold">-5 Days Schedule</span>
            </div>
        </div>
    );
};
