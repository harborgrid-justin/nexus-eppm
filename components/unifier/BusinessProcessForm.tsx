
import React, { useState } from 'react';
import { BPDefinition, BPRecord, BPLineItem } from '../../types/unifier';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { FormSections } from './form/FormSections';
import { FormActions } from './form/FormActions';
import { generateId } from '../../utils/formatters';

interface BusinessProcessFormProps {
    definition: BPDefinition; record?: BPRecord; projectId: string;
    onClose: () => void; onSave: (record: BPRecord, action: string) => void;
}

const BusinessProcessForm: React.FC<BusinessProcessFormProps> = ({ definition, record, projectId, onClose, onSave }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState<Record<string, any>>(record?.data || {});
    const [title, setTitle] = useState(record?.title || '');
    const [lineItems, setLineItems] = useState<BPLineItem[]>(record?.lineItems || []);

    const currentStatus = record?.status || 'Draft';
    const currentStep = definition.workflow.find(s => s.name === currentStatus) || definition.workflow[0];

    const handleAction = (action: string) => {
        if (!title) return alert("Title is required");
        const newRecord: BPRecord = {
            id: record?.id || generateId(definition.prefix),
            bpDefId: definition.id, projectId, status: currentStatus,
            title, data: formData, lineItems,
            auditTrail: record?.auditTrail || [], workflowHistory: record?.workflowHistory || []
        };
        onSave(newRecord, action);
    };

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            <div className={`p-5 border-b bg-slate-50 flex justify-between items-center`}>
                <h2 className="text-lg font-bold text-slate-900">{definition.name} - {record?.id || 'New'}</h2>
                <Badge variant="neutral">{currentStatus}</Badge>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <FormSections 
                        definition={definition} formData={formData} setFormData={setFormData}
                        title={title} setTitle={setTitle} lineItems={lineItems} setLineItems={setLineItems}
                        currentStep={currentStep} isDraft={currentStatus === 'Draft'}
                    />
                </div>
            </div>
            <FormActions currentStep={currentStep} onAction={handleAction} onCancel={onClose} />
        </div>
    );
};
export default BusinessProcessForm;
