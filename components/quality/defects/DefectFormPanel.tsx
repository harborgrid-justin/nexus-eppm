import React, { useState } from 'react';
import { NonConformanceReport } from '../../../types';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Save } from 'lucide-react';
import { generateId } from '../../../utils/formatters';

interface DefectFormPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (defect: Partial<NonConformanceReport>) => void;
    projectId: string;
}

export const DefectFormPanel: React.FC<DefectFormPanelProps> = ({ isOpen, onClose, onSave, projectId }) => {
    const [formData, setFormData] = useState<Partial<NonConformanceReport>>({
        projectId,
        status: 'Open',
        severity: 'Major',
        description: '',
        category: 'Workmanship'
    });

    const handleSubmit = () => {
        onSave({ ...formData, id: generateId('NCR'), date: new Date().toISOString().split('T')[0] });
    };

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title="Log Non-Conformance"
            footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit} icon={Save}>Save Report</Button></>}
        >
            <div className="space-y-4">
                <Input label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Severity</label>
                        <select className="w-full p-2 border rounded-lg text-sm" value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value as any})}>
                            <option>Minor</option>
                            <option>Major</option>
                            <option>Critical</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <select className="w-full p-2 border rounded-lg text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option>Material</option>
                            <option>Workmanship</option>
                            <option>Design</option>
                            <option>Safety</option>
                        </select>
                    </div>
                </div>
            </div>
        </SidePanel>
    );
};
