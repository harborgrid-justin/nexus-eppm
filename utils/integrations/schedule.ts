
import { Task } from '../../types';

export const checkTaskStagnation = (task: Task): boolean => {
    // Mock logic: if task is in progress for a long time without progress change
    // Real implementation would check history logs
    return false;
};
