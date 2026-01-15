
import React, { useState, useEffect, useMemo } from 'react';
import { BPDefinition, BPRecord } from '../../types/unifier';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Save, ArrowRight, X, Calendar, DollarSign, List, FileText, Globe, Search, ShieldCheck } from 'lucide-react';
import { generateId } from '../../utils/formatters';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';

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
    const { t } = useI18n();
    const [formData, setFormData] = useState<Record<string, any>>(record?.data || {});
    const [title, setTitle] = useState(record?.title || '');
    const [lineItems, setLineItems] = useState<any[]>(record?.lineItems || []);

    const currentStatus = record?.status || 'Draft';
    const currentStep = definition.workflow.find(s => s.name === currentStatus) || definition.workflow[0];
    const availableActions = currentStep?.actions.length > 0 ? currentStep.actions : ['Save Draft'];

    const handleAction = (action: string) => {
        if (!title) { alert(t('unifier.title_required', "Narrative Title is required.")); return; }
        
        const newRecord: BPRecord = {
            id: record?.id || generateId(definition.prefix),
            bpDefId: definition.id,
            projectId,
            status: currentStatus,
            title,
            data: formData,
            lineItems: lineItems,
            auditTrail: record?.auditTrail || [],
            workflowHistory: record?.workflowHistory || []
        };
        onSave(newRecord, action);
    };

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden shadow-2xl rounded-3xl">
            <div className={`p-6 border-b ${theme.colors.border} flex justify-between items-center bg-slate-900 text-white`}>
                <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-2xl bg-white/10 border border-white/10 shadow-inner`}>
                        {definition.type === 'Cost' ? <DollarSign size={24} className="text-green-400"/> : <FileText size={24} className="text-blue-400"/>}
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter">{definition.name}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-widest">{record?.id || 'NEW_ENTRY_MODE'}</span>
                            <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase bg-white/10 text-white border border-white/10 tracking-widest`}>
                                {currentStatus}
                            </span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full text-slate-400 transition-all active:scale-90"><X size={24}/></button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50/50 scrollbar-thin">
                <div className="p-10 max-w-5xl mx-auto space-y-12">
                    <section className="space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Search size={14}/> Primary Registry Identification
                             </h3>
                        </div>
                        <div className="max-w-2xl">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Record Headline</label>
                            <Input 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                disabled={!currentStep.editableFields.includes('title') && currentStatus !== 'Draft'}
                                className="h-14 text-xl font-black text-slate-900 border-2 placeholder:text-slate-200"
                                placeholder={`Descriptive subject for this ${definition.name}...`}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                            {definition.fields.map(field => {
                                const isEditable = currentStep.editableFields.includes(field.key) || currentStatus === 'Draft';
                                const val = formData[field.key] || '';
                                
                                return (
                                    <div key={field.key} className={field.type === 'Textarea' ? 'col-span-2' : ''}>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                        
                                        {field.type === 'Picker' ? (
                                            <select 
                                                className={`w-full p-3.5 border-2 ${theme.colors.border} rounded-2xl text-sm font-bold bg-slate-50 focus:bg-white focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none transition-all text-slate-800 disabled:opacity-60 cursor-pointer`}
                                                value={val}
                                                onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                                                disabled={!isEditable}
                                            >
                                                <option value="">-- Select Authority --</option>
                                                {field.pickerSource === 'vendors' && state.vendors.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                                                {field.pickerSource === 'cbs' && state.unifier.costSheet.rows.map(r => <option key={r.costCode} value={r.costCode}>{r.costCode}: {r.description}</option>)}
                                            </select>
                                        ) : field.type === 'Date' ? (
                                            <div className="relative group">
                                                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-nexus-500 transition-colors"/>
                                                <input 
                                                    type="date"
                                                    className={`w-full pl-12 pr-4 py-3.5 border-2 ${theme.colors.border} rounded-2xl text-sm font-black focus:bg-white focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none transition-all bg-slate-50 text-slate-800 disabled:opacity-60`}
                                                    value={val}
                                                    onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                                                    disabled={!isEditable}
                                                />
                                            </div>
                                        ) : field.type === 'Textarea' ? (
                                            <textarea 
                                                className={`w-full p-5 border-2 ${theme.colors.border} rounded-[2rem] text-sm h-40 focus:bg-white focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none transition-all bg-slate-50 text-slate-700 disabled:opacity-60 resize-none shadow-inner leading-relaxed font-medium`}
                                                value={val}
                                                onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                                                disabled={!isEditable}
                                                placeholder={`Detailed narrative for ${field.label}...`}
                                            />
                                        ) : (
                                            <div className="relative group">
                                                {field.type === 'Currency' && <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors"/>}
                                                <input 
                                                    type={field.type === 'Currency' || field.type === 'Number' ? 'number' : 'text'}
                                                    value={val}
                                                    onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                                                    disabled={!isEditable}
                                                    placeholder={`Input ${field.label}...`}
                                                    className={`w-full ${field.type === 'Currency' ? 'pl-12' : 'px-5'} py-3.5 border-2 ${theme.colors.border} rounded-2xl text-sm font-black focus:bg-white focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none transition-all bg-slate-50 text-slate-900 disabled:opacity-60 shadow-sm`}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>

            <div className={`p-6 border-t ${theme.colors.border} bg-slate-900 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nexus-500 to-blue-500 opacity-30"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-2.5 bg-white/10 rounded-xl border border-white/10 text-nexus-400 shadow-inner"><ShieldCheck size={22}/></div>
                    <div>
                         <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Compliance Verification</p>
                         <p className="text-xs font-bold text-white uppercase tracking-tight">Record integrity verified against schema v2.4</p>
                    </div>
                </div>
                <div className="flex gap-3 relative z-10">
                    {availableActions.map(action => {
                        const isPrimary = ['Submit', 'Approve', 'Certify'].includes(action);
                        const isDanger = ['Reject', 'Terminate'].includes(action);
                        return (
                            <Button 
                                key={action} 
                                onClick={() => handleAction(action)}
                                variant={isDanger ? 'danger' : isPrimary ? 'primary' : 'secondary'}
                                icon={isPrimary ? ArrowRight : isDanger ? X : Save}
                                className="font-black uppercase tracking-widest text-[10px] px-10 h-12 rounded-2xl shadow-xl"
                            >
                                {action}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
