import React, { useState, useEffect } from 'react';
import { useWbsManager } from '../../hooks/index';
import { WBSNode } from '../../types/index';
import { useData } from '../../context/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { WbsTreePanel } from './wbs/WbsTreePanel';
import { WbsDictionaryPanel } from './wbs/WbsDictionaryPanel';
import { EmptyGrid } from '../common/EmptyGrid';
import { Layers } from 'lucide-react';
import { generateId } from '../../utils/formatters';

interface WBSManagerProps {
  projectId: string;
}

const WBSManager: React.FC<WBSManagerProps> = ({ projectId }) => {
  const { state, dispatch } = useData();
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
        dispatch({ type: 'WBS_UPDATE_NODE', payload: { projectId, nodeId: editedNode.id, updatedData: editedNode } });
    }
  };

  const handleInitializeFoundation = () => {
      const rootNode: WBSNode = {
          id: generateId('WBS'),
          wbsCode: '1',
          name: 'Project Root',
          description: 'Establishment of project delivery boundaries.',
          children: []
      };
      dispatch({ type: 'WBS_ADD_NODE', payload: { projectId, parentId: null, newNode: rootNode } });
  };

  if (wbsTree.length === 0) {
      return (
          <div className="h-full w-full flex items-center justify-center p-12 bg-white">
              <EmptyGrid 
                  title="Deliverable Hierarchy Undefined"
                  description="A Work Breakdown Structure (WBS) is required to calculate performance indices and schedule logic. Initialize the root foundation to begin scope mapping."
                  icon={Layers}
                  onAdd={canEditProject() ? handleInitializeFoundation : undefined}
                  actionLabel="Establish Strategic Foundation"
              />
          </div>
      );
  }

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
