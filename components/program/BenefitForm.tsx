
import React, { useState } from 'react';
import { Benefit, Project } from '../../types';
import { useData } from '../../context/DataContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    programId: string;
    projects: Project[];
}

export const BenefitForm: React.FC<Props> = ({ isOpen, onClose, programId, projects }) => {
    const { dispatch } = useData();
    const [formData, setFormData] = useState<Partial<Benefit>>({
        description: '',
        type: 'Financial',
        value: 0,
        metric: 'USD',
        status: 'Planned',
        componentId: programId
    });

    const handleSave = () => {
        if (!formData.description) return;
        const benefit: Benefit = {
            id: generateId('BEN'),
            componentId: formData.componentId || programId,
            description: formData.description,
            type: formData.type as any,
            value: Number(formData.value) || 0,
            realizedValue: 0,
            metric: formData.metric || '',
            targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            status: formData.status as any
        };
        
        dispatch({ type: 'ADD_BENEFIT', payload: benefit } as any); 
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Define Benefit" footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSave}>Save</Button></>}>
            <div className="space-y-4">
                <Input label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Type</label>
                        <select className="w-full p-2 border rounded" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                            <option>Financial</option><option>Non-Financial</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Target Value</label>
                        <Input type="number" value={formData.value} onChange={e => setFormData({...formData, value: parseFloat(e.target.value)})} />
                    </div>
                </div>
                <div>
                     <label className="block text-sm font-bold mb-1">Linked Component</label>
                     <select className="w-full p-2 border rounded" value={formData.componentId} onChange={e => setFormData({...formData, componentId: e.target.value})}>
                         <option value={programId}>Program Level</option>
                         {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                     </select>
                </div>
            </div>
        </Modal>
    );
};
