import { ProjectCalendar } from '../types';

const isWeekend = (date: Date, calendar: ProjectCalendar): boolean => {
  return !calendar.workingDays.includes(date.getDay());
};

const isHoliday = (date: Date, calendar: ProjectCalendar): boolean => {
  return calendar.holidays.includes(toISODateString(date));
};

export const addWorkingDays = (startDate: Date, duration: number, calendar: ProjectCalendar): Date => {
  let currentDate = new Date(startDate);
  let daysAdded = 0;
  while (daysAdded < duration) {
    currentDate.setDate(currentDate.getDate() + 1);
    if (!isWeekend(currentDate, calendar) && !isHoliday(currentDate, calendar)) {
      daysAdded++;
    }
  }
  return currentDate;
};

export const getWorkingDaysDiff = (start: string | Date, end: string | Date, calendar: ProjectCalendar): number => {
  let startDate = new Date(start);
  let endDate = new Date(end);
  let days = 0;
  
  if (startDate > endDate) return 0;

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
  startDate.setUTCHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setUTCHours(0, 0, 0, 0);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return 0;
  }
  
  return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
};

export const toISODateString = (date: Date): string => {
  if (isNaN(date.getTime())) {
    return '';
  }
  return date.toISOString().split('T')[0];
};

export const maxDate = (date1: Date, date2: Date): Date => {
  return date1 > date2 ? date1 : date2;
};

export const minDate = (date1: Date, date2: Date): Date => {
  return date1 < date2 ? date1 : date2;
};