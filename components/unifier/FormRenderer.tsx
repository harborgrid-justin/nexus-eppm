
import React, { useState, useEffect } from 'react';
import { BPDefinition, BPRecord } from '../../types/unifier';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Save, ArrowRight, X, Calendar, DollarSign, List, FileText } from 'lucide-react';
import { generateId } from '../../utils/formatters';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

interface FormRendererProps {
    definition: BPDefinition;
    record?: BPRecord;
    projectId: string;
    onClose: () => void;
    onSave: (record: BPRecord, action: string) => void;
}

export const FormRenderer: React.FC<FormRendererProps> = ({ definition, record, projectId, onClose, onSave }) => {
    const { state } = useData();
    const theme = useTheme();
    const [formData, setFormData] = useState<Record<string, any>>(record?.data || {});
    const [title, setTitle] = useState(record?.title || '');
    const [lineItems, setLineItems] = useState<any[]>(record?.lineItems || []);

    const currentStatus = record?.status || 'Draft';
    // Find current step. If not found (e.g. new record), default to first step.
    const currentStep = definition.workflow.find(s => s.name === currentStatus) || definition.workflow[0];
    const availableActions = currentStep?.actions.length > 0 ? currentStep.actions : ['Save'];

    // --- LINE ITEMS LOGIC ---
    const handleAddLine = () => {
        setLineItems([...lineItems, { id: Date.now(), description: '', amount: 0 }]);
    };
    
    const updateLineItem = (index: number, key: string, value: any) => {
        const newLines = [...lineItems];
        newLines[index] = { ...newLines[index], [key]: value };
        setLineItems(newLines);
    };

    const handleAction = (action: string) => {
        // Basic Validation
        if (!title) { alert("Title is required"); return; }
        
        const newRecord: BPRecord = {
            id: record?.id || generateId(definition.prefix),
            bpDefId: definition.id,
            projectId,
            status: currentStatus, // Will be transitioned by engine
            title,
            data: formData,
            lineItems: lineItems,
            auditTrail: record?.auditTrail || [],
            workflowHistory: record?.workflowHistory || []
        };
        onSave(newRecord, action);
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className={`p-5 border-b ${theme.colors.border} flex justify-between items-center bg-slate-50`}>
                <div>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${theme.colors.primary} text-white`}>
                            {definition.type === 'Cost' ? <DollarSign size={20}/> : <FileText size={20}/>}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">{definition.name}</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-xs text-slate-500">{record?.id || 'New Record'}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${record ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {currentStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-4xl mx-auto space-y-8">
                    {/* General Information */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">General Information</h3>
                        <div>
                            <label className={theme.typography.label + " block mb-1"}>Title <span className="text-red-500">*</span></label>
                            <Input 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                disabled={!currentStep.editableFields.includes('title') && currentStatus !== 'Draft'}
                                className="font-medium text-lg"
                                placeholder={`Enter ${definition.name} title...`}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {definition.fields.map(field => {
                                const isEditable = currentStep.editableFields.includes(field.key) || currentStatus === 'Draft';
                                
                                return (
                                    <div key={field.key} className={field.type === 'String' || field.type === 'Textarea' ? 'col-span-2' : ''}>
                                        <label className={theme.typography.label + " block mb-1"}>
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                        
                                        {field.type === 'Picker' ? (
                                            <select 
                                                className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 disabled:bg-slate-50 disabled:text-slate-500 outline-none`}
                                                value={formData[field.key] || ''}
                                                onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                                                disabled={!isEditable}
                                            >
                                                <option value="">Select...</option>
                                                {/* Picker Logic */}
                                                {field.pickerSource === 'vendors' && state.vendors.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                                                {field.pickerSource === 'cbs' && state.unifier.costSheet.rows.map(r => <option key={r.costCode} value={r.costCode}>{r.costCode} - {r.description}</option>)}
                                            </select>
                                        ) : field.type === 'Date' ? (
                                            <div className="relative">
                                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                                <input 
                                                    type="date"
                                                    className={`w-full pl-10 pr-3 py-2.5 border ${theme.colors.border} rounded-lg text-sm focus:ring-2 focus:ring-nexus-500 disabled:bg-slate-50 disabled:text-slate-500 outline-none`}
                                                    value={formData[field.key] || ''}
                                                    onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                                                    disabled={!isEditable}
                                                />
                                            </div>
                                        ) : field.type === 'Textarea' ? (
                                            <textarea 
                                                className={`w-full p-3 border ${theme.colors.border} rounded-lg text-sm focus:ring-2 focus:ring-nexus-500 disabled:bg-slate-50 disabled:text-slate-500 outline-none h-24 resize-none`}
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
                                                // Adding currency icon if type is currency
                                                icon={field.type === 'Currency' ? DollarSign : undefined}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Line Items (Dynamic) */}
                    {definition.lineItemDefinition && (
                        <section className="space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Line Items</h3>
                                <Button size="sm" variant="secondary" onClick={handleAddLine} disabled={currentStatus !== 'Draft'}>Add Line</Button>
                            </div>
                            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            {definition.lineItemDefinition.map(f => (
                                                <th key={f.key} className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">{f.label}</th>
                                            ))}
                                            <th className="w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {lineItems.map((item, idx) => (
                                            <tr key={idx}>
                                                {definition.lineItemDefinition!.map(f => (
                                                    <td key={f.key} className="p-2">
                                                        <input 
                                                            className="w-full bg-transparent border-b border-transparent focus:border-nexus-500 outline-none text-sm"
                                                            value={item[f.key] || ''}
                                                            onChange={e => updateLineItem(idx, f.key, e.target.value)}
                                                            disabled={currentStatus !== 'Draft'}
                                                        />
                                                    </td>
                                                ))}
                                                <td className="p-2 text-center">
                                                    <button onClick={() => setLineItems(lineItems.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-500" disabled={currentStatus !== 'Draft'}><X size={14}/></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {lineItems.length === 0 && <tr><td colSpan={definition.lineItemDefinition.length + 1} className="p-4 text-center text-slate-400 text-sm italic">No line items.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Workflow Actions Footer */}
            <div className={`p-4 border-t ${theme.colors.border} bg-slate-50 flex justify-end gap-3`}>
                {availableActions.map(action => (
                    <Button 
                        key={action} 
                        onClick={() => handleAction(action)}
                        variant={action === 'Reject' ? 'danger' : action === 'Submit' || action === 'Approve' || action === 'Certify' ? 'primary' : 'secondary'}
                        icon={action === 'Submit' || action === 'Approve' ? ArrowRight : Save}
                        className="px-6"
                    >
                        {action}
                    </Button>
                ))}
            </div>
        </div>
    );
};
