
import React, { useState, useEffect } from 'react';
import { Sliders, Plus, Save, List, FileText, CheckSquare, AlignLeft, Lock } from 'lucide-react';
import { useWbsManager } from '../hooks';
import WBSNodeComponent from './scope/WBSNodeComponent';
import { WBSNode } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { usePermissions } from '../hooks/usePermissions';
import { PageHeader } from './common/PageHeader';

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
  const { canEditProject } = usePermissions();

  const [activeTab, setActiveTab] = useState<'wbs' | 'requirements' | 'statement'>('wbs');
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
  
  const renderRTM = () => (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden h-full flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><List size={16}/> Requirements Traceability Matrix (RTM)</h3>
              {canEditProject() ? (
                <button className="text-xs font-bold text-nexus-600 hover:underline">+ Add Requirement</button>
              ) : (
                <Lock size={14} className="text-slate-400" />
              )}
          </div>
          <div className="flex-1 overflow-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-100">
                      <tr>
                          <th className="px-4 py-2 text-left font-medium text-slate-500">ID</th>
                          <th className="px-4 py-2 text-left font-medium text-slate-500">Requirement</th>
                          <th className="px-4 py-2 text-left font-medium text-slate-500">Source</th>
                          <th className="px-4 py-2 text-left font-medium text-slate-500">Verification</th>
                          <th className="px-4 py-2 text-left font-medium text-slate-500">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                      {project?.requirements?.map(req => (
                          <tr key={req.id}>
                              <td className="px-4 py-3 font-mono text-slate-600">{req.id}</td>
                              <td className="px-4 py-3 text-slate-800 font-medium">{req.description}</td>
                              <td className="px-4 py-3 text-slate-600">{req.source}</td>
                              <td className="px-4 py-3 text-slate-600">{req.verificationMethod}</td>
                              <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${req.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{req.status}</span>
                              </td>
                          </tr>
                      ))}
                      {!project?.requirements?.length && <tr><td colSpan={5} className="p-6 text-center text-slate-400">No requirements defined.</td></tr>}
                  </tbody>
              </table>
          </div>
      </div>
  );

  const renderScopeStatement = () => (
      <div className="bg-white rounded-xl border border-slate-200 h-full p-6 overflow-auto">
          <div className="max-w-3xl mx-auto space-y-6">
              <div className="border-b pb-4 mb-4 flex justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Project Scope Statement</h3>
                    <p className="text-slate-500 text-sm">Define the boundaries of the project.</p>
                  </div>
                  {!canEditProject() && <span className="text-xs bg-slate-100 px-2 py-1 rounded flex items-center gap-1 text-slate-500 h-fit"><Lock size={12}/> Read Only</span>}
              </div>
              
              <div>
                  <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><AlignLeft size={16}/> Project Scope Description</h4>
                  <textarea 
                    disabled={!canEditProject()}
                    className="w-full h-32 p-3 border border-slate-300 rounded-md text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50 disabled:text-slate-500" 
                    placeholder="Describe the project scope in detail..." 
                  />
              </div>

              <div className="grid grid-cols-2 gap-6">
                  <div>
                      <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><CheckSquare size={16} className="text-green-600"/> Deliverables</h4>
                      <div className="p-3 bg-slate-50 rounded border border-slate-200 h-40 text-sm text-slate-600">
                          <ul className="list-disc pl-4 space-y-1">
                              <li>Foundation Design Documents</li>
                              <li>Excavation Permit</li>
                              <li>Site Survey Report</li>
                          </ul>
                      </div>
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><CheckSquare size={16} className="text-red-500"/> Exclusions</h4>
                      <div className="p-3 bg-slate-50 rounded border border-slate-200 h-40 text-sm text-slate-600">
                          <ul className="list-disc pl-4 space-y-1">
                              <li>Landscaping outside site boundary</li>
                              <li>Maintenance after handover</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  if (!project) return <div className={theme.layout.pagePadding}>Loading scope...</div>;

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`} onContextMenu={(e) => e.preventDefault()} onClick={closeContextMenu}>
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
      
      <PageHeader
        title="Scope Management"
        subtitle="Define and manage the project's Work Breakdown Structure (WBS)."
        icon={Sliders}
        actions={
            <div className="flex gap-4 items-center">
                <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                    <button onClick={() => setActiveTab('wbs')} className={`px-3 py-1.5 text-sm font-medium rounded ${activeTab === 'wbs' ? 'bg-nexus-100 text-nexus-700' : 'text-slate-600'}`}>WBS</button>
                    <button onClick={() => setActiveTab('requirements')} className={`px-3 py-1.5 text-sm font-medium rounded ${activeTab === 'requirements' ? 'bg-nexus-100 text-nexus-700' : 'text-slate-600'}`}>Requirements (RTM)</button>
                    <button onClick={() => setActiveTab('statement')} className={`px-3 py-1.5 text-sm font-medium rounded ${activeTab === 'statement' ? 'bg-nexus-100 text-nexus-700' : 'text-slate-600'}`}>Scope Statement</button>
                </div>
                {activeTab === 'wbs' && (
                    canEditProject() ? (
                        <button onClick={() => handleAddNode(null)} className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium`}>
                            <Plus size={16} /> Add WBS Element
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-400 rounded-lg text-sm border border-slate-200">
                            <Lock size={14}/> Edit Restricted
                        </div>
                    )
                )}
            </div>
        }
      />
      
      <div className="flex-1 flex overflow-hidden bg-slate-100 rounded-xl border border-slate-200 shadow-sm">
        {activeTab === 'wbs' && (
            <div className="flex w-full h-full">
                {/* WBS Tree Panel */}
                <div className={`w-1/2 bg-white border-r ${theme.colors.border} flex flex-col`}>
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
                <div className="w-1/2 flex flex-col bg-white">
                <div className={`p-4 ${theme.layout.headerBorder} ${theme.colors.background} flex justify-between items-center`}>
                    <h3 className="font-semibold text-slate-800">WBS Dictionary</h3>
                    {selectedNode && canEditProject() && (
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
                                disabled={!canEditProject()}
                                className="text-xl font-bold text-slate-900 mt-2 w-full p-1 -ml-1 border border-transparent focus:border-slate-300 rounded-lg focus:ring-1 focus:ring-nexus-500 disabled:bg-white disabled:text-slate-700"
                            />
                        </div>
                        <div>
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Statement of Work</h4>
                        <textarea
                            value={editedNode.description || ''}
                            onChange={e => handleFieldChange('description', e.target.value)}
                            disabled={!canEditProject()}
                            className={`text-sm text-slate-600 bg-slate-50 p-3 rounded-md border ${theme.colors.border} min-h-[120px] w-full focus:ring-1 focus:ring-nexus-500 focus:border-nexus-500 disabled:opacity-70`}
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
        )}

        {activeTab === 'requirements' && renderRTM()}
        {activeTab === 'statement' && renderScopeStatement()}
      </div>
    </div>
  );
};

export default ScopeManagement;
