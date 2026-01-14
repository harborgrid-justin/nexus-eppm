import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { GlobalCalendar } from '../../types/index';
import { Calendar as CalendarIcon, Plus, Save, Edit2 } from 'lucide-react';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { EmptyGrid } from '../common/EmptyGrid';
import { WorkWeekEditor } from './calendar/WorkWeekEditor';
import { HolidayList } from './calendar/HolidayList';

export const CalendarEditor: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const { t } = useI18n();
    const [selectedCalendarId, setSelectedCalendarId] = useState<string>(state.calendars[0]?.id || '');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingCalendar, setEditingCalendar] = useState<Partial<GlobalCalendar> | null>(null);

    const selectedCalendar = state.calendars.find(c => c.id === selectedCalendarId);

    const handleSave = () => {
        if (!editingCalendar?.name) return;
        const payload = { ...editingCalendar, id: editingCalendar.id || generateId('CAL') } as GlobalCalendar;
        dispatch({ type: editingCalendar.id ? 'ADMIN_UPDATE_CALENDAR' : 'ADMIN_ADD_CALENDAR', payload });
        setIsPanelOpen(false);
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className={`p-4 rounded-xl border ${theme.colors.border} bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm`}>
                <div>
                    <h3 className={`text-lg font-bold ${theme.colors.text.primary} flex items-center gap-2`}><CalendarIcon className="text-nexus-600" /> {t('cal.title', 'Enterprise Calendars')}</h3>
                    <p className={`text-sm ${theme.colors.text.secondary}`}>{t('cal.subtitle', 'Define global working hours and holidays.')}</p>
                </div>
                <div className="flex gap-2">
                    {state.calendars.length > 0 && (
                        <select value={selectedCalendarId} onChange={(e) => setSelectedCalendarId(e.target.value)} className={`text-sm border ${theme.colors.border} rounded-lg px-3 py-2 bg-white outline-none`}>
                            {state.calendars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    )}
                    <Button size="sm" icon={Plus} onClick={() => { setEditingCalendar(null); setIsPanelOpen(true); }}>{t('cal.new', 'New Calendar')}</Button>
                </div>
            </div>

            {selectedCalendar ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                    <WorkWeekEditor workWeek={selectedCalendar.workWeek} setWorkWeek={() => {}} />
                    <HolidayList holidays={selectedCalendar.holidays} />
                </div>
            ) : (
                <EmptyGrid title={t('cal.empty', 'No Calendars Found')} description={t('cal.empty_desc', 'Initialize an organizational calendar.')} icon={CalendarIcon} onAdd={() => setIsPanelOpen(true)} />
            )}

            <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} title={t('cal.config', 'Configure Calendar')} footer={<><Button variant="secondary" onClick={() => setIsPanelOpen(false)}>{t('common.cancel', 'Cancel')}</Button><Button onClick={handleSave} icon={Save}>{t('common.save', 'Save')}</Button></>}>
                <div className="space-y-4">
                    <Input label={t('common.name', 'Name')} value={editingCalendar?.name} onChange={e => setEditingCalendar({...editingCalendar!, name: e.target.value})} />
                </div>
            </SidePanel>
        </div>
    );
};
export default CalendarEditor;