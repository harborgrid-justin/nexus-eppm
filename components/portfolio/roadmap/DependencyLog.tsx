
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Link } from 'lucide-react';

export const DependencyLog: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`${theme.components.card} overflow-hidden`}>
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-xs text-slate-500 uppercase flex items-center gap-2">
                <Link size={14}/> Strategic Dependencies
            </div>
            <div className="p-4 text-center text-slate-400 italic text-sm">
                No active cross-stream dependencies detected.
            </div>
        </div>
    );
};
