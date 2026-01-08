
import React from 'react';

interface SidebarHeaderProps {
    isCollapsed?: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isCollapsed }) => {
    return (
        <div className={`h-12 flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} border-b border-primary-light/10 bg-primary flex-shrink-0 overflow-hidden`}>
          <div className="flex items-center gap-2.5 text-white overflow-hidden">
            <div className="w-7 h-7 bg-secondary rounded-md flex items-center justify-center shadow-lg shadow-nexus-500/20 font-bold text-sm flex-shrink-0">N</div>
            {!isCollapsed && (
                <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="text-xs font-bold tracking-tight truncate leading-tight">Nexus PPM</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest truncate leading-none">Enterprise</span>
                </div>
            )}
          </div>
        </div>
    );
};
