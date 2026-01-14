import React from 'react';
import { ChangeOrder } from '../../../types/index';
import { DollarSign, Calendar, AlertTriangle, TrendingUp, Clock, Target } from 'lucide-react';
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
            <div className={`${theme.components.card} p-8 rounded-[2.5rem] bg-white shadow-sm border-slate-100 relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 p-16 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-colors"></div>
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-10 flex items-center gap-3 border-b border-slate-50 pb-4 relative z-10">
                    <DollarSign className="text-green-600" size={20}/> Fiscal Exposure Vector
                </h3>
                <div className="flex flex-col gap-8 relative z-10">
                    <div className="flex-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5 ml-1">Proposed Cost Delta</label>
                        <div className="relative group/input">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl group-focus-within/input:text-green-500 transition-colors">$</span>
                            <input 
                                type="number" 
                                value={co.amount}
                                onChange={(e) => onChange('amount', parseFloat(e.target.value))}
                                disabled={isReadOnly}
                                className={`w-full pl-10 p-4 border-2 ${theme.colors.border} rounded-2xl text-2xl font-black font-mono text-slate-900 focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none transition-all shadow-inner`}
                            />
                        </div>
                    </div>
                    <div className={`p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between`}>
                        <div className="flex items-center gap-3">