
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
    const [selectedId, setSelectedId] = useState<string | null>(state.activityCodes.length > 0 ? state.activityCodes[0].id : null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingCode, setEditingCode] = useState<Partial<ActivityCode> | null>(null);

    const filteredCodes = useMemo(() => state.activityCodes.filter(ac => ac.scope === scope), [state.activityCodes, scope]);
    const selectedCode = state.activityCodes.find(ac => ac.id === selectedId);

    const handleOpenPanel = (code?: ActivityCode) => {
        setEditingCode(code || { name: '', scope, values: [] });
        setIsPanelOpen(true);
    };

    const handleSaveCode = () => {
        if (!editingCode?.name) return;
        const codeToSave: ActivityCode = {
            id: editingCode.id || generateId('AC'),
            name: editingCode.name,
            scope: editingCode.scope || scope,
            values: editingCode.values || []
        };
        dispatch({ 
            type: editingCode.id ? 'ADMIN_UPDATE_ACTIVITY_CODE' : 'ADMIN_ADD_ACTIVITY_CODE', 
            payload: codeToSave 
        });
        setIsPanelOpen(false);
        if (!selectedId) setSelectedId(codeToSave.id);
    };

    const handleDeleteCode = (id: string) => {
        if (confirm("Delete this Activity Code? This action cannot be undone and will remove code assignments from all activities.")) {
            dispatch({ type: 'ADMIN_DELETE_ACTIVITY_CODE', payload: id });
            if (selectedId === id) setSelectedId(null);
        }
    };

    const handleUpdateValues = (updatedCode: ActivityCode) => {
        dispatch({ type: 'ADMIN_UPDATE_ACTIVITY_CODE', payload: updatedCode });
    };

    return (
        <div className={`h-full flex ${theme.colors.surface} rounded-xl border ${theme.colors.border} overflow-hidden shadow-sm`}>
            <ActivityCodeRegistry 
                codes={filteredCodes} 
                activeScope={scope} 
                setActiveScope={setScope} 
                selectedId={selectedId} 
                onSelect={setSelectedId} 
                onAdd={() => handleOpenPanel()} 
                onEdit={handleOpenPanel}
                onDelete={handleDeleteCode}
            />
            <div className="flex-1 flex flex-col bg-white overflow-y-auto">
                {selectedCode ? (
                    <DictionaryValues code={selectedCode} onUpdateCode={handleUpdateValues} />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12">
                        <EmptyGrid 
                            title="No Category Selected"
                            description="Select a global or project-level activity code from the left to manage its dictionary values and mapping logic."
                            icon={Tag}
                            actionLabel="Create Code"
                            onAdd={() => handleOpenPanel()}
                        />
                    </div>
                )}
            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingCode?.id ? "Edit Activity Code" : "Create Activity Code"}
                width="md:w-[450px]"
                footer={<><Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button><Button onClick={handleSaveCode} icon={Save}>Save Code</Button></>}
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Code Name</label>
                        <Input value={editingCode?.name} onChange={e => setEditingCode({...editingCode, name: e.target.value})} placeholder="e.g. Phase, Location, Responsibility" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Scope</label>
                         <select 
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                            value={editingCode?.scope}
                            onChange={e => setEditingCode({...editingCode, scope: e.target.value as any})}
                        >
                            <option value="Global">Global</option>
                            <option value="EPS">EPS</option>
                            <option value="Project">Project</option>
                        </select>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};
