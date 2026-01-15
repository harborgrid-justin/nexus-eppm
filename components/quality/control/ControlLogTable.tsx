
import React from 'react';
import { QualityReport } from '../../../types';
import { Badge } from '../../ui/Badge';
import { Search, ClipboardList } from 'lucide-react';
import { EmptyGrid } from '../../common/EmptyGrid';
import { useTheme } from '../../../context/ThemeContext';

interface ControlLogTableProps {
    reports: QualityReport[];
    filterStatus: string;
    onFilterChange: (s: string) => void;
    onSelectReport: (id: string) => void;
    selectedReportId: string | null;
}

export const ControlLogTable: React.FC<ControlLogTableProps> = ({ reports, filterStatus, onFilterChange, onSelectReport, selectedReportId }) => {
    const theme = useTheme();
    
    return (
        <div className="flex flex-col h-full bg-white">
            <div className={`p-4 border-b ${theme.colors.border} flex gap-2 shrink-0 bg-slate-50/30`}>
                <div className="relative flex-1 group">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-nexus-600 transition-colors"/>
                    <input className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none transition-all shadow-inner" placeholder="Search logs..." />
                </div>
                <select className="text-xs font-black uppercase border border-slate-200 rounded-xl px-3 bg-white outline-none cursor-pointer" value={filterStatus} onChange={e => onFilterChange(e.target.value)}>
                    <option value="All">All Status</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                </select>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin">
                {reports.length > 0 ? reports.map(r => (
                    <div 
                        key={r.id} 
                        onClick={() => onSelectReport(r.id)}
                        className={`p-6 border-b border-slate-50 cursor-pointer transition-all duration-150 ${selectedReportId === r.id ? 'bg-nexus-50 border-l-4 border-l-nexus-600 shadow-inner' : 'border-l-4 border-l-transparent hover:bg-slate-50'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-black text-sm text-slate-800 uppercase tracking-tight">{r.type}</span>
                            <Badge variant={r.status === 'Pass' ? 'success' : r.status === 'Fail' ? 'danger' : 'warning'}>{r.status}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">
                            <span>{r.date}</span>
                            <span>•</span>
                            <span>Auth: {r.inspector}</span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-1 font-medium italic">"{r.summary}"</p>
                    </div>
                )) : (
                    <div className="h-full flex items-center justify-center p-8">
                         <EmptyGrid 
                            title="Inspection Ledger Neutral"
                            description="No quality control artifacts detected in the current partition scope."
                            icon={ClipboardList}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
