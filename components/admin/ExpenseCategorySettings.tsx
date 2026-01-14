import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { Receipt, Plus, Globe, Briefcase, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { EmptyGrid } from '../common/EmptyGrid';

export const ExpenseCategorySettings: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const { t } = useI18n();
    const [activeScope, setActiveScope] = useState<'Global' | 'Project'>('Global');

    const filtered = state.expenseCategories.filter(ec => ec.scope === activeScope);

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className={`p-4 rounded-xl border ${theme.colors.border} bg-white flex justify-between items-center shadow-sm`}>
                <div className="flex bg-slate-100 p-1 rounded-lg border">
                    <button onClick={() => setActiveScope('Global')} className={`px-6 py-1.5 text-xs font-bold rounded-md transition-all ${activeScope === 'Global' ? 'bg-white shadow text-nexus-600' : 'text-slate-500'}`}><Globe size={14} className="inline mr-1.5"/> {t('common.global', 'Global')}</button>
                    <button onClick={() => setActiveScope('Project')} className={`px-6 py-1.5 text-xs font-bold rounded-md transition-all ${activeScope === 'Project' ? 'bg-white shadow text-nexus-600' : 'text-slate-500'}`}><Briefcase size={14} className="inline mr-1.5"/> {t('common.project', 'Project')}</button>
                </div>
                <Button size="sm" icon={Plus}>{t('common.add', 'New Category')}</Button>
            </div>

            <div className="flex-1 overflow-auto">
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                        {filtered.map(cat => (
                            <div key={cat.id} className={`p-4 bg-white border border-slate-200 rounded-xl shadow-sm group hover:border-nexus-400 transition-all flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Receipt size={16}/></div>
                                    <span className="font-bold text-sm text-slate-800">{cat.name}</span>
                                </div>
                                <button className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyGrid title={t('exp.no_cats', 'No Categories Registered')} description={t('exp.no_cats_desc', 'Initialize standardized cost buckets.')} icon={Receipt} />
                )}
            </div>
        </div>
    );
};
export default ExpenseCategorySettings;