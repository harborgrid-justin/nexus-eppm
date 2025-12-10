import React from 'react';
import { useProjectState } from '../../hooks';
import { Sliders, Calculator, CheckCircle2 } from 'lucide-react';

interface CostEstimatingProps {
  projectId: string;
}

const CostEstimating: React.FC<CostEstimatingProps> = ({ projectId }) => {
  const { project } = useProjectState(projectId);

  return (
    <div className="h-full flex">
      {/* WBS Tree */}
      <div className="w-1/3 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-800">WBS for Estimation</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* Mock WBS Tree */}
          <div className="p-2 rounded-md bg-nexus-100 font-medium text-nexus-800">1. Project Management</div>
          <div className="p-2 rounded-md hover:bg-slate-50 ml-4">1.1 Permitting</div>
          <div className="p-2 rounded-md hover:bg-slate-50">2. Site Work</div>
        </div>
      </div>

      {/* Estimating Details */}
      <div className="w-2/3 flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Estimate Details: <span className="text-nexus-700">1.1 Permitting</span></h3>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
             <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Estimate Type</label>
                <select className="w-full p-2 border border-slate-300 rounded-md text-sm">
                    <option>Definitive</option>
                    <option>Preliminary</option>
                    <option>ROM</option>
                </select>
             </div>
             <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Confidence</label>
                <select className="w-full p-2 border border-slate-300 rounded-md text-sm">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                </select>
             </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Estimated Cost</label>
                <input type="text" value="$250,000" className="w-full p-2 border border-slate-300 rounded-md text-sm font-bold" />
             </div>
          </div>
           <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Basis of Estimate (BoE)</label>
              <textarea className="w-full h-32 p-3 border border-slate-300 rounded-md text-sm" placeholder="Based on quotes from 3 vendors..."></textarea>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CostEstimating;