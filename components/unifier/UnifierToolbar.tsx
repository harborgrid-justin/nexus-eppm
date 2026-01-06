import React from 'react';
import { Plus, Briefcase, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  title: string;
  onCreate: () => void;
  onRefresh: () => void;
}

export const UnifierToolbar: React.FC<Props> = ({ title, onCreate, onRefresh }) => {
  const theme = useTheme();
  return (
    <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center bg-slate-50/50`}>
        <div className="flex items-center gap-3">
        <div className={`p-2 ${theme.colors.surface} rounded-lg border ${theme.colors.border} shadow-sm text-slate-400`}>
            <Briefcase size={16}/>
        </div>
        <h3 className={`font-black ${theme.colors.text.primary} text-sm uppercase tracking-widest`}>{title}</h3>
        </div>
        <div className="flex gap-2">
        <button onClick={onRefresh} className={`p-2 ${theme.colors.text.tertiary} hover:${theme.colors.text.secondary} rounded-lg hover:bg-white transition-all`} aria-label="Refresh log">
            <RefreshCw size={16}/>
        </button>
        <button 
            onClick={onCreate} 
            className={`px-4 py-2 ${theme.colors.primary} text-white rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 shadow-md active:scale-95 transition-all`}
        >
            <Plus size={14}/> Create
        </button>
        </div>
    </div>
  );
};