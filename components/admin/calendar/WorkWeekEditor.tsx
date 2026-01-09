
import React from 'react';
import { WorkDay, WorkWeek } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { Clock } from 'lucide-react';
import { Card } from '../../ui/Card';

interface WorkWeekEditorProps {
    workWeek: WorkWeek;
    setWorkWeek: (ww: WorkWeek) => void;
}

export const WorkWeekEditor: React.FC<WorkWeekEditorProps> = ({ workWeek, setWorkWeek }) => {
    const theme = useTheme();
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

    return (
        <Card className="flex flex-col h-full overflow-hidden min-h-[300px]">
            <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.background} flex justify-between items-center`}>
                <h4 className={`font-bold ${theme.colors.text.secondary} flex items-center gap-2 text-xs uppercase tracking-widest`}><Clock size={16}/> Work Week Baseline</h4>
            </div>
            <div className={`flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 scrollbar-thin`}>
                {days.map(day => {
                    const dayData = workWeek[day];
                    return (
                        <div key={day} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 border ${theme.colors.border} rounded-lg ${theme.colors.surface} gap-2`}>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="checkbox" 
                                    checked={dayData.isWorkDay} 
                                    readOnly
                                    className="w-4 h-4 rounded border-slate-300 text-nexus-600 cursor-default"
                                />
                                <span className={`text-sm font-medium ${theme.colors.text.primary} capitalize w-24`}>{day}</span>
                            </div>
                            <div className="flex-1 flex flex-wrap gap-2 sm:justify-end">
                                {dayData.isWorkDay ? (
                                    dayData.intervals.map((interval, idx) => (
                                        <span key={idx} className={`inline-flex items-center px-2 py-1 rounded ${theme.colors.background} text-xs font-mono ${theme.colors.text.secondary} border ${theme.colors.border}`}>
                                            {interval.start} - {interval.end}
                                        </span>
                                    ))
                                ) : (
                                    <span className={`text-xs ${theme.colors.text.tertiary} italic px-2 py-1`}>Non-work</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};
