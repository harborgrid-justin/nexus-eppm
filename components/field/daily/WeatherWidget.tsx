import React from 'react';
import { Sun, CloudRain, Cloud, Wind, Thermometer, RefreshCw } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useTheme } from '../../../context/ThemeContext';

interface WeatherWidgetProps {
    weather: { condition: string; temperature: string; wind?: string; precipitation?: string };
    onAdjust: () => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, onAdjust }) => {
    const theme = useTheme();
    
    const getIcon = (cond: string) => {
        const c = cond.toLowerCase();
        if (c.includes('rain')) return <CloudRain size={32} className="text-blue-500 animate-bounce" />;
        if (c.includes('cloud')) return <Cloud size={32} className="text-slate-400" />;
        if (c.includes('wind')) return <Wind size={32} className="text-slate-500 animate-pulse" />;
        return <Sun size={32} className="text-yellow-500 animate-spin-slow" />;
    };

    return (
        <div className={`${theme.components.card} p-8 rounded-[2.5rem] flex flex-col justify-between shadow-sm relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-8 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-6 z-10 relative">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-slate-50 pb-2">
                    <Thermometer size={14} className="text-nexus-600"/> Site Atmospheric Ingestion
                </h3>
                <button onClick={onAdjust} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-nexus-600 transition-all active:scale-95">
                    <RefreshCw size={14}/>
                </button>
            </div>
            
            <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-inner z-10 relative">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-100">
                        {getIcon(weather.condition)}
                    </div>
                    <div>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{weather.temperature}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{weather.condition}</p>
                    </div>
                </div>
                <div className="text-right space-y-2">
                    {weather.wind && (
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-slate-400 uppercase">Wind Vector</span>
                            <span className="text-xs font-bold text-slate-700">{weather.wind}</span>
                        </div>
                    )}
                    {weather.precipitation && (
                        <div className="flex flex-col items-end">
                             <span className="text-[8px] font-black text-slate-400 uppercase">Precipitation</span>
                             <span className="text-xs font-bold text-blue-600">{weather.precipitation}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};