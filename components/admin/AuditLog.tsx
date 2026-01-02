
import React, { useState, useDeferredValue, useMemo, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { History, Shield, Filter, Search, Download, Clock, User, Loader2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { useTheme } from '../../context/ThemeContext';

const AuditLog: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    
    // Pattern 11: useDeferredValue for intensive data search
    const deferredSearchTerm = useDeferredValue(searchTerm);

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

    // Virtualization Setup
    const parentRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState(600);
    const ROW_HEIGHT = 64; // Fixed height for log rows

    useEffect(() => {
        if (parentRef.current) {
            setContainerHeight(parentRef.current.clientHeight);
        }
        const observer = new ResizeObserver(entries => {
            if (entries[0]) setContainerHeight(entries[0].contentRect.height);
        });
        if (parentRef.current) observer.observe(parentRef.current);
        return () => observer.disconnect();
    }, []);

    const { virtualItems, totalHeight, onScroll } = useVirtualScroll(0, {
        totalItems: logs.length,
        itemHeight: ROW_HEIGHT,
        containerHeight
    });

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
                        className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-nexus-500 outline-none transition-all"
                    />
                    {searchTerm !== deferredSearchTerm && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 size={14} className="animate-spin text-slate-400"/>
                        </div>
                    )}
                </div>
                <button className="p-2 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50">
                    <Filter size={18}/>
                </button>
            </div>

            <div className={`flex-1 overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm relative flex flex-col transition-opacity duration-300 ${searchTerm !== deferredSearchTerm ? 'opacity-70' : 'opacity-100'}`}>
                {/* Header */}
                <div className="grid grid-cols-[180px_160px_160px_1fr_100px] bg-slate-50 border-b border-slate-200 sticky top-0 z-10 font-bold text-xs text-slate-500 uppercase tracking-wider px-4 py-3">
                    <div>Timestamp</div>
                    <div>User</div>
                    <div>Action</div>
                    <div>Change Detail</div>
                    <div className="text-right">Status</div>
                </div>

                {/* Virtual List */}
                <div 
                    ref={parentRef}
                    className="flex-1 overflow-y-auto scrollbar-thin relative"
                    onScroll={(e) => onScroll(e.currentTarget.scrollTop)}
                >
                    <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
                        {virtualItems.map(({ index, offsetTop }) => {
                            const log = logs[index];
                            return (
                                <div 
                                    key={index}
                                    className="absolute top-0 left-0 w-full grid grid-cols-[180px_160px_160px_1fr_100px] items-center px-4 border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                    style={{ 
                                        height: `${ROW_HEIGHT}px`,
                                        transform: `translateY(${offsetTop}px)`
                                    }}
                                >
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Clock size={12}/>
                                        {log.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0">
                                            {log.user.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-slate-800 truncate" title={log.user}>{log.user}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded truncate inline-block max-w-full">
                                            {log.action}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-600 truncate" title={log.details}>
                                        {log.details}
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="success">Verified</Badge>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {logs.length === 0 && (
                        <div className="h-full flex items-center justify-center text-slate-400">
                            No activity recorded for this period.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default AuditLog;
