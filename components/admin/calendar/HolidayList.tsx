import React from 'react';
import { Holiday } from '../../../types/index';
import { useTheme } from '../../../context/ThemeContext';
import { Calendar as CalendarIcon, ShieldAlert, Plus } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

interface HolidayListProps {
    holidays: Holiday[];
}

export const HolidayList: React.FC<HolidayListProps> = ({ holidays }) => {
    const theme = useTheme();

    return (
        <Card className={`flex flex-col h-full overflow-hidden min-h-[400px] rounded-[2.5rem] border ${theme.colors.border} shadow-sm bg-white`}>
            <div className={`p-6 border-b ${theme.colors.border} bg-slate-50/50 flex justify-between items-center`}>
                <div>
                    <h4 className={`font-black text-slate-800 flex items-center gap-3 text-sm uppercase tracking-[0.2em]`}>
                        <CalendarIcon size={18} className="text-red-500"/> Organizational Shutdowns
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Calendar exceptions & non-work events</p>
                </div>
                <Button size="sm" variant="ghost" icon={Plus} className="text-[10px] font-black uppercase tracking-widest">Register Day</Button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin bg-white">
                {holidays.length > 0 ? (
                    <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                        <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm border-b`}>
                            <tr>
                                <th className={`${theme.components.table.header} pl-8 py-5`}>Target Date</th>
                                <th className={theme.components.table.header}>Event Designation</th>
                                <th className={`${theme.components.table.header} text-center pr-8`}>Logic Mode</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-slate-50 bg-white`}>
                            {holidays.map((holiday, idx) => (
                                <tr key={idx} className="nexus-table-row transition-all group">
                                    <td className={`px-6 py-5 pl-8 font-mono text-[11px] font-black text-slate-400 group-hover:text-nexus-600 transition-colors`}>{holiday.date}</td>
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-sm text-slate-800 uppercase tracking-tight">{holiday.name}</div>
                                    </td>
                                    <td className="px-6 py-5 text-center pr-8">
                                        <Badge variant={holiday.isRecurring ? 'info' : 'neutral'} className="h-6 px-3">
                                            {holiday.isRecurring ? 'Recurrent' : 'Fixed'}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                            {[...Array(3)].map((_, i) => (
                                <tr key={`f-${i}`} className="nexus-empty-pattern opacity-10 h-14">
                                    <td colSpan={10}></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center nexus-empty-pattern">
                        <ShieldAlert size={48} className="mx-auto mb-4 opacity-10 text-slate-400"/>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">No Calendar Exceptions Recorded</p>
                    </div>
                )}
            </div>
        </Card>
    );
};