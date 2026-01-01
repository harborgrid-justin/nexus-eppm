
import React, { useState, useEffect } from 'react';
import { WorkflowDefinition } from '../../../types';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { GitPullRequest, Trash2 } from 'lucide-react';

interface WorkflowPanelProps {
    isOpen: boolean;
    onClose: () => void;
    workflow: Partial<WorkflowDefinition> | null;
    onSave: (wf: WorkflowDefinition) => void;
    onDelete: (id: string) => void;
}

export const WorkflowPanel: React.FC<WorkflowPanelProps> = ({ isOpen, onClose, workflow, onSave, onDelete }) => {
    const [formData, setFormData] = useState<Partial<WorkflowDefinition>>({});

    useEffect(() => {
        if (workflow) setFormData(workflow);
    }, [workflow, isOpen]);

    const handleSave = () => {
        if (formData.name) {
            onSave({ ...formData, id: formData.id || `WF-${Date.now()}` } as WorkflowDefinition);
        }
    };

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title={workflow?.id ? "Edit Workflow" : "New Workflow"}
            footer={
                <div className="flex justify-between w-full">
                    {workflow?.id && <Button variant="danger" icon={Trash2} onClick={() => onDelete(workflow.id!)}>Delete</Button>}
                    <div className="flex gap-2 ml-auto">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSave} icon={GitPullRequest}>Save Workflow</Button>
                    </div>
                </div>
            }
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Workflow Name</label>
                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Change Order Approval" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Trigger Event</label>
                    <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                        value={formData.trigger}
                        onChange={e => setFormData({...formData, trigger: e.target.value as any})}
                    >
                        <option value="ChangeOrder">Change Order Created</option>
                        <option value="ScheduleBaseline">Baseline Change</option>
                        <option value="RiskEscalation">Risk Escalation</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                    <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value as any})}
                    >
                        <option value="Draft">Draft</option>
                        <option value="Active">Active</option>
                    </select>
                </div>
            </div>
        </SidePanel>
    );
};
