
import { Project, Task, WBSNode, TaskStatus } from '../types/index';

export const calculateTaskPhysicalProgress = (task: Task): number => {
    if (!task.steps || task.steps.length === 0) return task.progress;
    const totalWeight = task.steps.reduce((sum, s) => sum + s.weight, 0);
    if (totalWeight === 0) return 0;
    const completedWeight = task.steps.filter(s => s.completed).reduce((sum, s) => sum + s.weight, 0);
    return Math.round((completedWeight / totalWeight) * 100);
};

export const calculateProjectProgress = (project: Project): number => {
    if (!project || !project.tasks || project.tasks.length === 0) return 0;
    let totalWeight = 0;
    let completedWeight = 0;
    project.tasks.forEach(t => {
        if (t.type === 'Summary') return;
        const weight = t.duration || 1;
        const progress = t.steps && t.steps.length > 0 ? calculateTaskPhysicalProgress(t) : t.progress;
        totalWeight += weight;
        completedWeight += (weight * (progress / 100));
    });
    return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
};
