export interface GlobalCalendar {
  id: string;
  name: string;
  type: 'Global' | 'Project' | 'Resource';
  isDefault: boolean;
  workWeek: WorkWeek;
  holidays: Holiday[];
  exceptions: CalendarException[];
}

export interface WorkWeek {
  monday: WorkDay;
  tuesday: WorkDay;
  wednesday: WorkDay;
  thursday: WorkDay;
  friday: WorkDay;
  saturday: WorkDay;
  sunday: WorkDay;
}

export interface WorkDay {
  isWorkDay: boolean;
  intervals: { start: string; end: string }[]; // e.g., "08:00", "17:00"
  totalHours: number;
}

export interface Holiday {
  date: string; // ISO YYYY-MM-DD
  name: string;
  isRecurring: boolean;
}

export interface CalendarException {
  date: string;
  isWorkDay: boolean;
  intervals?: { start: string; end: string }[];
}

export interface ProjectCalendar {
  id: string;
  name: string;
  workingDays: number[];
  holidays: string[];
}