import { Task, TaskStatus } from '../../types/project';
import { addWorkingDays, getWorkingDaysDiff } from '../../utils/dateUtils';

const calendar = { workingDays: [1,2,3,4,5], holidays: [] };

export const calculateEarlyDates = (task: Task, predecessors: Task[], dataDate: Date) => {
    let earlyStart = new Date(dataDate);
    predecessors.forEach(pred => {
        const predFinish = new Date(pred.earlyFinish!);
        const potential = addWorkingDays(predFinish, 1, calendar);
        if (potential > earlyStart) earlyStart = potential;
    });
    const earlyFinish = addWorkingDays(earlyStart, Math.max(0, task.duration - 1), calendar);
    return { earlyStart, earlyFinish };
};

export const calculateLateDates = (task: Task, successors: {task: Task, lag: number}[], projectFinish: Date) => {
    let lateFinish = new Date(projectFinish);
    if (successors.length > 0) {
        let minLateStart = new Date(8640000000000000);
        successors.forEach(s => {
            const limit = addWorkingDays(new Date(s.task.lateStart!), -(s.lag + 1), calendar);
            if (limit < minLateStart) minLateStart = limit;
        });
        lateFinish = minLateStart;
    }
    const lateStart = addWorkingDays(lateFinish, -Math.max(0, task.duration - 1), calendar);
    return { lateStart, lateFinish };
};