
import React from 'react';
import { Target, TrendingUp, ShieldAlert } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface StrategicDriversProps {
    weights: { financial: number; strategic: number; risk: number };
    onWeightChange: (weights: { financial: number; strategic: number; risk: number }) => void;
}

export const StrategicDrivers: React.FC<StrategicDriversProps> = ({ weights, onWeightChange }) => {
    const theme = useTheme();

    const handleChange = (key: 'financial' | 'strategic' | 'risk', val: string) => {
        const numVal = parseFloat(val) / 100;
        onWeightChange({ ...weights, [key]: numVal });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-8 items-center flex-1 w-full">
            <div className="flex-1 space-y-3 w-full">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><TrendingUp size={14} className="text-blue-500"/> Financial Gain</span>
                    <span className="text-slate-900 font-mono">{(weights.financial * 100).toFixed(0)}%</span>
                </div>
                <input 
                    type="range" min="0" max="100" 
                    value={weights.financial * 100} 
                    onChange={e => handleChange('financial', e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 shadow-inner"
                />
            </div>
            <div className="flex-1 space-y-3 w-full">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Target size={14} className="text-green-500"/> Strategic Intent</span>
                    <span className="text-slate-900 font-mono">{(weights.strategic * 100).toFixed(0)}%</span>
                </div>
                <input 
                    type="range" min="0" max="100" 
                    value={weights.strategic * 100} 
                    onChange={e => handleChange('strategic', e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600 shadow-inner"
                />
            </div>
            <div className="flex-1 space-y-3 w-full">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><ShieldAlert size={14} className="text-red-500"/> Risk Boundary</span>
                    <span className="text-slate-900 font-mono">{(weights.risk * 100).toFixed(0)}%</span>
                </div>
                <input 
                    type="range" min="0" max="100" 
                    value={weights.risk * 100} 
                    onChange={e => handleChange('risk', e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600 shadow-inner"
                />
            </div>
        </div>
    );
};
