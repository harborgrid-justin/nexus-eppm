
import React, { useState, useEffect } from 'react';
import { Plus, Save, Lock, ArrowRight, DollarSign, Calendar, AlertCircle, Users } from 'lucide-react';
import { useWbsManager } from '../../hooks';
import WBSNodeComponent from './WBSNodeComponent';
import { WBSNode, CostEstimate } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { formatCurrency } from '../../utils/formatters';
import { CreateEstimateModal } from '../cost/CreateEstimateModal';

interface WBSManagerProps {
  projectId: string;
}

const WBSManager: React.FC<WBSManagerProps> = ({ projectId }) => {
  const { state, dispatch } = useData();
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

  const [editedNode, setEditedNode] = useState<WBSNode | null>(null);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);

  useEffect(() => {
    if (selectedNode) {
        setEditedNode(selectedNode);
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

  const handleEstimateCreated = (estimate: CostEstimate) => {
      dispatch({ 
          type: 'ADD_OR_UPDATE_COST_ESTIMATE', 
          payload: { projectId, estimate } 
      });
      alert(`Estimate ${estimate.id} created successfully.`);
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

  // --- CROSS-LINKING LOGIC ---
  const project = state.projects.find(p => p.id === projectId);
  
  // 1. Linked Schedule Tasks
  const relatedTasks = project?.tasks.filter(t => t.wbsCode === selectedNode?.wbsCode) || [];
  
  // 2. Linked Cost Estimate
  const estimate = project?.costEstimates?.find(e => e.wbsId === selectedNode?.id);
  
  // 3. Linked Risks (RBS linkage via ID)
  const linkedRisks = project?.risks?.filter(r => selectedNode?.riskIds?.includes(r.id) || r.category === selectedNode?.name) || [];

  return (
    <div className="h-full flex overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm" onContextMenu={(e) => e.preventDefault()} onClick={closeContextMenu}>
        
        {/* Create Estimate Modal */}
        {selectedNode && (
            <CreateEstimateModal 
                isOpen={isEstimateModalOpen}
                onClose={() => setIsEstimateModalOpen(false)}
                onSave={handleEstimateCreated}
                projectId={projectId}
                wbsId={selectedNode.id}
                wbsName={selectedNode.name}
            />
        )}

        {/* WBS Tree Panel (Left) */}
        <div className={`w-1/2 bg-slate-50 border-r ${theme.colors.border} flex flex-col transition-all`}>
            <div className={`p-4 ${theme.layout.headerBorder} bg-white flex justify-between items-center`}>
                <h3 className="font-semibold text-slate-800">WBS Hierarchy</h3>
                {canEditProject() ? (
                    <button onClick={() => handleAddNode(null)} className={`p-1.5 rounded bg-nexus-100 text-nexus-700 hover:bg-nexus-200`} title="Add Root Node">
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

        {/* WBS Dictionary Panel (Right) */}
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
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">{selectedNode.wbsCode}</span>
                            <span className="text-xs text-slate-400">ID: {selectedNode.id}</span>
                        </div>
                        <input
                            type="text"
                            value={editedNode.name || ''}
                            onChange={e => handleFieldChange('name', e.target.value)}
                            disabled={!canEditProject()}
                            className="text-xl font-bold text-slate-900 w-full p-2 -ml-2 border border-transparent hover:border-slate-300 focus:border-nexus-500 rounded-lg focus:ring-1 focus:ring-nexus-500 disabled:bg-white disabled:text-slate-700 transition-colors"
                        />
                    </div>

                    {/* Core Definition */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description of Work</h4>
                        <textarea
                            value={editedNode.description || ''}
                            onChange={e => handleFieldChange('description', e.target.value)}
                            disabled={!canEditProject()}
                            className={`text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border ${theme.colors.border} min-h-[120px] w-full focus:ring-1 focus:ring-nexus-500 focus:border-nexus-500 disabled:opacity-70`}
                            placeholder="Detailed scope description..."
                        />
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Cost Account</span>
                            <div className="flex items-center gap-2">
                                <DollarSign size={14} className="text-slate-400"/>
                                <input 
                                    className="w-full bg-transparent text-sm font-mono text-slate-800 focus:outline-none focus:border-b focus:border-nexus-500" 
                                    value={editedNode.costAccount || ''}
                                    onChange={e => handleFieldChange('costAccount', e.target.value)}
                                    disabled={!canEditProject()}
                                    placeholder="e.g. CA-102.3"
                                />
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Owner (RMS Link)</span>
                             <div className="flex items-center gap-2">
                                <Users size={14} className="text-slate-400"/>
                                <input
                                    className="w-full bg-transparent text-sm text-slate-800 focus:outline-none focus:border-b focus:border-nexus-500"
                                    value={editedNode.owner || ''}
                                    onChange={e => handleFieldChange('owner', e.target.value)}
                                    disabled={!canEditProject()}
                                    placeholder="Assign Owner"
                                />
                             </div>
                        </div>
                    </div>
                    
                    {/* Cross-Reference (Linking) Section */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2 border-t pt-4 border-slate-100">
                           <ArrowRight size={14}/> Integrated Cross-References
                        </h4>
                        
                        <div className="space-y-3">
                             {/* Schedule Link */}
                             <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-md"><Calendar size={16}/></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Schedule (WBS)</p>
                                        <p className="text-xs text-slate-500">
                                            {relatedTasks.length > 0 
                                                ? `${relatedTasks.length} Linked Tasks` 
                                                : 'No Linked Tasks'}
                                        </p>
                                    </div>
                                </div>
                                {relatedTasks.length > 0 ? (
                                    <div className="text-right">
                                        <span className="block text-xs font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded mb-1">{relatedTasks[0].status}</span>
                                        <span className="text-[10px] text-slate-400">{relatedTasks[0].startDate}</span>
                                    </div>
                                ) : (
                                    <button className="text-xs text-blue-600 font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Create Task</button>
                                )}
                             </div>

                             {/* Cost Link */}
                             <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-50 text-green-600 rounded-md"><DollarSign size={16}/></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Cost Estimate</p>
                                        <p className="text-xs text-slate-500">{estimate ? `Version ${estimate.version} (${estimate.status})` : 'No Estimate'}</p>
                                    </div>
                                </div>
                                {estimate ? (
                                    <div className="text-right">
                                        <span className="block text-xs font-mono font-bold text-green-700">{formatCurrency(estimate.totalCost)}</span>
                                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded">{estimate.class}</span>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setIsEstimateModalOpen(true)}
                                        className="text-xs text-green-600 font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Create Estimate
                                    </button>
                                )}
                             </div>

                             {/* Risk Link */}
                             <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-50 text-red-600 rounded-md"><AlertCircle size={16}/></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Risks (RBS)</p>
                                        <p className="text-xs text-slate-500">{linkedRisks.length > 0 ? `${linkedRisks.length} Risks Identified` : 'No Risks Linked'}</p>
                                    </div>
                                </div>
                                {linkedRisks.length > 0 ? (
                                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">High Score: {Math.max(...linkedRisks.map(r => r.score))}</span>
                                ) : (
                                    <button className="text-xs text-red-600 font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Link Risk</button>
                                )}
                             </div>
                        </div>
                    </div>

                </div>
                ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <ArrowRight size={48} className="mb-4 opacity-20"/>
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
