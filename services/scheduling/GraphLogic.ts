
import { Task } from '../../types/project';

export const topologicalSort = (tasks: Task[]): Task[] => {
    const inDegree = new Map<string, number>();
    const graph = new Map<string, string[]>();
    
    tasks.forEach(t => { inDegree.set(t.id, 0); graph.set(t.id, []); });
    tasks.forEach(t => {
        t.dependencies.forEach(dep => {
            if (graph.has(dep.targetId)) {
                graph.get(dep.targetId)?.push(t.id);
                inDegree.set(t.id, (inDegree.get(t.id) || 0) + 1);
            }
        });
    });

    const queue: string[] = [];
    inDegree.forEach((count, id) => { if (count === 0) queue.push(id); });

    const sorted: Task[] = [];
    const taskMap = new Map(tasks.map(t => [t.id, t]));

    while (queue.length > 0) {
        const currentId = queue.shift()!;
        const task = taskMap.get(currentId);
        if (task) sorted.push(task);
        (graph.get(currentId) || []).forEach(neighborId => {
            inDegree.set(neighborId, (inDegree.get(neighborId) || 0) - 1);
            if (inDegree.get(neighborId) === 0) queue.push(neighborId);
        });
    }

    if (sorted.length !== tasks.length) throw new Error("Cycle detected in schedule.");
    return sorted;
};
