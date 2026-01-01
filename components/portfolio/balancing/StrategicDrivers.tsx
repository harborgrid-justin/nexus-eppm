
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
        <div className="flex gap-6 items-center flex-1">
            <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><TrendingUp size={12}/> Financial</span>
                    <span>{(weights.financial * 100).toFixed(0)}%</span>
                </div>
                <input 
                    type="range" min="0" max="100" 
                    value={weights.financial * 100} 
                    onChange={e => handleChange('financial', e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Target size={12}/> Strategic</span>
                    <span>{(weights.strategic * 100).toFixed(0)}%</span>
                </div>
                <input 
                    type="range" min="0" max="100" 
                    value={weights.strategic * 100} 
                    onChange={e => handleChange('strategic', e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><ShieldAlert size={12}/> Risk Adj.</span>
                    <span>{(weights.risk * 100).toFixed(0)}%</span>
                </div>
                <input 
                    type="range" min="0" max="100" 
                    value={weights.risk * 100} 
                    onChange={e => handleChange('risk', e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
            </div>
        </div>
    );
};
