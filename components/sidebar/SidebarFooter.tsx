import React from 'react';
import { User as UserType } from '../../types/auth';
import { LogOut, User as UserIcon, Settings2, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SidebarFooterProps {
    user: UserType | null;
    onProfileOpen: () => void;
    onLogout: () => void;
    isCollapsed?: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ user, onProfileOpen, onLogout, isCollapsed }) => {
    const theme = useTheme();

    if (isCollapsed) {
        return (
            <div className="py-6 border-t border-white/5 flex flex-col items-center gap-6">
                 <button onClick={onProfileOpen} className="relative group p-1 active:scale-90 transition-transform">
                    <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-xl border border-white/20 hover:border-nexus-400 shadow-lg" />
                    <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-[100] shadow-2xl border border-white/10">Identity Config</div>
                 </button>
                 <button onClick={onLogout} className="text-slate-500 hover:text-red-400 p-2 group relative active:scale-90 transition-all hover:bg-red-400/10 rounded-xl" title="Terminate Session">
                   <LogOut size={20} />
                   <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-[100] shadow-2xl border border-white/10">Log Out</div>
               </button>
            </div>
        );
    }

    return (
        <div className="p-6 border-t border-white/5 bg-black/10">
           <div className="flex items-center gap-4 group">
               <div 
                  className="relative cursor-pointer flex-shrink-0 active:scale-90 transition-transform" 
                  onClick={onProfileOpen}
                  role="button"
                >
                   <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-2xl border-2 border-white/10 hover:border-nexus-500 transition-colors shadow-2xl" />
                   <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
               </div>
               <div 
                  className="flex-1 min-w-0 cursor-pointer" 
                  onClick={onProfileOpen}
                  role="button"
                >
                   <p className="text-sm font-black text-white truncate tracking-tight uppercase group-hover:text-nexus-400 transition-colors">{user?.name || 'Authorized Guest'}</p>
                   <div className="flex items-center gap-1.5 mt-0.5">
                       <ShieldCheck size={10} className="text-nexus-500"/>
                       <p className="text-[9px] font-bold text-slate-500 truncate uppercase tracking-widest">{user?.role}</p>
                   </div>
               </div>
               <div className="flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button onClick={onProfileOpen} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="User Settings"><Settings2 size={16}/></button>
                    <button onClick={onLogout} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Log Out"><LogOut size={16} /></button>
               </div>
           </div>
        </div>
    );
};