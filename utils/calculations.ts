
import { Project, Task, WBSNode, TaskStatus, ActivityStep } from '../types/index';

/**
 * Calculates physical progress for a task based on its steps.
 * In P6, Physical % is manually entered or driven by step completion.
 */
export const calculateTaskPhysicalProgress = (task: Task): number => {
    if (!task.steps || task.steps.length === 0) return task.progress;
    
    const totalWeight = task.steps.reduce((sum, s) => sum + s.weight, 0);
    if (totalWeight === 0) return 0;
    
    const completedWeight = task.steps
        .filter(s => s.completed)
        .reduce((sum, s) => sum + s.weight, 0);
        
    return Math.round((completedWeight / totalWeight) * 100);
};

/**
 * Calculates physical percent complete for a WBS node by aggregating child tasks and sub-nodes.
 * Uses a weighted-budget algorithm for financial alignment.
 */
export const calculateWbsProgress = (node: WBSNode, tasks: Task[]): number => {
    const childTasks = tasks.filter(t => t.wbsCode.startsWith(node.wbsCode) && t.type !== 'Summary');
    
    if (childTasks.length === 0) return 0;

    let totalWeight = 0;
    let completedWeight = 0;

    childTasks.forEach(t => {
        // Weight by duration as a proxy for effort if cost loading isn't present
        const weight = t.duration || 1;
        const progress = t.steps && t.steps.length > 0 ? calculateTaskPhysicalProgress(t) : t.progress;
        
        totalWeight += weight;
        completedWeight += (weight * (progress / 100));
    });

    return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
};

/**
 * Global Project Progress Rollup 
 */
export const calculateProjectProgress = (project: Project): number => {
    if (!project || !project.tasks || project.tasks.length === 0) return 0;
    
    // P6 Logic: Summary nodes are driven by their children
    const rootTasks = project.tasks.filter(t => !t.wbsCode.includes('.'));
    
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
