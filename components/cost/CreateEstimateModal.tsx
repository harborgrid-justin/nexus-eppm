
import React, { useState, useEffect } from 'react';
import { CostEstimate } from '../../types';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Calculator, Info } from 'lucide-react';
import { generateId } from '../../utils/formatters';
import { ESTIMATE_CLASSES } from '../../constants/index';

interface CreateEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (estimate: CostEstimate) => void;
  projectId: string;
  wbsId: string;
  wbsName: string;
}

export const CreateEstimateModal: React.FC<CreateEstimateModalProps> = ({ 
    isOpen, onClose, onSave, projectId, wbsId, wbsName 
}) => {
  const [formData, setFormData] = useState<Partial<CostEstimate>>({
      class: 'Class 5 (ROM)',
      method: 'Deterministic',
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
          updaterId: 'CurrentUser'
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
            <h3 className="font-bold text-slate-800">Estimate for: <span className="text-nexus-600">{wbsName}</span></h3>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estimate Class (AACE)</label>
                <select 
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                    value={formData.class}
                    onChange={e => setFormData({...formData, class: e.target.value as any})}
                >
                    {ESTIMATE_CLASSES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                    {ESTIMATE_CLASSES.find(c => c.id === formData.class)?.description}
                </p>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Basis of Estimate (BoE)</label>
                <textarea 
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm h-32"
                    value={formData.basisOfEstimate}
                    onChange={e => setFormData({...formData, basisOfEstimate: e.target.value})}
                    placeholder="Describe the methodology, data sources, and assumptions..."
                />
            </div>
        </div>
    </SidePanel>
  );
};
