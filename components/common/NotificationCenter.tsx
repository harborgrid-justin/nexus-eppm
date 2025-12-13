
import React from 'react';
import { Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
    const notifications = [
        { id: 1, type: 'success', title: 'Export Completed', message: 'Project P1001 export is ready for download.', time: '2m ago' },
        { id: 2, type: 'warning', title: 'Budget Threshold', message: 'Phase 2 labor costs exceeded 90% of budget.', time: '1h ago' },
        { id: 3, type: 'info', title: 'System Maintenance', message: 'Scheduled downtime on Sunday at 2am.', time: '5h ago' }
    ];

    const getIcon = (type: string) => {
        switch(type) {
            case 'success': return <CheckCircle size={16} className="text-green-500"/>;
            case 'warning': return <AlertTriangle size={16} className="text-yellow-500"/>;
            default: return <Info size={16} className="text-blue-500"/>;
        }
    };

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
            <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-700 text-sm">Notifications</h3>
                <button className="text-xs text-nexus-600 hover:underline">Mark all read</button>
            </div>
            <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                    <div key={n.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 flex gap-3 items-start cursor-pointer">
                        <div className="mt-0.5">{getIcon(n.type)}</div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-2 text-center border-t border-slate-100">
                <button className="text-xs text-slate-500 hover:text-slate-800">View History</button>
            </div>
        </div>
    );
};
