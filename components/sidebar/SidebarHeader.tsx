
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const SidebarHeader: React.FC = () => {
    const theme = useTheme();
    const borderColor = theme.mode === 'dark' ? 'border-slate-800' : 'border-slate-700';
    const bgColor = theme.mode === 'dark' ? 'bg-slate-950' : 'bg-slate-900';

    return (
        <div className={`h-16 flex items-center px-6 border-b ${borderColor} ${bgColor} flex-shrink-0`}>
          <div className="flex items-center gap-3 text-white overflow-hidden">
            <div className={`w-8 h-8 ${theme.colors.primary} rounded-lg flex items-center justify-center shadow-lg shadow-nexus-500/20 font-bold text-lg flex-shrink-0`}>N</div>
            <div className="flex flex-col min-w-0">
               <span className="text-sm font-bold tracking-tight truncate">Nexus PPM</span>
               <span className="text-[10px] text-slate-400 uppercase tracking-widest truncate">Enterprise</span>
            </div>
          </div>
        </div>
    );
};
