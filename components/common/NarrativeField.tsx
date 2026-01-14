import React, { useState, useEffect } from 'react';
import { FieldPlaceholder } from './FieldPlaceholder';
import { useTheme } from '../../context/ThemeContext';
import { Edit2, Save, X } from 'lucide-react';
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
  value, 
  label, 
  placeholderLabel, 
  onAdd,
  onSave,
  className = "",
  asHtml = false,
  isReadOnly = false
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
        <div className={`space-y-2 ${className}`}>
            <label className={`block text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest ml-1`}>
                {label}
            </label>
            <FieldPlaceholder 
                label={placeholderLabel} 
                onAdd={!isReadOnly ? (onAdd || (() => setIsEditing(true))) : undefined} 
            />
        </div>
    );
  }

  return (
    <div className={`space-y-2 group ${className}`}>
      <div className="flex justify-between items-end">
          <label className={`block text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest ml-1`}>
            {label}
          </label>
          {!isEditing && !isReadOnly && (
              <button 
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-nexus-600 hover:text-nexus-700 p-1"
                title="Edit Field"
              >
                  <Edit2 size={12}/>
              </button>
          )}
      </div>

      {isEditing ? (
          <div className="animate-in fade-in zoom-in-95 duration-200">
              <textarea 
                  className={`w-full p-4 rounded-xl border ${theme.colors.border} ${theme.colors.surface} ${theme.colors.text.primary} text-sm leading-relaxed focus:ring-2 focus:ring-nexus-500 focus:border-nexus-500 outline-none resize-y min-h-[120px] shadow-inner`}
                  value={localValue}
                  onChange={(e) => setLocalValue(e.target.value)}
                  autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                  <Button variant="ghost" size="sm" onClick={handleCancel} icon={X}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={handleSave} icon={Save}>Save Change</Button>
              </div>
          </div>
      ) : (
        <div 
            className={`p-4 rounded-xl border ${theme.colors.border} ${theme.colors.surface} text-sm leading-relaxed ${theme.colors.text.primary} hover:border-nexus-300 transition-colors relative`}
            onDoubleClick={() => !isReadOnly && setIsEditing(true)}
        >
          {asHtml ? (
            <div dangerouslySetInnerHTML={{ __html: value || '' }} />
          ) : (
            <p className="whitespace-pre-wrap">{value}</p>
          )}
        </div>
      )}
    </div>
  );
};