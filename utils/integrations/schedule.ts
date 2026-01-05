
import { Task, TaskStatus } from '../../types';
import { getDaysDiff } from '../dateUtils';

export const checkTaskStagnation = (task: Task): boolean => {
    if (task.status !== TaskStatus.IN_PROGRESS || task.progress === 100) {
        return false;
    }

    const today = new Date();
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);
    
    if (today < startDate) return false;

    const totalDuration = getDaysDiff(startDate, endDate);
    if (totalDuration <= 0) return false;

    const elapsedDuration = getDaysDiff(startDate, today);
    const expectedProgress = Math.min(100, (elapsedDuration / totalDuration) * 100);

    // A task is stagnant if its actual progress is less than half of what's expected,
    // and it has been in progress for a meaningful duration (e.g., > 10% of its timespan).
    const isStagnant = task.progress < (expectedProgress / 2) && expectedProgress > 10;
    
    return isStagnant;
};
