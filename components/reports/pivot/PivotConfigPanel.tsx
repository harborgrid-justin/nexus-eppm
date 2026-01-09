
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { RefreshCw } from 'lucide-react';

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
        <div className={`${theme.colors.surface} p-4 rounded-xl border ${theme.colors.border} shadow-sm mb-6 flex flex-wrap gap-6 items-center`}>
            <div className="flex flex-col gap-1">
                <label className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest`}>Rows</label>
                <select className={`${theme.colors.background} border ${theme.colors.border} rounded-lg py-1.5 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-nexus-500`} value={rowField} onChange={e => setRowField(e.target.value)}>
                    {availablePivotFields.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>
            <div className="flex flex-col gap-1">
                <label className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest`}>Columns</label>
                <select className={`${theme.colors.background} border ${theme.colors.border} rounded-lg py-1.5 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-nexus-500`} value={colField} onChange={e => setColField(e.target.value)}>
                    {availablePivotFields.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>
            <div className="flex flex-col gap-1">
                <label className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest`}>Values</label>
                <select className={`${theme.colors.background} border ${theme.colors.border} rounded-lg py-1.5 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-nexus-500`} value={valField} onChange={e => setValField(e.target.value)}>
                    {availableAggregateFields.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>
            <div className="ml-auto">
                <Button size="sm" variant="ghost" icon={RefreshCw} onClick={onRecalculate}>Recalculate</Button>
            </div>
        </div>
    );
};
