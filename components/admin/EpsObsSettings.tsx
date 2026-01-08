
import React, { useState } from 'react';
import { Layers, Folder, User, Plus, Edit2, Trash2, ChevronRight, ChevronDown, Building } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { EPSNode, OBSNode } from '../../types/index';
import { EmptyGrid } from '../common/EmptyGrid';

const EpsObsSettings: React.FC = () => {
    const { state } = useData();
    const [view, setView] = useState<'EPS' | 'OBS'>('EPS');
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['EPS-ROOT', 'OBS-ROOT']));

    const toggleNode = (id: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const renderEPSNode = (node: EPSNode, level: number = 0) => {
        const children = state.eps.filter(e => e.parentId === node.id);
        const isExpanded = expandedNodes.has(node.id);

        return (
            <div key={node.id} className="select-none animate-nexus-in">
                <div 
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100 group transition-colors cursor-pointer"
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
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-slate-200 rounded text-slate-500"><Edit2 size={12}/></button>
                        <button className="p-1 hover:bg-nexus-50 rounded text-nexus-600"><Plus size={12}/></button>
                        <button className="p-1 hover:bg-red-50 rounded text-red-500"><Trash2 size={12}/></button>
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
            <div key={node.id} className="select-none animate-nexus-in">
                <div 
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100 group transition-colors cursor-pointer"
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
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-slate-200 rounded text-slate-500"><Edit2 size={12}/></button>
                        <button className="p-1 hover:bg-nexus-50 rounded text-nexus-600"><Plus size={12}/></button>
                        <button className="p-1 hover:bg-red-50 rounded text-red-500"><Trash2 size={12}/></button>
                    </div>
                </div>
                {isExpanded && children.map(child => renderOBSNode(child, level + 1))}
            </div>
        );
    };

    const hasData = view === 'EPS' ? state.eps.length > 0 : state.obs.length > 0;

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
                <button 
                    onClick={() => setView('EPS')}
                    className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${view === 'EPS' ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Enterprise Projects (EPS)
                </button>
                <button 
                    onClick={() => setView('OBS')}
                    className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${view === 'OBS' ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Organizational (OBS)
                </button>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-500 uppercase tracking-widest flex justify-between items-center">
                    <span>Hierarchy Tree</span>
                    <span className="font-mono text-[10px] text-slate-400">{view === 'EPS' ? state.eps.length : state.obs.length} Nodes</span>
                </div>
                <div className="flex-1 overflow-auto p-2 scrollbar-thin">
                    {!hasData ? (
                        <EmptyGrid 
                            title={`${view} Structure Undefined`}
                            description={`Initialize the global hierarchical structure for your ${view === 'EPS' ? 'project database' : 'security and organization'} nodes.`}
                            icon={Layers}
                            actionLabel={`Define Root ${view}`}
                            onAdd={() => {}}
                        />
                    ) : (
                        <div className="min-w-[400px]">
                            {view === 'EPS' ? (
                                state.eps.filter(e => !e.parentId).map(node => renderEPSNode(node))
                            ) : (
                                state.obs.filter(e => !e.parentId).map(node => renderOBSNode(node))
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 shadow-sm">
                <div className="p-1 bg-blue-100 rounded text-blue-600 shrink-0"><Layers size={14}/></div>
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                    <strong>P6 Parity Note:</strong> The EPS defines the hierarchical structure of the project database. The OBS creates the security profile structure. Projects are assigned to an EPS node and an OBS Responsible Manager.
                </p>
            </div>
        </div>
    );
};

export default EpsObsSettings;
