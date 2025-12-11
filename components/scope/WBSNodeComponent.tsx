import React from 'react';
import { WBSNode, WBSNodeShape } from '../../types';
import { ChevronRight, ChevronDown, PlusCircle } from 'lucide-react';

interface WBSNodeComponentProps {
  node: WBSNode;
  level: number;
  isOpen: boolean;
  isSelected: boolean;
  isDragged: boolean;
  onToggle: () => void;
  onClick: () => void;
  onAddChild: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

const getShapeClasses = (shape: WBSNodeShape = 'rectangle') => {
  switch (shape) {
    case 'oval': return 'rounded-full';
    case 'hexagon': return ''; // Requires more complex CSS/SVG
    default: return 'rounded-md';
  }
}

const WBSNodeComponent: React.FC<WBSNodeComponentProps> = ({
  node, level, isOpen, isSelected, isDragged,
  onToggle, onClick, onAddChild,
  onDragStart, onDragEnd, onDrop, onDragOver, onContextMenu
}) => {
  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`group flex items-center pr-2 my-0.5 rounded-md cursor-pointer relative
        ${isSelected ? 'bg-nexus-100' : 'hover:bg-slate-50'}
        ${isDragged ? 'opacity-30' : ''}
      `}
      style={{ paddingLeft: `${level * 24 + 8}px` }}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {/* Link Handles */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-2 border-slate-400 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 bg-white border-2 border-slate-400 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer" />

      <div onClick={(e) => { e.stopPropagation(); onToggle(); }} className="p-1 -ml-2">
        {node.children.length > 0 ? (
          isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />
        ) : (
          <div className="w-[18px]"></div>
        )}
      </div>
      <div className={`flex items-center gap-3 border border-transparent p-2 flex-1 ${getShapeClasses(node.shape)}`}>
        <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{node.wbsCode}</span>
        <span className="text-sm font-medium text-slate-800">{node.name}</span>
      </div>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); onAddChild(); }} className="p-1 hover:bg-slate-200 rounded text-green-500" title="Add child node">
          <PlusCircle size={12} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(WBSNodeComponent);
