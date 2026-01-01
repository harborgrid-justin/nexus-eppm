
import React, { useState } from 'react';
import { Layers, Folder, User, Plus, Edit2, Trash2, ChevronRight, ChevronDown, Building, Save, X, Network } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { EPSNode, OBSNode } from '../../types';
import { Button } from '../ui/Button';
import { SidePanel } from '../ui/SidePanel';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';

const EpsObsSettings: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const [view, setView] = useState<'EPS' | 'OBS'>('EPS');
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['EPS-ROOT', 'OBS-ROOT']));
    
    // SidePanel State
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingNode, setEditingNode] = useState<any | null>(null);

    const toggleNode = (id: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleOpenPanel = (node?: any, parentId: string | null = null) => {
        if (view === 'EPS') {
            setEditingNode(node || { name: '', code: '', parentId: parentId, managerId: '' });
        } else {
            setEditingNode(node || { name: '', parentId: parentId, managerId: '', description: '' });
        }
        setIsPanelOpen(true);
    };

    const handleSave = () => {
        if (!editingNode?.name) return;

        const actionType = view === 'EPS' 
            ? (editingNode.id ? 'UPDATE_EPS_NODE' : 'ADD_EPS_NODE')
            : (editingNode.id ? 'UPDATE_OBS_NODE' : 'ADD_OBS_NODE');

        const payload = {
            ...editingNode,
            id: editingNode.id || generateId(view)
        };

        dispatch({ type: actionType as any, payload });
        setIsPanelOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm(`Delete this ${view} element? Projects and children linked to this node will require re-assignment.`)) {
            dispatch({ type: view === 'EPS' ? 'DELETE_EPS_NODE' : 'DELETE_OBS_NODE', payload: id } as any);
        }
    };

    const renderEPSNode = (node: EPSNode, level: number = 0) => {
        const children = state.eps.filter(e => e.parentId === node.id);
        const isExpanded = expandedNodes.has(node.id);

        return (
            <div key={node.id} className="select-none">
                <div 
                    className={`flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100 group transition-colors cursor-pointer ${editingNode?.id === node.id ? 'bg-nexus-50' : ''}`}
                    style={{ paddingLeft: `${level * 24 + 12}px` }} 
                    onClick={() => toggleNode(node.id)}
                >
                    <div className="text-slate-400">
                        {children.length > 0 ? (isExpanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>) : <div className="w-[14px]"/>}
                    </div>
                    <Folder size={16} className="text-nexus-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <span className="font-bold text-sm text-slate-800 truncate block">{node.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">({node.code})</span>
                    </div>
                    <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); handleOpenPanel(node); }} className="p-1 hover:bg-slate-200 rounded text-slate-500"><Edit2 size={12}/></button>
                        <button onClick={(e) => { e.stopPropagation(); handleOpenPanel(null, node.id); }} className="p-1 hover:bg-nexus-50 rounded text-nexus-600"><Plus size={12}/></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(node.id); }} className="p-1 hover:bg-red-50 rounded text-red-500"><Trash2 size={12}/></button>
                    </div>
                </div>
                {isExpanded && children.map(child => renderEPSNode(child, level + 1))}
            </div>
        );
    };

    const renderOBSNode = (node: OBSNode, level: number = 0) => {
        const children = state.obs.filter(e => e.parentId === node.id);
        const isExpanded = expandedNodes.has(node.id);
        const manager = state.resources.find(r => r.id === node.managerId);

        return (
            <div key={node.id} className="select-none">
                <div 
                    className={`flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100 group transition-colors cursor-pointer ${editingNode?.id === node.id ? 'bg-blue-50' : ''}`}
                    style={{ paddingLeft: `${level * 24 + 12}px` }}
                    onClick={() => toggleNode(node.id)}
                >
                    <div className="text-slate-400">
                        {children.length > 0 ? (isExpanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>) : <div className="w-[14px]"/>}
                    </div>
                    <Building size={16} className="text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <span className="font-bold text-sm text-slate-800 truncate block">{node.name}</span>
                        {manager && (
                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-medium inline-block mt-0.5">
                                Lead: {manager.name}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); handleOpenPanel(node); }} className="p-1 hover:bg-slate-200 rounded text-slate-500"><Edit2 size={12}/></button>
                        <button onClick={(e) => { e.stopPropagation(); handleOpenPanel(null, node.id); }} className="p-1 hover:bg-nexus-50 rounded text-nexus-600"><Plus size={12}/></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(node.id); }} className="p-1 hover:bg-red-50 rounded text-red-500"><Trash2 size={12}/></button>
                    </div>
                </div>
                {isExpanded && children.map(child => renderOBSNode(child, level + 1))}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
                    <button 
                        onClick={() => setView('EPS')}
                        className={`flex-1 md:flex-none px-4 md:px-6 py-2 text-sm font-bold rounded-md transition-all ${view === 'EPS' ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Enterprise Projects (EPS)
                    </button>
                    <button 
                        onClick={() => setView('OBS')}
                        className={`flex-1 md:flex-none px-4 md:px-6 py-2 text-sm font-bold rounded-md transition-all ${view === 'OBS' ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Organizational (OBS)
                    </button>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="secondary" size="sm" icon={Network} className="flex-1 md:flex-none">Apply Global Changes</Button>
                    <Button size="sm" icon={Plus} onClick={() => handleOpenPanel()} className="flex-1 md:flex-none">Add {view} Root</Button>
                </div>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-500 uppercase tracking-widest flex justify-between items-center">
                    <span>Manage {view} Hierarchy</span>
                    <span className="font-mono text-[10px] text-slate-400">{view === 'EPS' ? state.eps.length : state.obs.length} Nodes</span>
                </div>
                <div className="flex-1 overflow-auto p-2 scrollbar-thin">
                    <div className="min-w-[300px]">
                        {view === 'EPS' ? (
                            state.eps.filter(e => !e.parentId).map(node => renderEPSNode(node))
                        ) : (
                            state.obs.filter(e => !e.parentId).map(node => renderOBSNode(node))
                        )}
                    </div>
                </div>
            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingNode?.id ? `Edit ${view} element` : `Create ${view} element`}
                width="md:w-[450px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} icon={Save}>Commit {view} Record</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div className="bg-slate-900 p-4 rounded-xl text-white mb-6">
                        <p className="text-[10px] font-black text-nexus-400 uppercase tracking-widest mb-1">Hierarchy Context</p>
                        <p className="text-sm font-bold truncate">
                            Parent: {editingNode?.parentId ? (view === 'EPS' ? state.eps.find(e => e.id === editingNode.parentId)?.name : state.obs.find(o => o.id === editingNode.parentId)?.name) : '[ROOT]'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Element Name</label>
                        <Input value={editingNode?.name} onChange={e => setEditingNode({...editingNode, name: e.target.value})} placeholder={`e.g. ${view === 'EPS' ? 'Western Region Portfolio' : 'Finance Department'}`} />
                    </div>

                    {view === 'EPS' && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">EPS Code / Short Name</label>
                            <Input value={editingNode?.code} onChange={e => setEditingNode({...editingNode, code: e.target.value})} placeholder="e.g. WEST-EC" className="font-mono uppercase" />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Responsible Manager</label>
                        <select 
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                            value={editingNode?.managerId}
                            onChange={e => setEditingNode({...editingNode, managerId: e.target.value})}
                        >
                            <option value="">-- No Assignment --</option>
                            {state.resources.map(res => <option key={res.id} value={res.id}>{res.name} ({res.role})</option>)}
                        </select>
                        <p className="text-[10px] text-slate-400 mt-2">Linking to OBS determines executive security privileges for this branch.</p>
                    </div>

                    {view === 'OBS' && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                            <textarea 
                                className="w-full p-3 border border-slate-300 rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none"
                                value={editingNode?.description}
                                onChange={e => setEditingNode({...editingNode, description: e.target.value})}
                                placeholder="Purpose and function of this organizational unit..."
                            />
                        </div>
                    )}
                </div>
            </SidePanel>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 shadow-sm">
                <div className="p-1 bg-blue-100 rounded text-blue-600 shrink-0"><Layers size={14}/></div>
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                    <strong>Administrative Note:</strong> Deleting parent nodes will prompt for cascade deletion or re-parenting of child elements to maintain tree integrity.
                </p>
            </div>
        </div>
    );
};

export default EpsObsSettings;
