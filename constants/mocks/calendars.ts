
import { GlobalCalendar, WorkDay } from '../../types';

const standardDay: WorkDay = {
  isWorkDay: true,
  intervals: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }],
  totalHours: 8
};

const nonWorkDay: WorkDay = {
  isWorkDay: false,
  intervals: [],
  totalHours: 0
};

export const MOCK_CALENDARS: GlobalCalendar[] = [
  {
    id: 'CAL-STD',
    name: 'Standard 5-Day Workweek',
    type: 'Global',
    isDefault: true,
    workWeek: {
      monday: standardDay,
      tuesday: standardDay,
      wednesday: standardDay,
      thursday: standardDay,
      friday: standardDay,
      saturday: nonWorkDay,
      sunday: nonWorkDay
    },
    holidays: [
      { date: '2024-01-01', name: "New Year's Day", isRecurring: true },
      { date: '2024-12-25', name: 'Christmas Day', isRecurring: true }
    ],
    exceptions: []
  },
  {
    id: 'CAL-247',
    name: '24/7 Operations',
    type: 'Global',
    isDefault: false,
    workWeek: {
      monday: { ...standardDay, totalHours: 24, intervals: [{ start: "00:00", end: "23:59" }] },
      tuesday: { ...standardDay, totalHours: 24, intervals: [{ start: "00:00", end: "23:59" }] },
      wednesday: { ...standardDay, totalHours: 24, intervals: [{ start: "00:00", end: "23:59" }] },
      thursday: { ...standardDay, totalHours: 24, intervals: [{ start: "00:00", end: "23:59" }] },
      friday: { ...standardDay, totalHours: 24, intervals: [{ start: "00:00", end: "23:59" }] },
      saturday: { ...standardDay, totalHours: 24, intervals: [{ start: "00:00", end: "23:59" }] },
      sunday: { ...standardDay, totalHours: 24, intervals: [{ start: "00:00", end: "23:59" }] },
    },
    holidays: [],
    exceptions: []
  }
];
