
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const ArchitectureStandardForm: React.FC<Props> = ({ isOpen, onClose }) => {
    const { dispatch } = useData();
    const [formData, setFormData] = useState({
        title: '',
        category: 'Technology',
        description: '',
        status: 'Baseline'
    });

    const handleSave = () => {
        if (!formData.title) return;
        const std = {
            id: generateId('ARCH'),
            ...formData
        };
        // Using generic update for program architecture, assuming reducer handles this action or similar
        // Similar to Benefits, we assume 'ADD_ARCH_STANDARD' will be handled
        dispatch({ type: 'ADD_ARCH_STANDARD', payload: std } as any);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Define Architecture Standard" footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSave}>Save</Button></>}>
            <div className="space-y-4">
                <Input label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <label className="block text-sm font-bold mb-1">Category</label>
                         <select className="w-full p-2 border rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                             <option>Technology</option><option>Data</option><option>Security</option><option>Application</option>
                         </select>
                    </div>
                    <div>
                         <label className="block text-sm font-bold mb-1">Status</label>
                         <select className="w-full p-2 border rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                             <option>Baseline</option><option>Proposed</option><option>Retired</option>
                         </select>
                    </div>
                </div>
                <div>
                     <label className="block text-sm font-bold mb-1">Description</label>
                     <textarea className="w-full p-2 border rounded h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
            </div>
        </Modal>
    );
};
