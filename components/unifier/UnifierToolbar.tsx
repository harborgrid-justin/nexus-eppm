import React from 'react';
import { Plus, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
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
    <div className={`p-5 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 gap-4 shrink-0 shadow-sm z-10`}>
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className={`p-3 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-400`}>
                <Layers size={20}/>
            </div>
            <div>
                <h3 className={`font-black text-slate-900 text-sm uppercase tracking-tight truncate`}>{title}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                    <ShieldCheck size={10} className="text-nexus-500"/>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Process Governance Active</span>
                </div>
            </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={onRefresh} icon={RefreshCw} disabled={disabled} className="text-[10px] font-black uppercase tracking-widest h-10 px-6">Poll Stream</Button>
            <Button variant="primary" size="sm" onClick={onCreate} icon={Plus} disabled={disabled} className="text-[10px] font-black uppercase tracking-widest shadow-lg shadow-nexus-500/20 px-8 h-10">Initialize Record</Button>
        </div>
    </div>
  );
};