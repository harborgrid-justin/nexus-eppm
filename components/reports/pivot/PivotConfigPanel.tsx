
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
        <div className={`${theme.colors.surface} p-6 rounded-[2rem] border ${theme.colors.border} shadow-sm mb-8 flex flex-wrap gap-10 items-center bg-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 p-12 bg-nexus-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col gap-2 relative z-10 min-w-[180px]">
                <label className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-[0.2em] ml-1 flex items-center gap-2`}><Layers size={12}/> Primary Axis (Rows)</label>
                <select className={`${theme.colors.background} border ${theme.colors.border} rounded-xl py-2 px-4 text-sm font-black text-slate-800 outline-none focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 transition-all cursor-pointer shadow-sm`} value={rowField} onChange={e => setRowField(e.target.value)}>
                    {availablePivotFields.map(f => <option key={f} value={f}>{f} Domain</option>)}
                </select>
            </div>

            <div className="flex flex-col gap-2 relative z-10 min-w-[180px]">
                <label className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-[0.2em] ml-1 flex items-center gap-2`}><Filter size={12}/> Secondary Axis (Cols)</label>
                <select className={`${theme.colors.background} border ${theme.colors.border} rounded-xl py-2 px-4 text-sm font-black text-slate-800 outline-none focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 transition-all cursor-pointer shadow-sm`} value={colField} onChange={e => setColField(e.target.value)}>
                    {availablePivotFields.map(f => <option key={f} value={f}>{f} Status</option>)}
                </select>
            </div>

            <div className="flex flex-col gap-2 relative z-10 min-w-[180px]">
                <label className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-[0.2em] ml-1 flex items-center gap-2`}><Zap size={12}/> Value Vector</label>
                <select className={`${theme.colors.background} border ${theme.colors.border} rounded-xl py-2 px-4 text-sm font-black text-slate-800 outline-none focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 transition-all cursor-pointer shadow-sm`} value={valField} onChange={e => setValField(e.target.value)}>
                    {availableAggregateFields.map(f => <option key={f} value={f}>Aggregated {f}</option>)}
                </select>
            </div>

            <div className="ml-auto relative z-10">
                <Button size="md" variant="secondary" icon={RefreshCw} onClick={onRecalculate} className="font-black uppercase tracking-widest text-[10px] h-11 px-8 rounded-xl">Recalculate Table</Button>
            </div>
        </div>
    );
};
