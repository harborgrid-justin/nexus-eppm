
import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { getDaysDiff } from '../utils/dateUtils';

export const useResourcePlanning = () => {
  const { state } = useData();

  const skillMatrix = useMemo(() => {
    const matrix: Record<string, number> = {};
    state.resources.forEach(r => {
        r.skills.forEach(skill => {
            matrix[skill] = (matrix[skill] || 0) + 1;
        });
    });
    return Object.entries(matrix).map(([skill, count]) => ({ skill, count }));
  }, [state.resources]);

  const utilizationTrend = useMemo(() => {
     // 1. Setup Time Horizon (Next 6 Months)
     const today = new Date();
     const months: { date: Date; name: string; util: number; capacity: number; demand: number }[] = [];
     
     for (let i = 0; i < 6; i++) {
         const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
         months.push({
             date: d,
             name: d.toLocaleString('default', { month: 'short' }),
             util: 0,
             capacity: 0,
             demand: 0
         });
     }

     // 2. Calculate Total Monthly Capacity
     // Assume 160h per resource per month (standard FTE)
     const activeResourcesCount = state.resources.filter(r => r.status === 'Active').length;
     const monthlyCapacity = activeResourcesCount * 160;

     months.forEach(m => m.capacity = monthlyCapacity);

     // 3. Calculate Demand from Active Tasks
     state.projects.forEach(project => {
        if (project.status === 'Closed' || project.status === 'Archived') return;

        project.tasks.forEach(task => {
            if (task.status === 'Completed' || !task.assignments?.length) return;

            const start = new Date(task.startDate);
            const end = new Date(task.endDate);
            const duration = Math.max(1, task.duration); // Avoid div by zero

            // Calculate total hours for this task
            // Effort = (Units/100) * Duration(days) * 8h/day
            // We assume assignments have units. If units missing, assume 100%.
            // Summing assignments on the task:
            const taskTotalHours = task.assignments.reduce((sum, a) => sum + ((a.units || 100) / 100) * duration * 8, 0);
            
            // Distribute hours across intersected months
            months.forEach(month => {
                const monthStart = new Date(month.date.getFullYear(), month.date.getMonth(), 1);
                const monthEnd = new Date(month.date.getFullYear(), month.date.getMonth() + 1, 0);

                const overlapStart = start > monthStart ? start : monthStart;
                const overlapEnd = end < monthEnd ? end : monthEnd;

                if (overlapStart <= overlapEnd) {
                    const daysOverlap = getDaysDiff(overlapStart, overlapEnd) + 1;
                    const monthHours = (daysOverlap / duration) * taskTotalHours;
                    month.demand += monthHours;
                }
            });
        });
     });

     // 4. Compute Utilization %
     return months.map(m => ({
         month: m.name,
         util: m.capacity > 0 ? Math.round((m.demand / m.capacity) * 100) : 0
     }));

  }, [state.resources, state.projects]);

  return { skillMatrix, utilizationTrend };
};
