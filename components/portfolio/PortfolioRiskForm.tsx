
import React, { useState } from 'react';
import { PortfolioRisk } from '../../types';
import { useData } from '../../context/DataContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const PortfolioRiskForm: React.FC<Props> = ({ isOpen, onClose }) => {
    const { dispatch } = useData();
    const [formData, setFormData] = useState<Partial<PortfolioRisk>>({
        description: '',
        category: 'Market',
        probability: 'Medium',
        impact: 'High',
        ownerId: '',
        status: 'Open',
        mitigationPlan: ''
    });

    const handleSave = () => {
        if (!formData.description) return;
        
        const probVal = formData.probability === 'High' ? 5 : formData.probability === 'Medium' ? 3 : 1;
        const impVal = formData.impact === 'High' ? 5 : formData.impact === 'Medium' ? 3 : 1;

        const newRisk: PortfolioRisk = {
            id: generateId('PR'),
            description: formData.description || '',
            category: formData.category || 'Strategic',
            probability: formData.probability as any,
            impact: formData.impact as any,
            score: probVal * impVal,
            ownerId: formData.ownerId || 'Board',
            status: 'Open',
            mitigationPlan: formData.mitigationPlan || '',
            financialImpact: 0 // Default for now
        };

        dispatch({ type: 'ADD_RISK', payload: { ...newRisk, projectId: 'PORTFOLIO_LEVEL' } });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Identify Portfolio Risk"
            footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSave}>Log Risk</Button></>}
        >
            <div className="space-y-4">
                <Input label="Risk Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="e.g. Currency Fluctuation" />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Category</label>
                        <select className="w-full p-2 border rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option>Market</option><option>Regulatory</option><option>Strategic</option><option>Financial</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Owner</label>
                        <Input value={formData.ownerId} onChange={e => setFormData({...formData, ownerId: e.target.value})} placeholder="e.g. CFO" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold mb-1">Probability</label>
                        <select className="w-full p-2 border rounded" value={formData.probability} onChange={e => setFormData({...formData, probability: e.target.value as any})}>
                            <option>Low</option><option>Medium</option><option>High</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Impact</label>
                        <select className="w-full p-2 border rounded" value={formData.impact} onChange={e => setFormData({...formData, impact: e.target.value as any})}>
                            <option>Low</option><option>Medium</option><option>High</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Mitigation Strategy</label>
                    <textarea className="w-full p-2 border rounded h-24" value={formData.mitigationPlan} onChange={e => setFormData({...formData, mitigationPlan: e.target.value})} />
                </div>
            </div>
        </Modal>
    );
};
