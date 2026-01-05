
import { Project, Task } from '../../types/index';

export interface ComparisonResult {
    addedTasks: Task[];
    deletedTasks: Task[];
    modifiedTasks: {
        id: string;
        name: string;
        changes: { field: string; oldValue: any; newValue: any }[];
    }[];
    varianceStats: {
        costVariance: number;
        durationVariance: number;
        addedCount: number;
        deletedCount: number;
        modifiedCount: number;
    }
}

export const compareProjects = (baseProject: Project, targetProject: Project): ComparisonResult => {
    const baseMap = new Map(baseProject.tasks.map(t => [t.id, t]));
    const targetMap = new Map(targetProject.tasks.map(t => [t.id, t]));

    const addedTasks: Task[] = [];
    const deletedTasks: Task[] = [];
    const modifiedTasks: any[] = [];
    let durationVariance = 0;

    // Detect Added & Modified
    targetProject.tasks.forEach((targetTask: Task) => {
        const baseTask = baseMap.get(targetTask.id);
        if (!baseTask) {
            addedTasks.push(targetTask);
        } else {
            const changes = [];
            // Check key fields
            if (targetTask.startDate !== baseTask.startDate) changes.push({ field: 'startDate', oldValue: baseTask.startDate, newValue: targetTask.startDate });
            if (targetTask.endDate !== baseTask.endDate) changes.push({ field: 'endDate', oldValue: baseTask.endDate, newValue: targetTask.endDate });
            if (targetTask.duration !== baseTask.duration) {
                changes.push({ field: 'duration', oldValue: baseTask.duration, newValue: targetTask.duration });
                durationVariance += (targetTask.duration - baseTask.duration);
            }
            if (targetTask.status !== baseTask.status) changes.push({ field: 'status', oldValue: baseTask.status, newValue: targetTask.status });
            
            // Deep Check Logic (Simplified for now)
            if (targetTask.dependencies.length !== baseTask.dependencies.length) {
                changes.push({ field: 'logic', oldValue: `${baseTask.dependencies.length} links`, newValue: `${targetTask.dependencies.length} links` });
            }

            if (changes.length > 0) {
                modifiedTasks.push({ id: targetTask.id, name: targetTask.name, changes });
            }
        }
    });

    // Detect Deleted
    baseProject.tasks.forEach((baseTask: Task) => {
        if (!targetMap.has(baseTask.id)) {
            deletedTasks.push(baseTask);
        }
    });

    return {
        addedTasks,
        deletedTasks,
        modifiedTasks,
        varianceStats: {
            costVariance: targetProject.budget - baseProject.budget,
            durationVariance,
            addedCount: addedTasks.length,
            deletedCount: deletedTasks.length,
            modifiedCount: modifiedTasks.length
        }
    };
};
