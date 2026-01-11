import { Project, Task, WBSNode, TaskStatus } from '../types/index';

/**
 * Calculates physical percent complete for a WBS node by aggregating child tasks and sub-nodes.
 * Uses a weighted-duration algorithm to ensure accurate representation of project velocity.
 */
export const calculateWbsProgress = (node: WBSNode, tasks: Task[]): number => {
    const childTasks = tasks.filter(t => t.wbsCode.startsWith(node.wbsCode) && t.type !== 'Summary');
    const childNodes = node.children || [];

    if (childTasks.length === 0 && childNodes.length === 0) return 0;

    let totalWeight = 0;
    let completedWeight = 0;

    // Aggregate Tasks
    childTasks.forEach(t => {
        const weight = t.duration || 1;
        totalWeight += weight;
        completedWeight += (weight * (t.progress / 100));
    });

    // Recursively Aggregate Sub-nodes
    childNodes.forEach(cn => {
        // We calculate sub-node progress and weigh it by its own total task count or estimated duration
        // For simplicity in this engine, we use task counts as the weighting factor for sub-WBS levels
        const subProgress = calculateWbsProgress(cn, tasks);
        const subWeight = tasks.filter(t => t.wbsCode.startsWith(cn.wbsCode)).length || 1;
        totalWeight += subWeight;
        completedWeight += (subWeight * (subProgress / 100));
    });

    return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
};

/**
 * Global Project Progress Rollup
 */
export const calculateProjectProgress = (project: Project): number => {
    if (!project || !project.tasks || project.tasks.length === 0) return 0;
    
    // P6 Methodology: If WBS exists, roll up from root nodes
    if (project.wbs && project.wbs.length > 0) {
        let total = 0;
        project.wbs.forEach(rootNode => {
            total += calculateWbsProgress(rootNode, project.tasks);
        });
        return Math.round(total / project.wbs.length);
    }

    // Fallback: Simple weighted task average
    const totalWeightedDuration = project.tasks.reduce((acc, t) => acc + (t.duration || 1), 0);
    const completedWeightedDuration = project.tasks.reduce((acc, t) => acc + ((t.duration || 1) * (t.progress / 100)), 0);
    
    return totalWeightedDuration > 0 ? Math.round((completedWeightedDuration / totalWeightedDuration) * 100) : 0;
};

/**
 * Aggregates actual costs from the bottom-up
 */
export const calculateWbsActualCost = (node: WBSNode, tasks: Task[], expenses: any[]): number => {
    const taskIds = new Set(tasks.filter(t => t.wbsCode.startsWith(node.wbsCode)).map(t => t.id));
    const relevantExpenses = expenses.filter(e => taskIds.has(e.activityId));
    
    return relevantExpenses.reduce((sum, e) => sum + (e.actualCost || 0), 0);
};
