import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { Banknote, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { FundingSourceGrid } from './funding/FundingSourceGrid';
import { FundingSourcePanel } from './funding/FundingSourcePanel';
import { EmptyGrid } from '../common/EmptyGrid';

export const FundingSourceSettings: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const { t } = useI18n();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingSource, setEditingSource] = useState<any>(null);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className={`p-6 rounded-2xl bg-slate-50 border ${theme.colors.border} flex justify-between items-center shadow-sm`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-nexus-600 text-white rounded-xl shadow-lg shadow-nexus-500/20"><Banknote size={24}/></div>
                    <div>
                        <h4 className="text-lg font-black uppercase tracking-tighter text-slate-800">{t('admin.funding_registry', 'Financial Authority Registry')}</h4>
                        <p className="text-sm text-slate-500">{t('admin.funding_subtitle', 'Define entities that authorize project budget.')}</p>
                    </div>
                </div>
                <Button size="md" icon={Plus} onClick={() => { setEditingSource({}); setIsPanelOpen(true); }}>{t('admin.funding_register', 'Register Source')}</Button>
            </div>

            <div className="flex-1 overflow-auto">
                {state.fundingSources.length > 0 ? (
                    <FundingSourceGrid 
                        onEdit={(fs) => { setEditingSource(fs); setIsPanelOpen(true); }}
                        onDelete={(id) => dispatch({type: 'ADMIN_DELETE_FUNDING_SOURCE', payload: id})}
                    />
                ) : (
                    <EmptyGrid title={t('admin.funding_empty', 'No Authorities Defined')} description={t('admin.funding_empty_desc', 'Add a corporate or grant funding source.')} icon={Banknote} onAdd={() => setIsPanelOpen(true)} />
                )}
            </div>

            <FundingSourcePanel 
                isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} 
                editingSource={editingSource} 
                onSave={(s) => dispatch({type: s.id ? 'ADMIN_UPDATE_FUNDING_SOURCE' : 'ADMIN_ADD_FUNDING_SOURCE', payload: s})}
            />
        </div>
    );
};
export default FundingSourceSettings;