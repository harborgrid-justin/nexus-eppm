import React from 'react';
import { ChangeOrder } from '../../../types/index';
import { DollarSign, Calendar, AlertTriangle, TrendingUp, Clock, Target, ArrowRight } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';

interface ChangeOrderImpactProps {
    co: ChangeOrder;
    isReadOnly: boolean;
    onChange: (field: keyof ChangeOrder, value: any) => void;
}

export const ChangeOrderImpact: React.FC<ChangeOrderImpactProps> = ({ co, isReadOnly, onChange }) => {
    const theme = useTheme();
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className={`${theme.components.card} p-10 rounded-[3rem] bg-white shadow-sm border-slate-100 relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 p-24 bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em] mb-10 flex items-center gap-3 border-b border-slate-50 pb-5 relative z-10">
                        <DollarSign className="text-green-600" size={20}/> Fiscal Exposure Vector
                    </h3>
                    <div className="flex flex-col gap-10 relative z-10">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">Proposed Capital Delta</label>
                            <div className="relative group/input">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-2xl group-focus-within/input:text-green-500 transition-colors">$</span>
                                <input 
                                    type="number" 
                                    value={co.amount}
                                    onChange={(e) => onChange('amount', parseFloat(e.target.value))}
                                    disabled={isReadOnly}
                                    className={`w-full pl-12 p-5 border-2 ${theme.colors.border} rounded-[2rem] text-3xl font-black font-mono text-slate-900 focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none transition-all shadow-inner bg-slate-50/30`}
                                />
                            </div>
                        </div>
                        <div className={`p-6 rounded-[2rem] bg-slate-900 text-white flex items-center justify-between shadow-2xl relative overflow-hidden`}>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-3 bg-white/10 rounded-2xl border border-white/10 shadow-inner">
                                    <TrendingUp size={24} className="text-nexus-400"/>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Baseline Variance</p>
                                    <p className="text-xl font-black font-mono tracking-tighter text-green-400">+{formatPercentage(0.4, 2)}</p>
                                </div>
                            </div>
                            <ArrowRight size={20} className="text-slate-700 absolute right-6 opacity-30"/>
                        </div>
                    </div>
                </div>

                <div className={`${theme.components.card} p-10 rounded-[3rem] bg-white shadow-sm border-slate-100 relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 p-24 bg-red-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em] mb-10 flex items-center gap-3 border-b border-slate-50 pb-5 relative z-10">
                        <Clock className="text-red-500" size={20}/> Temporal Schedule Shift
                    </h3>
                    <div className="flex flex-col gap-10 relative z-10">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">Critical Path Impact</label>
                            <div className="relative group/input">
                                <input 
                                    type="number" 
                                    value={co.scheduleImpactDays}
                                    onChange={(e) => onChange('scheduleImpactDays', parseInt(e.target.value))}
                                    disabled={isReadOnly}
                                    className={`w-full p-5 border-2 ${theme.colors.border} rounded-[2rem] text-3xl font-black font-mono text-slate-900 focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none transition-all shadow-inner bg-slate-50/30 pr-16`}
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Days</span>
                            </div>
                        </div>
                        <div className={`p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center gap-5 shadow-inner`}>
                            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm text-red-500">
                                <AlertTriangle size={24}/>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Risk Rating</p>
                                <p className="text-lg font-black text-slate-800 tracking-tight uppercase">High Volatility Vector</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={`p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl border border-white/5 group`}>
                <div className="absolute top-0 right-0 p-32 bg-nexus-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-nexus-500/15 transition-colors duration-700"></div>
                <div className="relative z-10 flex gap-8 items-start">
                    <div className="p-4 bg-white/10 rounded-3xl border border-white/10 shadow-inner">
                        <Target size={32} className="text-nexus-400"/>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-black text-lg tracking-tight uppercase mb-2">Automated Impact Re-Calculation</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium uppercase tracking-tight max-w-2xl">
                            Submitting these values will trigger a stochastic simulation of the project roadmap. The CPM engine will re-evaluate all driving predecessors and update downstream milestones across the organizational graph.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};