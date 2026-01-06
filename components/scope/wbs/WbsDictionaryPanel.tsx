import React from 'react';
import { WBSNode } from '../../../types';
import { Save, BookOpen, Layers } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { NarrativeField } from '../../common/NarrativeField';
import { EmptyGrid } from '../../common/EmptyGrid';

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
            <div className="flex-1 flex flex-col items-center justify-center bg-white">
                <EmptyGrid 
                    title="No Element Selected"
                    description="Select a node from the WBS hierarchy to inspect or define its dictionary parameters."
                    icon={Layers}
                />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white animate-nexus-in">
            <div className="p-6 border-b border-border flex justify-between items-center bg-slate-50/30">
                <div>
                    <h2 className="text-xl font-bold text-text-primary">{editedNode.name}</h2>
                    <p className="text-sm text-text-secondary font-mono mt-1">{editedNode.wbsCode}</p>
                </div>
                {canEdit && <Button icon={Save} onClick={onSave}>Save Dictionary</Button>}
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Element Name</label>
                        <Input value={editedNode.name} onChange={e => setEditedNode({...editedNode, name: e.target.value})} disabled={!canEdit} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">WBS Code</label>
                        <Input value={editedNode.wbsCode} onChange={e => setEditedNode({...editedNode, wbsCode: e.target.value})} disabled={!canEdit} className="font-mono" />
                    </div>
                </div>

                <NarrativeField 
                    label="Scope Description & Deliverables"
                    value={editedNode.description}
                    placeholderLabel="No physical scope defined for this node."
                    onAdd={() => {}} // In production, this would focus the textarea or open an editor
                />

                {/* Additional dictionary fields could go here, following the same pattern */}
                <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Responsibility</span>
                        <span className="text-sm font-bold text-slate-700">Project Manager</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Account Code</span>
                        <span className="text-sm font-mono text-slate-700">GL-4920</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Quality Standards</span>
                        <span className="text-sm font-bold text-slate-700">ISO-9001</span>
                    </div>
                </div>
            </div>
        </div>
    );
};