
import React, { useState, useEffect } from 'react';
import { Plus, Save, Lock } from 'lucide-react';
import { useWbsManager } from '../../hooks';
import WBSNodeComponent from './WBSNodeComponent';
import { WBSNode } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { usePermissions } from '../../hooks/usePermissions';

interface WBSManagerProps {
  projectId: string;
}

const WBSManager: React.FC<WBSManagerProps> = ({ projectId }) => {
  const { dispatch } = useData();
  const theme = useTheme();
  const { canEditProject } = usePermissions();
  
  const {
    wbsTree,
    selectedNode,
    openNodes,
    draggedNodeId,
    contextMenu,
    handleNodeClick,
    toggleNode,
    handleAddNode,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDragOver,
    handleContextMenu,
    closeContextMenu,
    handleShapeChange
  } = useWbsManager(projectId);

  const [editedNode, setEditedNode] = useState<Partial<WBSNode> | null>(null);

  useEffect(() => {
    if (selectedNode) {
        setEditedNode({ ...selectedNode });
    }
  }, [selectedNode]);

  const handleFieldChange = (field: keyof WBSNode, value: string) => {
    if (editedNode && canEditProject()) {
        setEditedNode({ ...editedNode, [field]: value });
    }
  };

  const handleSave = () => {
    if (editedNode && editedNode.id) {
        dispatch({ type: 'UPDATE_WBS_NODE', payload: { projectId, nodeId: editedNode.id, updatedData: editedNode } });
    }
  };

  const renderTree = (nodes: WBSNode[], level: number) => {
    return nodes.map(node => (
      <React.Fragment key={node.id}>
        <WBSNodeComponent
          node={node}
          level={level}
          isOpen={openNodes.has(node.id)}
          isSelected={selectedNode?.id === node.id}
          isDragged={draggedNodeId === node.id}
          onToggle={() => toggleNode(node.id)}
          onClick={() => handleNodeClick(node.id)}
          onAddChild={() => handleAddNode(node.id)}
          onDragStart={(e) => handleDragStart(e, node.id)}
          onDragEnd={handleDragEnd}
          onDrop={(e) => handleDrop(e, node.id)}
          onDragOver={handleDragOver}
          onContextMenu={(e) => handleContextMenu(e, node.id)}
        />
        {openNodes.has(node.id) && node.children.length > 0 && (
          renderTree(node.children, level + 1)
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="h-full flex overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm" onContextMenu={(e) => e.preventDefault()} onClick={closeContextMenu}>
        {/* WBS Tree Panel */}
        <div className={`w-1/2 bg-slate-50 border-r ${theme.colors.border} flex flex-col`}>
            <div className={`p-4 ${theme.layout.headerBorder} bg-white flex justify-between items-center`}>
                <h3 className="font-semibold text-slate-800">Hierarchy</h3>
                {canEditProject() ? (
                    <button onClick={() => handleAddNode(null)} className={`p-1.5 rounded bg-nexus-100 text-nexus-700 hover:bg-nexus-200`}>
                        <Plus size={16} />
                    </button>
                ) : <Lock size={16} className="text-slate-400"/>}
            </div>
            <div 
                className="flex-1 overflow-auto p-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, null)}
            >
                {wbsTree.length > 0 ? renderTree(wbsTree, 0) : (
                    <div className="text-center p-8 text-slate-400 text-sm">
                        No WBS defined. Click + to start.
                    </div>
                )}
            </div>
        </div>

        {/* WBS Dictionary Panel */}
        <div className="w-1/2 flex flex-col bg-white">
            <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center`}>
                <h3 className="font-semibold text-slate-800">WBS Dictionary</h3>
                {selectedNode && canEditProject() && (
                    <button onClick={handleSave} className={`px-3 py-1.5 text-sm font-medium ${theme.colors.accentBg} text-white rounded-md flex items-center gap-2 hover:bg-nexus-700`}>
                        <Save size={14}/> Save
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-auto p-6">
                {selectedNode && editedNode ? (
                <div className="space-y-6">
                    <div>
                        <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{selectedNode.wbsCode}</span>
                        <input
                            type="text"
                            value={editedNode.name || ''}
                            onChange={e => handleFieldChange('name', e.target.value)}
                            disabled={!canEditProject()}
                            className="text-xl font-bold text-slate-900 mt-2 w-full p-1 -ml-1 border border-transparent focus:border-slate-300 rounded-lg focus:ring-1 focus:ring-nexus-500 disabled:bg-white disabled:text-slate-700"
                        />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Description of Work</h4>
                        <textarea
                            value={editedNode.description || ''}
                            onChange={e => handleFieldChange('description', e.target.value)}
                            disabled={!canEditProject()}
                            className={`text-sm text-slate-600 bg-slate-50 p-3 rounded-md border ${theme.colors.border} min-h-[120px] w-full focus:ring-1 focus:ring-nexus-500 focus:border-nexus-500 disabled:opacity-70`}
                            placeholder="Add a detailed description for this work package..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded border border-slate-100">
                            <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Cost Account</span>
                            <input disabled className="w-full bg-transparent text-sm font-mono text-slate-700" value="CA-102.3"/>
                        </div>
                        <div className="p-3 bg-slate-50 rounded border border-slate-100">
                            <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Owner</span>
                            <input disabled className="w-full bg-transparent text-sm text-slate-700" value="Sarah Chen"/>
                        </div>
                    </div>
                </div>
                ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                    <p>Select a WBS element to view dictionary details.</p>
                </div>
                )}
            </div>
        </div>

        {/* Context Menu */}
        {contextMenu.visible && (
            <div 
              className={`absolute z-50 bg-white shadow-xl rounded-lg border border-slate-200 py-1 min-w-[150px]`}
              style={{ top: contextMenu.y, left: contextMenu.x }}
            >
              <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100 mb-1">Visual Style</div>
              <button onClick={() => handleShapeChange('rectangle')} className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 text-slate-700">Rectangle</button>
              <button onClick={() => handleShapeChange('oval')} className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 text-slate-700">Oval (Milestone)</button>
              <button onClick={() => handleShapeChange('hexagon')} className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 text-slate-700">Hexagon (Gate)</button>
            </div>
        )}
    </div>
  );
};

export default WBSManager;
