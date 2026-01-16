
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { RefreshCw, Filter, Layers, Zap } from 'lucide-react';

interface PivotConfigPanelProps {
    rowField: string;
    setRowField: (f: string) => void;
    colField: string;
    setColField: (f: string) => void;
    valField: string;
    setValField: (f: string) => void;
    availablePivotFields: string[];
    availableAggregateFields: string[];
    onRecalculate: () => void;
}

export const PivotConfigPanel: React.FC<PivotConfigPanelProps> = ({
    rowField, setRowField, colField, setColField, valField, setValField,
    availablePivotFields, availableAggregateFields, onRecalculate
}) => {
    const theme = useTheme();
    return (
        <div className={`p-4 flex flex-wrap gap-6 items-center bg-slate-50/50`}>
            
            <div className="flex flex-col gap-1 relative z-10 min-w-[160px]">
                <label className={`text-[9px] font-black ${theme.colors.text.tertiary} uppercase tracking-[0.2em] ml-1 flex items-center gap-2`}><Layers size={10}/> Rows</label>
                <select className={`${theme.colors.background} border ${theme.colors.border} rounded-lg py-1.5 px-3 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-nexus-500/10 focus:border-nexus-500 transition-all cursor-pointer shadow-sm`} value={rowField} onChange={e => setRowField(e.target.value)}>
                    {availablePivotFields.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>

            <div className="flex flex-col gap-1 relative z-10 min-w-[160px]">
                <label className={`text-[9px] font-black ${theme.colors.text.tertiary} uppercase tracking-[0.2em] ml-1 flex items-center gap-2`}><Filter size={10}/> Columns</label>
                <select className={`${theme.colors.background} border ${theme.colors.border} rounded-lg py-1.5 px-3 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-nexus-500/10 focus:border-nexus-500 transition-all cursor-pointer shadow-sm`} value={colField} onChange={e => setColField(e.target.value)}>
                    {availablePivotFields.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>

            <div className="flex flex-col gap-1 relative z-10 min-w-[160px]">
                <label className={`text-[9px] font-black ${theme.colors.text.tertiary} uppercase tracking-[0.2em] ml-1 flex items-center gap-2`}><Zap size={10}/> Values</label>
                <select className={`${theme.colors.background} border ${theme.colors.border} rounded-lg py-1.5 px-3 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-nexus-500/10 focus:border-nexus-500 transition-all cursor-pointer shadow-sm`} value={valField} onChange={e => setValField(e.target.value)}>
                    {availableAggregateFields.map(f => <option key={f} value={f}>Sum of {f}</option>)}
                </select>
            </div>

            <div className="ml-auto relative z-10 pt-4">
                <Button size="sm" variant="secondary" icon={RefreshCw} onClick={onRecalculate} className="font-black uppercase tracking-widest text-[10px]">Recalculate</Button>
            </div>
        </div>
    );
};
