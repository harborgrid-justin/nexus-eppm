
import React from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Project } from '../../../types';

interface ScheduleToolbarProps {
    showCriticalPath: boolean;
    setShowCriticalPath: (show: boolean) => void;
    activeBaselineId: string | null;
    setActiveBaselineId: (id: string) => void;
    baselines: Project['baselines'];
}

export const ScheduleToolbar: React.FC<ScheduleToolbarProps> = ({
    showCriticalPath, setShowCriticalPath, activeBaselineId, setActiveBaselineId, baselines
}) => {
    const theme = useTheme();
    return (
        <div className={`h-12 bg-slate-50 border-b ${theme.colors.border} flex items-center px-6 gap-4 z-30 shrink-0 overflow-x-auto scrollbar-hide`}>
            <div className="flex items-center gap-2 relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input className="pl-9 pr-4 py-1.5 text-xs border border-slate-300 rounded-md w-48 focus:ring-1 focus:ring-nexus-500 outline-none" placeholder="Search tasks..." />
            </div>
            <div className="h-6 w-px bg-slate-300"></div>
            <button 
                onClick={() => setShowCriticalPath(!showCriticalPath)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-colors whitespace-nowrap ${showCriticalPath ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-white border border-slate-300 text-slate-600'}`}
            >
                <div className={`w-2 h-2 rounded-full ${showCriticalPath ? 'bg-red-600' : 'bg-slate-400'}`}></div> Critical Path
            </button>
            <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baseline:</span>
                <select 
                    className="text-[10px] font-bold border border-slate-300 rounded py-1 px-2 bg-white outline-none focus:ring-1 focus:ring-nexus-500"
                    value={activeBaselineId || ''}
                    onChange={(e) => setActiveBaselineId(e.target.value)}
                >
                    <option value="">None</option>
                    {baselines?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>
            <div className="ml-auto flex items-center gap-3">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-green-500"/> Sched OK
                 </span>
            </div>
        </div>
    );
};
