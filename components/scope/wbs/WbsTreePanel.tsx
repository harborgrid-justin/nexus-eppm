
import React, { useTransition } from 'react';
import WBSNodeComponent from '../WBSNodeComponent';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { WBSNode } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';

interface WbsManagerProps {
    selectedNode: WBSNode | null;
    openNodes: Set<string>;
    draggedNodeId: string | null;
    handleNodeClick: (id: string) => void;
    toggleNode: (id: string) => void;
    handleDragStart: (e: React.DragEvent, id: string) => void;
    handleDragEnd: () => void;
    handleDrop: (e: React.DragEvent, id: string | null) => void;
    handleDragOver: (e: React.DragEvent) => void;
    handleContextMenu: (e: React.MouseEvent, id: string) => void;
}

interface WbsTreePanelProps {
    wbsTree: WBSNode[];
    managerProps: WbsManagerProps;
    canEdit: boolean;
    onAddNode: (parentId: string | null) => void;
}

export const WbsTreePanel: React.FC<WbsTreePanelProps> = ({ wbsTree, managerProps, canEdit, onAddNode }) => {
    const { 
        selectedNode, openNodes, draggedNodeId, 
        handleNodeClick, toggleNode, handleDragStart, handleDragEnd, handleDrop, handleDragOver, handleContextMenu 
    } = managerProps;

    const [isPending, startTransition] = useTransition();
    const theme = useTheme();

    const renderNode = (node: WBSNode, level: number) => {
        const isOpen = openNodes.has(node.id);
        const isSelected = selectedNode?.id === node.id;

        return (
            <div key={node.id}>
                <WBSNodeComponent
                    node={node}
                    level={level}
                    isOpen={isOpen}
                    isSelected={isSelected}
                    isDragged={draggedNodeId === node.id}
                    onToggle={() => toggleNode(node.id)}
                    onClick={() => startTransition(() => handleNodeClick(node.id))}
                    onAddChild={() => onAddNode(node.id)}
                    onDragStart={(e) => handleDragStart(e, node.id)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, node.id)}
                    onDragOver={handleDragOver}
                    onContextMenu={(e) => handleContextMenu(e, node.id)}
                />
                {isOpen && node.children && node.children.map((child: WBSNode) => renderNode(child, level + 1))}
            </div>
        );
    };

    return (
        <div className={`w-1/3 min-w-[350px] border-r ${theme.colors.border} bg-slate-50 flex flex-col`}>
            <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center bg-white shadow-sm`}>
                <h3 className="font-black text-slate-700 text-xs uppercase tracking-widest">WBS Hierarchy</h3>
                <div className="flex gap-2">
                    {isPending && <Loader2 className="animate-spin text-nexus-500 self-center" size={14}/>}
                    {canEdit && <Button size="sm" variant="ghost" icon={Plus} onClick={() => onAddNode(null)}>Root</Button>}
                </div>
            </div>
            <div className={`flex-1 overflow-y-auto p-2 scrollbar-thin transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
                {wbsTree.map((node: WBSNode) => renderNode(node, 0))}
            </div>
        </div>
    );
};
