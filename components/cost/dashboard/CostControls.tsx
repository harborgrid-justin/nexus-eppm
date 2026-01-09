
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface CostControlsProps {
    includeRisk: boolean;
    setIncludeRisk: (v: boolean) => void;
    includePendingChanges: boolean;
    setIncludePendingChanges: (v: boolean) => void;
}

export const CostControls: React.FC<CostControlsProps> = ({ 
    includeRisk, setIncludeRisk, includePendingChanges, setIncludePendingChanges 
}) => {
    const theme = useTheme();
    return (
        <div className={`${theme.components.card} p-6 flex flex-col xl:flex-row justify-between items-center gap-6 bg-slate-50/50`}>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-nexus-600 text-white rounded-xl shadow-lg shadow-nexus-500/30"><TrendingUp size={24}/></div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">EAC Multi-Variate Analysis</h2>
                    <p className="text-xs text-slate-500 font-medium">Configure forecast inclusions to adjust the Performance Measurement Baseline.</p>
                </div>
            </div>
            <div className="flex gap-8 border-l border-slate-200 pl-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={includeRisk} onChange={e => setIncludeRisk(e.target.checked)} className="w-4 h-4 rounded text-nexus-600 focus:ring-nexus-500 border-slate-300" />
                    <span className="text-sm font-bold text-slate-700 group-hover:text-nexus-600 transition-colors">Projected Risk EMV</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={includePendingChanges} onChange={e => setIncludePendingChanges(e.target.checked)} className="w-4 h-4 rounded text-nexus-600 focus:ring-nexus-500 border-slate-300" />
                    <span className="text-sm font-bold text-slate-700 group-hover:text-nexus-600 transition-colors">Pending Changes</span>
                </label>
            </div>
        </div>
    );
};
