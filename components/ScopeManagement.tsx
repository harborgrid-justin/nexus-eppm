import React, { useState, useEffect } from 'react';
import { Sliders, Plus, Save } from 'lucide-react';
import { useWbsManager } from '../hooks';
import WBSNodeComponent from './scope/WBSNodeComponent';
import { WBSNode } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

interface ScopeManagementProps {
  projectId: string;
}

const ScopeManagement: React.FC<ScopeManagementProps> = ({ projectId }) => {
  const { dispatch } = useData();
  const {
    project,
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
  const theme = useTheme();

  const [editedNode, setEditedNode] = useState<Partial<WBSNode> | null>(null);

  useEffect(() => {
    if (selectedNode) {
        setEditedNode({ ...selectedNode });
    }
  }, [selectedNode]);

  const handleFieldChange = (field: keyof WBSNode, value: string) => {
    if (editedNode) {
        setEditedNode({ ...editedNode, [field]: value });
    }
  };

  const handleSave = () => {
    if (editedNode && editedNode.id) {
        dispatch({ type: 'UPDATE_WBS_NODE', payload: { projectId, nodeId: editedNode.id, updatedData: editedNode } });
        alert('WBS Element Saved!');
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
  
  if (!project) return <div className={theme.layout.pagePadding}>Loading scope...</div>;

  return (
    <div className={`${theme.layout.pageContainer}`} onContextMenu={(e) => e.preventDefault()} onClick={closeContextMenu}>
      {contextMenu.visible && (
        <div 
          className={`absolute z-50 ${theme.colors.surface} shadow-lg rounded-md border ${theme.colors.border} py-1`}
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div className="px-3 py-1 text-xs font-semibold text-slate-400">Change Shape</div>
          <button onClick={() => handleShapeChange('rectangle')} className="block w-full text-left px-3 py-1 text-sm hover:bg-slate-100">Rectangle</button>
          <button onClick={() => handleShapeChange('oval')} className="block w-full text-left px-3 py-1 text-sm hover:bg-slate-100">Oval</button>
          <button onClick={() => handleShapeChange('hexagon')} className="block w-full text-left px-3 py-1 text-sm hover:bg-slate-100">Hexagon</button>
        </div>
      )}
      <div className={`${theme.layout.header} ${theme.layout.headerBorder} ${theme.layout.pagePadding}`}>
        <div>
          <h1 className={theme.typography.h1}>
            <Sliders className="text-nexus-600" /> Scope Management
          </h1>
          <p className={theme.typography.small}>Define and manage the project's Work Breakdown Structure (WBS).</p>
        </div>
        <button onClick={() => handleAddNode(null)} className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium`}>
          <Plus size={16} /> Add WBS Element
        </button>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* WBS Tree Panel */}
        <div className={`w-1/2 border-r ${theme.colors.border} flex flex-col`}>
          <div className={`p-4 ${theme.layout.headerBorder} ${theme.colors.background}`}>
            <h3 className="font-semibold text-slate-800">Work Breakdown Structure</h3>
          </div>
          <div 
            className="flex-1 overflow-auto p-2"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, null)} // Drop on root
          >
            {renderTree(wbsTree, 0)}
          </div>
        </div>

        {/* WBS Dictionary Panel */}
        <div className="w-1/2 flex flex-col">
          <div className={`p-4 ${theme.layout.headerBorder} ${theme.colors.background} flex justify-between items-center`}>
            <h3 className="font-semibold text-slate-800">WBS Dictionary</h3>
            {selectedNode && (
                <button onClick={handleSave} className={`px-3 py-1.5 text-sm font-medium ${theme.colors.accentBg} text-white rounded-md flex items-center gap-2 hover:bg-nexus-700`}>
                    <Save size={14}/> Save Changes
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
                        className="text-xl font-bold text-slate-900 mt-2 w-full p-1 -ml-1 border border-transparent focus:border-slate-300 rounded-lg focus:ring-1 focus:ring-nexus-500"
                    />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Statement of Work</h4>
                  <textarea
                    value={editedNode.description || ''}
                    onChange={e => handleFieldChange('description', e.target.value)}
                    className={`text-sm text-slate-600 bg-slate-50 p-3 rounded-md border ${theme.colors.border} min-h-[120px] w-full focus:ring-1 focus:ring-nexus-500 focus:border-nexus-500`}
                    placeholder="Add a detailed description for this work package..."
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <p>Select a WBS element to view its details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScopeManagement;
