
import { useMemo } from 'react';
import { Project, GlobalCalendar, WorkDay } from '../../types/index';

export const useGanttCalendar = (project: Project, calendars: GlobalCalendar[]) => {
  return useMemo(() => {
    const globalCal = calendars.find(c => c.id === project.calendarId) || calendars[0];
    if (!globalCal || !globalCal.workWeek) {
      return { id: 'default', name: 'Standard', workingDays: [1, 2, 3, 4, 5], holidays: [] };
    }
    const workingDays: number[] = [];
    const dayMap: Record<string, number> = { 'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6 };
    Object.entries(globalCal.workWeek).forEach(([dayName, workDay]) => {
      if ((workDay as WorkDay).isWorkDay) {
        const dayIdx = dayMap[dayName.toLowerCase()];
        if (dayIdx !== undefined) workingDays.push(dayIdx);
      }
    });
    return {
      id: globalCal.id,
      name: globalCal.name,
      workingDays,
      holidays: globalCal.holidays ? globalCal.holidays.map(h => h.date) : []
    };
  }, [project.calendarId, calendars]);
};
