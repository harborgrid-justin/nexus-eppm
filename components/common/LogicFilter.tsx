import React, { useState } from 'react';
import { Filter, Plus, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';

interface FilterCriteria {
    id: string;
    field: string;
    operator: string;
    value: string;
}

export const LogicFilter: React.FC = () => {
    const theme = useTheme();
    const { t } = useI18n();
    const [filters, setFilters] = useState<FilterCriteria[]>([
        { id: '1', field: 'Status', operator: 'Equals', value: 'Open' }
    ]);

    const addFilter = () => {
        setFilters([...filters, { id: Date.now().toString(), field: 'Priority', operator: 'Equals', value: '' }]);
    };

    const removeFilter = (id: string) => {
        setFilters(filters.filter(f => f.id !== id));
    };

    return (
        <div className={`p-4 rounded-xl border ${theme.colors.border} ${theme.colors.surface} shadow-sm`}>
            <div className="flex justify-between items-center mb-4">
                <h4 className={`text-xs font-black uppercase tracking-widest ${theme.colors.text.tertiary} flex items-center gap-2`}>
                    <Filter size={14}/> {t('common.filters', 'Logic Filters')}
                </h4>
                <button onClick={addFilter} className="text-nexus-600 hover:text-nexus-700 text-xs font-bold flex items-center gap-1">
                    <Plus size={14}/> {t('common.add', 'Add')}
                </button>
            </div>
            <div className="space-y-2">
                {filters.map((f, idx) => (
                    <div key={f.id} className="flex items-center gap-2 animate-nexus-in">
                        {idx > 0 && <span className="text-[10px] font-black text-slate-400 uppercase w-8 text-center">{t('common.and', 'AND')}</span>}
                        <select className={`flex-1 text-xs border ${theme.colors.border} rounded-lg p-1.5 bg-slate-50 focus:bg-white outline-none`}>
                            <option>Status</option><option>Priority</option><option>Cost Code</option>
                        </select>
                        <select className={`w-24 text-xs border ${theme.colors.border} rounded-lg p-1.5 bg-slate-50 focus:bg-white outline-none`}>
                            <option>Equals</option><option>Contains</option><option>Exists</option>
                        </select>
                        <input type="text" className={`flex-1 text-xs border ${theme.colors.border} rounded-lg p-1.5 bg-slate-50 focus:bg-white outline-none`} defaultValue={f.value} />
                        <button onClick={() => removeFilter(f.id)} className="text-slate-400 hover:text-red-500 p-1"><X size={14}/></button>
                    </div>
                ))}
            </div>
        </div>
    );
};