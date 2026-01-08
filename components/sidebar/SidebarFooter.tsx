
import React from 'react';
import { User } from '../../types/auth';
import { LogOut, User as UserIcon } from 'lucide-react';

interface SidebarFooterProps {
    user: User | null;
    onProfileOpen: () => void;
    onLogout: () => void;
    isCollapsed?: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ user, onProfileOpen, onLogout, isCollapsed }) => {
    if (isCollapsed) {
        return (
            <div className="py-4 border-t border-primary-light/10 flex flex-col items-center gap-4">
                 <button onClick={onProfileOpen} className="relative group">
                    <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full border border-slate-600 hover:border-nexus-500" />
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] shadow-xl">Profile</div>
                 </button>
                 <button onClick={onLogout} className="text-slate-500 hover:text-red-400 p-1 group relative" title="Log Out">
                   <LogOut size={18} />
                   <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] shadow-xl">Logout</div>
               </button>
            </div>
        );
    }

    return (
        <div className="p-4 border-t border-primary-light/10 bg-primary-dark/20">
           <div className="flex items-center gap-3">
               <div 
                  className="relative cursor-pointer group flex-shrink-0" 
                  onClick={onProfileOpen}
                  role="button"
                >
                   <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-full border border-slate-600 group-hover:border-nexus-500" />
                   <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-primary-dark/20 rounded-full"></div>
               </div>
               <div 
                  className="flex-1 min-w-0 cursor-pointer" 
                  onClick={onProfileOpen}
                  role="button"
                >
                   <p className="text-sm font-bold text-white truncate">{user?.name || 'Guest'}</p>
                   <p className="text-xs text-slate-500 truncate">{user?.role}</p>
               </div>
               <button onClick={onLogout} className="text-slate-500 hover:text-red-400 p-1 flex-shrink-0" title="Log Out">
                   <LogOut size={16} />
               </button>
           </div>
        </div>
    );
};
