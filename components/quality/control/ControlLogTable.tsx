import React from 'react';
import { QualityReport } from '../../../types';
import { Badge } from '../../ui/Badge';
import { useTheme } from '../../../context/ThemeContext';
import { Search, Filter, ChevronRight } from 'lucide-react';

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
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-200 flex gap-2">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-300 rounded-md" placeholder="Search logs..." />
                </div>
                <select className="text-sm border border-slate-300 rounded-md px-2" value={filterStatus} onChange={e => onFilterChange(e.target.value)}>
                    <option value="All">All Status</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                </select>
            </div>
            <div className="flex-1 overflow-y-auto">
                {reports.map(r => (
                    <div 
                        key={r.id} 
                        onClick={() => onSelectReport(r.id)}
                        className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedReportId === r.id ? 'bg-nexus-50 border-l-4 border-l-nexus-500' : 'border-l-4 border-l-transparent'}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm text-slate-800">{r.type}</span>
                            <Badge variant={r.status === 'Pass' ? 'success' : r.status === 'Fail' ? 'danger' : 'warning'}>{r.status}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{r.date} • {r.inspector}</p>
                        <p className="text-sm text-slate-600 line-clamp-1">{r.summary}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
