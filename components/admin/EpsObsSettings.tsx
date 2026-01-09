
import React, { useState } from 'react';
import { Layers, Plus, Folder } from 'lucide-react';
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
    
    // Panel State
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingNode, setEditingNode] = useState<Partial<EPSNode | OBSNode>>({});

    const handleAdd = (parentId: string | null) => {
        setEditingNode({ name: '', parentId });
        setIsPanelOpen(true);
    };

    const handleEdit = (node: EPSNode | OBSNode) => {
        setEditingNode({ ...node });
        setIsPanelOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this node? All children will be orphaned.")) {
            dispatch({ type: view === 'EPS' ? 'ADMIN_DELETE_EPS_NODE' : 'ADMIN_DELETE_OBS_NODE', payload: id });
        }
    };

    const handleSave = (nodeData: Partial<EPSNode | OBSNode>) => {
        if (!nodeData.name) return;
        const id = nodeData.id || generateId(view === 'EPS' ? 'EPS' : 'OBS');
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

    const hasData = view === 'EPS' ? state.eps.length > 0 : state.obs.length > 0;
    const currentNodes = view === 'EPS' ? state.eps : state.obs;

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center bg-slate-100 p-1 rounded-lg w-full md:w-auto">
                <div className="flex gap-1">
                    <button onClick={() => setView('EPS')} className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${view === 'EPS' ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-700'}`}>Enterprise Projects (EPS)</button>
                    <button onClick={() => setView('OBS')} className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${view === 'OBS' ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-700'}`}>Organizational (OBS)</button>
                </div>
                <Button size="sm" icon={Plus} onClick={() => handleAdd(null)}>Add Root Node</Button>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-500 uppercase tracking-widest flex justify-between items-center">
                    <span>Hierarchy Tree</span>
                    <span className="font-mono text-[10px] text-slate-400">{currentNodes.length} Nodes</span>
                </div>
                <div className="flex-1 overflow-auto p-2 scrollbar-thin">
                    {!hasData ? (
                        <EmptyGrid title={`${view} Structure Undefined`} description={`Initialize the global hierarchical structure for your ${view === 'EPS' ? 'project database' : 'security and organization'} nodes.`} icon={Layers} actionLabel={`Define Root ${view}`} onAdd={() => handleAdd(null)} />
                    ) : (
                        <StructureTree nodes={currentNodes} type={view} onEdit={handleEdit} onAdd={handleAdd} onDelete={handleDelete} />
                    )}
                </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 shadow-sm">
                <div className="p-1 bg-blue-100 rounded text-blue-600 shrink-0"><Layers size={14}/></div>
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                    <strong>P6 Parity Note:</strong> The EPS defines the hierarchical structure of the project database. The OBS creates the security profile structure. Projects are assigned to an EPS node and an OBS Responsible Manager.
                </p>
            </div>

            <NodePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} editingNode={editingNode} type={view} resources={state.resources} onSave={handleSave} />
        </div>
    );
};
export default EpsObsSettings;
