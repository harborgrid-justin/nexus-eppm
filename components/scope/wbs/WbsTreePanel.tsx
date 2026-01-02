import React from 'react';
import WBSNodeComponent from '../WBSNodeComponent';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/Button';

interface WbsTreePanelProps {
    wbsTree: any[];
    managerProps: any;
    canEdit: boolean;
    onAddNode: (parentId: string | null) => void;
}

export const WbsTreePanel: React.FC<WbsTreePanelProps> = ({ wbsTree, managerProps, canEdit, onAddNode }) => {
    const { 
        selectedNode, openNodes, draggedNodeId, 
        handleNodeClick, toggleNode, handleDragStart, handleDragEnd, handleDrop, handleDragOver, handleContextMenu 
    } = managerProps;

    const renderNode = (node: any, level: number) => {
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
                    onClick={() => handleNodeClick(node.id)}
                    onAddChild={() => onAddNode(node.id)}
                    onDragStart={(e) => handleDragStart(e, node.id)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, node.id)}
                    onDragOver={handleDragOver}
                    onContextMenu={(e) => handleContextMenu(e, node.id)}
                />
                {isOpen && node.children.map((child: any) => renderNode(child, level + 1))}
            </div>
        );
    };

    return (
        <div className="w-1/3 min-w-[350px] border-r border-slate-200 bg-slate-50 flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-700 text-sm">WBS Hierarchy</h3>
                {canEdit && <Button size="sm" variant="ghost" icon={Plus} onClick={() => onAddNode(null)}>Root</Button>}
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {wbsTree.map((node: any) => renderNode(node, 0))}
            </div>
        </div>
    );
};