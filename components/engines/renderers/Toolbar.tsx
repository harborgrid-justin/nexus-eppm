
import React from 'react';
import { Filter, Settings, RefreshCw, Plus } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const Toolbar: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`p-4 border-b ${theme.colors.border} bg-slate-50 flex justify-between items-center`}>
            <div className="flex gap-2">
                <button className={`flex items-center gap-2 px-3 py-1.5 ${theme.colors.surface} border ${theme.colors.border} rounded-lg text-sm`}>
                    <Filter size={14} /> Filter
                </button>
            </div>
            <div className="flex gap-2">
                <button className="p-2 text-slate-500 hover:bg-slate-200 rounded"><RefreshCw size={16} /></button>
                <button className={`flex items-center gap-2 px-3 py-1.5 ${theme.colors.primary} text-white rounded-lg text-sm`}>
                    <Plus size={16} /> New Record
                </button>
            </div>
        </div>
    );
};
