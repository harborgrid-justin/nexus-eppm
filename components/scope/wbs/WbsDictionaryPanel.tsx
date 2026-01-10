import React from 'react';
import { WBSNode } from '../../../types';
import { Save, Layers, Info, ShieldCheck } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { NarrativeField } from '../../common/NarrativeField';
import { EmptyGrid } from '../../common/EmptyGrid';
import { useTheme } from '../../../context/ThemeContext';

interface WbsDictionaryPanelProps {
    selectedNode: WBSNode | null;
    editedNode: Partial<WBSNode> | null;
    setEditedNode: (node: Partial<WBSNode>) => void;
    canEdit: boolean;
    onSave: () => void;
    projectId: string;
}

export const WbsDictionaryPanel: React.FC<WbsDictionaryPanelProps> = ({ selectedNode, editedNode, setEditedNode, canEdit, onSave }) => {
    const theme = useTheme();

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
            <div className={`p-6 border-b ${theme.colors.border} flex justify-between items-center bg-slate-50/30`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-nexus-600">
                        <Layers size={24}/>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">{editedNode.name}</h2>
                        <p className="text-xs text-slate-500 font-mono font-bold mt-1">Code: {editedNode.wbsCode}</p>
                    </div>
                </div>
                {canEdit && <Button icon={Save} onClick={onSave} className="shadow-lg shadow-nexus-500/20">Save Dictionary</Button>}
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-thin">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Element Designation</label>
                        <Input 
                            value={editedNode.name || ''} 
                            onChange={e => setEditedNode({...editedNode, name: e.target.value})} 
                            disabled={!canEdit} 
                            className="bg-slate-50 font-bold h-11"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Work Breakdown Index</label>
                        <Input 
                            value={editedNode.wbsCode || ''} 
                            onChange={e => setEditedNode({...editedNode, wbsCode: e.target.value})} 
                            disabled={!canEdit} 
                            className="font-mono bg-slate-50 h-11" 
                        />
                    </div>
                </div>

                <NarrativeField 
                    label="Scope Description & Deliverables"
                    value={editedNode.description}
                    placeholderLabel="No physical scope defined for this node. Descriptions are required for earned value baseline."
                    onSave={(val) => setEditedNode({...editedNode, description: val})}
                    isReadOnly={!canEdit}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-nexus-200 transition-colors">
                        <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Responsibility</span>
                        <span className="text-sm font-bold text-slate-700">Project Manager</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-nexus-200 transition-colors">
                        <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Account Code</span>
                        <span className="text-sm font-mono font-bold text-slate-700">GL-4920</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-nexus-200 transition-colors">
                        <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Quality Standards</span>
                        <span className="text-sm font-bold text-slate-700">ISO-9001</span>
                    </div>
                </div>

                <div className="bg-indigo-900 p-6 rounded-3xl text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10">
                        <h4 className="font-bold flex items-center gap-2 mb-2 text-sm">
                            <ShieldCheck size={18} className="text-nexus-400"/> Baseline Integrity
                        </h4>
                        <p className="text-[11px] text-indigo-200 leading-relaxed font-medium uppercase tracking-tight">
                            Modifying the WBS structure after baseline approval triggers a formal Change Request (PCR). 
                            Ensure dictionary entries accurately describe the physical work required.
                        </p>
                    </div>
                    <Info size={100} className="absolute -right-8 -bottom-8 text-white/5 opacity-10" />
                </div>
            </div>
        </div>
    );
};