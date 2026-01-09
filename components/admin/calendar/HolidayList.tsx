
import React from 'react';
import { Holiday } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Card } from '../../ui/Card';

interface HolidayListProps {
    holidays: Holiday[];
}

export const HolidayList: React.FC<HolidayListProps> = ({ holidays }) => {
    const theme = useTheme();

    return (
        <Card className="flex flex-col h-full overflow-hidden min-h-[300px]">
            <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.background} flex justify-between items-center`}>
                <h4 className={`font-bold ${theme.colors.text.secondary} flex items-center gap-2 text-xs uppercase tracking-widest`}><CalendarIcon size={16}/> Public Holidays</h4>
            </div>
            <div className="flex-1 overflow-y-auto">
                {holidays.length > 0 ? (
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className={`${theme.colors.surface} sticky top-0 z-10`}>
                            <tr>
                                <th className={theme.components.table.header}>Date</th>
                                <th className={theme.components.table.header}>Name</th>
                                <th className={theme.components.table.header + " text-center"}>Type</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')} ${theme.colors.surface}`}>
                            {holidays.map((holiday, idx) => (
                                <tr key={idx} className={theme.components.table.row}>
                                    <td className={`${theme.components.table.cell} font-mono ${theme.colors.text.secondary}`}>{holiday.date}</td>
                                    <td className={theme.components.table.cell}>{holiday.name}</td>
                                    <td className={`${theme.components.table.cell} text-center`}>
                                        <span className={`text-[10px] px-2 py-1 rounded-full ${holiday.isRecurring ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {holiday.isRecurring ? 'Recurring' : 'One-time'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-8 text-center text-slate-400 text-sm italic">No holidays configured.</div>
                )}
            </div>
        </Card>
    );
};
