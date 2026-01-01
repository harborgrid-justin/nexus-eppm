
import React, { useState } from 'react';
import { Filter, Plus, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface FilterCriteria {
    id: string;
    field: string;
    operator: string;
    value: string;
}

export const LogicFilter: React.FC = () => {
    const theme = useTheme();
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
        <div className={`${theme.components.card} ${theme.layout.cardPadding} w-full`}>
            <div className="flex justify-between items-center mb-3">
                <h4 className={`${theme.typography.label} flex items-center gap-2`}>
                    <Filter size={12}/> Advanced Filters
                </h4>
                <button onClick={addFilter} className="text-nexus-600 hover:text-nexus-700 text-xs font-medium flex items-center gap-1 transition-colors">
                    <Plus size={12}/> Add Criteria
                </button>
            </div>
            <div className="space-y-2">
                {filters.map((f, idx) => (
                    <div key={f.id} className="flex items-center gap-2">
                        {idx > 0 && <span className={`${theme.typography.label} w-8 text-center`}>AND</span>}
                        <select className={`text-sm border ${theme.colors.border} rounded py-1 px-2 focus:ring-nexus-500 focus:border-nexus-500 ${theme.colors.surface}`}>
                            <option>Status</option>
                            <option>Priority</option>
                            <option>Risk Score</option>
                            <option>Due Date</option>
                        </select>
                        <select className={`text-sm border ${theme.colors.border} rounded py-1 px-2 focus:ring-nexus-500 focus:border-nexus-500 ${theme.colors.surface}`}>
                            <option>Equals</option>
                            <option>Not Equals</option>
                            <option>Contains</option>
                            <option>Greater Than</option>
                        </select>
                        <input type="text" className={`text-sm border ${theme.colors.border} rounded py-1 px-2 flex-1 focus:ring-nexus-500 focus:border-nexus-500`} defaultValue={f.value} />
                        <button onClick={() => removeFilter(f.id)} className={`${theme.colors.text.tertiary} hover:text-red-500 transition-colors`}><X size={14}/></button>
                    </div>
                ))}
            </div>
        </div>
    );
};
