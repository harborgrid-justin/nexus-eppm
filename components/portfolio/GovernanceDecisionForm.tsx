
import React, { useState, useEffect } from 'react';
import { GovernanceDecision } from '../../types';
import { useData } from '../../context/DataContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    decision?: GovernanceDecision | null;
}

export const GovernanceDecisionForm: React.FC<Props> = ({ isOpen, onClose, decision }) => {
    const { dispatch } = useData();
    const [formData, setFormData] = useState<Partial<GovernanceDecision>>({
        title: '',
        date: new Date().toISOString().split('T')[0],
        authorityId: 'Steering Committee',
        decision: 'Approved',
        notes: ''
    });

    useEffect(() => {
        if (decision) {
            setFormData(decision);
        } else {
            setFormData({
                title: '',
                date: new Date().toISOString().split('T')[0],
                authorityId: 'Steering Committee',
                decision: 'Approved',
                notes: ''
            });
        }
    }, [decision, isOpen]);

    const handleSave = () => {
        if (!formData.title) return;
        
        const decisionToSave: GovernanceDecision = {
            id: formData.id || generateId('DEC'),
            title: formData.title,
            date: formData.date || '',
            authorityId: formData.authorityId || '',
            decision: formData.decision as any,
            notes: formData.notes || ''
        };

        if (formData.id) {
            dispatch({ type: 'GOVERNANCE_UPDATE_DECISION', payload: decisionToSave });
        } else {
            dispatch({ type: 'GOVERNANCE_ADD_DECISION', payload: decisionToSave });
        }
        
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={decision ? "Edit Decision" : "Log Governance Decision"}
            footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSave}>{decision ? "Update" : "Record"} Decision</Button></>}
        >
            <div className="space-y-4">
                <Input label="Decision Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Budget Increase for Project X" />
                <div className="grid grid-cols-2 gap-4">
                    <Input type="date" label="Date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                    <div>
                        <label className="block text-sm font-bold mb-1">Authority</label>
                        <select className="w-full p-2 border rounded" value={formData.authorityId} onChange={e => setFormData({...formData, authorityId: e.target.value})}>
                            <option>Steering Committee</option><option>Investment Committee</option><option>Change Control Board</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Outcome</label>
                     <select className="w-full p-2 border rounded" value={formData.decision} onChange={e => setFormData({...formData, decision: e.target.value as any})}>
                        <option>Approved</option><option>Rejected</option><option>Deferred</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Meeting Notes / Rationale</label>
                    <textarea className="w-full p-2 border rounded h-24" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                </div>
            </div>
        </Modal>
    );
};
