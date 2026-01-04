
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Filter, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';

export const TeamCalendar: React.FC = () => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [filter, setFilter] = useState('All');

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(); // 0 = Sun

    const events = state.teamEvents || [];

    const getEventColor = (type: string) => {
        switch(type) {
            case 'Milestone': return 'bg-red-100 text-red-700 border-red-200';
            case 'Meeting': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Leave': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentMonth(newDate);
    };

    const handleAddEvent = () => {
        const newEvent = {
            id: Date.now(),
            date: new Date().toISOString(),
            title: 'New Event',
            type: 'Meeting' as const,
            duration: 1
        };
        dispatch({ type: 'ADD_TEAM_EVENT', payload: newEvent });
    };

    return (
        <div className={`h-full flex flex-col ${theme.colors.surface} border ${theme.colors.border} rounded-xl shadow-sm overflow-hidden`}>
            {/* Header */}
            <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center bg-slate-50`}>
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white border border-slate-300 rounded-lg p-1">
                        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronLeft size={16}/></button>
                        <span className="px-3 font-bold text-sm min-w-[120px] text-center">
                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronRight size={16}/></button>
                    </div>
                    <Button size="sm" variant="outline" icon={CalIcon} onClick={() => setCurrentMonth(new Date())}>Today</Button>
                </div>
                <div className="flex gap-2">
                    <select 
                        className="text-sm border border-slate-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-nexus-500 outline-none"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option>All Events</option>
                        <option>Milestones</option>
                        <option>Team Leave</option>
                        <option>Meeting</option>
                    </select>
                    <Button size="sm" icon={Plus} onClick={handleAddEvent}>Add Event</Button>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="py-2 text-xs font-bold text-slate-500 uppercase tracking-widest">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 auto-rows-fr h-full min-h-[500px]">
                    {[...Array(42)].map((_, i) => {
                        const dayNum = i - startDay + 1;
                        const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
                        
                        let dayEvents = [];
                        if (isCurrentMonth) {
                            dayEvents = events.filter(e => {
                                const d = new Date(e.date);
                                return d.getDate() === dayNum && 
                                       d.getMonth() === currentMonth.getMonth() && 
                                       d.getFullYear() === currentMonth.getFullYear() &&
                                       (filter === 'All' || e.type === filter);
                            });
                        }

                        const isToday = isCurrentMonth && 
                                        dayNum === new Date().getDate() && 
                                        currentMonth.getMonth() === new Date().getMonth() &&
                                        currentMonth.getFullYear() === new Date().getFullYear();

                        return (
                            <div 
                                key={i} 
                                className={`
                                    border-b border-r border-slate-100 p-2 flex flex-col gap-1 relative min-h-[100px] transition-colors
                                    ${!isCurrentMonth ? 'bg-slate-50/50 text-slate-300' : 'bg-white hover:bg-slate-50'}
                                `}
                            >
                                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-nexus-600 text-white shadow-md' : ''}`}>
                                    {isCurrentMonth ? dayNum : ''}
                                </span>
                                
                                {isCurrentMonth && dayEvents.map(ev => (
                                    <div 
                                        key={ev.id} 
                                        className={`text-[10px] px-2 py-1 rounded border font-medium truncate cursor-pointer hover:opacity-80 shadow-sm ${getEventColor(ev.type)}`}
                                        title={ev.title}
                                    >
                                        {ev.title}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
