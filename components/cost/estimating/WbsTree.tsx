import React from 'react';
import { WBSNode } from '../../../types';
import { Folder, ChevronRight, ChevronDown, FileText } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface WbsTreeProps {
    wbsTree: WBSNode[];
    selectedNode: WBSNode | null;
    onNodeClick: (id: string) => void;
}

interface TreeNodeProps {
    node: WBSNode;
    level: number;
    selectedId: string | null;
    onSelect: (id: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, selectedId, onSelect }) => {
    const [isOpen, setIsOpen] = React.useState(true);
    const hasChildren = node.children && node.children.length > 0;
    
    return (
        <div>
            <div 
                className={`flex items-center py-1.5 px-2 cursor-pointer hover:bg-slate-100 text-sm ${selectedId === node.id ? 'bg-nexus-50 text-nexus-700 font-bold' : 'text-slate-700'}`}
                style={{ paddingLeft: `${level * 16 + 8}px` }}
                onClick={() => onSelect(node.id)}
            >
                <div onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="p-0.5 mr-1 text-slate-400">
                    {hasChildren ? (isOpen ? <ChevronDown size={12}/> : <ChevronRight size={12}/>) : <div className="w-3"/>}
                </div>
                {hasChildren ? <Folder size={14} className="mr-2 text-blue-400" /> : <FileText size={14} className="mr-2 text-slate-400" />}
                <span className="truncate">{node.wbsCode} {node.name}</span>
            </div>
            {isOpen && hasChildren && node.children.map(child => (
                <TreeNode key={child.id} node={child} level={level + 1} selectedId={selectedId} onSelect={onSelect} />
            ))}
        </div>
    );
};

export const WbsTree: React.FC<WbsTreeProps> = ({ wbsTree, selectedNode, onNodeClick }) => {
    const theme = useTheme();
    return (
        <div className={`w-64 border-r ${theme.colors.border} bg-slate-50 flex flex-col`}>
            <div className={`p-3 border-b ${theme.colors.border} font-bold text-xs uppercase text-slate-500 tracking-wider`}>WBS Structure</div>
            <div className="flex-1 overflow-y-auto py-2">
                {wbsTree.map(node => (
                    <TreeNode key={node.id} node={node} level={0} selectedId={selectedNode?.id || null} onSelect={onNodeClick} />
                ))}
            </div>
        </div>
    );
};