
import React, { useState } from 'react';
import { BPDefinition, BPRecord } from '../../types/unifier';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Save, ArrowRight, X } from 'lucide-react';
import { generateId } from '../../utils/formatters';

interface BusinessProcessFormProps {
    definition: BPDefinition;
    record?: BPRecord;
    projectId: string;
    onClose: () => void;
    onSave: (record: BPRecord, action: string) => void;
}

export const BusinessProcessForm: React.FC<BusinessProcessFormProps> = ({ definition, record, projectId, onClose, onSave }) => {
    const { state } = useData();
    const theme = useTheme();
    
    // Initialize form data
    const [formData, setFormData] = useState<Record<string, any>>(record?.data || {});
    const [title, setTitle] = useState(record?.title || '');
    
    // Determine current step actions
    const currentStatus = record?.status || 'Draft';
    const currentStep = definition.workflow.find(s => s.name === currentStatus) || definition.workflow[0];
    const availableActions = currentStep.actions.length > 0 ? currentStep.actions : ['Save'];

    const handleAction = (action: string) => {
        const newRecord: BPRecord = {
            id: record?.id || generateId(definition.prefix),
            bpDefId: definition.id,
            projectId,
            status: currentStatus, // Will be updated by engine
            title,
            data: formData,
            auditTrail: record?.auditTrail || [],
            workflowHistory: record?.workflowHistory || []
        };
        onSave(newRecord, action);
    };

    return (
        <div className="h-full flex flex-col bg-white">
            <div className={`p-6 border-b ${theme.colors.border} flex justify-between items-center bg-slate-50`}>
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-slate-900">{definition.name}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${record ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
                            {currentStatus}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{record ? record.id : 'New Record'}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <div>
                    <label className={theme.typography.label + " block mb-1"}>Title</label>
                    <Input value={title} onChange={e => setTitle(e.target.value)} disabled={!currentStep.editableFields.includes('title') && currentStatus !== 'Draft'} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {definition.fields.map(field => {
                        const isEditable = currentStep.editableFields.includes(field.key) || currentStatus === 'Draft';
                        
                        return (
                            <div key={field.key} className={field.type === 'String' ? 'md:col-span-2' : ''}>
                                <label className={theme.typography.label + " block mb-1"}>
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>
                                
                                {field.type === 'Picker' ? (
                                    <select 
                                        className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 disabled:bg-slate-100`}
                                        value={formData[field.key] || ''}
                                        onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                                        disabled={!isEditable}
                                    >
                                        <option value="">Select...</option>
                                        {/* Mock Picker Data Logic */}
                                        {field.pickerSource === 'vendors' && state.vendors.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                                        {field.pickerSource === 'cbs' && state.unifier.costSheet.rows.map(r => <option key={r.costCode} value={r.costCode}>{r.costCode} - {r.description}</option>)}
                                    </select>
                                ) : field.type === 'Date' ? (
                                    <Input 
                                        type="date"
                                        value={formData[field.key] || ''}
                                        onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                                        disabled={!isEditable}
                                    />
                                ) : (
                                    <Input 
                                        type={field.type === 'Currency' || field.type === 'Number' ? 'number' : 'text'}
                                        value={formData[field.key] || ''}
                                        onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                                        disabled={!isEditable}
                                        className={field.type === 'Currency' ? 'font-mono' : ''}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={`p-6 border-t ${theme.colors.border} bg-slate-50 flex justify-end gap-3`}>
                {availableActions.map(action => (
                    <Button 
                        key={action} 
                        onClick={() => handleAction(action)}
                        variant={action === 'Reject' ? 'danger' : action === 'Submit' || action === 'Approve' || action === 'Certify' ? 'primary' : 'secondary'}
                        icon={action === 'Submit' || action === 'Approve' ? ArrowRight : Save}
                    >
                        {action}
                    </Button>
                ))}
            </div>
        </div>
    );
};
