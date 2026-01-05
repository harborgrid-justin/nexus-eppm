import { Project, Task, Dependency, TaskStatus, ProjectCalendar } from '../types/index';
import { addWorkingDays, getWorkingDaysDiff, maxDate, minDate, toISODateString } from '../utils/dateUtils';

export interface ScheduleOptions {
    dataDate: Date;
    useRetainedLogic: boolean;
    honorConstraints: boolean;
}

export interface ScheduleResult {
    tasks: Task[];
    log: string;
    stats: {
        criticalPathLength: number;
        criticalTasksCount: number;
        openEnds: number;
    };
    success: boolean;
}

export class SchedulingEngine {
    private logBuffer: string[] = [];

    private log(message: string) {
        this.logBuffer.push(`[${new Date().toLocaleTimeString()}] ${message}`);
    }

    public async schedule(project: Project, options: ScheduleOptions): Promise<ScheduleResult> {
        this.logBuffer = [];
        this.log(`*** STARTING SCHEDULE CALCULATION ***`);
        this.log(`Project: ${project.name} (${project.code})`);
        this.log(`Data Date: ${options.dataDate.toDateString()}`);
        this.log(`Logic Mode: ${options.useRetainedLogic ? 'Retained Logic' : 'Progress Override'}`);

        // Simulate calculation time
        await new Promise(resolve => setTimeout(resolve, 600));

        const tasks = JSON.parse(JSON.stringify(project.tasks)) as Task[];
        const taskMap = new Map<string, Task>();
        tasks.forEach(t => taskMap.set(t.id, t));

        // 1. Validation & Initialization
        let openEnds = 0;
        tasks.forEach(t => {
            // Reset calculated dates
            t.earlyStart = undefined;
            t.earlyFinish = undefined;
            t.lateStart = undefined;
            t.lateFinish = undefined;
            t.totalFloat = 0;
            t.critical = false;

            // Note: In a real engine, Actual dates would be preserved if Status is Started/Completed
            
            if (t.dependencies.length === 0 && t.type !== 'Summary') {
                if (t.id !== tasks[0]?.id) openEnds++; 
            }
        });

        this.log(`Validation: Found ${openEnds} activities with open starts.`);

        // 2. Topological Sort (Kahn's Algorithm)
        let sortedTasks: Task[];
        try {
            sortedTasks = this.topologicalSort(tasks);
        } catch (e) {
            this.log(`CRITICAL ERROR: Circular dependency detected in network logic.`);
            return {
                tasks: [],
                log: this.logBuffer.join('\n'),
                stats: { criticalPathLength: 0, criticalTasksCount: 0, openEnds },
                success: false
            };
        }

        // 3. Forward Pass (Early Dates)
        for (const task of sortedTasks) {
            if (task.status === TaskStatus.COMPLETED) {
                // If completed, stick to actuals (simplified here to existing dates)
                // In full engine, we'd use actualStart/actualFinish fields
                continue;
            }

            let earlyStart = new Date(options.dataDate);
            
            // If task has no predecessors, it starts at DataDate or Project Start
            if (task.dependencies.length === 0) {
                 earlyStart = new Date(options.dataDate); // Or Project Start
            }

            // Check Predecessors
            for (const dep of task.dependencies) {
                const pred = taskMap.get(dep.targetId);
                if (!pred) continue;

                const predStart = pred.earlyStart ? new Date(pred.earlyStart) : new Date(options.dataDate);
                const predFinish = pred.earlyFinish ? new Date(pred.earlyFinish) : new Date(options.dataDate);
                let constraintDate = new Date(options.dataDate);

                // PDM Relationships
                switch (dep.type) {
                    case 'FS': // Finish to Start
                        constraintDate = addWorkingDays(predFinish, dep.lag + 1, { workingDays: [1,2,3,4,5], holidays: [] });
                        break;
                    case 'SS': // Start to Start
                        constraintDate = addWorkingDays(predStart, dep.lag, { workingDays: [1,2,3,4,5], holidays: [] });
                        break;
                    case 'FF': // Finish to Finish
                         constraintDate = addWorkingDays(predFinish, dep.lag, { workingDays: [1,2,3,4,5], holidays: [] }); 
                         // Note: FF constraints affect Finish, which back-calcs Start. Simplified here.
                         break;
                    case 'SF': // Start to Finish
                         constraintDate = addWorkingDays(predStart, dep.lag, { workingDays: [1,2,3,4,5], holidays: [] });
                         break;
                }
                
                if (constraintDate > earlyStart) {
                    earlyStart = constraintDate;
                }
            }
            
            // Hard Constraints
            if (options.honorConstraints && task.primaryConstraint?.type === 'Start No Earlier Than' && task.primaryConstraint.date) {
                const constDate = new Date(task.primaryConstraint.date);
                if (constDate > earlyStart) {
                     earlyStart = constDate;
                     this.log(`Constraint Applied: ${task.wbsCode} pushed to ${constDate.toLocaleDateString()}`);
                }
            }

            task.earlyStart = earlyStart;
            // Calculate Early Finish based on duration
            task.earlyFinish = addWorkingDays(earlyStart, Math.max(0, task.duration - 1), { workingDays: [1,2,3,4,5], holidays: [] });
        }

        // 4. Backward Pass (Late Dates & Float)
        let projectFinish = new Date(options.dataDate);
        tasks.forEach(t => {
            if (t.earlyFinish && new Date(t.earlyFinish) > projectFinish) {
                projectFinish = new Date(t.earlyFinish);
            }
        });
        
        this.log(`Calculated Project Finish: ${projectFinish.toLocaleDateString()}`);

        const reverseTasks = [...sortedTasks].reverse();
        
        // Build Successor Map for Backward Pass
        const successorMap = new Map<string, Array<{ id: string, type: string, lag: number }>>();
        tasks.forEach(t => {
            t.dependencies.forEach(dep => {
                if (!successorMap.has(dep.targetId)) successorMap.set(dep.targetId, []);
                successorMap.get(dep.targetId)?.push({ id: t.id, type: dep.type, lag: dep.lag });
            });
        });
        
        for (const task of reverseTasks) {
            if (task.status === TaskStatus.COMPLETED) continue;

            let lateFinish = new Date(projectFinish);
            const successors = successorMap.get(task.id) || [];
            
            if (successors.length > 0) {
                let minLateStart = new Date(8640000000000000); // Max Date
                let hasValidSuccessor = false;

                for (const succRel of successors) {
                    const succ = taskMap.get(succRel.id);
                    if (!succ || !succ.lateStart) continue;

                    hasValidSuccessor = true;
                    // Logic for FS Reverse: LS - Lag - 1
                    const limitDate = addWorkingDays(new Date(succ.lateStart), -(succRel.lag + 1), { workingDays: [1,2,3,4,5], holidays: [] });
                    if (limitDate < minLateStart) minLateStart = limitDate;
                }
                
                if (hasValidSuccessor) lateFinish = minLateStart;
            }

            task.lateFinish = lateFinish;
            task.lateStart = addWorkingDays(lateFinish, -(Math.max(0, task.duration - 1)), { workingDays: [1,2,3,4,5], holidays: [] });
            
            // Calculate Float
            if (task.earlyStart && task.lateStart) {
                const tf = getWorkingDaysDiff(task.earlyStart, task.lateStart, { workingDays: [1,2,3,4,5], holidays: [] });
                task.totalFloat = tf;
                task.critical = tf <= 0;
            }
        }

        // 5. Stats Generation
        const criticalCount = tasks.filter(t => t.critical).length;
        this.log(`Analysis Complete.`);
        this.log(`- Activities Processed: ${tasks.length}`);
        this.log(`- Critical Activities: ${criticalCount}`);
        this.log(`- Percent Critical: ${tasks.length > 0 ? ((criticalCount/tasks.length)*100).toFixed(1) : 0}%`);

        return {
            tasks,
            log: this.logBuffer.join('\n'),
            stats: {
                criticalPathLength: getWorkingDaysDiff(options.dataDate, projectFinish, { workingDays: [1,2,3,4,5], holidays: [] }),
                criticalTasksCount: criticalCount,
                openEnds
            },
            success: true
        };
    }

