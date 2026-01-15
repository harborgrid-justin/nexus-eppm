
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
    const options = field.pickerSource === 'vendors' ? state.vendors : 
                    field.pickerSource === 'cbs' ? state.unifier.costSheet.rows : [];
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
        <select 
            value={safeValue} 
            onChange={e => onChange(e.target.value)} 
            disabled={!isEditable} 
            className="w-full p-3 border border-slate-300 rounded-xl text-sm font-bold bg-slate-50 focus:bg-white focus:ring-4 focus:ring-nexus-500/10 outline-none transition-all text-slate-700 disabled:opacity-60"
        >
          <option value="">-- Select {field.label} --</option>
          {options.map((opt: any) => (
              <option key={opt.id || opt.costCode} value={opt.id || opt.costCode}>
                  {opt.name || opt.description || opt.id || opt.costCode}
              </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === 'Textarea') {
      return (
        <div className="flex flex-col gap-1.5 col-span-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
            <textarea
                disabled={!isEditable}
                className="w-full p-4 border border-slate-300 rounded-2xl text-sm font-medium h-32 focus:ring-4 focus:ring-nexus-500/10 outline-none transition-all bg-slate-50 focus:bg-white resize-none shadow-inner"
                value={safeValue}
                onChange={e => onChange(e.target.value)}
                placeholder={`Input ${field.label}...`}
            />
        </div>
      );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
      <Input 
        value={safeValue} 
        onChange={e => onChange(e.target.value)} 
        disabled={!isEditable} 
        type={field.type === 'Number' || field.type === 'Currency' ? 'number' : 'text'}
        className="h-12 font-bold"
      />
    </div>
  );
};
