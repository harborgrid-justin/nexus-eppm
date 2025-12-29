
import React, { useState, useEffect } from 'react';
import { Risk, RiskResponseAction, RiskHistoryItem } from '../../types';
import { useData } from '../../context/DataContext';
import { Plus, Trash2, Save, AlertTriangle, Calendar, DollarSign, Shield, Activity, ArrowRight } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { formatCurrency } from '../../utils/formatters';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';

interface RiskDetailPanelProps {
  riskId: string;
  projectId: string;
  onClose: () => void;
}

const RiskDetailPanel: React.FC<RiskDetailPanelProps> = ({ riskId, projectId, onClose }) => {
  const { state, dispatch } = useData();
  const { canEditProject } = usePermissions();
  const [risk, setRisk] = useState<Risk | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'response' | 'history'>('details');
  const [history, setHistory] = useState<RiskHistoryItem[]>([]);

  const isReadOnly = !canEditProject();
  const projectTasks = state.projects.find(p => p.id === projectId)?.tasks || [];

  useEffect(() => {
    const foundRisk = state.risks.find(r => r.id === riskId);
    if (foundRisk) {
      setRisk(JSON.parse(JSON.stringify(foundRisk)));
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
      const score = (risk.probabilityValue || 1) * (risk.impactValue || 1);
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

  if (!risk) return null;

  return (
    <SidePanel
        isOpen={true}
        onClose={onClose}
        width="max-w-4xl"
        title={
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-slate-900">{risk.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${
                        risk.status === 'Open' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>{risk.status}</span>
                    {risk.isEscalated && <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-red-50 text-red-700 border border-red-200">Escalated</span>}
                </div>
            </div>
        }
        footer={
            <>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                {!isReadOnly && <Button onClick={handleSave} icon={Save}>Save Changes</Button>}
            </>
        }
    >
        {/* Main Content */}
        <div className="space-y-6">
            
            {/* Status Bar */}
            <div className="flex flex-wrap gap-6 p-4 bg-white border border-slate-200 rounded-xl shadow-sm items-center">
                 <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase font-bold">Risk Owner</span>
                    <span className="text-sm font-medium text-slate-900">{risk.owner}</span>
                 </div>
                 <div className="w-px h-8 bg-slate-100"></div>
                 <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase font-bold">Category</span>
                    <span className="text-sm font-medium text-slate-900">{risk.category}</span>
                 </div>
                 <div className="w-px h-8 bg-slate-100"></div>
                 <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase font-bold">Current Score</span>
                    <span className={`text-lg font-bold ${risk.score >= 15 ? 'text-red-600' : 'text-slate-800'}`}>{risk.score}</span>
                 </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex gap-6">
                    {['details', 'response', 'history'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab 
                                ? 'border-nexus-600 text-nexus-600' 
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'details' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                        {/* Description */}
                        <div>
                            <label className="text-sm font-bold text-slate-900 mb-2 block">Risk Description & Cause</label>
                            <textarea 
                                value={risk.description} 
                                disabled={isReadOnly} 
                                onChange={(e) => handleChange('description', e.target.value)} 
                                className="w-full p-4 border border-slate-300 rounded-xl text-sm min-h-[100px] focus:ring-2 focus:ring-nexus-500 outline-none"
                                placeholder="Describe the risk event, its root cause, and potential effect..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Qualitative */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Activity size={18} className="text-blue-500"/> Qualitative Scoring
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-500 uppercase font-bold">Probability</span>
                                            <span className="font-mono font-bold text-slate-700">{risk.probabilityValue}/5</span>
                                        </div>
                                        <input 
                                            type="range" min="1" max="5" 
                                            value={risk.probabilityValue || 1} 
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                handleChange('probabilityValue', val);
                                                handleChange('probability', val >= 4 ? 'High' : val >= 2 ? 'Medium' : 'Low');
                                            }}
                                            disabled={isReadOnly}
                                            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-500 uppercase font-bold">Impact</span>
                                            <span className="font-mono font-bold text-slate-700">{risk.impactValue}/5</span>
                                        </div>
                                        <input 
                                            type="range" min="1" max="5" 
                                            value={risk.impactValue || 1} 
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                handleChange('impactValue', val);
                                                handleChange('impact', val >= 4 ? 'High' : val >= 2 ? 'Medium' : 'Low');
                                            }}
                                            disabled={isReadOnly}
                                            className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Quantitative */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <DollarSign size={18} className="text-green-600"/> Quantitative Exposure
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Potential Cost Impact</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                            <input 
                                                type="number" 
                                                value={risk.financialImpact || 0} 
                                                onChange={(e) => handleChange('financialImpact', parseFloat(e.target.value))}
                                                className="w-full pl-7 p-2 border border-slate-300 rounded-lg text-sm font-mono font-bold"
                                                disabled={isReadOnly}
                                            />
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-100">
                                        <span className="text-xs text-slate-500 uppercase font-bold">Exposure (EMV)</span>
                                        <span className="font-mono text-sm font-bold text-nexus-700">
                                            {formatCurrency((risk.financialImpact || 0) * ((risk.probabilityValue || 1) * 0.2))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Linkage */}
                        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                             <div className="flex items-center gap-4">
                                 <div className="flex-1">
                                     <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Impacted Schedule Task</label>
                                     <select 
                                        value={risk.linkedTaskId || ''} 
                                        onChange={(e) => handleChange('linkedTaskId', e.target.value || undefined)}
                                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-nexus-500 outline-none"
                                        disabled={isReadOnly}
                                    >
                                        <option value="">-- No Schedule Link --</option>
                                        {projectTasks.map(t => (
                                            <option key={t.id} value={t.id}>{t.wbsCode} - {t.name}</option>
                                        ))}
                                    </select>
                                 </div>
                                 <div className="flex-1">
                                    <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Risk Category</label>
                                    <select 
                                        value={risk.category} 
                                        onChange={(e) => handleChange('category', e.target.value)} 
                                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-nexus-500 outline-none"
                                        disabled={isReadOnly}
                                    >
                                        <option>Technical</option>
                                        <option>Schedule</option>
                                        <option>Cost</option>
                                        <option>External</option>
                                        <option>Resource</option>
                                        <option>Governance</option>
                                    </select>
                                 </div>
                             </div>
                        </div>
                    </div>
                )}

                {activeTab === 'response' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Shield size={18} className="text-purple-600"/> Response Strategy
                            </h3>
                            <div className="flex gap-2 mb-4">
                                {['Avoid', 'Mitigate', 'Transfer', 'Accept', 'Escalate'].map(strat => (
                                    <button 
                                        key={strat}
                                        onClick={() => handleChange('strategy', strat)}
                                        disabled={isReadOnly}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                                            risk.strategy === strat 
                                            ? 'bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500' 
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {strat}
                                    </button>
                                ))}
                            </div>
                            <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Mitigation Plan</label>
                            <textarea 
                                placeholder="Detailed plan to reduce probability or impact..." 
                                value={risk.mitigationPlan}
                                onChange={(e) => handleChange('mitigationPlan', e.target.value)}
                                disabled={isReadOnly}
                                className="w-full p-4 border border-slate-300 rounded-xl text-sm min-h-[120px] focus:ring-2 focus:ring-nexus-500 outline-none"
                            />
                        </div>
                        
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-800">Action Items</h3>
                                {!isReadOnly && (
                                    <button className="text-xs text-nexus-600 font-bold flex items-center gap-1 hover:bg-nexus-50 px-2 py-1 rounded transition-colors">
                                        <Plus size={12}/> Add Action
                                    </button>
                                )}
                            </div>
                            {risk.responseActions.length > 0 ? (
                                <div className="space-y-2">
                                    {risk.responseActions.map((action, i) => (
                                        <div key={action.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                            <input type="checkbox" className="rounded text-nexus-600 w-4 h-4" checked={action.status === 'Complete'} readOnly/>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-800">{action.description}</p>
                                                <div className="flex gap-3 mt-1 text-xs text-slate-500">
                                                    <span>Owner: {action.owner}</span>
                                                    <span>Due: {action.dueDate}</span>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 px-2 py-1 bg-white rounded border border-slate-200">{action.status}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 text-slate-400 text-sm">
                                    No specific actions defined yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="relative pl-6 border-l-2 border-slate-200 space-y-8">
                            {history.map((item, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[29px] top-1 w-3 h-3 bg-slate-400 rounded-full border-2 border-white ring-1 ring-slate-200"></div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{item.action}</p>
                                            <p className="text-sm text-slate-600 mt-1">{item.change}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-mono text-slate-500">{item.date}</p>
                                            <p className="text-xs text-slate-400">{item.user}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
    </SidePanel>
  );
};

export default RiskDetailPanel;
