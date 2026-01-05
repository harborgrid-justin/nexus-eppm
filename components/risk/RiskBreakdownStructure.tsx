
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import RBSNode from './RBSNode';
import { detectCircularDependency } from '../../utils/treeUtils';
import { useTheme } from '../../context/ThemeContext';

interface RiskBreakdownStructureProps {
  projectId: string;
}

const RiskBreakdownStructure: React.FC<RiskBreakdownStructureProps> = ({ projectId }) => {
  const { state, dispatch } = useData();
  const { rbs } = state;
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  
  const handleDrop = (newParentId: string | null) => {
    if (!draggedNodeId) return;

    if (detectCircularDependency(rbs, draggedNodeId, newParentId)) {
        setError(`Cannot move node. Circular dependency detected.`);
        setTimeout(() => setError(null), 3000);
        setDraggedNodeId(null);
        return;
    }

    dispatch({ type: 'UPDATE_RBS_NODE_PARENT', payload: { nodeId: draggedNodeId, newParentId } });
    setDraggedNodeId(null);
  };

  if(!rbs) {
    return <div className={theme.layout.pagePadding}>No RBS defined for this context.</div>;
  }

  return (
    <div className="h-full flex flex-col relative">
        {error && (
            <div className="absolute top-2 right-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded z-50 shadow-md">
                {error}
            </div>
        )}
        <div className={`p-4 ${theme.layout.headerBorder} ${theme.colors.background}/50`}>
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