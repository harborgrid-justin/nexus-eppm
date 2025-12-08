import { Project, TaskStatus } from '../types';

export const calculateProjectProgress = (project: Project): number => {
    if (!project || !project.tasks || project.tasks.length === 0) return 0;
    
    const totalDuration = project.tasks.reduce((acc, t) => acc + t.duration, 0);
    if (totalDuration === 0) return 0;
    
    const completedDuration = project.tasks.reduce((acc, t) => acc + (t.duration * (t.progress / 100)), 0);
    return Math.round((completedDuration / totalDuration) * 100);
};