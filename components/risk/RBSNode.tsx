
import React, { useState } from 'react';
import { RiskBreakdownStructureNode } from '../../types/index';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface RBSNodeProps {
  node: RiskBreakdownStructureNode;
  level: number;
  draggedNodeId: string | null;
  setDraggedNodeId: (id: string | null) => void;
  handleDrop: (parentId: string | null) => void;
}

const RBSNode: React.FC<RBSNodeProps> = ({ node, level, draggedNodeId, setDraggedNodeId, handleDrop }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setDraggedNodeId(node.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setDraggedNodeId(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (node.id !== draggedNodeId) {
            setIsDragOver(true);
        }
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        handleDrop(node.id);
    };

    const isBeingDragged = draggedNodeId === node.id;

    return (
      <div 
        className={`rounded-md ${isBeingDragged ? 'opacity-30' : ''} ${isDragOver ? 'bg-nexus-100 ring-2 ring-nexus-400' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={onDrop}
      >
        <div 
          className="group flex items-center p-2 my-0.5"
          style={{ paddingLeft: `${level * 24 + 8}px` }}
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-1 -ml-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-nexus-500 rounded"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') { setIsOpen(!isOpen); e.preventDefault(); } }}
            aria-label={isOpen ? "Collapse" : "Expand"}
            aria-expanded={isOpen}
          >
            {node.children.length > 0 ? (
              isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />
            ) : (
              <div className="w-[18px]"></div>
            )}
          </div>
          <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md mr-3">{node.code}</span>
          <span className="text-sm font-medium text-slate-800">{node.name}</span>
        </div>
        {isOpen && node.children.length > 0 && (
          <div className="pl-6">
            {node.children.map(child => 
                <RBSNode 
                    key={child.id} 
                    node={child} 
                    level={level + 1} 
                    draggedNodeId={draggedNodeId}
                    setDraggedNodeId={setDraggedNodeId}
                    handleDrop={handleDrop}
                />
            )}
          </div>
        )}
      </div>
    );
  }

export default RBSNode;
