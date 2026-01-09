
import React from 'react';
import { NonConformanceReport } from '../../../types';
import { Search, AlertOctagon, Bug } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { EmptyGrid } from '../../common/EmptyGrid';

interface DefectListProps {
    defects: NonConformanceReport[];
    selectedDefectId: string | null;
    onSelectDefect: (id: string) => void;
    searchTerm: string;
    onSearch: (term: string) => void;
}

export const DefectList: React.FC<DefectListProps> = ({ defects, selectedDefectId, onSelectDefect, searchTerm, onSearch }) => {
    return (
        <div className="w-1/3 min-w-[300px] border-r border-border bg-white flex flex-col">
             <div className="p-4 border-b border-slate-200">
                 <div className="relative">
                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                     <input 
                        type="text" 
                        placeholder="Search NCRs..." 
                        value={searchTerm}
                        onChange={e => onSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-nexus-500 outline-none"
                     />
                 </div>
             </div>
             <div className="flex-1 overflow-y-auto">
                 {defects.length > 0 ? defects.map(d => (
                     <div 
                        key={d.id} 
                        onClick={() => onSelectDefect(d.id)}
                        className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedDefectId === d.id ? 'bg-red-50 border-l-4 border-l-red-500' : 'border-l-4 border-l-transparent'}`}
                     >
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-mono text-xs text-slate-500 font-bold">{d.id}</span>
                            <Badge variant={d.severity === 'Critical' ? 'danger' : d.severity === 'Major' ? 'warning' : 'neutral'}>{d.severity}</Badge>
                        </div>
                        <h4 className="font-bold text-sm text-slate-800 mb-1 line-clamp-1">{d.description}</h4>
                        <div className="flex justify-between items-center text-xs text-slate-500">
                            <span>{d.date}</span>
                            <span className={`font-bold ${d.status === 'Open' ? 'text-red-600' : 'text-green-600'}`}>{d.status}</span>
                        </div>
                     </div>
                 )) : (
                     <div className="h-full flex items-center justify-center p-6">
                        <EmptyGrid 
                            title="No Defects Found"
                            description={searchTerm ? "No NCRs match your search." : "No non-conformance reports active."}
                            icon={Bug}
                        />
                     </div>
                 )}
             </div>
        </div>
    );
};
