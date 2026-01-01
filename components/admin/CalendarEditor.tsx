
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { GlobalCalendar, WorkDay } from '../../types';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Check, X, Save, Edit2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';

const CalendarEditor: React.FC = () => {
    const { state, dispatch } = useData();
    const [selectedCalendarId, setSelectedCalendarId] = useState<string>(state.calendars[0]?.id);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingCalendar, setEditingCalendar] = useState<Partial<GlobalCalendar> | null>(null);

    const selectedCalendar = state.calendars.find(c => c.id === selectedCalendarId) || state.calendars[0];
    const days: (keyof typeof selectedCalendar.workWeek)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const handleOpenPanel = (cal?: GlobalCalendar) => {
        if (cal) {
            setEditingCalendar(JSON.parse(JSON.stringify(cal)));
        } else {
            setEditingCalendar({
                name: 'New Corporate Calendar',
                type: 'Global',
                isDefault: false,
                workWeek: JSON.parse(JSON.stringify(state.calendars[0].workWeek)),
                holidays: [],
                exceptions: []
            });
        }
        setIsPanelOpen(true);
    };

    const handleSave = () => {
        if (!editingCalendar?.name) return;
        const calToSave: GlobalCalendar = {
            ...editingCalendar,
            id: editingCalendar.id || generateId('CAL')
        } as GlobalCalendar;

        dispatch({
            type: editingCalendar.id ? 'UPDATE_CALENDAR' : 'ADD_CALENDAR',
            payload: calToSave
        });
        setIsPanelOpen(false);
    };

    const handleDelete = (id: string) => {
        if (id === 'CAL-STD') {
            alert("Standard Calendar cannot be deleted.");
            return;
        }
        if (confirm("Delete this calendar? Resources linked to it will revert to the Standard Calendar.")) {
            dispatch({ type: 'DELETE_CALENDAR', payload: id });
            setSelectedCalendarId(state.calendars[0].id);
        }
    };

    const renderWorkDay = (dayName: string, workDay: WorkDay) => (
        <div key={dayName} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-200 rounded-lg bg-white gap-2">
            <div className="flex items-center gap-3">
                <input 
                    type="checkbox" 
                    checked={workDay.isWorkDay} 
                    readOnly
                    className="w-4 h-4 rounded border-slate-300 text-nexus-600 cursor-default"
                />
                <span className="text-sm font-medium text-slate-700 capitalize w-24">{dayName}</span>
            </div>
            <div className="flex-1 flex flex-wrap gap-2 sm:justify-end">
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <CalendarIcon className="text-nexus-600" size={20}/> Enterprise Calendars
                    </h3>
                    <p className="text-sm text-slate-500">Define global working hours, holidays, and exceptions.</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <select 
                        value={selectedCalendarId}
                        onChange={(e) => setSelectedCalendarId(e.target.value)}
                        className="bg-white border border-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-nexus-500 flex-1 md:flex-none"
                    >
                        {state.calendars.map(c => <option key={c.id} value={c.id}>{c.name} {c.isDefault ? '(Default)' : ''}</option>)}
                    </select>
                    <Button size="sm" variant="secondary" icon={Edit2} onClick={() => handleOpenPanel(selectedCalendar)} className="flex-1 md:flex-none">Configure</Button>
                    <Button size="sm" icon={Plus} onClick={() => handleOpenPanel()} className="flex-1 md:flex-none">New Calendar</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
                <Card className="flex flex-col h-full overflow-hidden min-h-[300px]">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <h4 className="font-bold text-slate-700 flex items-center gap-2 text-xs uppercase tracking-widest"><Clock size={16}/> Work Week Baseline</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 scrollbar-thin">
                        {days.map(day => renderWorkDay(day as string, selectedCalendar.workWeek[day]))}
                    </div>
                </Card>

                <Card className="flex flex-col h-full overflow-hidden min-h-[300px]">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <h4 className="font-bold text-slate-700 flex items-center gap-2 text-xs uppercase tracking-widest"><CalendarIcon size={16}/> Public Holidays</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-white sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {selectedCalendar.holidays.map((holiday, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm font-mono text-slate-600 whitespace-nowrap">{holiday.date}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-800">{holiday.name}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-[10px] px-2 py-1 rounded-full ${holiday.isRecurring ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {holiday.isRecurring ? 'Recurring' : 'One-time'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingCalendar?.id ? "Edit Calendar Parameters" : "Define New Calendar"}
                width="md:w-[500px]"
                footer={
                    <>
                        {editingCalendar?.id && (
                            <Button variant="danger" size="sm" icon={Trash2} className="mr-auto" onClick={() => handleDelete(editingCalendar.id!)}>Delete Calendar</Button>
                        )}
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} icon={Save}>Commit Definition</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-slate-500 mb-1 uppercase tracking-widest">Calendar Name</label>
                        <Input value={editingCalendar?.name} onChange={e => setEditingCalendar({...editingCalendar!, name: e.target.value})} placeholder="e.g. London Office Standard" />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Working Days</label>
                        <div className="grid grid-cols-2 gap-2">
                            {days.map(day => (
                                <label key={day} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${editingCalendar?.workWeek?.[day].isWorkDay ? 'bg-nexus-50 border-nexus-300 ring-1 ring-nexus-500/10' : 'bg-white border-slate-200'}`}>
                                    <span className="text-sm font-bold capitalize">{day}</span>
                                    <input 
                                        type="checkbox" 
                                        checked={editingCalendar?.workWeek?.[day].isWorkDay} 
                                        onChange={(e) => {
                                            const newWorkWeek = { ...editingCalendar!.workWeek! };
                                            newWorkWeek[day] = { ...newWorkWeek[day], isWorkDay: e.target.checked };
                                            setEditingCalendar({...editingCalendar!, workWeek: newWorkWeek});
                                        }}
                                        className="rounded text-nexus-600 focus:ring-nexus-500" 
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default CalendarEditor;
