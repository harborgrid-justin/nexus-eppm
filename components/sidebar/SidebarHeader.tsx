
import React from 'react';

export const SidebarHeader: React.FC = () => {
    return (
        <div className="h-12 flex items-center px-4 border-b border-primary-light/10 bg-primary flex-shrink-0">
          <div className="flex items-center gap-2.5 text-white overflow-hidden">
            <div className="w-7 h-7 bg-secondary rounded-md flex items-center justify-center shadow-lg shadow-nexus-500/20 font-bold text-sm flex-shrink-0">N</div>
            <div className="flex flex-col min-w-0">
               <span className="text-xs font-bold tracking-tight truncate leading-tight">Nexus PPM</span>
               <span className="text-[9px] text-slate-400 uppercase tracking-widest truncate leading-none">Enterprise</span>
            </div>
          </div>
        </div>
    );
};
