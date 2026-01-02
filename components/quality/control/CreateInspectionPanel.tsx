import React from 'react';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Save } from 'lucide-react';

interface CreateInspectionPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export const CreateInspectionPanel: React.FC<CreateInspectionPanelProps> = ({ isOpen, onClose, onSave }) => {
    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title="New Inspection"
            footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={onSave} icon={Save}>Save</Button></>}
        >
            <div className="space-y-4">
                <Input label="Inspection Type" placeholder="e.g. Concrete Pour Pre-Check" />
                <Input type="date" label="Date" />
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Scope / Location</label>
                    <textarea className="w-full p-2 border border-slate-300 rounded-lg text-sm h-20" placeholder="Area to be inspected..."></textarea>
                </div>
            </div>
        </SidePanel>
    );
};
