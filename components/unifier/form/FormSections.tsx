import React from 'react';
import { BPDefinition, BPLineItem } from '../../../types/unifier';
import { Input } from '../../ui/Input';
import { BPField } from './BPField';

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
    <div className="space-y-8">
        <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Record Header</h3>
            <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Subject..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {definition.fields.map(field => (
                    <BPField key={field.key} field={field} value={formData[field.key]} onChange={(val) => setFormData({...formData, [field.key]: val})} isEditable={isDraft || currentStep.editableFields.includes(field.key)} />
                ))}
            </div>
        </section>
    </div>
);