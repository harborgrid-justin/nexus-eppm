
import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarScheduleTmpl: React.FC = () => {
    const theme = useTheme();
    const [currentMonth, setCurrentMonth] = useState('October');

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className={theme.typography.h2}>Team Availability</h2>
                    <p className="text-sm text-slate-500">Resource allocation and blackout dates.</p>
                </div>
                <div className="flex gap-4 items-center bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    <Button variant="ghost" size="sm" onClick={() => setCurrentMonth('September')}><ChevronLeft size={16}/></Button>
                    <span className="font-bold text-sm min-w-[120px] text-center">{currentMonth} 2024</span>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentMonth('November')}><ChevronRight size={16}/></Button>
                </div>
            </div>
            
            <Card className="flex-1 overflow-hidden flex flex-col border-slate-300 shadow-md">
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 divide-x divide-slate-200">
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                        <div key={d} className="p-3 text-center text-xs font-black text-slate-400 uppercase tracking-widest">{d}</div>
                    ))}
                </div>
                <div className="flex-1 grid grid-cols-7 grid-rows-5 divide-x divide-slate-200 divide-y bg-white">
                    {[...Array(35)].map((_, i) => (
                        <div key={i} className="p-2 relative group hover:bg-slate-50 transition-colors min-h-[100px]">
                            <span className={`text-xs font-bold ${i < 30 ? 'text-slate-700' : 'text-slate-300'}`}>{i < 30 ? i + 1 : i - 29}</span>
                            
                            {/* Mock Events */}
                            {i === 12 && (
                                <div className="mt-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-200 truncate font-medium cursor-pointer hover:bg-blue-200">
                                    Steering Comm
                                </div>
                            )}
                            {i === 14 && (
                                <div className="mt-2 text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded border border-red-200 truncate font-medium cursor-pointer hover:bg-red-200">
                                    Code Freeze
                                </div>
                            )}
                            {(i === 18 || i === 19) && (
                                <div className="mt-2 text-[10px] bg-yellow-50 text-yellow-700 px-2 py-1 rounded border border-yellow-200 truncate font-medium">
                                    Mike: PTO
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
