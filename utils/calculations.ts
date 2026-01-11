import { Project, Task, WBSNode, TaskStatus } from '../types/index';

// Performance Cache for Tree Operations
const ROLLUP_CACHE = new Map<string, number>();

/**
 * Calculates physical percent complete for a WBS node by aggregating child tasks and sub-nodes.
 * Uses a weighted-duration algorithm for production-grade schedule velocity.
 */
export const calculateWbsProgress = (node: WBSNode, tasks: Task[]): number => {
    const cacheKey = `progress_${node.id}_${tasks.length}`;
    if (ROLLUP_CACHE.has(cacheKey)) return ROLLUP_CACHE.get(cacheKey)!;

    const childTasks = tasks.filter(t => t.wbsCode.startsWith(node.wbsCode) && t.type !== 'Summary');
    const childNodes = node.children || [];

    if (childTasks.length === 0 && childNodes.length === 0) return 0;

    let totalWeight = 0;
    let completedWeight = 0;

    childTasks.forEach(t => {
        const weight = t.duration || 1;
        totalWeight += weight;
        completedWeight += (weight * (t.progress / 100));
    });

    childNodes.forEach(cn => {
        const subProgress = calculateWbsProgress(cn, tasks);
        const subWeight = tasks.filter(t => t.wbsCode.startsWith(cn.wbsCode)).length || 1;
        totalWeight += subWeight;
        completedWeight += (subWeight * (subProgress / 100));
    });

    const result = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
    ROLLUP_CACHE.set(cacheKey, result);
    return result;
};

/**
 * Global Project Progress Rollup - Clears cache on first call per cycle
 */
export const calculateProjectProgress = (project: Project): number => {
    if (!project || !project.tasks || project.tasks.length === 0) return 0;
    
    // Clear cache for fresh calculation cycle
    if (ROLLUP_CACHE.size > 1000) ROLLUP_CACHE.clear();

    if (project.wbs && project.wbs.length > 0) {
        let total = 0;
        project.wbs.forEach(rootNode => {
            total += calculateWbsProgress(rootNode, project.tasks);
        });
        return Math.round(total / project.wbs.length);
    }

    const totalWeight = project.tasks.reduce((acc, t) => acc + (t.duration || 1), 0);
    const completedWeight = project.tasks.reduce((acc, t) => acc + ((t.duration || 1) * (t.progress / 100)), 0);
    
    return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
};

export const calculateWbsActualCost = (node: WBSNode, tasks: Task[], expenses: any[]): number => {
    const taskIds = new Set(tasks.filter(t => t.wbsCode.startsWith(node.wbsCode)).map(t => t.id));
    return expenses.filter(e => taskIds.has(e.activityId)).reduce((sum, e) => sum + (e.actualCost || 0), 0);
};