import React, { useState, useEffect } from 'react';
import { useWbsManager } from '../../hooks';
import { CostEstimate, WBSNode } from '../../types';
import { useData } from '../../context/DataContext';
import { Save } from 'lucide-react';

interface CostEstimatingProps {
  projectId: string;
}

const CostEstimating: React.FC<CostEstimatingProps> = ({ projectId }) => {
  const { state, dispatch } = useData();
  const {
    wbsTree,
    selectedNode,
    handleNodeClick,
  } = useWbsManager(projectId);

  const [estimate, setEstimate] = useState<Partial<CostEstimate> | null>(null);

  useEffect(() => {
    if (selectedNode) {
      const project = state.projects.find(p => p.id === projectId);
      const existingEstimate = project?.costEstimates?.find(e => e.wbsId === selectedNode.id);
      if (existingEstimate) {
        setEstimate(existingEstimate);
      } else {
        setEstimate({ wbsId: selectedNode.id, type: 'Preliminary', confidence: 'Medium', amount: 0, basisOfEstimate: '' });
      }
    } else {
        setEstimate(null);
    }
  }, [selectedNode, state.projects, projectId]);

  const renderTree = (nodes: WBSNode[], level: number) => {
    return nodes.map(node => (
      <React.Fragment key={node.id}>
        <div 
          onClick={() => handleNodeClick(node.id)}
          className={`p-2 my-0.5 rounded-md cursor-pointer ${selectedNode?.id === node.id ? 'bg-nexus-100' : 'hover:bg-slate-100'}`}
          style={{ paddingLeft: `${level * 24 + 8}px` }}
        >
          <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md mr-3">{node.wbsCode}</span>
          <span className="text-sm font-medium text-slate-800">{node.name}</span>
        </div>
      </React.Fragment>
    ));
  };
  
  const handleSave = () => {
    if (estimate && estimate.wbsId) {
      dispatch({ type: 'ADD_OR_UPDATE_COST_ESTIMATE', payload: { projectId, estimate: estimate as CostEstimate } });
      alert('Estimate saved!');
    }
  };

  return (
    <div className="h-full flex">
      <div className="w-1/3 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-800">WBS for Estimation</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {renderTree(wbsTree, 0)}
        </div>
      </div>

      <div className="w-2/3 flex flex-col">
        {selectedNode && estimate ? (
          <>
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">Estimate Details: <span className="text-nexus-700">{selectedNode.name}</span></h3>
              <button onClick={handleSave} className="px-3 py-1.5 bg-nexus-600 text-white rounded-md text-sm font-medium hover:bg-nexus-700 flex items-center gap-2">
                <Save size={14}/> Save Estimate
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">Estimate Type</label>
                  <select value={estimate.type} onChange={e => setEstimate({...estimate, type: e.target.value as any})} className="w-full p-2 border border-slate-300 rounded-md text-sm">
                    <option>Definitive</option>
                    <option>Preliminary</option>
                    <option>ROM</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">Confidence</label>
                  <select value={estimate.confidence} onChange={e => setEstimate({...estimate, confidence: e.target.value as any})} className="w-full p-2 border border-slate-300 rounded-md text-sm">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">Estimated Cost</label>
                  <input type="number" value={estimate.amount || ''} onChange={e => setEstimate({...estimate, amount: parseFloat(e.target.value)})} className="w-full p-2 border border-slate-300 rounded-md text-sm font-bold" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Basis of Estimate (BoE)</label>
                <textarea value={estimate.basisOfEstimate} onChange={e => setEstimate({...estimate, basisOfEstimate: e.target.value})} className="w-full h-32 p-3 border border-slate-300 rounded-md text-sm" placeholder="Based on quotes from 3 vendors..."></textarea>
              </div>
            </div>
          </>
        ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
                <p>Select a WBS element to create or view its cost estimate.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CostEstimating;
