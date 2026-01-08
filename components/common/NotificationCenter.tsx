
import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

export const NotificationCenter: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const notifications = state.governance.alerts;
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    // Track previous count to detect NEW notifications for vibration
    const prevCountRef = useRef(unreadCount);

    const [isMounted, setIsMounted] = useState(false);
  
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Optimization: Vibration API
    // Provides tactile feedback on mobile devices when a new high-priority alert arrives
    useEffect(() => {
        if (unreadCount > prevCountRef.current) {
            const latest = notifications[0];
            if (latest && (latest.severity === 'Critical' || latest.severity === 'Blocker')) {
                // Pulse pattern: Vibrate 200ms, pause 100ms, vibrate 200ms
                if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            } else {
                // Short pulse for normal info
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
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <div className="relative group">
            <button className="relative p-2 text-slate-400 hover:text-nexus-600 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-200">
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20"></span>
                )}
            </button>
            
            <div className={`absolute right-0 mt-3 w-96 ${theme.components.card} overflow-hidden z-50 hidden group-hover:block animate-in slide-in-from-top-2 origin-top-right shadow-2xl`}>
                <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.surface} flex justify-between items-center`}>
                    <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{unreadCount} UNREAD</span>
                </div>
                <div className="max-h-96 overflow-y-auto scrollbar-thin">
                    {notifications.length > 0 ? notifications.map(n => (
                        <div 
                            key={n.id} 
                            onClick={() => dispatch({type: 'MARK_ALERT_READ', payload: n.id})}
                            className={`p-4 border-b ${theme.colors.border.replace('border-b-', 'border-b-slate-')}50 hover:${theme.colors.background}/50 flex gap-4 items-start cursor-pointer transition-colors ${!n.isRead ? `${theme.colors.semantic.info.bg}/30` : ''}`}
                        >
                            <div className={`mt-0.5 p-2 ${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} shrink-0`}>
                                {getIcon(n.severity)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <p className="text-sm font-bold text-slate-800 leading-tight truncate">{n.title}</p>
                                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                                        {isMounted ? getTimeAgo(n.date) : new Date(n.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{n.message}</p>
                                <div className="flex flex-wrap gap-1.5 mt-2.5">
                                    {n.category && (
                                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-tight">
                                            {n.category}
                                        </span>
                                    )}
                                    {n.link && (
                                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-nexus-50 text-nexus-600 border border-nexus-100 uppercase tracking-tight">
                                            {n.link.type}: {n.link.id}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                            <Bell size={32} className="opacity-10 mb-2"/>
                            <p className="text-sm font-medium">All caught up!</p>
                        </div>
                    )}
                </div>
                <div className={`p-3 text-center border-t ${theme.colors.border} ${theme.colors.background}`}>
                    <button className="text-[11px] font-bold text-nexus-600 hover:text-nexus-800 uppercase tracking-widest">Mark all as read</button>
                </div>
            </div>
        </div>
    );
};
