
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { GlobalCalendar, WorkDay } from '../../types';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Check, X } from 'lucide-react';
import { Card } from '../ui/Card';

const CalendarEditor: React.FC = () => {
    const { state } = useData();
    const [selectedCalendarId, setSelectedCalendarId] = useState<string>(state.calendars[0]?.id);
    const [isEditing, setIsEditing] = useState(false);

    const selectedCalendar = state.calendars.find(c => c.id === selectedCalendarId) || state.calendars[0];

    // Days of Week map
    const days: (keyof typeof selectedCalendar.workWeek)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const renderWorkDay = (dayName: string, workDay: WorkDay) => (
        <div key={dayName} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white">
            <div className="flex items-center gap-3">
                <input 
                    type="checkbox" 
                    checked={workDay.isWorkDay} 
                    disabled={!isEditing}
                    className="w-4 h-4 rounded border-slate-300 text-nexus-600 focus:ring-nexus-500"
                />
                <span className="text-sm font-medium text-slate-700 capitalize w-24">{dayName}</span>
            </div>
            <div className="flex-1 flex flex-wrap gap-2 justify-end">
                {workDay.isWorkDay ? (
                    workDay.intervals.map((interval, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-xs font-mono text-slate-600 border border-slate-200">
                            {interval.start} - {interval.end}
                        </span>
                    ))
                ) : (
                    <span className="text-xs text-slate-400 italic px-2 py-1">Non-work</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <CalendarIcon className="text-nexus-600" size={20}/> Enterprise Calendars
                    </h3>
                    <p className="text-sm text-slate-500">Define global working hours, holidays, and exceptions.</p>
                </div>
                <div className="flex gap-2">
                    <select 
                        value={selectedCalendarId}
                        onChange={(e) => setSelectedCalendarId(e.target.value)}
                        className="bg-white border border-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-nexus-500"
                    >
                        {state.calendars.map(c => <option key={c.id} value={c.id}>{c.name} {c.isDefault ? '(Default)' : ''}</option>)}
                    </select>
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                            isEditing ? 'bg-nexus-600 text-white hover:bg-nexus-700' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        {isEditing ? <><Check size={16}/> Done</> : 'Edit'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
                {/* Standard Work Week */}
                <Card className="flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <h4 className="font-bold text-slate-700 flex items-center gap-2"><Clock size={16}/> Standard Work Week</h4>
                        {isEditing && <span className="text-xs text-nexus-600 bg-nexus-50 px-2 py-1 rounded border border-nexus-200">Editing Enabled</span>}
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                        {days.map(day => renderWorkDay(day as string, selectedCalendar.workWeek[day]))}
                    </div>
                    <div className="p-4 border-t border-slate-200 bg-slate-50">
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Total Hours/Week: <strong>40</strong></span>
                            <span>Default for: <strong>Projects, Resources</strong></span>
                        </div>
                    </div>
                </Card>

                {/* Exceptions & Holidays */}
                <Card className="flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <h4 className="font-bold text-slate-700 flex items-center gap-2"><CalendarIcon size={16}/> Holidays & Exceptions</h4>
                        {isEditing && (
                            <button className="text-xs flex items-center gap-1 bg-white border border-slate-300 px-2 py-1 rounded hover:bg-slate-50">
                                <Plus size={12}/> Add Exception
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase">Type</th>
                                    {isEditing && <th className="px-4 py-2 w-10"></th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {selectedCalendar.holidays.map((holiday, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm font-mono text-slate-600">{holiday.date}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-800">{holiday.name}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-[10px] px-2 py-1 rounded-full ${holiday.isRecurring ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {holiday.isRecurring ? 'Recurring' : 'One-time'}
                                            </span>
                                        </td>
                                        {isEditing && (
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CalendarEditor;
