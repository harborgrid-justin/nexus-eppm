
import React from 'react';

export const SidebarHeader: React.FC = () => {
    return (
        <div className="h-16 flex items-center px-6 border-b border-primary-light/10 bg-primary flex-shrink-0">
          <div className="flex items-center gap-3 text-white overflow-hidden">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shadow-lg shadow-nexus-500/20 font-bold text-lg flex-shrink-0">N</div>
            <div className="flex flex-col min-w-0">
               <span className="text-sm font-bold tracking-tight truncate">Nexus PPM</span>
               <span className="text-[10px] text-slate-400 uppercase tracking-widest truncate">Enterprise</span>
            </div>
          </div>
        </div>
    );
};
