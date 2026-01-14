
import React from 'react';
import { ChangeOrder } from '../../../types';
import { DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface ChangeOrderImpactProps {
    co: ChangeOrder;
    isReadOnly: boolean;
    onChange: (field: keyof ChangeOrder, value: any) => void;
}

export const ChangeOrderImpact: React.FC<ChangeOrderImpactProps> = ({ co, isReadOnly, onChange }) => {
    const theme = useTheme();
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${theme.components.card} p-6`}>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <DollarSign className="text-green-600" size={18}/> Cost Impact
                </h3>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Net Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <input 
                                type="number" 
                                value={co.amount}
                                onChange={(e) => onChange('amount', parseFloat(e.target.value))}
                                disabled={isReadOnly}
                                className={`w-full pl-7 p-2 border ${theme.colors.border} rounded-md text-lg font-bold text-slate-900 focus:ring-2 focus:ring-nexus-500 outline-none`}
                            />
                        </div>
                    </div>
                    <div className={`text-sm text-slate-500 ${theme.colors.background} p-3 rounded-lg max-w-[150px] border ${theme.colors.border}`}>
                        This represents {(co.amount / 5000000 * 100).toFixed(2)}% of the original budget.
                    </div>
                </div>
            </div>

            <div className={`${theme.components.card} p-6`}>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Calendar className="text-blue-600" size={18}/> Schedule Impact
                </h3>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Time Extension</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={co.scheduleImpactDays || 0}
                                onChange={(e) => onChange('scheduleImpactDays', parseFloat(e.target.value))}
                                disabled={isReadOnly}
                                className={`w-full p-2 border ${theme.colors.border} rounded-md text-lg font-bold text-slate-900 focus:ring-2 focus:ring-nexus-500 outline-none`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">Days</span>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 ${theme.colors.semantic.warning.text} ${theme.colors.semantic.warning.bg} px-3 py-2 rounded-lg text-xs font-bold border ${theme.colors.semantic.warning.border}`}>
                        <AlertTriangle size={14}/> Critical Path
                    </div>
                </div>
            </div>
            </div>

            <div className={`${theme.colors.background} border ${theme.colors.border} rounded-xl p-5`}>
                <h4 className="text-sm font-bold text-slate-800 mb-2">Scope Impact Statement</h4>
                <textarea 
                    className={`w-full p-3 ${theme.colors.surface} border ${theme.colors.border} rounded-lg text-sm h-24 focus:ring-2 focus:ring-nexus-500 outline-none resize-none`}
                    placeholder="Describe impact on deliverables, quality, or safety..."
                    disabled={isReadOnly}
                />
            </div>
        </div>
    );
};
