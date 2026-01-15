
interface Calendar {
    workingDays: number[]; // 0-6 (Sun-Sat)
    holidays: string[]; // ISO Strings
}

const isWeekend = (date: Date, calendar: Calendar): boolean => {
  return !calendar.workingDays.includes(date.getDay());
};

const isHoliday = (date: Date, calendar: Calendar): boolean => {
  return calendar.holidays.includes(date.toISOString().split('T')[0]);
};

export const addWorkingDays = (startDate: Date, duration: number, calendar: Calendar): Date => {
  let currentDate = new Date(startDate);
  let daysAdded = 0;
  
  // Handle negative duration (backward pass)
  const direction = duration >= 0 ? 1 : -1;
  const absDuration = Math.abs(duration);

  while (daysAdded < absDuration) {
    currentDate.setDate(currentDate.getDate() + direction);
    if (!isWeekend(currentDate, calendar) && !isHoliday(currentDate, calendar)) {
      daysAdded++;
    }
  }
  return currentDate;
};

export const getWorkingDaysDiff = (start: string | Date, end: string | Date, calendar: Calendar): number => {
  let startDate = new Date(start);
  let endDate = new Date(end);
  
  // Normalize to start of day
  startDate.setHours(0,0,0,0);
  endDate.setHours(0,0,0,0);

  if (startDate > endDate) return 0; // Simple handling, could extend for negative

  let days = 0;
  let curr = new Date(startDate);

  while (curr < endDate) {
    curr.setDate(curr.getDate() + 1);
    if (!isWeekend(curr, calendar) && !isHoliday(curr, calendar)) {
      days++;
    }
  }
  return days;
};

export const getDaysDiff = (start: string | Date, end: string | Date): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
};

export const toISODateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const maxDate = (dates: Date[]): Date => {
  if (dates.length === 0) return new Date();
  return new Date(Math.max(...dates.map(d => d.getTime())));
};

export const minDate = (dates: Date[]): Date => {
  if (dates.length === 0) return new Date();
  return new Date(Math.min(...dates.map(d => d.getTime())));
};
