
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
        <div className={`p-5 rounded-2xl border ${theme.colors.border} ${theme.colors.surface} shadow-sm bg-white`}>
            <div className="flex justify-between items-center mb-5">
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.colors.text.tertiary} flex items-center gap-2`}>
                    <Filter size={14} className="text-nexus-600"/> {t('common.filters', 'Predicate Logic Gates')}
                </h4>
                <button onClick={addFilter} className="text-nexus-600 hover:text-nexus-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 px-3 py-1 bg-nexus-50 border border-nexus-100 rounded-lg shadow-sm transition-all active:scale-95">
                    <Plus size={12}/> {t('common.add', 'Append')}
                </button>
            </div>
            <div className="space-y-2.5">
                {filters.map((f, idx) => (
                    <div key={f.id} className="flex items-center gap-2 animate-nexus-in">
                        {idx > 0 && <span className="text-[9px] font-black text-slate-300 uppercase w-8 text-center">AND</span>}
                        <select className={`flex-1 text-xs font-bold border ${theme.colors.border} rounded-xl p-2 bg-slate-50 focus:bg-white outline-none focus:ring-4 focus:ring-nexus-500/5 transition-all text-slate-700`}>
                            <option>Status</option><option>Priority</option><option>Cost Code</option><option>Physical %</option>
                        </select>
                        <select className={`w-28 text-xs font-bold border ${theme.colors.border} rounded-xl p-2 bg-slate-50 focus:bg-white outline-none focus:ring-4 focus:ring-nexus-500/5 transition-all text-slate-700`}>
                            <option>Equals</option><option>Contains</option><option>Exists</option><option>Greater Than</option>
                        </select>
                        <input type="text" className={`flex-1 text-xs font-black border ${theme.colors.border} rounded-xl p-2 bg-slate-50 focus:bg-white outline-none focus:ring-4 focus:ring-nexus-500/5 transition-all text-slate-900 shadow-inner`} defaultValue={f.value} placeholder="Value..." />
                        <button onClick={() => removeFilter(f.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X size={14}/></button>
                    </div>
                ))}
            </div>
        </div>
    );
};
