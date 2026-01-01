
import React, { useState, useEffect } from 'react';
import { useWbsManager } from '../../hooks';
import { WBSNode } from '../../types';
import { useData } from '../../context/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { WbsTreePanel } from './wbs/WbsTreePanel';
import { WbsDictionaryPanel } from './wbs/WbsDictionaryPanel';

interface WBSManagerProps {
  projectId: string;
}

const WBSManager: React.FC<WBSManagerProps> = ({ projectId }) => {
  const { dispatch } = useData();
  const { canEditProject } = usePermissions();
  
  const {
    wbsTree, selectedNode, handleAddNode, ...managerProps
  } = useWbsManager(projectId);

  const [editedNode, setEditedNode] = useState<Partial<WBSNode> | null>(null);

  useEffect(() => {
    if (selectedNode) {
        setEditedNode({ ...selectedNode });
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (editedNode && editedNode.id) {
        dispatch({ type: 'UPDATE_WBS_NODE', payload: { projectId, nodeId: editedNode.id, updatedData: editedNode } });
    }
  };

  return (
    <div className="h-full flex overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm" onContextMenu={(e) => e.preventDefault()} onClick={managerProps.closeContextMenu}>
        <WbsTreePanel
            wbsTree={wbsTree}
            managerProps={managerProps}
            canEdit={canEditProject()}
            onAddNode={handleAddNode}
        />
        <WbsDictionaryPanel
            selectedNode={selectedNode}
            editedNode={editedNode}
            setEditedNode={setEditedNode}
            canEdit={canEditProject()}
            onSave={handleSave}
            projectId={projectId}
        />
    </div>
  );
};

export default WBSManager;
