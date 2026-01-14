import React, { useState, useDeferredValue, useMemo, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { History, Shield, Filter, Search, Download, Clock, User, Loader2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { useTheme } from '../../context/ThemeContext';
import { EmptyGrid } from '../common/EmptyGrid';

const AuditLog: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    
    // Pattern 11: useDeferredValue for intensive data search
    const deferredSearchTerm = useDeferredValue(searchTerm);

    const logs = useMemo(() => {
        const allLogs = state.governance?.auditLog || [];
        if (!deferredSearchTerm) return allLogs;
        
        const term = deferredSearchTerm.toLowerCase();
        return allLogs.filter(log => 
            String(log.user).toLowerCase().includes(term) ||
            String(log.action).toLowerCase().includes(term) ||
            String(log.details).toLowerCase().includes(term)
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
        <div className={`h-full flex flex-col ${theme.layout.sectionSpacing} p-6`}>
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm shrink-0`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20">
                        <Shield size={24}/>
                    </div>
                    <div>
                        <h3 className={`text-lg font-black text-slate-900 uppercase tracking-tighter`}>Compliance Audit Trail</h3>
                        <p className={`text-sm ${theme.colors.text.secondary}`}>Cryptographically verifiable record of project modifications and security events.</p>
                    </div>
                </div>
                <button className={`w-full md:w-auto px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95`}>
                    <Download size={14}/> Generate Report
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
                        className={`pl-10 pr-4 py-2.5 w-full border ${theme.colors.border} rounded-lg text-sm focus:ring-2 focus:ring-nexus-500 outline-none transition-all ${theme.colors.surface} ${theme.colors.text.primary} font-medium`}
                    />
                    {searchTerm !== deferredSearchTerm && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Loader2 size={16} className="animate-spin text-nexus-500"/>
                        </div>
                    )}
                </div>
                <button className={`p-2.5 border ${theme.colors.border} rounded-lg bg-white text-slate-500 hover:text-nexus-600 transition-colors shadow-sm`}>
                    <Filter size={18}/>
                </button>
            </div>

            <div className={`flex-1 overflow-hidden ${theme.colors.surface} border ${theme.colors.border} rounded-xl shadow-sm relative flex flex-col transition-opacity duration-300 ${searchTerm !== deferredSearchTerm ? 'opacity-70' : 'opacity-100'}`}>
                {/* Header */}
                <div className={`grid grid-cols-[180px_160px_160px_1fr_100px] ${theme.colors.background} border-b ${theme.colors.border} sticky top-0 z-10 font-bold text-[10px] ${theme.colors.text.secondary} uppercase tracking-widest px-6 py-4`}>
                    <div>Timeline</div>
                    <div>Identity</div>
                    <div>Vector</div>
                    <div>Narrative Payload</div>
                    <div className="text-right">Integrity</div>
                </div>

                {/* Virtual List */}
                <div 
                    ref={parentRef}
                    className="flex-1 overflow-y-auto scrollbar-thin relative"
                    onScroll={(e) => onScroll(e.currentTarget.scrollTop)}
                >
                    {logs.length > 0 ? (
                         <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
                            {virtualItems.map(({ index, offsetTop }) => {
                                const log = logs[index];
                                return (
                                    <div 
                                        key={index}
                                        className={`absolute top-0 left-0 w-full grid grid-cols-[180px_160px_160px_1fr_100px] items-center px-6 border-b ${theme.colors.border.replace('border-', 'border-b-').replace('200','100').replace('800','800/50')} hover:${theme.colors.background} transition-colors`}
                                        style={{ 
                                            height: `${ROW_HEIGHT}px`,
                                            transform: `translateY(${offsetTop}px)`
                                        }}
                                    >
                                        <div className={`flex items-center gap-2 text-xs font-mono font-bold ${theme.colors.text.tertiary}`}>
                                            <Clock size={12}/>
                                            {new Date(log.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-7 h-7 rounded-full ${theme.colors.background} flex items-center justify-center text-[10px] font-black shrink-0 border ${theme.colors.border} text-slate-500`}>
                                                {String(log.user).charAt(0).toUpperCase()}
                                            </div>
                                            <span className={`text-sm font-bold ${theme.colors.text.primary} truncate`} title={log.user}>{String(log.user)}</span>
                                        </div>
                                        <div>
                                            <span className={`text-[10px] font-black ${theme.colors.text.secondary} uppercase tracking-tighter ${theme.colors.background} px-2 py-0.5 rounded border ${theme.colors.border} truncate inline-block max-w-full`}>
                                                {String(log.action)}
                                            </span>
                                        </div>
                                        <div className={`text-sm ${theme.colors.text.secondary} font-medium truncate`} title={log.details}>
                                            {String(log.details)}
                                        </div>
                                        <div className="text-right">
                                            <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-green-600">
                                                <Shield size={12}/> OK
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={`h-full flex items-center justify-center`}>
                            <EmptyGrid 
                                title="No Events Recorded"
                                description={searchTerm ? `The filter "${searchTerm}" returned zero logs.` : "The administrative audit trail is clear."}
                                icon={History}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuditLog;