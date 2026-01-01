
import React, { useState, useEffect } from 'react';
import { WorkflowStep } from '../../../types';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Plus } from 'lucide-react';

interface StepPanelProps {
    isOpen: boolean;
    onClose: () => void;
    step: Partial<WorkflowStep> | null;
    onSave: (step: WorkflowStep, index: number | null) => void;
}

export const StepPanel: React.FC<StepPanelProps> = ({ isOpen, onClose, step, onSave }) => {
    const [formData, setFormData] = useState<Partial<WorkflowStep>>({});

    useEffect(() => {
        if (step) {
            setFormData(step);
        } else {
            setFormData({ name: '', type: 'Approval', role: '', requirements: [] });
        }
    }, [step, isOpen]);

    const handleSave = () => {
        if (formData.name && formData.role) {
            onSave({ 
                ...formData, 
                id: formData.id || `STEP-${Date.now()}`,
                requirements: formData.requirements || []
            } as WorkflowStep, step && step.id ? null : null); // Index handling needs refinement in parent
        }
    };

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title={step?.id ? "Edit Step" : "Add Step"}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} icon={Plus}>Save Step</Button>
                </>
            }
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Step Name</label>
                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Project Manager Review" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                    <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value as any})}
                    >
                        <option value="Approval">Approval Gate</option>
                        <option value="Review">Review Task</option>
                        <option value="Notification">Notification</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Assigned Role</label>
                    <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="e.g. Project Manager" />
                </div>
            </div>
        </SidePanel>
    );
};
