
import React, { useState, useEffect, useMemo } from 'react';
import { Risk, RiskBreakdownStructureNode } from '../../types';
import { useData } from '../../context/DataContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { AlertTriangle, DollarSign, Calendar, Shield, Zap } from 'lucide-react';

interface RiskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (risk: Risk) => void;
  projectId: string;
  existingRisk?: Risk | null;
}

export const RiskForm: React.FC<RiskFormProps> = ({ isOpen, onClose, onSave, projectId, existingRisk }) => {
  const { state } = useData();
  const project = state.projects.find(p => p.id === projectId);
  
  const [formData, setFormData] = useState<Partial<Risk>>({
    description: '',
    category: '',
    status: 'Open',
    probabilityValue: 1,
    impactValue: 1,
    financialImpact: 0,
    strategy: 'Mitigate',
    responseActions: []
  });

  const [automationTriggered, setAutomationTriggered] = useState<string | null>(null);

  // Flatten RBS to get categories
  const rbsCategories = useMemo(() => {
    const categories: string[] = [];
    const traverse = (nodes: RiskBreakdownStructureNode[]) => {
        nodes.forEach(node => {
            categories.push(node.name); // Using name as category for simplicity in flat list
            if (node.children) traverse(node.children);
        });
    };
    if (state.rbs) traverse(state.rbs);
    // Add default if empty
    if (categories.length === 0) return ['Technical', 'Schedule', 'Cost', 'External', 'Resource'];
    return categories;
  }, [state.rbs]);

  useEffect(() => {
    if (existingRisk) {
      setFormData({ ...existingRisk });
    } else {
        // Reset
        setFormData({
            description: '',
            category: rbsCategories[0],
            status: 'Open',
            probabilityValue: 1,
            impactValue: 1,
            financialImpact: 0,
            strategy: 'Mitigate',
            responseActions: []
        });
    }
  }, [existingRisk, isOpen, rbsCategories]);

  // --- Automation Logic ---
  const calculateScore = (prob: number, imp: number) => prob * imp;
  const calculateEMV = (cost: number, prob: number) => cost * (prob * 0.2); // Simplified probability scalar (1=20%, 5=100%)

  const currentScore = calculateScore(formData.probabilityValue || 1, formData.impactValue || 1);
  const currentEMV = calculateEMV(formData.financialImpact || 0, formData.probabilityValue || 1);

  // Auto-escalation Logic Hook
  useEffect(() => {
      if (currentScore >= 15 && !formData.isEscalated) {
          setAutomationTriggered("High Risk Score detected. Recommendation: Escalate to Program Level.");
      } else if (currentEMV > 100000 && formData.strategy !== 'Transfer') {
          setAutomationTriggered("High Financial Exposure. Recommendation: Consider Transfer/Insure strategy.");
      } else {
          setAutomationTriggered(null);
      }
  }, [currentScore, currentEMV, formData.isEscalated, formData.strategy]);

  const handleSubmit = () => {
    const risk: Risk = {
        id: existingRisk?.id || `RISK-${Date.now()}`,
        projectId,
        owner: formData.owner || 'Unassigned',
        ...formData as Risk,
        score: currentScore,
        emv: currentEMV,
        // Auto-apply escalation if high score
        isEscalated: currentScore >= 20 ? true : formData.isEscalated
    };
    onSave(risk);
    onClose();
  };

  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={existingRisk ? `Edit Risk: ${existingRisk.id}` : 'Identify New Risk'}
        size="lg"
        footer={
            <>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>{existingRisk ? 'Save Changes' : 'Register Risk'}</Button>
            </>
        }
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Definition */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea 
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm h-24"
                        placeholder="Describe the risk event and its cause..."
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">RBS Category</label>
                        <select 
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                            {rbsCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Owner</label>
                        <select 
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                            value={formData.owner}
                            onChange={e => setFormData({...formData, owner: e.target.value})}
                        >
                            <option value="">Select Owner...</option>
                            {state.resources.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <label className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <Calendar size={14}/> Schedule Link
                    </label>
                    <select 
                        className="w-full p-2 border border-blue-200 rounded-lg text-sm bg-white"
                        value={formData.linkedTaskId}
                        onChange={e => setFormData({...formData, linkedTaskId: e.target.value})}
                    >
                        <option value="">-- No Linked Task --</option>
                        {project?.tasks.map(t => <option key={t.id} value={t.id}>{t.wbsCode} - {t.name}</option>)}
                    </select>
                    <p className="text-xs text-blue-700 mt-2">Linking to a task allows for Monte Carlo schedule simulation.</p>
                </div>
            </div>

            {/* Right Column: Analysis */}
            <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-orange-500"/> Qualitative Scoring
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-bold">Probability (1-5)</label>
                            <input 
                                type="range" min="1" max="5" 
                                value={formData.probabilityValue} 
                                onChange={e => setFormData({...formData, probabilityValue: parseInt(e.target.value)})}
                                className="w-full mt-2"
                            />
                            <div className="text-center font-bold text-slate-700">{formData.probabilityValue}</div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-bold">Impact (1-5)</label>
                            <input 
                                type="range" min="1" max="5" 
                                value={formData.impactValue} 
                                onChange={e => setFormData({...formData, impactValue: parseInt(e.target.value)})}
                                className="w-full mt-2"
                            />
                            <div className="text-center font-bold text-slate-700">{formData.impactValue}</div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-sm text-slate-600">Risk Score:</span>
                        <span className={`text-xl font-bold ${currentScore >= 15 ? 'text-red-600' : 'text-slate-800'}`}>{currentScore}</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <DollarSign size={16} className="text-green-600"/> Financial Exposure
                    </h4>
                    <label className="block text-xs text-slate-500 mb-1">Potential Cost Impact</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input 
                            type="number" 
                            className="w-full pl-8 p-2 border border-slate-300 rounded-lg text-sm font-mono"
                            value={formData.financialImpact}
                            onChange={e => setFormData({...formData, financialImpact: parseFloat(e.target.value)})}
                        />
                    </div>
                    <div className="mt-3 flex justify-between items-center text-sm bg-green-50 p-2 rounded text-green-800">
                        <span>Expected Monetary Value (EMV):</span>
                        <span className="font-bold">{formatCurrency(currentEMV)}</span>
                    </div>
                </div>

                {automationTriggered && (
                    <div className="p-3 bg-nexus-50 border border-nexus-200 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                        <Zap size={16} className="text-nexus-600 shrink-0 mt-0.5"/>
                        <p className="text-xs text-nexus-800">
                            <strong>AI Trigger:</strong> {automationTriggered}
                        </p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Response Strategy</label>
                    <div className="flex gap-2">
                        {['Avoid', 'Mitigate', 'Transfer', 'Accept'].map(strat => (
                            <button
                                key={strat}
                                onClick={() => setFormData({...formData, strategy: strat as any})}
                                className={`flex-1 py-1 text-xs border rounded transition-colors ${
                                    formData.strategy === strat ? 'bg-nexus-600 text-white border-nexus-600' : 'bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {strat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </Modal>
  );
};