    private topologicalSort(tasks: Task[]): Task[] {
        // Kahn's Algorithm
        const inDegree = new Map<string, number>();
        const graph = new Map<string, string[]>();
        
        tasks.forEach(t => {
            inDegree.set(t.id, 0);
            graph.set(t.id, []);
        });

        tasks.forEach(t => {
            t.dependencies.forEach(dep => {
                if (graph.has(dep.targetId)) {
                    graph.get(dep.targetId)?.push(t.id);
                    inDegree.set(t.id, (inDegree.get(t.id) || 0) + 1);
                }
            });
        });

        const queue: string[] = [];
        inDegree.forEach((count, id) => {
            if (count === 0) queue.push(id);
        });

        const sorted: Task[] = [];
        const taskMap = new Map(tasks.map(t => [t.id, t]));

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            const task = taskMap.get(currentId);
            if (task) sorted.push(task);

            const neighbors = graph.get(currentId) || [];
            neighbors.forEach(neighborId => {
                inDegree.set(neighborId, (inDegree.get(neighborId) || 0) - 1);
                if (inDegree.get(neighborId) === 0) {
                    queue.push(neighborId);
                }
            });
        }

        if (sorted.length !== tasks.length) {
            throw new Error("Cycle detected in schedule network logic.");
        }

        return sorted;
    }
}

export const Scheduler = new SchedulingEngine();