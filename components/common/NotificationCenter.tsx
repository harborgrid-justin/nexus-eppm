
import React from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const NotificationCenter: React.FC = () => {
    const { state, dispatch } = useData();
    const notifications = state.governance.alerts;
    const unreadCount = notifications.filter(n => !n.isRead).length;

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
            <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors">
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
            </button>
            
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 hidden group-hover:block animate-in slide-in-from-top-2">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 text-sm">Notifications</h3>
                    <span className="text-xs text-slate-500">{unreadCount} unread</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(n => (
                        <div 
                            key={n.id} 
                            onClick={() => dispatch({type: 'MARK_ALERT_READ', payload: n.id})}
                            className={`p-3 border-b border-slate-50 hover:bg-slate-50 flex gap-3 items-start cursor-pointer transition-colors ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                        >
                            <div className="mt-0.5">{getIcon(n.severity)}</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{getTimeAgo(n.date)}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                                <div className="flex gap-2 mt-1.5">
                                    {n.category && (
                                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 border border-slate-200">
                                            {n.category}
                                        </span>
                                    )}
                                    {n.link && (
                                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-500 border border-indigo-100">
                                            {n.link.type}: {n.link.id}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-slate-400 text-xs">No notifications.</div>
                    )}
                </div>
                <div className="p-2 text-center border-t border-slate-100 bg-slate-50">
                    <button className="text-xs text-nexus-600 hover:text-nexus-800 font-medium">View All History</button>
                </div>
            </div>
        </div>
    );
};
