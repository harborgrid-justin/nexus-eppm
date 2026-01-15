
import React from 'react';
import { Plus, Briefcase, RefreshCw, Layers } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

interface Props {
  title: string;
  onCreate: () => void;
  onRefresh: () => void;
  disabled?: boolean;
}

export const UnifierToolbar: React.FC<Props> = ({ title, onCreate, onRefresh, disabled }) => {
  const theme = useTheme();
  return (
    <div className={`p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center bg-slate-50/30 gap-3 shrink-0`}>
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className={`p-2 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-400`}>
                <Layers size={18}/>
            </div>
            <h3 className={`font-black text-slate-900 text-sm uppercase tracking-tight truncate`}>{title}</h3>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="ghost" size="sm" onClick={onRefresh} icon={RefreshCw} disabled={disabled} className="text-[10px] font-black uppercase tracking-widest">Poll Hub</Button>
            <Button variant="primary" size="sm" onClick={onCreate} icon={Plus} disabled={disabled} className="text-[10px] font-black uppercase tracking-widest shadow-lg shadow-nexus-500/20 px-6 h-10">Initialize Record</Button>
        </div>
    </div>
  );
};
