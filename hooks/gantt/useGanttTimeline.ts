
import { useMemo } from 'react';
import { Project } from '../../types';
import { getDaysDiff } from '../../utils/dateUtils';

export const DAY_WIDTH = 50;

export const useGanttTimeline = (
  project: Project,
  viewMode: 'day' | 'week' | 'month',
  dayWidth: number
) => {
  const projectStart = useMemo(() => {
    if (!project.tasks.length) return new Date();
    const starts = project.tasks.map(t => new Date(t.startDate).getTime()).filter(t => !isNaN(t));
    if (starts.length === 0) return new Date();
    return new Date(Math.min(...starts));
  }, [project.tasks]);

  const projectEnd = useMemo(() => {
    if (!project.tasks.length) return new Date();
    const ends = project.tasks.map(t => new Date(t.endDate).getTime()).filter(t => !isNaN(t));
    if (ends.length === 0) return new Date();
    return new Date(Math.max(...ends));
  }, [project.tasks]);

  // Add buffer to end
  const displayEnd = useMemo(() => {
      const d = new Date(projectEnd);
      d.setDate(d.getDate() + 30); 
      return d;
  }, [projectEnd]);

  const timelineHeaders = useMemo(() => {
    const totalDays = getDaysDiff(projectStart, displayEnd);
    const months = new Map<string, { start: number, width: number }>();
    const days: { date: Date; isWorking: boolean }[] = [];

    let currentMonth = -1;
    let monthStartLeft = 0;

    for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(projectStart);
        currentDate.setDate(currentDate.getDate() + i);
        
        // Month grouping
        if (currentDate.getMonth() !== currentMonth) {
            if (currentMonth !== -1) {
                const key = new Date(projectStart.getFullYear(), currentMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
                months.set(key, { start: monthStartLeft, width: (i * dayWidth) - monthStartLeft });
            }
            currentMonth = currentDate.getMonth();
            monthStartLeft = i * dayWidth;
        }

        // Days
        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
        days.push({
            date: currentDate,
            isWorking: !isWeekend
        });
    }
    
    // Add last month
    if (currentMonth !== -1) {
        const key = new Date(projectStart.getFullYear(), currentMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
        months.set(key, { start: monthStartLeft, width: (totalDays * dayWidth) - monthStartLeft });
    }

    return { months, days };
  }, [projectStart, displayEnd, dayWidth]);

  return {
      projectStart,
      projectEnd: displayEnd,
      timelineHeaders
  };
};
