
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const ResourceTableHeader: React.FC = () => {
  const theme = useTheme();
  return (
    <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm border-b`}>
      <tr>
        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Resource Identity</th>
        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Enterprise Role</th>
        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Class</th>
        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Org Calendar</th>
        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
        <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Std Rate</th>
        <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
      </tr>
    </thead>
  );
};
