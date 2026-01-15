
import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

export const NotificationCenter: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const notifications = state.governance?.alerts || [];
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    const prevCountRef = useRef(unreadCount);
    const [isMounted, setIsMounted] = useState(false);
  
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (unreadCount > prevCountRef.current) {
            const latest = notifications[0];
            if (latest && (latest.severity === 'Critical' || latest.severity === 'Blocker')) {
                if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            } else {
                if (navigator.vibrate) navigator.vibrate(100);
            }
        }
        prevCountRef.current = unreadCount;
    }, [unreadCount, notifications]);

    const getIcon = (severity: string) => {
        switch(severity) {
            case 'Info': return <Info size={16} className="text-blue-500"/>;
            case 'Warning': return <AlertTriangle size={16} className="text-yellow-500"/>;
            case 'Critical': return <XCircle size={16} className="text-red-500"/>;
            case 'Blocker': return <XCircle size={16} className="text-purple-600 font-bold"/>;
            default: return <CheckCircle size={16} className="text-green-500"/>;
        }
    };
    
    const getTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <div className="relative group">
            <button className={`relative p-2 ${theme.colors.text.tertiary} hover:text-nexus-600 hover:${theme.colors.background} rounded-xl transition-all border border-transparent hover:${theme.colors.border} active:scale-90`}>
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20 animate-pulse"></span>
                )}
            </button>
            
            <div className={`absolute right-0 mt-3 w-96 ${theme.colors.surface} rounded-[2rem] overflow-hidden z-[100] hidden group-hover:block animate-in slide-in-from-top-2 origin-top-right shadow-2xl border ${theme.colors.border}`}>
                <div className={`p-5 border-b ${theme.colors.border} ${theme.colors.surface} flex justify-between items-center ${theme.colors.background}/50`}>
                    <h3 className={`font-black ${theme.colors.text.primary} text-[10px] uppercase tracking-[0.2em]`}>Strategic Pulse Feed</h3>
                    <span className={`text-[9px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-inner`}>{unreadCount} NEW ENTRIES</span>
                </div>
                <div className="max-h-96 overflow-y-auto scrollbar-thin bg-white">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-slate-50">
                            {notifications.map(n => (
                                <div 
                                    key={n.id} 
                                    onClick={() => dispatch({type: 'MARK_ALERT_READ', payload: n.id})}
                                    className={`p-5 hover:bg-slate-50 transition-colors flex gap-4 items-start cursor-pointer border-l-4 ${!n.isRead ? 'border-nexus-500 bg-nexus-50/20' : 'border-transparent'}`}
                                >
                                    <div className={`mt-0.5 p-2 ${theme.colors.surface} rounded-xl shadow-sm border border-slate-100 shrink-0`}>
                                        {getIcon(n.severity)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className={`text-sm font-black ${theme.colors.text.primary} leading-tight truncate uppercase tracking-tight`}>{n.title}</p>
                                            <span className={`text-[9px] font-mono font-black text-slate-400 whitespace-nowrap`}>
                                                {isMounted ? getTimeAgo(n.date) : ''}
                                            </span>
                                        </div>
                                        <p className={`text-xs ${theme.colors.text.secondary} mt-1.5 leading-relaxed line-clamp-2 font-medium`}>{n.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center nexus-empty-pattern">
                            <div className="p-5 bg-white rounded-3xl shadow-lg border border-slate-100 mb-4 opacity-50"><CheckCircle size={32} className="text-green-500"/></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Queue Operational</p>
                        </div>
                    )}
                </div>
                <div className={`p-4 text-center border-t ${theme.colors.border} bg-slate-50`}>
                    <button className="text-[10px] font-black text-nexus-600 hover:text-nexus-800 uppercase tracking-[0.2em] transition-all active:scale-95">Purge Event Log</button>
                </div>
            </div>
        </div>
    );
};
