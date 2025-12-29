
import React, { useState, useEffect } from 'react';
import { CostEstimate } from '../../types';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Calculator, Info } from 'lucide-react';
import { generateId } from '../../utils/formatters';

interface CreateEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (estimate: CostEstimate) => void;
  projectId: string;
  wbsId: string;
  wbsName: string;
}

const ESTIMATE_CLASSES = [
    { id: 'Class 5 (ROM)', label: 'Class 5: Rough Order of Magnitude', contingency: 30, description: 'Concept screening (0-2% definition)' },
    { id: 'Class 4 (Preliminary)', label: 'Class 4: Preliminary / Feasibility', contingency: 20, description: 'Study or feasibility (1-15% definition)' },
    { id: 'Class 3 (Budget)', label: 'Class 3: Budget Authorization', contingency: 15, description: 'Budget authorization (10-40% definition)' },
    { id: 'Class 2 (Control)', label: 'Class 2: Control / Bid', contingency: 10, description: 'Control or bid/tender (30-75% definition)' },
    { id: 'Class 1 (Definitive)', label: 'Class 1: Definitive / Check', contingency: 5, description: 'Check estimate or change order (65-100% definition)' },
];

export const CreateEstimateModal: React.FC<CreateEstimateModalProps> = ({ 
    isOpen, onClose, onSave, projectId, wbsId, wbsName 
}) => {
  const [formData, setFormData] = useState<Partial<CostEstimate>>({
      class: 'Class 5 (ROM)',
      method: 'Parametric',
      contingencyPercent: 30,
      escalationPercent: 5,
      basisOfEstimate: ''
  });

  // Auto-adjust contingency based on class selection
  useEffect(() => {
      const selectedClass = ESTIMATE_CLASSES.find(c => c.id === formData.class);
      if (selectedClass) {
          setFormData(prev => ({ ...prev, contingencyPercent: selectedClass.contingency }));
      }
  }, [formData.class]);

  const handleSubmit = () => {
      const newEstimate: CostEstimate = {
          id: generateId('CE'),
          projectId,
          wbsId,
          version: 1,
          status: 'Draft',
          method: formData.method as any,
          class: formData.class as any,
          baseCost: 0,
          contingencyPercent: formData.contingencyPercent || 0,
          escalationPercent: formData.escalationPercent || 0,
          // Calculate initial overhead (0 base cost, so just 0 for now)
          totalCost: 0, 
          items: [],
          basisOfEstimate: formData.basisOfEstimate || `Initial estimate generated for ${wbsName}.`,
          updatedAt: new Date().toISOString(),
          updatedBy: 'CurrentUser'
      };
      onSave(newEstimate);
      onClose();
  };

  return (
    <SidePanel
        isOpen={isOpen}
        onClose={onClose}
        title="Create Cost Estimate"
        width="md:w-[600px]"
        footer={
            <>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} icon={Calculator}>Initialize Estimate</Button>
            </>
        }
    >
        <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                <p className="text-sm text-slate-600">
                    Creating estimate for WBS: <span className="font-bold text-slate-800">{wbsName}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">ID: {wbsId}</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estimate Classification (AACE)</label>
                <select 
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none"
                    value={formData.class}
                    onChange={e => setFormData({...formData, class: e.target.value as any})}
                >
                    {ESTIMATE_CLASSES.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                </select>
                <div className="flex items-start gap-2 mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    <Info size={14} className="shrink-0 mt-0.5"/>
                    <p>{ESTIMATE_CLASSES.find(c => c.id === formData.class)?.description}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Methodology</label>
                    <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none"
                        value={formData.method}
                        onChange={e => setFormData({...formData, method: e.target.value as any})}
                    >
                        <option value="Parametric">Parametric (Historical)</option>
                        <option value="Analogous">Analogous (Top-Down)</option>
                        <option value="Deterministic">Deterministic (Bottom-Up)</option>
                        <option value="Three-Point">Three-Point (PERT)</option>
                    </select>
                </div>
                <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Contingency (%)</label>
                     <div className="relative">
                        <Input 
                            type="number" 
                            value={formData.contingencyPercent}
                            onChange={e => setFormData({...formData, contingencyPercent: parseFloat(e.target.value)})}
                        />
                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                     </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Basis of Estimate (Narrative)</label>
                <textarea 
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none"
                    placeholder="Describe assumptions, inclusions, and exclusions..."
                    value={formData.basisOfEstimate}
                    onChange={e => setFormData({...formData, basisOfEstimate: e.target.value})}
                />
            </div>
        </div>
    </SidePanel>
  );
};
