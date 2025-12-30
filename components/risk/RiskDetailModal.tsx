
import React, { useState, useEffect } from 'react';
import { Risk, RiskResponseAction, RiskHistoryItem } from '../../types';
import { useData } from '../../context/DataContext';
import { X, Plus, Save, ShieldAlert, Calendar, DollarSign, Shield, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { formatCurrency } from '../../utils/formatters';

interface RiskDetailModalProps {
  riskId: string;
  projectId: string;
  onClose: () => void;
}

const RiskDetailModal: React.FC<RiskDetailModalProps> = ({ riskId, projectId, onClose }) => {
  const { state, dispatch } = useData();
  const { canEditProject } = usePermissions();
  const [risk, setRisk] = useState<Risk | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'response' | 'history'>('details');
  const [history, setHistory] = useState<RiskHistoryItem[]>([]);

  // If we had granular 'risk:write' permissions we would use that, but 'project:edit' covers it for now.
  const isReadOnly = !canEditProject();

  // Get tasks for the current project for integration linkage
  const projectTasks = state.projects.find(p => p.id === projectId)?.tasks || [];

  useEffect(() => {
    const foundRisk = state.risks.find(r => r.id === riskId);
    if (foundRisk) {
      setRisk(JSON.parse(JSON.stringify(foundRisk))); // Deep copy for local state
      // Mock history if not present
      setHistory(foundRisk.history || [
          { date: '2024-01-15', user: 'System', action: 'Created', change: 'Risk identified via AI scan' },
          { date: '2024-02-01', user: 'Mike Ross', action: 'Updated', change: 'Score increased from 9 to 12' }
      ]);
    }
  }, [riskId, state.risks]);

  const handleSave = () => {
    if (risk) {
      if (!risk.description) {
        alert("Description is required.");
        return;
      }
      // Calculate Score automatically
      const score = (risk.probabilityValue || 1) * (risk.impactValue || 1);
      // Calculate EMV
      const probMap: Record<number, number> = { 1: 0.1, 2: 0.3, 3: 0.5, 4: 0.7, 5: 0.9 };
      const emv = (risk.financialImpact || 0) * (probMap[risk.probabilityValue] || 0.1);
      
      const updatedRisk = { ...risk, score, emv };
      
      dispatch({ type: 'UPDATE_RISK', payload: { risk: updatedRisk } });
      onClose();
    }
  };

  const handleChange = (field: keyof Risk, value: any) => {
    if (risk) {
        setRisk({ ...risk, [field]: value });
    }
  };
  
  const handleResponseActionChange = (index: number, field: keyof RiskResponseAction, value: string) => {
    if(risk) {
        const newActions = [...risk.responseActions];
        const actionToUpdate = { ...newActions[index], [field]: value };
        newActions[index] = actionToUpdate;
        handleChange('responseActions', newActions);
    }
  };

  if (!risk) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
             <div>
                <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-slate-900">{risk.id}</h2>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${risk.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-200 text-slate-600'}`}>{risk.status}</span>
                    {risk.isEscalated && <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-red-100 text-red-800">Escalated</span>}
                </div>
                <div className="text-xs text-slate-500 flex gap-4">
                    <span>Owner: <strong>{risk.owner}</strong></span>
                    <span>Category: <strong>{risk.category}</strong></span>
                </div>
             </div>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full border border-slate-200 shadow-sm hover:shadow">
                <X size={20} />
             </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-white px-6">
              {['details', 'response', 'history'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab 
                        ? 'border-nexus-600 text-nexus-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
              ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
             {activeTab === 'details' && (
                 <div className="space-y-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Risk Description</label>
                        <textarea 
                            value={risk.description} 
                            disabled={isReadOnly} 
                            onChange={(e) => handleChange('description', e.target.value)} 
                            className="w-full p-2 border border-slate-300 rounded-md min-h-[80px] text-sm focus:ring-nexus-500 focus:border-nexus-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Scoring Panel */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-blue-500"/> Qualitative Analysis</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-500">Probability (1-5)</label>
                                    <select 
                                        value={risk.probabilityValue || 1} 
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            handleChange('probabilityValue', val);
                                            handleChange('probability', val >= 4 ? 'High' : val >= 2 ? 'Medium' : 'Low');
                                        }}
                                        className="w-full mt-1 p-2 border border-slate-300 rounded-md text-sm"
                                    >
                                        {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500">Impact (1-5)</label>
                                    <select 
                                        value={risk.impactValue || 1} 
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            handleChange('impactValue', val);
                                            handleChange('impact', val >= 4 ? 'High' : val >= 2 ? 'Medium' : 'Low');
                                        }}
                                        className="w-full mt-1 p-2 border border-slate-300 rounded-md text-sm"
                                    >
                                        {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-slate-100 rounded-lg flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-600">Calculated Score:</span>
                                <span className={`text-xl font-bold ${(risk.probabilityValue * risk.impactValue) >= 15 ? 'text-red-600' : 'text-slate-800'}`}>
                                    {risk.probabilityValue * risk.impactValue} / 25
                                </span>
                            </div>
                        </div>

                        {/* Quantitative Panel */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><DollarSign size={16} className="text-green-500"/> Quantitative Analysis</h3>
                            <div>
                                <label className="text-xs text-slate-500">Potential Financial Impact ($)</label>
                                <input 
                                    type="number" 
                                    value={risk.financialImpact || 0} 
                                    onChange={(e) => handleChange('financialImpact', parseFloat(e.target.value))}
                                    className="w-full mt-1 p-2 border border-slate-300 rounded-md text-sm font-mono"
                                />
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Expected Monetary Value (EMV):</span>
                                    <span className="font-mono font-bold text-slate-800">
                                        {formatCurrency((risk.financialImpact || 0) * ((risk.probabilityValue || 1) * 0.2))} 
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Required Contingency:</span>
                                    <span className="font-mono font-bold text-nexus-600">
                                        {formatCurrency((risk.financialImpact || 0) * ((risk.probabilityValue || 1) * 0.2))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-slate-700">Category</label>
                            <select value={risk.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full mt-1 p-2 border border-slate-300 rounded-md text-sm">
                                <option>Technical</option>
                                <option>Schedule</option>
                                <option>Cost</option>
                                <option>External</option>
                                <option>Resource</option>
                                <option>Governance</option>
                            </select>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
                            <label className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-1">
                                <Calendar size={14} /> Schedule Impact (Task Link)
                            </label>
                            <select 
                                value={risk.linkedTaskId || ''} 
                                onChange={(e) => handleChange('linkedTaskId', e.target.value || undefined)}
                                className="w-full p-2 text-sm border border-blue-200 rounded-md bg-white focus:ring-blue-500"
                            >
                                <option value="">-- No Schedule Impact --</option>
                                {projectTasks.map(t => (
                                    <option key={t.id} value={t.id}>{t.wbsCode} - {t.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                 </div>
             )}

             {activeTab === 'response' && (
                 <div className="space-y-6">
                     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Shield size={16} className="text-purple-500"/> Response Strategy</h3>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {['Avoid', 'Mitigate', 'Transfer', 'Accept', 'Escalate'].map(strat => (
                                <button 
                                    key={strat}
                                    onClick={() => handleChange('strategy', strat)}
                                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                                        risk.strategy === strat 
                                        ? 'bg-purple-100 border-purple-300 text-purple-800 ring-1 ring-purple-400' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {strat}
                                </button>
                            ))}
                        </div>
                        <textarea 
                            placeholder="Describe mitigation plan..." 
                            value={risk.mitigationPlan}
                            onChange={(e) => handleChange('mitigationPlan', e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg text-sm h-24"
                        />
                     </div>

                     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800">Action Plan</h3>
                            <button className="text-xs text-nexus-600 font-bold flex items-center gap-1"><Plus size={12}/> Add Step</button>
                        </div>
                        <div className="space-y-2">
                            {risk.responseActions.map((action, i) => (
                                <div key={action.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-100">
                                    <input type="checkbox" className="rounded text-nexus-600" checked={action.status === 'Complete'} readOnly/>
                                    <span className="text-sm flex-1">{action.description}</span>
                                    <span className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500">{action.owner}</span>
                                    <span className="text-xs text-slate-400">{action.dueDate}</span>
                                </div>
                            ))}
                            {risk.responseActions.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">No actions defined.</p>}
                        </div>
                     </div>
                 </div>
             )}

             {activeTab === 'history' && (
                 <div className="space-y-4">
                     {history.map((item, idx) => (
                         <div key={idx} className="flex gap-4 group">
                             <div className="flex flex-col items-center">
                                 <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-nexus-500 mt-2"></div>
                                 {idx < history.length - 1 && <div className="w-px h-full bg-slate-200 my-1"></div>}
                             </div>
                             <div className="pb-6">
                                 <p className="text-sm font-bold text-slate-800">{item.action}</p>
                                 <p className="text-sm text-slate-600">{item.change}</p>
                                 <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                     <span>{item.user}</span>
                                     <span>•</span>
                                     <span>{item.date}</span>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
             <div className="text-xs text-slate-500">
                Last modified by {history[history.length-1]?.user || 'System'}
             </div>
             <div className="flex gap-3">
                <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                {!isReadOnly && (
                    <button onClick={handleSave} className="px-4 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700 shadow-sm flex items-center gap-2">
                        <Save size={16}/> Save Risk
                    </button>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default RiskDetailModal;