import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import RBSNode from './RBSNode';

interface RiskBreakdownStructureProps {
  projectId: string;
}

const RiskBreakdownStructure: React.FC<RiskBreakdownStructureProps> = ({ projectId }) => {
  const { state, dispatch } = useData();
  const { rbs } = state;
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  
  // A simple check to prevent dropping a node onto one of its own children
  const isDropTargetValid = (draggedId: string, targetId: string | null): boolean => {
      if (!targetId || !draggedId) return true;
      let invalid = false;
      const findInChildren = (nodes: any[], parentId: string) => {
          for(const node of nodes) {
              if (node.id === parentId) {
                  invalid = true;
                  break;
              }
              if (node.children) findInChildren(node.children, parentId);
          }
      };
      
      const draggedNode = rbs.find(n => n.id === draggedId); // Simplified find
      if(draggedNode) {
        findInChildren(draggedNode.children, targetId);
      }
      return !invalid;
  };

  const handleDrop = (newParentId: string | null) => {
    if (draggedNodeId && isDropTargetValid(draggedNodeId, newParentId)) {
        dispatch({ type: 'UPDATE_RBS_NODE_PARENT', payload: { nodeId: draggedNodeId, newParentId } });
    }
    setDraggedNodeId(null);
  };

  if(!rbs) {
    return <div className="p-4">No RBS defined for this context.</div>;
  }

  return (
    <div className="h-full flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-semibold text-slate-800">Risk Breakdown Structure (RBS)</h3>
        </div>
        <div 
          className="flex-1 overflow-auto p-4"
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleDrop(null)} // Drop on root
        >
            {rbs.map(node => 
              <RBSNode 
                key={node.id} 
                node={node} 
                level={0}
                draggedNodeId={draggedNodeId}
                setDraggedNodeId={setDraggedNodeId}
                handleDrop={handleDrop}
              />
            )}
        </div>
    </div>
  );
};

export default RiskBreakdownStructure;
