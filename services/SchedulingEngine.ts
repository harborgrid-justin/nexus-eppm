
import { Project, Task, TaskStatus, ProjectCalendar } from '../types/index';
import { getWorkingDaysDiff, addWorkingDays } from '../utils/dateUtils';

export interface ScheduleResult {
    tasks: Task[];
    success: boolean;
    log: string;
    stats: {
        criticalTasksCount: number;
        criticalPathLength: number;
        openEnds: number;
    };
}

export class SchedulingEngine {
    /**
     * Enterprise CPM Scheduler
     * Performs Forward and Backward pass calculations to determine Early/Late dates and Total Float.
     */
    public async schedule(project: Project, options: { 
        dataDate: Date; 
        calendar?: ProjectCalendar;
        useRetainedLogic?: boolean;
        honorConstraints?: boolean;
    }): Promise<ScheduleResult> {
        const logLines: string[] = [];
        const startTime = performance.now();

        if (!project.tasks || project.tasks.length === 0) {
            return { 
                success: true, 
                log: "No activities to schedule.", 
                tasks: [],
                stats: { criticalTasksCount: 0, criticalPathLength: 0, openEnds: 0 }
            };
        }

        // Deep clone to avoid mutation during calculation
        const tasks = JSON.parse(JSON.stringify(project.tasks)) as Task[];
        const taskMap = new Map(tasks.map(t => [t.id, t]));
        
        // 1. Build Graph & Topological Sort
        const inDegree = new Map<string, number>();
        const successorsMap = new Map<string, string[]>();
        
        tasks.forEach(t => { 
            inDegree.set(t.id, 0); 
            successorsMap.set(t.id, []); 
        });

        tasks.forEach(t => {
            t.dependencies.forEach(dep => {
                if (taskMap.has(dep.targetId)) {
                    successorsMap.get(dep.targetId)?.push(t.id);
                    inDegree.set(t.id, (inDegree.get(t.id) || 0) + 1);
                }
            });
        });

        const queue: string[] = [];
        inDegree.forEach((count, id) => { if (count === 0) queue.push(id); });

        const sortedIds: string[] = [];
        while (queue.length > 0) {
            const u = queue.shift()!;
            sortedIds.push(u);
            const succs = successorsMap.get(u) || [];
            succs.forEach(v => {
                inDegree.set(v, (inDegree.get(v) || 0) - 1);
                if (inDegree.get(v) === 0) queue.push(v);
            });
        }

        if (sortedIds.length !== tasks.length) {
            return { 
                success: false, 
                log: "Cycle detected in schedule network logic. Calculation aborted. Check logic loops.", 
                tasks: [],
                stats: { criticalTasksCount: 0, criticalPathLength: 0, openEnds: 0 }
            }; 
        }

        // Use provided calendar or fallback
        const calendar = options.calendar || { 
            id: 'default', 
            name: 'Standard', 
            workingDays: [1,2,3,4,5], 
            holidays: [] 
        };

        // --- 2. Forward Pass (Early Dates) ---
        logLines.push("Starting Forward Pass...");
        
        sortedIds.forEach(taskId => {
            const t = taskMap.get(taskId)!;
            
            // Initial Start is Data Date or constrained start
            let earlyStart = new Date(options.dataDate);

            // Predecessor Logic
            t.dependencies.forEach(dep => {
                const pred = taskMap.get(dep.targetId);
                if (pred && pred.earlyFinish) {
                    // Logic: FS + Lag
                    // For now assuming FS for all to simplify demo code, P6 handles SS/FF/SF
                    const predFinish = new Date(pred.earlyFinish);
                    const potentialStart = addWorkingDays(predFinish, dep.lag + (dep.type === 'FS' ? 1 : 0), calendar);
                    if (potentialStart > earlyStart) earlyStart = potentialStart;
                }
            });

            // Constraint Logic
            if (options.honorConstraints && t.primaryConstraint?.date) {
                const constraintDate = new Date(t.primaryConstraint.date);
                if (t.primaryConstraint.type === 'Start On' && constraintDate > earlyStart) {
                    earlyStart = constraintDate;
                }
            }

            t.earlyStart = earlyStart;
            t.earlyFinish = addWorkingDays(earlyStart, Math.max(0, t.duration - 1), calendar);
            
            // Sync UI dates
            t.startDate = t.earlyStart.toISOString().split('T')[0];
            t.endDate = t.earlyFinish.toISOString().split('T')[0];
        });

        // Calculate Project Finish Date
        const projectFinish = new Date(Math.max(...tasks.map(t => t.earlyFinish!.getTime())));
        logLines.push(`Forward Pass Complete. Project Finish: ${projectFinish.toISOString().split('T')[0]}`);

        // --- 3. Backward Pass (Late Dates & Float) ---
        logLines.push("Starting Backward Pass...");
        
        // Reverse topological order
        [...sortedIds].reverse().forEach(taskId => {
            const t = taskMap.get(taskId)!;
            
            let lateFinish = new Date(projectFinish);
            
            const succs = successorsMap.get(taskId) || [];
            if (succs.length > 0) {
                let minLateStart = new Date(8640000000000000); // Max Date
                
                succs.forEach(succId => {
                    const succ = taskMap.get(succId)!;
                    // Find dependency linking succ to t
                    const dep = succ.dependencies.find(d => d.targetId === t.id);
                    if (dep && succ.lateStart) {
                        // Reverse Logic: LateFinish = Succ.LateStart - Lag - 1
                        const limit = addWorkingDays(new Date(succ.lateStart), -(dep.lag + 1), calendar);
                        if (limit < minLateStart) minLateStart = limit;
                    }
                });
                if (minLateStart.getTime() !== 8640000000000000) lateFinish = minLateStart;
            }

            t.lateFinish = lateFinish;
            t.lateStart = addWorkingDays(lateFinish, -(Math.max(0, t.duration - 1)), calendar);
            
            // Calculate Float
            // Total Float = Late Start - Early Start
            const float = getWorkingDaysDiff(t.earlyStart!, t.lateStart!, calendar);
            t.totalFloat = float;
            t.critical = float <= 0;
            
            // Free Float (Simple FS calc)
            // FF = Min(Succ.EarlyStart) - EarlyFinish - 1
            if (succs.length > 0) {
                 let minSuccEarlyStart = new Date(8640000000000000);
                 succs.forEach(succId => {
                     const succ = taskMap.get(succId)!;
                     if (succ.earlyStart && succ.earlyStart < minSuccEarlyStart) minSuccEarlyStart = succ.earlyStart;
                 });
                 t.freeFloat = Math.max(0, getWorkingDaysDiff(t.earlyFinish!, minSuccEarlyStart, calendar) - 1);
            } else {
                t.freeFloat = 0;
            }
        });

        const criticalTasks = tasks.filter(t => t.critical);
        const duration = Math.ceil(getWorkingDaysDiff(options.dataDate, projectFinish, calendar));
        const endTime = performance.now();
        
        logLines.push(`Calculation completed in ${(endTime - startTime).toFixed(2)}ms`);
        logLines.push(`Critical Activities: ${criticalTasks.length}`);

        return { 
            tasks, 
            success: true, 
            log: logLines.join('\n'),
            stats: { 
                criticalTasksCount: criticalTasks.length,
                criticalPathLength: duration,
                openEnds: tasks.filter(t => t.dependencies.length === 0).length
            } 
        };
    }
}
export const Scheduler = new SchedulingEngine();
