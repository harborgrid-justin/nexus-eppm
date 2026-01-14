
import React from 'react';
import { BPRecord, BPFieldDefinition } from '../../types/unifier';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  record: BPRecord;
  fields: BPFieldDefinition[];
  onClick: () => void;
}

export const BPRecordRow: React.FC<Props> = ({ record, fields, onClick }) => {
  const theme = useTheme();

  const renderCell = (val: any) => {
    if (val === null || val === undefined) return '-';
    // Defense: Ensure only primitives are rendered to prevent Error #31
    if (typeof val === 'object') {
        try {
            return Array.isArray(val) ? `[List: ${val.length}]` : '[Object Detail]';
        } catch (e) {
            return '-';
        }
    }
    return String(val);
  };

  return (
    <tr 
        onClick={onClick} 
        className={`nexus-table-row cursor-pointer transition-all duration-150 group border-b ${theme.colors.border.replace('border-','border-b-')} outline-none focus:${theme.colors.background}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <td className={`px-6 py-4 text-xs font-mono font-bold ${theme.colors.text.tertiary} group-hover:text-nexus-600 transition-colors`}>
        {String(record.id)}
      </td>
      <td className={`px-6 py-4 text-sm font-bold ${theme.colors.text.primary}`}>
        {renderCell(record.title)}
      </td>
      <td className="px-6 py-4">
        <span className={`bg-slate-100 px-2 py-0.5 rounded text-[10px] font-black ${theme.colors.text.secondary} border ${theme.colors.border} uppercase tracking-tight`}>
          {renderCell(record.status)}
        </span>
      </td>
      {fields.map(f => (
        <td key={f.key} className={`px-6 py-4 text-sm ${theme.colors.text.secondary} font-medium`}>
          {renderCell(record.data[f.key])}
        </td>
      ))}
    </tr>
  );
};
