
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { ActivityCodeScope, ActivityCode } from '../../types';
import { ActivityCodeRegistry } from './activity_codes/ActivityCodeRegistry';
import { DictionaryValues } from './activity_codes/DictionaryValues';
import { useTheme } from '../../context/ThemeContext';
import { EmptyGrid } from '../common/EmptyGrid';
import { Tag, Save } from 'lucide-react';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';

export const ActivityCodeSettings: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
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
        dispatch({ type: 'ADMIN_ADD_ACTIVITY_CODE', payload });
        setIsPanelOpen(false);
    };

    return (
        <div className={`h-full flex bg-white border-l border-slate-200 overflow-hidden`}>
            <ActivityCodeRegistry 
                codes={filteredCodes} activeScope={scope} setActiveScope={setScope} 
                selectedId={selectedId} onSelect={setSelectedId} onAdd={() => { setEditingCode(null); setIsPanelOpen(true); }} 
            />
            <div className="flex-1 flex flex-col bg-white">
                {selectedCode ? (
                    <DictionaryValues code={selectedCode} onUpdateCode={(c) => dispatch({type:'ADMIN_UPDATE_ACTIVITY_CODE', payload:c})} />
                ) : (
                    <EmptyGrid title="No Dictionary Selected" description="Select a standardized code dictionary from the global registry to modify its values." icon={Tag} />
                )}
            </div>
            <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} title={editingCode?.id ? "Edit Dictionary" : "Establish New Dictionary"} footer={<><Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button><Button onClick={handleSaveCode} icon={Save}>Commit Schema</Button></>}>
                <div className="space-y-4">
                    <Input label="Dictionary Name" value={editingCode?.name} onChange={e => setEditingCode({...editingCode!, name: e.target.value})} placeholder="e.g. Area Code" />
                </div>
            </SidePanel>
        </div>
    );
};
