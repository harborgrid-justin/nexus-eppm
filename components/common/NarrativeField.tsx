
import React, { useState, useEffect } from 'react';
import { FieldPlaceholder } from './FieldPlaceholder';
import { useTheme } from '../../context/ThemeContext';
import { Edit2, Save, X, FileText } from 'lucide-react';
import { Button } from '../ui/Button';

interface NarrativeFieldProps {
  value?: string;
  label: string;
  placeholderLabel: string;
  onAdd?: () => void; 
  onSave?: (newValue: string) => void;
  className?: string;
  asHtml?: boolean;
  isReadOnly?: boolean;
}

export const NarrativeField: React.FC<NarrativeFieldProps> = ({ 
  value, label, placeholderLabel, onAdd, onSave, className = "", asHtml = false, isReadOnly = false
}) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleSave = () => {
      if (onSave) onSave(localValue);
      setIsEditing(false);
  };

  const handleCancel = () => {
      setLocalValue(value || '');
      setIsEditing(false);
  };

  if (!value && !isEditing) {
    return (
        <div className={`space-y-3 ${className}`}>
            <label className={`block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1`}>
                {label}
            </label>
            <FieldPlaceholder 
                label={placeholderLabel} 
                onAdd={!isReadOnly ? (onAdd || (() => setIsEditing(true))) : undefined} 
                icon={FileText}
            />
        </div>
    );
  }

  return (
    <div className={`space-y-3 group ${className}`}>
      <div className="flex justify-between items-end px-1">
          <label className={`block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]`}>
            {label}
          </label>
          {!isEditing && !isReadOnly && (
              <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 transition-opacity text-nexus-600 hover:text-nexus-800 p-1 flex items-center gap-1 text-[10px] font-bold uppercase" title="Modify Narrative">
                  <Edit2 size={12}/> Edit
              </button>
          )}
      </div>

      {isEditing ? (
          <div className="animate-nexus-in bg-white p-2 rounded-[2rem] border-2 border-nexus-200 shadow-2xl">
              <textarea 
                  className={`w-full p-6 rounded-2xl border-0 text-sm leading-relaxed focus:ring-0 outline-none resize-none min-h-[160px] bg-slate-50 shadow-inner font-medium text-slate-800`}
                  value={localValue}
                  onChange={(e) => setLocalValue(e.target.value)}
                  autoFocus
                  placeholder="Input detailed artifact narrative..."
              />
              <div className="flex justify-end gap-3 p-4 bg-white rounded-b-[2rem]">
                  <Button variant="ghost" size="sm" onClick={handleCancel} icon={X} className="font-bold uppercase text-[10px] tracking-widest">Discard</Button>
                  <Button variant="primary" size="sm" onClick={handleSave} icon={Save} className="font-black uppercase text-[10px] tracking-widest shadow-lg">Commit Change</Button>
              </div>
          </div>
      ) : (
        <div 
            className={`p-6 rounded-[2rem] border border-slate-200 bg-white text-sm leading-relaxed text-slate-700 hover:border-nexus-300 transition-all group-hover:shadow-md relative overflow-hidden`}
            onDoubleClick={() => !isReadOnly && setIsEditing(true)}
        >
          {asHtml ? (
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: value || '' }} />
          ) : (
            <p className="whitespace-pre-wrap font-medium">{value}</p>
          )}
          <div className="absolute inset-0 nexus-empty-pattern opacity-0 group-hover:opacity-5 transition-opacity"></div>
        </div>
      )}
    </div>
  );
};
