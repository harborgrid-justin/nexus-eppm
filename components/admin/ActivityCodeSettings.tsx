
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { ActivityCodeScope } from '../../types';
import { ActivityCodeRegistry } from './activity_codes/ActivityCodeRegistry';
import { DictionaryValues } from './activity_codes/DictionaryValues';
import { useTheme } from '../../context/ThemeContext';
import { EmptyGrid } from '../common/EmptyGrid';
import { Tag } from 'lucide-react';

export const ActivityCodeSettings: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const [scope, setScope] = useState<ActivityCodeScope>('Global');
    const [selectedId, setSelectedId] = useState<string | null>(state.activityCodes[0]?.id || null);

    const filteredCodes = useMemo(() => state.activityCodes.filter(ac => ac.scope === scope), [state.activityCodes, scope]);
    const selectedCode = state.activityCodes.find(ac => ac.id === selectedId);

    return (
        <div className={`h-full flex ${theme.colors.surface} rounded-xl border ${theme.colors.border} overflow-hidden shadow-sm`}>
            <ActivityCodeRegistry 
                codes={filteredCodes} 
                activeScope={scope} 
                setActiveScope={setScope} 
                selectedId={selectedId} 
                onSelect={setSelectedId} 
                onAdd={() => {}} 
            />
            <div className="flex-1 flex flex-col bg-white overflow-y-auto">
                {selectedCode ? (
                    <DictionaryValues code={selectedCode} onAddValue={() => {}} />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12">
                        <EmptyGrid 
                            title="No Category Selected"
                            description="Select a global or project-level activity code from the left to manage its dictionary values and mapping logic."
                            icon={Tag}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
