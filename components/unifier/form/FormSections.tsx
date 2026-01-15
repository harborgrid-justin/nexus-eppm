
import React from 'react';
import { BPDefinition, BPLineItem } from '../../../types/unifier';
import { Input } from '../../ui/Input';
import { BPField } from './BPField';
import { Target, FileText } from 'lucide-react';

interface Props {
  definition: BPDefinition;
  formData: Record<string, any>;
  setFormData: (d: any) => void;
  title: string;
  setTitle: (t: string) => void;
  lineItems: BPLineItem[];
  setLineItems: (l: any) => void;
  currentStep: any;
  isDraft: boolean;
}

export const FormSections: React.FC<Props> = ({ definition, formData, setFormData, title, setTitle, currentStep, isDraft }) => (
    <div className="space-y-12 animate-nexus-in">
        <section className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-3 flex items-center gap-2">
                <FileText size={14} className="text-nexus-600"/> Strategic Record Context
            </h3>
            <div className="max-w-xl">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Subject Narrative</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder={`Summary of this ${definition.prefix}...`} className="h-12 font-black text-slate-900" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {definition.fields.map(field => (
                    <BPField 
                        key={field.key} 
                        field={field} 
                        value={formData[field.key]} 
                        onChange={(val) => setFormData({...formData, [field.key]: val})} 
                        isEditable={isDraft || currentStep.editableFields.includes(field.key)} 
                    />
                ))}
            </div>
        </section>
        
        {definition.lineItemDefinition && (
             <section className="space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Target size={14} className="text-blue-600"/> Granular Line Items
                </h3>
                <div className="nexus-empty-pattern border-2 border-dashed border-slate-100 rounded-2xl p-10 text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase italic">Line Item Grid Initializing...</p>
                </div>
             </section>
        )}
    </div>
);
