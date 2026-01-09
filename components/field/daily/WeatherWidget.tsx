
import React from 'react';
import { Sun, CloudRain, Cloud, Wind } from 'lucide-react';
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
        if (c.includes('rain')) return <CloudRain size={32} className="text-blue-500" />;
        if (c.includes('cloud')) return <Cloud size={32} className="text-slate-400" />;
        if (c.includes('wind')) return <Wind size={32} className="text-slate-500" />;
        return <Sun size={32} className="text-yellow-500" />;
    };

    return (
        <div className={`${theme.components.card} p-5 flex flex-col justify-between`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Meteorological Conditions
                </h3>
                <Button size="sm" variant="ghost" onClick={onAdjust}>Adjust</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                    {getIcon(weather.condition)}
                    <div>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{weather.temperature}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{weather.condition}</p>
                    </div>
                </div>
                {(weather.wind || weather.precipitation) && (
                    <div className="text-right text-xs text-slate-500 space-y-1">
                        {weather.wind && <p>Wind: {weather.wind}</p>}
                        {weather.precipitation && <p>Precip: {weather.precipitation}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};
