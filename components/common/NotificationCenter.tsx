
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
            <button className={`relative p-2 ${theme.colors.text.tertiary} hover:text-nexus-600 hover:${theme.colors.background} rounded-lg transition-all border border-transparent hover:${theme.colors.border}`}>
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20 animate-pulse"></span>
                )}
            </button>
            
            <div className={`absolute right-0 mt-3 w-96 ${theme.colors.surface} rounded-xl overflow-hidden z-50 hidden group-hover:block animate-in slide-in-from-top-2 origin-top-right shadow-2xl border ${theme.colors.border}`}>
                <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.surface} flex justify-between items-center ${theme.colors.background}/50`}>
                    <h3 className={`font-bold ${theme.colors.text.primary} text-sm uppercase tracking-tighter`}>System Notifications</h3>
                    <span className={`text-[9px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest`}>{unreadCount} UNREAD ENTRIES</span>
                </div>
                <div className="max-h-96 overflow-y-auto scrollbar-thin bg-white">
                    {notifications.length > 0 ? notifications.map(n => (
                        <div 
                            key={n.id} 
                            onClick={() => dispatch({type: 'MARK_ALERT_READ', payload: n.id})}
                            className={`p-4 border-b ${theme.colors.border} hover:${theme.colors.background} flex gap-4 items-start cursor-pointer transition-colors ${!n.isRead ? `${theme.colors.semantic.info.bg}/30` : ''}`}
                        >
                            <div className={`mt-0.5 p-2 ${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} shrink-0`}>
                                {getIcon(n.severity)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <p className={`text-sm font-black ${theme.colors.text.primary} leading-tight truncate`}>{n.title}</p>
                                    <span className={`text-[10px] ${theme.colors.text.tertiary} font-mono whitespace-nowrap`}>
                                        {isMounted ? getTimeAgo(n.date) : new Date(n.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className={`text-xs ${theme.colors.text.secondary} mt-1 leading-relaxed line-clamp-2 font-medium`}>{n.message}</p>
                                <div className="flex flex-wrap gap-1.5 mt-2.5">
                                    {n.category && (
                                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black ${theme.colors.background} ${theme.colors.text.tertiary} border ${theme.colors.border} uppercase tracking-tight`}>
                                            {n.category}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-16 text-center text-slate-400 flex flex-col items-center nexus-empty-pattern">
                            <Bell size={40} className="opacity-10 mb-2"/>
                            <p className="text-sm font-bold uppercase tracking-widest text-[10px]">Queue Clear</p>
                        </div>
                    )}
                </div>
                <div className={`p-3 text-center border-t ${theme.colors.border} bg-slate-50`}>
                    <button className="text-[10px] font-black text-nexus-600 hover:text-nexus-800 uppercase tracking-widest">Mark all as read</button>
                </div>
            </div>
        </div>
    );
};
