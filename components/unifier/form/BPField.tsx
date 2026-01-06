import React from 'react';
import { BPFieldDefinition } from '../../../types/unifier';
import { Input } from '../../ui/Input';
import { useData } from '../../../context/DataContext';

interface Props {
  field: BPFieldDefinition;
  value: any;
  onChange: (val: any) => void;
  isEditable: boolean;
}

export const BPField: React.FC<Props> = ({ field, value, onChange, isEditable }) => {
  const { state } = useData();
  const safeValue = value === null || value === undefined ? '' : String(value);

  if (field.type === 'Picker') {
    const options = field.pickerSource === 'vendors' ? state.vendors : [];
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500">{field.label}</label>
        <select value={safeValue} onChange={e => onChange(e.target.value)} disabled={!isEditable} className="w-full p-2 border rounded-lg text-sm bg-white">
          <option value="">Select...</option>
          {options.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-slate-500">{field.label}</label>
      <Input value={safeValue} onChange={e => onChange(e.target.value)} disabled={!isEditable} type={field.type === 'Number' || field.type === 'Currency' ? 'number' : 'text'} />
    </div>
  );
};