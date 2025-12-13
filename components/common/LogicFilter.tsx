
import React, { useState } from 'react';
import { Filter, Plus, X } from 'lucide-react';

interface FilterCriteria {
    id: string;
    field: string;
    operator: string;
    value: string;
}

export const LogicFilter: React.FC = () => {
    const [filters, setFilters] = useState<FilterCriteria[]>([
        { id: '1', field: 'Status', operator: 'Equals', value: 'Open' }
    ]);

    const addFilter = () => {
        setFilters([...filters, { id: Date.now().toString(), field: 'Priority', operator: 'Equals', value: 'High' }]);
    };

    const removeFilter = (id: string) => {
        setFilters(filters.filter(f => f.id !== id));
    };

    return (
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm w-full">
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Filter size={12}/> Advanced Filters
                </h4>
                <button onClick={addFilter} className="text-nexus-600 hover:text-nexus-700 text-xs font-medium flex items-center gap-1">
                    <Plus size={12}/> Add Criteria
                </button>
            </div>
            <div className="space-y-2">
                {filters.map((f, idx) => (
                    <div key={f.id} className="flex items-center gap-2">
                        {idx > 0 && <span className="text-xs font-bold text-slate-400 uppercase w-8 text-center">AND</span>}
                        <select className="text-sm border-slate-300 rounded py-1 px-2 focus:ring-nexus-500 focus:border-nexus-500">
                            <option>Status</option>
                            <option>Priority</option>
                            <option>Risk Score</option>
                            <option>Due Date</option>
                        </select>
                        <select className="text-sm border-slate-300 rounded py-1 px-2 focus:ring-nexus-500 focus:border-nexus-500">
                            <option>Equals</option>
                            <option>Not Equals</option>
                            <option>Contains</option>
                            <option>Greater Than</option>
                        </select>
                        <input type="text" className="text-sm border-slate-300 rounded py-1 px-2 flex-1 focus:ring-nexus-500 focus:border-nexus-500" defaultValue={f.value} />
                        <button onClick={() => removeFilter(f.id)} className="text-slate-400 hover:text-red-500"><X size={14}/></button>
                    </div>
                ))}
            </div>
        </div>
    );
};
