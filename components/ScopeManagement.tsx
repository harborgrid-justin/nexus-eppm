import React from 'react';
import { useProjectState } from '../hooks/useProjectState';
import { WBSNode } from '../types';
import { Sliders, Plus, ChevronRight } from 'lucide-react';

interface ScopeManagementProps {
  projectId: string;
}

const WBSNodeComponent: React.FC<{ node: WBSNode, level: number }> = ({ node, level }) => {
  return (
    <div>
      <div 
        className="flex items-center p-2 rounded-md hover:bg-slate-100"
        style={{ paddingLeft: `${level * 24 + 8}px` }}
      >
        {node.children.length > 0 && <ChevronRight size={14} className="mr-2 text-slate-400" />}
        <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md mr-3">{node.wbsCode}</span>
        <span className="font-medium text-slate-800">{node.name}</span>
      </div>
      {node.children.length > 0 && (
        <div className="border-l-2 border-slate-200 ml-3">
          {node.children.map(child => (
            <WBSNodeComponent key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

const ScopeManagement: React.FC<ScopeManagementProps> = ({ projectId }) => {
  const { project } = useProjectState(projectId);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col p-6">
       <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="text-nexus-600" /> Scope Management
            </h1>
            <p className="text-slate-500">Define and manage the project's Work Breakdown Structure (WBS).</p>
          </div>
          <button className="px-4 py-2 bg-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium">
             <Plus size={16} /> Add WBS Element
          </button>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
             <h3 className="font-semibold text-slate-800">Work Breakdown Structure</h3>
          </div>
          <div className="flex-1 overflow-auto p-4">
             {project?.wbs && project.wbs.map(node => (
               <WBSNodeComponent key={node.id} node={node} level={0} />
             ))}
             {!project?.wbs && <p className="text-slate-400 p-4">No WBS defined for this project.</p>}
          </div>
       </div>
    </div>
  );
};

export default ScopeManagement;