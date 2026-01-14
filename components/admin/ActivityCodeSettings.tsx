import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { ActivityCodeScope, ActivityCode } from '../../types';
import { ActivityCodeRegistry } from './activity_codes/ActivityCodeRegistry';
import { DictionaryValues } from './activity_codes/DictionaryValues';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { EmptyGrid } from '../common/EmptyGrid';
import { Tag, Save } from 'lucide-react';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';

export const ActivityCodeSettings: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const { t } = useI18n();
    const [scope, setScope] = useState<ActivityCodeScope>('Global');
    const [selectedId, setSelectedId] = useState<string | null>(state.activityCodes[0]?.id || null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingCode, setEditingCode] = useState<Partial<ActivityCode> | null>(null);

    const filteredCodes = useMemo(() => state.activityCodes.filter(ac => ac.scope === scope), [state.activityCodes, scope]);
    const selectedCode = state.activityCodes.find(ac => ac.id === selectedId);

    const handleSaveCode = () => {
        if (!editingCode?.name) return;
        const payload: ActivityCode = {
            id: editingCode.id || generateId('AC'),
            name: editingCode.name,
            scope: editingCode.scope || scope,
            values: editingCode.values || []
        };
        dispatch({ type: editingCode.id ? 'ADMIN_UPDATE_ACTIVITY_CODE' : 'ADMIN_ADD_ACTIVITY_CODE', payload });
        setIsPanelOpen(false);
    };

    return (
        <div className={`h-full flex ${theme.colors.surface} border-l border-slate-200 overflow-hidden`}>
            <ActivityCodeRegistry 
                codes={filteredCodes} activeScope={scope} setActiveScope={setScope} 
                selectedId={selectedId} onSelect={setSelectedId} onAdd={() => setIsPanelOpen(true)} 
            />
            <div className="flex-1 flex flex-col bg-white">
                {selectedCode ? (
                    <DictionaryValues code={selectedCode} onUpdateCode={(c) => dispatch({type:'ADMIN_UPDATE_ACTIVITY_CODE', payload:c})} />
                ) : (
                    <EmptyGrid 
                        title={t('admin.code_select', 'No Activity Code Selected')}
                        description={t('admin.code_select_desc', 'Select a dictionary from the registry to manage its values.')}
                        icon={Tag}
                    />
                )}
            </div>

            <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} title={t('admin.new_code', 'New Activity Code')}
                footer={<><Button variant="secondary" onClick={() => setIsPanelOpen(false)}>{t('common.cancel', 'Cancel')}</Button><Button onClick={handleSaveCode} icon={Save}>{t('common.save', 'Save')}</Button></>}>
                <div className="space-y-4">
                    <Input label={t('common.name', 'Name')} value={editingCode?.name} onChange={e => setEditingCode({...editingCode!, name: e.target.value})} />
                </div>
            </SidePanel>
        </div>
    );
};