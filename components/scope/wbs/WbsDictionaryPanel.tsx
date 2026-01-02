import React from 'react';
import { WBSNode } from '../../../types';
import { Save, BookOpen } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface WbsDictionaryPanelProps {
    selectedNode: WBSNode | null;
    editedNode: Partial<WBSNode> | null;
    setEditedNode: (node: Partial<WBSNode>) => void;
    canEdit: boolean;
    onSave: () => void;
    projectId: string;
}

export const WbsDictionaryPanel: React.FC<WbsDictionaryPanelProps> = ({ selectedNode, editedNode, setEditedNode, canEdit, onSave }) => {
    if (!selectedNode || !editedNode) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white">
                <BookOpen size={48} className="mb-4 opacity-20"/>
                <p>Select a WBS element to view dictionary details.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{editedNode.name}</h2>
                    <p className="text-sm text-slate-500 font-mono mt-1">{editedNode.wbsCode}</p>
                </div>
                {canEdit && <Button icon={Save} onClick={onSave}>Save Changes</Button>}
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Element Name</label>
                    <Input value={editedNode.name} onChange={e => setEditedNode({...editedNode, name: e.target.value})} disabled={!canEdit} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">WBS Code</label>
                    <Input value={editedNode.wbsCode} onChange={e => setEditedNode({...editedNode, wbsCode: e.target.value})} disabled={!canEdit} className="font-mono" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Scope Description</label>
                    <textarea 
                        className="w-full p-4 border border-slate-300 rounded-lg text-sm h-40 focus:ring-2 focus:ring-nexus-500 outline-none"
                        value={editedNode.description} 
                        onChange={e => setEditedNode({...editedNode, description: e.target.value})}
                        disabled={!canEdit}
                        placeholder="Detailed scope of work..."
                    />
                </div>
            </div>
        </div>
    );
};
