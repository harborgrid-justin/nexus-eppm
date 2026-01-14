import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { FileWarning, Plus, Globe, Briefcase, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { EmptyGrid } from '../common/EmptyGrid';

export const IssueCodeSettings: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const { t } = useI18n();
    const [scope, setScope] = useState<'Global' | 'Project'>('Global');

    const codes = state.issueCodes.filter(ic => ic.scope === scope);

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className={`p-4 rounded-xl border ${theme.colors.border} bg-white flex justify-between items-center shadow-sm`}>
                <div className="flex bg-slate-100 p-1 rounded-lg border">
                    <button onClick={() => setScope('Global')} className={`px-6 py-1.5 text-xs font-bold rounded-md transition-all ${scope === 'Global' ? 'bg-white shadow text-nexus-600' : 'text-slate-500'}`}><Globe size={14} className="inline mr-1.5"/> {t('common.global', 'Global')}</button>
                    <button onClick={() => setScope('Project')} className={`px-6 py-1.5 text-xs font-bold rounded-md transition-all ${scope === 'Project' ? 'bg-white shadow text-nexus-600' : 'text-slate-500'}`}><Briefcase size={14} className="inline mr-1.5"/> {t('common.project', 'Project')}</button>
                </div>
                <Button size="sm" icon={Plus}>{t('common.add', 'New Dictionary')}</Button>
            </div>

            <div className="flex-1 overflow-auto bg-white rounded-xl border border-slate-200 shadow-sm">
                {codes.length > 0 ? (
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className={theme.components.table.header}>{t('common.dictionary', 'Dictionary')}</th>
                                <th className={theme.components.table.header}>{t('common.values', 'Member Values')}</th>
                                <th className={theme.components.table.header}></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {codes.map(code => (
                                <tr key={code.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{code.name}</td>
                                    <td className="px-6 py-4 text-xs text-slate-500">{code.values.map(v => v.value).join(', ')}</td>
                                    <td className="px-6 py-4 text-right"><button className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <EmptyGrid title={t('admin.no_codes', 'No Issue Codes')} description={t('admin.no_codes_desc', 'Define standardized root cause categories.')} icon={FileWarning} />
                )}
            </div>
        </div>
    );
};
export default IssueCodeSettings;