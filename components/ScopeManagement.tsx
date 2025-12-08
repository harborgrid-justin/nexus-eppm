import React, { useState, useEffect, useMemo } from 'react';
import { useProjectState } from '../hooks/useProjectState';
import { useData } from '../context/DataContext';
import { WBSNode, Task } from '../types';
import { Sliders, Plus, ChevronRight, ChevronDown, MoreHorizontal, Edit, Trash2, PlusCircle, FileText, CheckCircle2 } from 'lucide-react';

interface ScopeManagementProps {
  projectId: string;
}

const ScopeManagement: React.FC<ScopeManagementProps> = ({ projectId }) => {
  const { project } = useProjectState(projectId);
  const { dispatch } = useData();
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const selectedNode = useMemo(() => {
    if (!selectedNodeId || !project?.wbs) return null;
    const findNode = (nodes: WBSNode[]): WBSNode | null => {
      for (const node of nodes) {
        if (node.id === selectedNodeId) return node;
        const found = findNode(node.children);
        if (found) return found;
      }
      return null;
    };
    return findNode(project.wbs);
  }, [selectedNodeId, project?.wbs]);

  const associatedTasks = useMemo(() => {
    if (!selectedNode) return [];
    return project?.tasks.filter(task => task.wbsCode.startsWith(selectedNode.wbsCode)) || [];
  }, [selectedNode, project?.tasks]);

  useEffect(() => {
    if (project?.wbs && project.wbs.length > 0 && !selectedNodeId) {
        const rootId = project.wbs[0].id;
        setSelectedNodeId(rootId);
        setOpenNodes(new Set([rootId]));
    }
  }, [project?.wbs]);

  const toggleNode = (nodeId: string) => {
    setOpenNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleAddNode = (parentId: string | null) => {
    // Logic to open a modal or inline form
    const name = prompt("Enter WBS element name:");
    if (name) {
      const newNode: WBSNode = {
        id: `WBS-${Date.now()}`,
        wbsCode: 'TBD', // This should be calculated based on parent
        name,
        description: '',
        children: []
      };
      dispatch({ type: 'ADD_WBS_NODE', payload: { projectId, parentId, newNode } });
    }
  };
  
  const handleDeleteNode = (nodeId: string) => {
    if(confirm('Are you sure you want to delete this WBS element and all its children?')) {
      dispatch({ type: 'DELETE_WBS_NODE', payload: { projectId, nodeId } });
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
      }
    }
  };

  const startEditing = (node: WBSNode) => {
    setEditingNodeId(node.id);
    setEditingName(node.name);
  };
  
  const saveEditing = () => {
    if (editingNodeId) {
      dispatch({ type: 'UPDATE_WBS_NODE', payload: { projectId, nodeId: editingNodeId, updatedData: { name: editingName } } });
      setEditingNodeId(null);
      setEditingName('');
    }
  };


  const WBSNodeComponent: React.FC<{ node: WBSNode; level: number }> = ({ node, level }) => {
    const isOpen = openNodes.has(node.id);
    const isSelected = selectedNodeId === node.id;
    const isEditing = editingNodeId === node.id;

    return (
      <div>
        <div 
          className={`group flex items-center p-2 rounded-md my-0.5 cursor-pointer ${isSelected ? 'bg-nexus-100' : 'hover:bg-slate-50'}`}
          style={{ paddingLeft: `${level * 24 + 8}px` }}
          onClick={() => setSelectedNodeId(node.id)}
        >
          <div onClick={(e) => {e.stopPropagation(); toggleNode(node.id);}} className="p-1 -ml-2">
            {node.children.length > 0 && (
              isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />
            )}
            {node.children.length === 0 && <div className="w-[18px]"></div>}
          </div>
          <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md mr-3">{node.wbsCode}</span>
          
          {isEditing ? (
            <input 
               type="text" 
               value={editingName}
               onChange={(e) => setEditingName(e.target.value)}
               onBlur={saveEditing}
               onKeyDown={(e) => e.key === 'Enter' && saveEditing()}
               className="text-sm font-medium text-slate-800 bg-white border border-nexus-400 rounded px-1 py-0 flex-1"
               autoFocus
            />
          ) : (
            <span className="text-sm font-medium text-slate-800">{node.name}</span>
          )}

          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 pr-2">
             <button onClick={(e) => { e.stopPropagation(); startEditing(node); }} className="p-1 hover:bg-slate-200 rounded"><Edit size={12} /></button>
             <button onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }} className="p-1 hover:bg-slate-200 rounded text-red-500"><Trash2 size={12} /></button>
             <button onClick={(e) => { e.stopPropagation(); handleAddNode(node.id); }} className="p-1 hover:bg-slate-200 rounded text-green-500"><PlusCircle size={12} /></button>
          </div>
        </div>
        {isOpen && node.children.length > 0 && (
          <div>
            {node.children.map(child => <WBSNodeComponent key={child.id} node={child} level={level + 1} />)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col">
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
          <div className="flex-1 overflow-auto p-2">
            {project?.wbs?.map(node => <WBSNodeComponent key={node.id} node={node} level={0} />)}
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
                 <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Associated Activities</h4>
                  {associatedTasks.length > 0 ? (
                    <ul className="space-y-2">
                      {associatedTasks.map(task => (
                        <li key={task.id} className="p-2 border border-slate-200 rounded-md text-sm flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-green-500" />
                          <span className="font-medium text-slate-700">{task.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No activities planned for this work package yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <div className="text-center">
                   <FileText size={32} className="mx-auto mb-2" />
                   <p>Select a WBS element to view its details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScopeManagement;
