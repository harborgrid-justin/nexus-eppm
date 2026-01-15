
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
    if (typeof val === 'number') return val.toLocaleString();
    if (typeof val === 'object') return '[Binary Object]';
    return String(val);
  };

  return (
    <tr 
        onClick={onClick} 
        className={`nexus-table-row cursor-pointer transition-all duration-150 group border-b border-slate-50 bg-white hover:bg-slate-50/50`}
    >
      <td className={`px-8 py-5 text-[11px] font-mono font-black text-slate-400 group-hover:text-nexus-600 transition-colors`}>
        {String(record.id)}
      </td>
      <td className={`px-6 py-5 text-sm font-bold text-slate-800 uppercase tracking-tight truncate max-w-md`} title={record.title}>
        {record.title}
      </td>
      <td className="px-6 py-5">
        <span className={`bg-slate-100 px-3 py-1.5 rounded-xl text-[9px] font-black text-slate-500 border border-slate-200 uppercase tracking-widest shadow-sm group-hover:border-nexus-200 group-hover:bg-nexus-50 group-hover:text-nexus-700 transition-all`}>
          {record.status}
        </span>
      </td>
      {fields.map(f => (
        <td key={f.key} className={`px-6 py-5 text-sm text-slate-600 font-medium truncate max-w-[200px]`}>
          {renderCell(record.data[f.key])}
        </td>
      ))}
    </tr>
  );
};
