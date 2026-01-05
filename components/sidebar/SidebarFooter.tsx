
import React from 'react';
import { User } from '../../types/auth';
import { LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SidebarFooterProps {
    user: User | null;
    onProfileOpen: () => void;
    onLogout: () => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ user, onProfileOpen, onLogout }) => {
    const theme = useTheme();
    const borderColor = theme.mode === 'dark' ? 'border-slate-800' : 'border-slate-700';
    const bgColor = theme.mode === 'dark' ? 'bg-slate-950' : 'bg-slate-900';

    return (
        <div className={`p-4 border-t ${borderColor} ${bgColor} flex-shrink-0`}>
           <div className="flex items-center gap-3">
               <div 
                  className="relative cursor-pointer group flex-shrink-0" 
                  onClick={onProfileOpen}
                  role="button"
                >
                   <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-full border border-slate-600 group-hover:border-nexus-500" />
                   <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
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
