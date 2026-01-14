
import React from 'react';
import { Resource } from '../../types';
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  resource: Resource;
  calendarName: string;
  canEdit: boolean;
  onEdit: (r: Resource) => void;
  onDelete: (id: string) => void;
}

export const ResourceRow: React.FC<Props> = ({ resource, calendarName, canEdit, onEdit, onDelete }) => {
  const theme = useTheme();
  return (
    <tr className="nexus-table-row group">
      <td className={`px-6 py-4 whitespace-nowrap border-b ${theme.colors.border.replace('border-','border-b-')}50`}>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 mr-3">
            {String(resource.name.charAt(0))}
          </div>
          <div>
            <div className={`text-sm font-bold ${theme.colors.text.primary}`}>{String(resource.name)}</div>
            <div className={`text-[10px] ${theme.colors.text.tertiary} font-mono tracking-tighter uppercase`}>{String(resource.id)}</div>
          </div>
        </div>
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme.colors.text.secondary} border-b ${theme.colors.border.replace('border-','border-b-')}50`}>{String(resource.role)}</td>
      <td className={`px-6 py-4 whitespace-nowrap border-b ${theme.colors.border.replace('border-','border-b-')}50`}><Badge variant="neutral">{String(resource.type)}</Badge></td>
      <td className={`px-6 py-4 whitespace-nowrap border-b ${theme.colors.border.replace('border-','border-b-')}50`}>
        <div className={`flex items-center gap-2 text-xs ${theme.colors.text.secondary}`}>
          <Calendar size={12}/> {String(calendarName)}
        </div>
      </td>
      <td className={`px-6 py-4 whitespace-nowrap border-b ${theme.colors.border.replace('border-','border-b-')}50`}>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${resource.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
          {String(resource.status)}
        </span>
      </td>
      <td className={`px-6 py-4 text-right font-mono text-sm font-bold border-b ${theme.colors.border.replace('border-','border-b-')}50`}>${Number(resource.hourlyRate)}</td>
      <td className={`px-6 py-4 text-right border-b ${theme.colors.border.replace('border-','border-b-')}50`}>
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {canEdit && (
            <>
              <button onClick={() => onEdit(resource)} className={`p-1.5 hover:${theme.colors.background} rounded ${theme.colors.text.tertiary} hover:text-nexus-600`}><Edit2 size={14}/></button>
              <button onClick={() => onDelete(resource.id)} className={`p-1.5 hover:${theme.colors.background} rounded ${theme.colors.text.tertiary} hover:text-red-500`}><Trash2 size={14}/></button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
