
import React, { useState } from 'react';
import { Layers, Plus, Building } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { EPSNode, OBSNode } from '../../types/index';
import { EmptyGrid } from '../common/EmptyGrid';
import { Button } from '../ui/Button';
import { generateId } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';
import { StructureTree } from './structure/StructureTree';
import { NodePanel } from './structure/NodePanel';

const EpsObsSettings: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const [view, setView] = useState<'EPS' | 'OBS'>('EPS');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingNode, setEditingNode] = useState<Partial<EPSNode | OBSNode>>({});

    const handleAdd = (parentId: string | null) => { setEditingNode({ name: '', parentId }); setIsPanelOpen(true); };
    const handleEdit = (node: EPSNode | OBSNode) => { setEditingNode({ ...node }); setIsPanelOpen(true); };
    const handleSave = (nodeData: Partial<EPSNode | OBSNode>) => {
        if (!nodeData.name) return;
        const id = nodeData.id || generateId(view);
        const payload = { ...nodeData, id };
        if (view === 'EPS') {
            const epsPayload = payload as EPSNode;
            if (!epsPayload.code) epsPayload.code = epsPayload.name.substring(0, 3).toUpperCase();
            dispatch({ type: nodeData.id ? 'ADMIN_UPDATE_EPS_NODE' : 'ADMIN_ADD_EPS_NODE', payload: epsPayload });
        } else {
            dispatch({ type: nodeData.id ? 'ADMIN_UPDATE_OBS_NODE' : 'ADMIN_ADD_OBS_NODE', payload: payload as OBSNode });
        }
        setIsPanelOpen(false);
    };

    const currentNodes = view === 'EPS' ? state.eps : state.obs;

    return (
        <div className={`h-full flex flex-col gap-6`}>
            <div className={`flex justify-between items-center bg-slate-50 p-4 rounded-2xl border ${theme.colors.border}`}>
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-inner">
                    <button onClick={() => setView('EPS')} className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${view === 'EPS' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'}`}>EPS View</button>
                    <button onClick={() => setView('OBS')} className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${view === 'OBS' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'}`}>OBS View</button>
                </div>
                <Button size="sm" icon={Plus} onClick={() => handleAdd(null)}>Add Root Level</Button>
            </div>
            <div className={`flex-1 bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col`}>
                <div className="p-4 bg-slate-50/50 border-b flex justify-between items-center px-8 font-black text-[10px] text-slate-400 uppercase tracking-widest">
                    <span>{view} Explorer</span>
                    <span>{currentNodes.length} Members</span>
                </div>
                <div className="flex-1 overflow-auto p-6 scrollbar-thin">
                    <StructureTree nodes={currentNodes} type={view} onEdit={handleEdit} onAdd={handleAdd} onDelete={(id) => dispatch({type: view === 'EPS' ? 'ADMIN_DELETE_EPS_NODE' : 'ADMIN_DELETE_OBS_NODE', payload: id})} />
                </div>
            </div>
            <NodePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} editingNode={editingNode} type={view} resources={state.resources} onSave={handleSave} />
        </div>
    );
};
export default EpsObsSettings;
