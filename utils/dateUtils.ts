
interface Calendar {
    workingDays: number[]; // 0-6 (Sun-Sat)
    holidays: string[]; // ISO Strings
}

const isWeekend = (date: Date, calendar: Calendar): boolean => {
  return !calendar.workingDays.includes(date.getDay());
};

const isHoliday = (date: Date, calendar: Calendar): boolean => {
  return calendar.holidays.includes(toISODateString(date));
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
  let days = 0;
  
  if (startDate > endDate) return 0; // Or negative logic

  while (startDate < endDate) {
    if (!isWeekend(startDate, calendar) && !isHoliday(startDate, calendar)) {
      days++;
    }
    startDate.setDate(startDate.getDate() + 1);
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

export const maxDate = (date1: Date, date2: Date): Date => {
  return date1 > date2 ? date1 : date2;
};

export const minDate = (date1: Date, date2: Date): Date => {
  return date1 < date2 ? date1 : date2;
};
