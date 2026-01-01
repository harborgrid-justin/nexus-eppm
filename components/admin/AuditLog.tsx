
import React, { useState, useDeferredValue, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { History, Shield, Filter, Search, Download, Clock, User } from 'lucide-react';
import { Badge } from '../ui/Badge';

const AuditLog: React.FC = () => {
    const { state } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearchTerm = useDeferredValue(searchTerm);

    // Rule 12: No derived state in effects, calc during render
    const logs = useMemo(() => {
        const allLogs = state.governance.auditLog || [];
        if (!deferredSearchTerm) return allLogs;
        
        const term = deferredSearchTerm.toLowerCase();
        return allLogs.filter(log => 
            log.user.toLowerCase().includes(term) ||
            log.action.toLowerCase().includes(term) ||
            log.details.toLowerCase().includes(term)
        );
    }, [state.governance.auditLog, deferredSearchTerm]);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                        <Shield size={24}/>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Compliance Audit Trail</h3>
                        <p className="text-sm text-slate-500">Immutable record of critical data modifications and security events.</p>
                    </div>
                </div>
                <button className="w-full md:w-auto px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2 shadow-sm">
                    <Download size={16}/> Export for Audit
                </button>
            </div>

            <div className="flex items-center gap-4 px-1 shrink-0">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input 
                        type="text" 
                        placeholder="Filter by user, action, or details..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-nexus-500 outline-none"
                    />
                </div>
                <button className="p-2 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50">
                    <Filter size={18}/>
                </button>
            </div>

            <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-xl shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase w-48 whitespace-nowrap">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase w-40 whitespace-nowrap">User</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase w-40 whitespace-nowrap">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase min-w-[200px]">Change Detail</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.map((log, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors focus:bg-slate-50 outline-none" tabIndex={0} role="row">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Clock size={12}/>
                                        {log.date}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                                            {log.user.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-slate-800">{log.user}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {log.details}
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <Badge variant="success">Verified</Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length === 0 && (
                    <div className="p-12 text-center text-slate-400">No activity recorded for this period.</div>
                )}
            </div>
        </div>
    );
};

export default AuditLog;
