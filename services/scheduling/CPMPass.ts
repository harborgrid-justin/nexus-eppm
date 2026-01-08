
import { Task, ProjectCalendar } from '../../types/index';
import { addWorkingDays } from '../../utils/dateUtils';

export const calculateEarlyDates = (
    task: Task, 
    predecessors: Task[], 
    dataDate: Date, 
    calendar: ProjectCalendar
) => {
    let earlyStart = new Date(dataDate);
    
    // Honor Predecessor Logic
    predecessors.forEach(pred => {
        if (pred.earlyFinish) {
            const predFinish = new Date(pred.earlyFinish);
            const potential = addWorkingDays(predFinish, 1, calendar);
            if (potential > earlyStart) earlyStart = potential;
        }
    });

    // Honor Task Constraints (Must Start On)
    if (task.primaryConstraint?.type === 'Start On' && task.primaryConstraint.date) {
        const constraintDate = new Date(task.primaryConstraint.date);
        if (constraintDate > earlyStart) earlyStart = constraintDate;
    }

    const earlyFinish = addWorkingDays(earlyStart, Math.max(0, task.duration - 1), calendar);
    return { earlyStart, earlyFinish };
};

export const calculateLateDates = (
    task: Task, 
    successors: { task: Task; lag: number }[], 
    projectFinish: Date, 
    calendar: ProjectCalendar
) => {
    let lateFinish = new Date(projectFinish);
    
    if (successors.length > 0) {
        let minLateStart = new Date(8640000000000000); // Max Date
        successors.forEach(s => {
            if (s.task.lateStart) {
                const limit = addWorkingDays(new Date(s.task.lateStart), -(s.lag + 1), calendar);
                if (limit < minLateStart) minLateStart = limit;
            }
        });
        lateFinish = minLateStart;
    }

    // Honor Task Constraints (Must Finish On)
    if (task.primaryConstraint?.type === 'Finish On' && task.primaryConstraint.date) {
        const constraintDate = new Date(task.primaryConstraint.date);
        if (constraintDate < lateFinish) lateFinish = constraintDate;
    }

    const lateStart = addWorkingDays(lateFinish, -Math.max(0, task.duration - 1), calendar);
    return { lateStart, lateFinish };
};
