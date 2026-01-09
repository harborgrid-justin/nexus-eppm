
import React, { useState } from 'react';
import { EPSNode, OBSNode } from '../../../types';
import { ChevronDown, ChevronRight, Folder, Edit2, Plus, Trash2, Building } from 'lucide-react';

interface StructureTreeProps {
    nodes: (EPSNode | OBSNode)[];
    type: 'EPS' | 'OBS';
    onEdit: (node: EPSNode | OBSNode) => void;
    onAdd: (parentId: string | null) => void;
    onDelete: (id: string) => void;
}

const TreeNode: React.FC<{ 
    node: EPSNode | OBSNode; 
    type: 'EPS' | 'OBS';
    allNodes: (EPSNode | OBSNode)[];
    level: number;
    onEdit: (n: any) => void;
    onAdd: (id: string) => void;
    onDelete: (id: string) => void;
}> = ({ node, type, allNodes, level, onEdit, onAdd, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const children = allNodes.filter(n => n.parentId === node.id);
    const hasChildren = children.length > 0;

    return (
        <div className="select-none animate-nexus-in">
            <div 
                className="flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100 group transition-colors cursor-pointer"
                style={{ paddingLeft: `${level * 24 + 12}px` }} 
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="text-slate-400">
                    {hasChildren ? (isExpanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>) : <div className="w-[14px]"/>}
                </div>
                {type === 'EPS' ? <Folder size={16} className="text-nexus-500 flex-shrink-0" /> : <Building size={16} className="text-blue-500 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                    <span className="font-bold text-sm text-slate-800 truncate block">{node.name}</span>
                    {type === 'EPS' && <span className="text-[10px] font-mono text-slate-400 uppercase">({(node as EPSNode).code})</span>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(node); }} className="p-1 hover:bg-slate-200 rounded text-slate-500"><Edit2 size={12}/></button>
                    <button onClick={(e) => { e.stopPropagation(); onAdd(node.id); }} className="p-1 hover:bg-nexus-50 rounded text-nexus-600"><Plus size={12}/></button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(node.id); }} className="p-1 hover:bg-red-50 rounded text-red-500"><Trash2 size={12}/></button>
                </div>
            </div>
            {isExpanded && children.map(child => (
                <TreeNode key={child.id} node={child} type={type} allNodes={allNodes} level={level + 1} onEdit={onEdit} onAdd={onAdd} onDelete={onDelete} />
            ))}
        </div>
    );
};

export const StructureTree: React.FC<StructureTreeProps> = ({ nodes, type, onEdit, onAdd, onDelete }) => {
    const rootNodes = nodes.filter(n => !n.parentId);
    return (
        <div className="min-w-[400px]">
            {rootNodes.map(node => (
                <TreeNode key={node.id} node={node} type={type} allNodes={nodes} level={0} onEdit={onEdit} onAdd={onAdd} onDelete={onDelete} />
            ))}
        </div>
    );
};
