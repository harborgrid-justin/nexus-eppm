import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { AlertTriangle, Plus, Filter, ArrowUpRight, ArrowDownRight, Minus, Search, ShieldCheck } from 'lucide-react';
import { Risk } from '../types';
import { useProjectState } from '../hooks/useProjectState';

interface RiskRegisterProps {
  projectId: string;
}

const RiskRegister: React.FC<RiskRegisterProps> = ({ projectId }) => {
  const { risks, riskProfile } = useProjectState(projectId);
  const [filter, setFilter] = useState('All');

  const getImpactScore = (p: string, i: string) => {
    const val = { 'Low': 1, 'Medium': 2, 'High': 3 };
    return (val[p as keyof typeof val] || 0) * (val[i as keyof typeof val] || 0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 6) return 'bg-red-100 text-red-800 border-red-200';
    if (score >= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  if (!risks || !riskProfile) {
    return <div>Loading risk register...</div>;
  }

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-300">
       <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="text-red-500" /> Risk Register
            </h1>
            <p className="text-slate-500">Identify, analyze, and mitigate project risks.</p>
          </div>
          <button className="px-4 py-2 bg-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm">
             <Plus size={16} /> Add Risk
          </button>
       </div>

       {/* Matrix Summary */}
       <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-sm text-slate-500">Total Risks</div>
             <div className="text-2xl font-bold text-slate-900">{riskProfile.totalRisks}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-sm text-slate-500">High Priority</div>
             <div className="text-2xl font-bold text-red-600">{riskProfile.highImpactRisks}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-sm text-slate-500">Open</div>
             <div className="text-2xl font-bold text-nexus-600">{riskProfile.openRisks}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-sm text-slate-500">Mitigated</div>
             <div className="text-2xl font-bold text-green-600">{risks.filter(r => r.status === 'Mitigated').length}</div>
          </div>
       </div>

       {/* Risk Table */}
       <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
             <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-400" />
                <select className="bg-white border border-slate-300 text-sm rounded-md px-2 py-1 focus:ring-nexus-500 focus:border-nexus-500">
                   <option>All Categories</option>
                   <option>Schedule</option>
                   <option>Cost</option>
                   <option>Technical</option>
                </select>
             </div>
             <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search risks..." className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-nexus-500" />
             </div>
          </div>
          
          <div className="flex-1 overflow-auto">
             <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 sticky top-0">
                   <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                   </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                   {risks.map(risk => {
                      const score = getImpactScore(risk.probability, risk.impact);
                      return (
                         <tr key={risk.id} className="hover:bg-slate-50 cursor-pointer">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{risk.id}</td>
                            <td className="px-6 py-4">
                               <div className="text-sm font-medium text-slate-900">{risk.description}</div>
                               <div className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{risk.mitigationPlan}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                               <span className="px-2 py-1 bg-slate-100 rounded text-xs">{risk.category}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                               <span className={`px-2 py-1 text-xs font-bold rounded border ${getScoreColor(score)}`}>
                                  {score} ({risk.probability.charAt(0)}/{risk.impact.charAt(0)})
                               </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                               {risk.owner}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                               {risk.status === 'Open' ? (
                                  <span className="flex items-center gap-1 text-xs font-medium text-red-600"><AlertTriangle size={12}/> Open</span>
                               ) : (
                                  <span className="flex items-center gap-1 text-xs font-medium text-green-600"><ShieldCheck size={12}/> {risk.status}</span>
                               )}
                            </td>
                         </tr>
                      );
                   })}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

export default RiskRegister;