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
        <div className={`h-full flex flex-col ${theme.layout.sectionSpacing}`}>
            <div className={`flex flex-col md:flex-row justify-between items-center bg-slate-50 p-3 rounded-xl border ${theme.colors.border} shadow-sm gap-3`}>
                <div className="flex bg-white p-1 rounded-lg border border-slate-200">
                    <button 
                        onClick={() => setView('EPS')} 
                        className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-md transition-all ${view === 'EPS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        Project Hierarchy (EPS)
                    </button>
                    <button 
                        onClick={() => setView('OBS')} 
                        className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-md transition-all ${view === 'OBS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        Security Hierarchy (OBS)
                    </button>
                </div>
                <Button size="sm" icon={Plus} onClick={() => handleAdd(null)}>Add Root Level</Button>
            </div>

            <div className={`flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col`}>
                <div className={`p-4 bg-slate-50/50 border-b border-slate-200 font-black text-[10px] text-slate-400 uppercase tracking-widest flex justify-between items-center`}>
                    <span>Hierarchy Explorer</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">{currentNodes.length} Elements</span>
                </div>
                <div className="flex-1 overflow-auto p-4 scrollbar-thin">
                    {!hasData ? (
                        <EmptyGrid 
                            title={`${view} Model Uninitialized`} 
                            description={`Construct the global tree structure for your ${view === 'EPS' ? 'project database' : 'security profiles'}.`} 
                            icon={Layers} 
                            actionLabel={`Define Root ${view}`} 
                            onAdd={() => handleAdd(null)} 
                        />
                    ) : (
                        <div className="max-w-4xl">
                            <StructureTree nodes={currentNodes} type={view} onEdit={handleEdit} onAdd={handleAdd} onDelete={handleDelete} />
                        </div>
                    )}
                </div>
            </div>
            
            <div className={`p-5 ${theme.colors.semantic.info.bg} border ${theme.colors.semantic.info.border} rounded-2xl flex gap-4 shadow-sm`}>
                <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600 shrink-0"><Layers size={20}/></div>
                <div>
                    <h4 className={`font-black text-[10px] uppercase tracking-widest text-blue-800 mb-1`}>Architecture Standard</h4>
                    <p className="text-xs text-blue-700 leading-relaxed font-medium">
                        The <strong>EPS (Enterprise Project Structure)</strong> controls project categorization. 
                        The <strong>OBS (Organizational Breakdown Structure)</strong> controls secure resource access. 
                        Every project must map to a valid node in both hierarchies.
                    </p>
                </div>
            </div>

            <NodePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} editingNode={editingNode} type={view} resources={state.resources} onSave={handleSave} />
        </div>
    );
};
export default EpsObsSettings;