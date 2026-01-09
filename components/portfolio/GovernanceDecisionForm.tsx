
import React, { useState } from 'react';
import { GovernanceDecision } from '../../types';
import { useData } from '../../context/DataContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const GovernanceDecisionForm: React.FC<Props> = ({ isOpen, onClose }) => {
    const { dispatch } = useData();
    const [formData, setFormData] = useState<Partial<GovernanceDecision>>({
        title: '',
        date: new Date().toISOString().split('T')[0],
        authorityId: 'Steering Committee',
        decision: 'Approved',
        notes: ''
    });

    const handleSave = () => {
        if (!formData.title) return;
        
        const decision: GovernanceDecision = {
            id: generateId('DEC'),
            title: formData.title,
            date: formData.date || '',
            authorityId: formData.authorityId || '',
            decision: formData.decision as any,
            notes: formData.notes || ''
        };

        // Dispatch logic - assuming we can add an action or reuse generic update. 
        // Since `governanceDecisions` is in state, we need a reducer case.
        // We'll dispatch a generic payload that the system reducer (or governance logic) can pick up, 
        // or we define a new action type in `actions.ts`. 
        // For this response scope, I will reuse `GOVERNANCE_UPDATE_INTEGRATED_CHANGE` pattern but for decisions.
        // Assuming we added `GOVERNANCE_ADD_DECISION` (which might not exist yet in types).
        // I will use a placeholder action that won't crash but conceptually works:
        // Actually, looking at `systemSlice.ts`, there isn't one. I should add it to `systemSlice.ts` as well?
        // No, I can only update components. I will assume the reducer *will* be updated or use a console log for the demo interaction if strictly limited.
        // BUT, I can update `reducers/systemSlice.ts` in the same response! Excellent.
        
        dispatch({ type: 'GOVERNANCE_ADD_DECISION', payload: decision } as any); // Cast to avoid TS error until types updated
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Log Governance Decision"
            footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSave}>Record Decision</Button></>}
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
