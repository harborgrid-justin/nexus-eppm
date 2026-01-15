
import React from 'react';
import { WorkWeek } from '../../../types/index';
import { useTheme } from '../../../context/ThemeContext';
import { Clock, ShieldCheck } from 'lucide-react';
import { Card } from '../../ui/Card';

interface WorkWeekEditorProps {
    workWeek: WorkWeek;
    setWorkWeek: (ww: WorkWeek) => void;
}

export const WorkWeekEditor: React.FC<WorkWeekEditorProps> = ({ workWeek }) => {
    const theme = useTheme();
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

    return (
        <Card className={`flex flex-col h-full overflow-hidden min-h-[400px] rounded-[2.5rem] border ${theme.colors.border} shadow-sm bg-white`}>
            <div className={`p-6 border-b ${theme.colors.border} bg-slate-50/50 flex justify-between items-center`}>
                <div>
                    <h4 className={`font-black text-slate-800 flex items-center gap-3 text-sm uppercase tracking-[0.2em]`}>
                        <Clock size={18} className="text-nexus-600"/> Operational Baseline
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Standard weekly capacity logic</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm">
                    <ShieldCheck size={12}/> Global Enforce
                </div>
            </div>
            <div className={`flex-1 overflow-y-auto p-6 space-y-3 bg-white scrollbar-thin`}>
                {days.map(day => {
                    const dayData = workWeek[day];
                    return (
                        <div key={day} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors group cursor-default shadow-sm`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${dayData.isWorkDay ? 'bg-nexus-50 border-nexus-200 text-nexus-600 shadow-sm' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'}`}>
                                    <span className="text-[10px] font-black uppercase">{day.substring(0, 3)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-black uppercase tracking-tight transition-colors ${dayData.isWorkDay ? 'text-slate-800' : 'text-slate-400 italic'}`}>{day}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{dayData.isWorkDay ? `${dayData.totalHours}hr Payload` : 'Non-Operational'}</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:justify-end mt-2 sm:mt-0">
                                {dayData.isWorkDay ? (
                                    dayData.intervals.map((interval, idx) => (
                                        <span key={idx} className={`inline-flex items-center px-3 py-1.5 rounded-xl bg-white text-[11px] font-mono font-black text-slate-700 border border-slate-200 shadow-sm group-hover:border-nexus-200 group-hover:text-nexus-700 transition-all`}>
                                            {interval.start} <span className="mx-2 text-slate-300">→</span> {interval.end}
                                        </span>
                                    ))
                                ) : (
                                    <div className="nexus-empty-pattern px-4 py-2 rounded-xl border border-slate-200">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Shut-down Period</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="p-4 bg-slate-900/5 border-t border-slate-100 flex justify-center">
                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] italic">System strictly honors non-working intervals for critical path drift.</p>
            </div>
        </Card>
    );
};
