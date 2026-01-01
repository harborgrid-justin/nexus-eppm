
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Banknote, Plus } from 'lucide-react';
// FIX: Corrected import path to avoid module resolution conflict.
import { FundingSource } from '../../types/index';
import { Button } from '../ui/Button';
import { FundingSourceGrid } from './funding/FundingSourceGrid';
import { FundingSourcePanel } from './funding/FundingSourcePanel';

export const FundingSourceSettings: React.FC = () => {
    const { dispatch } = useData();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingSource, setEditingSource] = useState<Partial<FundingSource> | null>(null);

    const handleOpenPanel = (fs?: FundingSource) => {
        setEditingSource(fs ? { ...fs } : { 
            name: '', type: 'Internal', totalAuthorized: 0, description: '' 
        });
        setIsPanelOpen(true);
    };

    const handleSave = (sourceToSave: FundingSource) => {
        dispatch({
            type: sourceToSave.id && sourceToSave.id.startsWith('FS-') ? 'ADMIN_UPDATE_FUNDING_SOURCE' : 'ADMIN_ADD_FUNDING_SOURCE',
            payload: sourceToSave
        });
        setIsPanelOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Remove this funding source?")) {
            dispatch({ type: 'ADMIN_DELETE_FUNDING_SOURCE', payload: id });
        }
    };

    return (
        <div className="space-y-6 h-full overflow-y-auto pr-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 p-6 rounded-2xl border border-slate-200 gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-nexus-600 text-white rounded-xl shadow-lg shadow-nexus-500/20"><Banknote size={24}/></div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg">Financial Authority Registry</h4>
                        <p className="text-sm text-slate-500">Define entities that provide budget authority.</p>
                    </div>
                </div>
                <Button icon={Plus} onClick={() => handleOpenPanel()} className="w-full md:w-auto">Register Source</Button>
            </div>

            <FundingSourceGrid 
                onEdit={handleOpenPanel}
                onDelete={handleDelete}
            />

            <FundingSourcePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                onSave={handleSave}
                editingSource={editingSource}
            />
        </div>
    );
};
