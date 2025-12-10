import React, { useState } from 'react';
import { useProjectState } from '../../hooks/useProjectState';
import { Plus, Filter, Search, AlertTriangle, ShieldCheck } from 'lucide-react';
import RiskDetailModal from './RiskDetailModal';

interface RiskRegisterGridProps {
  projectId: string;
}

const RiskRegisterGrid: React.FC<RiskRegisterGridProps> = ({ projectId }) => {
  const { risks } = useProjectState(projectId);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 15) return 'bg-red-100 text-red-800 border-red-200';
    if (score >= 8) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  if (!risks) return <div>Loading risks...</div>;

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center gap-2">
              <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search risks..." className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-nexus-500" />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm text-slate-600 hover:bg-slate-50">
                  <Filter size={14} /> Filter
              </button>
          </div>
          <button className="px-3 py-2 bg-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium">
              <Plus size={16} /> Add Risk
          </button>
        </div>
        
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Strategy</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {risks.map(risk => (
                  <tr key={risk.id} onClick={() => setSelectedRiskId(risk.id)} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{risk.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">{risk.description}</div>
                        <div className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{risk.responseActions[0]?.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs">{risk.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 text-xs font-bold rounded border ${getScoreColor(risk.score)}`}>
                            {risk.score} ({risk.probabilityValue}/{risk.impactValue})
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{risk.responseStrategy || 'None'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{risk.owner}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {risk.status === 'Open' ? (
                            <span className="flex items-center gap-1 text-xs font-medium text-red-600"><AlertTriangle size={12}/> Open</span>
                        ) : (
                            <span className="flex items-center gap-1 text-xs font-medium text-green-600"><ShieldCheck size={12}/> {risk.status}</span>
                        )}
                      </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
      </div>
      {selectedRiskId && (
        <RiskDetailModal 
          riskId={selectedRiskId}
          projectId={projectId}
          onClose={() => setSelectedRiskId(null)}
        />
      )}
    </>
  );
};

export default RiskRegisterGrid;
