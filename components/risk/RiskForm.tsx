
import React, { useState, useEffect, useMemo } from 'react';
import { Risk, RiskBreakdownStructureNode } from '../../types/index';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { AlertTriangle, DollarSign, Calendar, Shield, Zap, Sparkles, Loader2, Save, X } from 'lucide-react';
import { suggestRisks } from '../../services/geminiService';
import { useTheme } from '../../context/ThemeContext';

interface RiskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (risk: Risk) => void;
  projectId: string;
  existingRisk?: Risk | null;
}

export const RiskForm: React.FC<RiskFormProps> = ({ isOpen, onClose, onSave, projectId, existingRisk }) => {
  const { state } = useData();
  const theme = useTheme();
  const { success } = useToast();
  const project = state.projects.find(p => p.id === projectId);
  
  const [formData, setFormData] = useState<Partial<Risk>>({
    description: '',
    category: '',
    status: 'Open',
    probabilityValue: 3,
    impactValue: 3,
    financialImpact: 0,
    strategy: 'Mitigate',
    responseActions: []
  });

  const [automationTriggered, setAutomationTriggered] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Flatten RBS to get categories
  const rbsCategories = useMemo(() => {
    const categories: string[] = [];
    const traverse = (nodes: RiskBreakdownStructureNode[]) => {
        nodes.forEach(node => {
            categories.push(node.name); 
            if (node.children) traverse(node.children);
        });
    };
    if (state.rbs) traverse(state.rbs);
    if (categories.length === 0) return ['Technical', 'Schedule', 'Cost', 'External', 'Resource'];
    return categories;
  }, [state.rbs]);

  useEffect(() => {
    if (existingRisk) {
      setFormData({ ...existingRisk });
    } else {
        setFormData({
            description: '',
            category: rbsCategories[0],
            status: 'Open',
            probabilityValue: 3,
            impactValue: 3,
            financialImpact: 0,
            strategy: 'Mitigate',
            responseActions: []
        });
    }
  }, [existingRisk, isOpen, rbsCategories]);

  const handleAiSuggest = async () => {
      if (!project) return;
      setIsSuggesting(true);
      try {
          const risks = await suggestRisks(project.description || project.name, formData.category || 'Technical');
          if (risks && risks.length > 0) {
              const suggested = risks[0];
              const pVal = suggested.probability === 'High' ? 5 : suggested.probability === 'Medium' ? 3 : 1;
              const iVal = suggested.impact === 'High' ? 5 : suggested.impact === 'Medium' ? 3 : 1;
              
              setFormData(prev => ({
                  ...prev,
                  description: suggested.description,
                  probabilityValue: pVal,
                  impactValue: iVal,
                  mitigationPlan: suggested.mitigationPlan
              }));
              setAutomationTriggered("Risk details populated by AI Advisor based on category.");
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsSuggesting(false);
      }
  };

  const calculateScore = (prob: number, imp: number) => prob * imp;
  const getProbPercent = (val: number) => [0.1, 0.3, 0.5, 0.7, 0.9][val - 1] || 0.1;
  const calculateEMV = (cost: number, probVal: number) => cost * getProbPercent(probVal);

  const currentScore = calculateScore(formData.probabilityValue || 1, formData.impactValue || 1);
  const currentEMV = calculateEMV(formData.financialImpact || 0, formData.probabilityValue || 1);

  useEffect(() => {
      let advice = null;
      if (currentScore >= 15 && !formData.isEscalated) {
          advice = "High Risk Score detected (≥15). Recommendation: Escalate to Program Level.";
      } else if (currentEMV > 100000 && formData.strategy !== 'Transfer') {
          advice = "High Financial Exposure. Recommendation: Consider Transfer/Insure strategy.";
      }
      setAutomationTriggered(advice);
  }, [currentScore, currentEMV, formData.isEscalated, formData.strategy]);

  const handleSubmit = async () => {
    if (!formData.description) return; 
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 600));

    const risk: Risk = {
        id: existingRisk?.id || `RISK-${Date.now()}`,
        projectId,
        ownerId: formData.ownerId || 'Unassigned',
        description: formData.description,
        category: formData.category || 'Technical',
        status: formData.status || 'Open',
        probabilityValue: formData.probabilityValue || 1,
        impactValue: formData.impactValue || 1,
        financialImpact: formData.financialImpact || 0,
        strategy: formData.strategy || 'Mitigate',
        mitigationPlan: formData.mitigationPlan || '',
        score: currentScore,
        emv: currentEMV,
        probability: formData.probabilityValue! >= 4 ? 'High' : formData.probabilityValue! >= 3 ? 'Medium' : 'Low',
        impact: formData.impactValue! >= 4 ? 'High' : formData.impactValue! >= 3 ? 'Medium' : 'Low',
        isEscalated: currentScore >= 20 ? true : formData.isEscalated,
        responseActions: formData.responseActions || []
    };
    
    onSave(risk);
    success(existingRisk ? "Risk Updated" : "Risk Registered", `Successfully saved ${risk.id}`);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <SidePanel
        isOpen={isOpen}
        onClose={onClose}
        title={existingRisk ? `Edit Risk: ${existingRisk.id}` : 'Identify New Risk'}
        width="md:w-[600px]"
        footer={
            <>
                <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={!formData.description} isLoading={isSubmitting} icon={Save}>
                    {existingRisk ? 'Save Changes' : 'Register Risk'}
                </Button>
            </>
        }
    >
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-1">
                         <label className="block text-sm font-bold text-slate-700">Description <span className="text-red-500">*</span></label>
                         {!existingRisk && (
                             <button onClick={handleAiSuggest} className="text-xs text-purple-600 font-bold flex items-center gap-1 hover:text-purple-800 disabled:opacity-50" disabled={isSuggesting}>
                                 {isSuggesting ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>} AI Suggest
                             </button>
                         )}
                    </div>
                    <textarea 
                        className="w-full p-3 border border-slate-300 rounded-xl text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none resize-none shadow-sm"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        autoFocus
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">RBS Category</label>
                        <select 
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                            {rbsCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Owner</label>
                        <select 
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500"
                            value={formData.ownerId}
                            onChange={e => setFormData({...formData, ownerId: e.target.value})}
                        >
                            <option value="">Select Owner...</option>
                            {state.resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                </div>
                
                <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Mitigation Plan</label>
                     <textarea 
                        className="w-full p-3 border border-slate-300 rounded-xl text-sm h-20 resize-none focus:ring-2 focus:ring-nexus-500 shadow-sm"
                        value={formData.mitigationPlan}
                        onChange={e => setFormData({...formData, mitigationPlan: e.target.value})}
                        placeholder="Strategy to reduce impact or probability..."
                     />
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-orange-500"/> Qualitative Analysis (5x5)
                    </h4>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-bold flex justify-between mb-2">Probability <span>{formData.probabilityValue}</span></label>
                            <input type="range" min="1" max="5" value={formData.probabilityValue} onChange={e => setFormData({...formData, probabilityValue: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-bold flex justify-between mb-2">Impact <span>{formData.impactValue}</span></label>
                            <input type="range" min="1" max="5" value={formData.impactValue} onChange={e => setFormData({...formData, impactValue: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"/>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-600">Calculated Score</span>
                        <div className={`text-xl font-black ${currentScore >= 15 ? 'text-red-600' : currentScore >= 8 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {currentScore} <span className="text-xs font-medium text-slate-400 ml-1">/ 25</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <DollarSign size={16} className="text-green-600"/> Financial Exposure
                    </h4>
                    <div className="mb-3">
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Potential Cost Impact</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <input type="number" className="w-full pl-8 p-2.5 border border-slate-300 rounded-lg text-sm font-mono font-bold focus:ring-2 focus:ring-nexus-500 outline-none" value={formData.financialImpact} onChange={e => setFormData({...formData, financialImpact: parseFloat(e.target.value)})}/>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm bg-green-50 p-3 rounded-lg text-green-800 border border-green-100">
                        <span className="font-medium">Expected Monetary Value (EMV):</span>
                        <span className="font-black font-mono text-lg">{formatCurrency(currentEMV)}</span>
                    </div>
                </div>

                {automationTriggered && (
                    <div className="p-4 bg-nexus-50 border border-nexus-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                        <Zap size={18} className="text-nexus-600 shrink-0 mt-0.5"/>
                        <p className="text-xs text-nexus-800 leading-relaxed"><strong>AI Insight:</strong> {automationTriggered}</p>
                    </div>
                )}
            </div>
        </div>
    </SidePanel>
  );
};
