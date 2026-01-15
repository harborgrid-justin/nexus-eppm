import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle, Clock, ShieldAlert } from 'lucide-react';
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
            <button className={`relative p-2.5 ${theme.colors.text.tertiary} hover:text-nexus-600 hover:${theme.colors.background} rounded-xl transition-all border border-transparent hover:${theme.colors.border} active:scale-90 bg-white/50 shadow-sm`}>
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-3 h-3 bg-red-600 rounded-full border-2 border-white ring-4 ring-red-500/10 animate-pulse shadow-sm"></span>
                )}
            </button>
            
            <div className={`absolute right-0 mt-4 w-[420px] ${theme.colors.surface} rounded-[2.5rem] overflow-hidden z-[100] hidden group-hover:block animate-in slide-in-from-top-2 origin-top-right shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-slate-200`}>
                <div className={`p-6 border-b ${theme.colors.border} ${theme.colors.surface} flex justify-between items-center bg-slate-50/80 backdrop-blur-md`}>
                    <div>
                        <h3 className={`font-black ${theme.colors.text.primary} text-sm uppercase tracking-[0.2em] tracking-tighter`}>Governance Alert Stream</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Real-time system health audit</p>
                    </div>
                    <span className={`text-[10px] font-black text-nexus-700 bg-nexus-50 border border-nexus-200 px-3 py-1 rounded-full shadow-inner`}>{unreadCount} UNREAD EVENTS</span>
                </div>
                <div className="max-h-[500px] overflow-y-auto scrollbar-thin bg-white divide-y divide-slate-50">
                    {notifications.length > 0 ? (
                        notifications.map(n => (
                            <div 
                                key={n.id} 
                                onClick={() => dispatch({type: 'MARK_ALERT_READ', payload: n.id})}
                                className={`p-6 hover:bg-slate-50/80 transition-all flex gap-5 items-start cursor-pointer border-l-[6px] relative group/item ${!n.isRead ? 'border-nexus-600 bg-nexus-50/10' : 'border-transparent'}`}
                            >
                                <div className={`mt-0.5 p-3 ${theme.colors.surface} rounded-2xl shadow-sm border border-slate-100 shrink-0 group-hover/item:scale-110 transition-transform duration-300 bg-white`}>
                                    {getIcon(n.severity)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-4">
                                        <p className={`text-sm font-black ${theme.colors.text.primary} leading-tight truncate uppercase tracking-tight group-hover/item:text-nexus-700 transition-colors`}>{n.title}</p>
                                        <span className={`text-[9px] font-mono font-black text-slate-400 whitespace-nowrap bg-white px-2 py-0.5 rounded border border-slate-100 shadow-inner`}>
                                            {isMounted ? getTimeAgo(n.date) : '--:--'}
                                        </span>
                                    </div>
                                    <p className={`text-xs ${theme.colors.text.secondary} mt-2 leading-relaxed font-medium`}>{n.message}</p>
                                    {!n.isRead && (
                                        <div className="mt-3 flex items-center gap-2 text-[9px] font-black text-nexus-600 uppercase tracking-widest">
                                            <div className="w-1 h-1 bg-nexus-500 rounded-full"></div>
                                            Awaiting acknowledgement
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center text-slate-400 flex flex-col items-center justify-center nexus-empty-pattern">
                            <div className="p-6 bg-white rounded-[2rem] shadow-xl border border-slate-100 mb-6 opacity-30 group-hover:scale-110 transition-transform">
                                <ShieldAlert size={48} className="text-slate-300" strokeWidth={1} />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Queue Nominal</h4>
                            <p className="text-xs text-slate-400/60 mt-1 uppercase font-bold tracking-widest">No active threats detected</p>
                        </div>
                    )}
                </div>
                <div className={`p-4 text-center border-t ${theme.colors.border} bg-slate-50/80`}>
                    <button className="text-[10px] font-black text-slate-500 hover:text-nexus-600 uppercase tracking-[0.3em] transition-all active:scale-95">Purge Thread Buffer</button>
                </div>
            </div>
        </div>
    );
};