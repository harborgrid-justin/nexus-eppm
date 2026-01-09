
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { GlobalCalendar, WorkDay } from '../../types/index';
import { Calendar as CalendarIcon, Plus, Trash2, Save, Edit2 } from 'lucide-react';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';
import { EmptyGrid } from '../common/EmptyGrid';
import { WorkWeekEditor } from './calendar/WorkWeekEditor';
import { HolidayList } from './calendar/HolidayList';

const DEFAULT_WORK_DAY: WorkDay = { isWorkDay: true, intervals: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }], totalHours: 8 };
const DEFAULT_NON_WORK_DAY: WorkDay = { isWorkDay: false, intervals: [], totalHours: 0 };
const DEFAULT_WORK_WEEK = { monday: DEFAULT_WORK_DAY, tuesday: DEFAULT_WORK_DAY, wednesday: DEFAULT_WORK_DAY, thursday: DEFAULT_WORK_DAY, friday: DEFAULT_WORK_DAY, saturday: DEFAULT_NON_WORK_DAY, sunday: DEFAULT_NON_WORK_DAY };

const CalendarEditor: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const [selectedCalendarId, setSelectedCalendarId] = useState<string>('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingCalendar, setEditingCalendar] = useState<Partial<GlobalCalendar> | null>(null);

    useEffect(() => {
        if (state.calendars.length > 0 && !selectedCalendarId) {
            setSelectedCalendarId(state.calendars[0].id);
        } else if (state.calendars.length === 0) {
            setSelectedCalendarId('');
        }
    }, [state.calendars, selectedCalendarId]);

    const selectedCalendar = state.calendars.find(c => c.id === selectedCalendarId) || state.calendars[0];
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

    const handleOpenPanel = (cal?: GlobalCalendar) => {
        if (cal) {
            setEditingCalendar(JSON.parse(JSON.stringify(cal)));
        } else {
            setEditingCalendar({
                name: 'New Corporate Calendar',
                type: 'Global',
                isDefault: false,
                workWeek: JSON.parse(JSON.stringify(state.calendars[0]?.workWeek || DEFAULT_WORK_WEEK)),
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

        dispatch({ type: editingCalendar.id ? 'ADMIN_UPDATE_CALENDAR' : 'ADMIN_ADD_CALENDAR', payload: calToSave });
        setIsPanelOpen(false);
        if (!selectedCalendarId) setSelectedCalendarId(calToSave.id);
    };

    const handleDelete = (id: string) => {
        if (id === 'CAL-STD') { alert("Standard Calendar cannot be deleted."); return; }
        if (confirm("Delete this calendar?")) {
            dispatch({ type: 'ADMIN_DELETE_CALENDAR', payload: id });
            setSelectedCalendarId(state.calendars[0]?.id || '');
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center ${theme.colors.background} p-4 rounded-xl border ${theme.colors.border} shadow-sm gap-4`}>
                <div>
                    <h3 className={`text-lg font-bold ${theme.colors.text.primary} flex items-center gap-2`}><CalendarIcon className="text-nexus-600" size={20}/> Enterprise Calendars</h3>
                    <p className={`text-sm ${theme.colors.text.secondary}`}>Define global working hours, holidays, and exceptions.</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {state.calendars.length > 0 && (
                        <select value={selectedCalendarId} onChange={(e) => setSelectedCalendarId(e.target.value)} className={`${theme.colors.surface} border ${theme.colors.border} text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-nexus-500 flex-1 md:flex-none ${theme.colors.text.primary}`}>
                            {state.calendars.map(c => <option key={c.id} value={c.id}>{c.name} {c.isDefault ? '(Default)' : ''}</option>)}
                        </select>
                    )}
                    {selectedCalendar && <Button size="sm" variant="secondary" icon={Edit2} onClick={() => handleOpenPanel(selectedCalendar)} className="flex-1 md:flex-none">Configure</Button>}
                    <Button size="sm" icon={Plus} onClick={() => handleOpenPanel()} className="flex-1 md:flex-none">New Calendar</Button>
                </div>
            </div>

            {!selectedCalendar ? (
                <EmptyGrid title="No Calendars Defined" description="Initialize an enterprise calendar to manage working time." actionLabel="Create Calendar" onAdd={() => handleOpenPanel()} icon={CalendarIcon} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
                    <WorkWeekEditor workWeek={selectedCalendar.workWeek} setWorkWeek={()=>{}} />
                    <HolidayList holidays={selectedCalendar.holidays} />
                </div>
            )}

            <SidePanel
                isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} title={editingCalendar?.id ? "Edit Calendar Parameters" : "Define New Calendar"} width="md:w-[500px]"
                footer={<>
                        {editingCalendar?.id && <Button variant="danger" size="sm" icon={Trash2} className="mr-auto" onClick={() => handleDelete(editingCalendar.id!)}>Delete Calendar</Button>}
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} icon={Save}>Commit Definition</Button>
                </>}
            >
                <div className="space-y-6">
                    <div><label className={theme.typography.label + " block mb-1"}>Calendar Name</label><Input value={editingCalendar?.name} onChange={e => setEditingCalendar({...editingCalendar!, name: e.target.value})} placeholder="e.g. London Office Standard" /></div>
                    <div><label className={theme.typography.label + " block mb-2"}>Working Days</label><div className="grid grid-cols-2 gap-2">{days.map(day => (<label key={day} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${editingCalendar?.workWeek?.[day].isWorkDay ? 'bg-nexus-50 border-nexus-300 ring-1 ring-nexus-500/10' : `${theme.colors.surface} ${theme.colors.border}`}`}><span className="text-sm font-bold capitalize">{day}</span><input type="checkbox" checked={editingCalendar?.workWeek?.[day].isWorkDay} onChange={(e) => { const newWorkWeek = { ...editingCalendar!.workWeek! }; newWorkWeek[day] = { ...newWorkWeek[day], isWorkDay: e.target.checked }; setEditingCalendar({...editingCalendar!, workWeek: newWorkWeek}); }} className="rounded text-nexus-600 focus:ring-nexus-500" /></label>))}</div></div>
                </div>
            </SidePanel>
        </div>
    );
};

export default CalendarEditor;
