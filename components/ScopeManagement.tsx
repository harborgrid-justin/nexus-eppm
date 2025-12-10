import React from 'react';
import { Sliders, Plus } from 'lucide-react';
import { useWbsManager } from '../hooks';
import WBSNodeComponent from './scope/WBSNodeComponent';
import { WBSNode } from '../types';

interface ScopeManagementProps {
  projectId: string;
}

const ScopeManagement: React.FC<ScopeManagementProps> = ({ projectId }) => {
  const {
    project,
    wbsTree,
    selectedNode,
    associatedTasks,
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
  
  if (!project) return <div>Loading scope...</div>;

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col" onContextMenu={(e) => e.preventDefault()} onClick={closeContextMenu}>
      {contextMenu.visible && (
        <div 
          className="absolute z-50 bg-white shadow-lg rounded-md border border-slate-200 py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div className="px-3 py-1 text-xs font-semibold text-slate-400">Change Shape</div>
          <button onClick={() => handleShapeChange('rectangle')} className="block w-full text-left px-3 py-1 text-sm hover:bg-slate-100">Rectangle</button>
          <button onClick={() => handleShapeChange('oval')} className="block w-full text-left px-3 py-1 text-sm hover:bg-slate-100">Oval</button>
          <button onClick={() => handleShapeChange('hexagon')} className="block w-full text-left px-3 py-1 text-sm hover:bg-slate-100">Hexagon</button>
        </div>
      )}
      <div className="flex justify-between items-center p-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="text-nexus-600" /> Scope Management
          </h1>
          <p className="text-slate-500">Define and manage the project's Work Breakdown Structure (WBS).</p>
        </div>
        <button onClick={() => handleAddNode(null)} className="px-4 py-2 bg-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium">
          <Plus size={16} /> Add WBS Element
        </button>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* WBS Tree Panel */}
        <div className="w-1/2 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
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
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-slate-800">WBS Dictionary</h3>
          </div>
          <div className="flex-1 overflow-auto p-6">
            {selectedNode ? (
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{selectedNode.wbsCode}</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{selectedNode.name}</h2>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Statement of Work</h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-100 min-h-[80px]">
                    {selectedNode.description || <span className="italic text-slate-400">No description provided.</span>}
                  </p>
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