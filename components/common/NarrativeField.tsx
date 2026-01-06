import React from 'react';
import { FieldPlaceholder } from './FieldPlaceholder';
import { useTheme } from '../../context/ThemeContext';

interface NarrativeFieldProps {
  value?: string;
  label: string;
  placeholderLabel: string;
  onAdd?: () => void;
  className?: string;
  asHtml?: boolean;
}

/**
 * A standardized wrapper for narrative text areas.
 * Shows the value if it exists, otherwise renders the professional grey-fill placeholder.
 */
export const NarrativeField: React.FC<NarrativeFieldProps> = ({ 
  value, 
  label, 
  placeholderLabel, 
  onAdd, 
  className = "",
  asHtml = false
}) => {
  const theme = useTheme();

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      {value ? (
        <div className={`p-4 rounded-xl border border-slate-200 bg-white text-sm leading-relaxed ${theme.colors.text.primary}`}>
          {asHtml ? (
            <div dangerouslySetInnerHTML={{ __html: value }} />
          ) : (
            <p className="whitespace-pre-wrap">{value}</p>
          )}
        </div>
      ) : (
        <FieldPlaceholder label={placeholderLabel} onAdd={onAdd} />
      )}
    </div>
  );
};