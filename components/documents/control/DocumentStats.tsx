
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Database } from 'lucide-react';

interface DocumentStatsProps {
    usedGB: number;
    limitGB: number;
    percent: number;
}

export const DocumentStats: React.FC<DocumentStatsProps> = ({ usedGB, limitGB, percent }) => {
    const theme = useTheme();
    
    return (
        <div className="flex items-center gap-4 text-sm text-slate-500 w-full md:w-auto justify-end bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
                <Database size={14} className="text-nexus-500"/>
                <span className="font-bold text-xs uppercase tracking-wider">Storage</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-500 ${percent > 90 ? 'bg-red-500' : percent > 75 ? 'bg-orange-500' : 'bg-nexus-600'}`} 
                        style={{ width: `${percent}%` }}
                    ></div>
                </div>
                <span className="font-mono font-bold text-slate-700">{percent}%</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
                {usedGB.toFixed(2)} / {limitGB} GB
            </div>
        </div>
    );
};
