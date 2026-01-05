



// FIX: Corrected import path to use the barrel file to resolve module ambiguity.
import { Project, TaskStatus } from '../types/index';
import { getDaysDiff } from './dateUtils';

export const calculateProjectProgress = (project: Project): number => {
    if (!project || !project.tasks || project.tasks.length === 0) return 0;
    
    const totalWeightedDuration = project.tasks.reduce((acc, t) => acc + (t.duration * (t.work || 1)), 0);
    if (totalWeightedDuration === 0) {
        // Fallback for projects with only milestones
        const totalTasks = project.tasks.length;
        const completedTasks = project.tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
        return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    }
    
    const completedWeightedDuration = project.tasks.reduce((acc, t) => acc + (t.duration * (t.work || 1) * (t.progress / 100)), 0);
    return Math.round((completedWeightedDuration / totalWeightedDuration) * 100);
};

export { getDaysDiff } from './dateUtils';