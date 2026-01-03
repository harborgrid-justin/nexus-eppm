
import { Project, Task, Dependency, TaskStatus, ProjectCalendar } from '../types';
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

        // Simulate WASM/Worker delay for realism in UI
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

            if (t.status === TaskStatus.COMPLETED) {
                // Completed tasks fixed
            } else if (t.status === TaskStatus.IN_PROGRESS) {
                // In progress tasks start from Actual Start, calculate remaining
            }

            if (t.dependencies.length === 0 && t.type !== 'Summary') {
                // Check if it's the start node or truly open
                if (t.id !== tasks[0]?.id) openEnds++; // Simplified check
            }
        });

        this.log(`Validation: Found ${openEnds} activities with open starts.`);

        // 2. Forward Pass (Early Dates)
        const sortedTasks = this.topologicalSort(tasks); // Simplified topo sort for calculation order
        
        for (const task of sortedTasks) {
            if (task.status === TaskStatus.COMPLETED) continue;

            let earlyStart = new Date(options.dataDate);
            
            // Check Predecessors
            for (const dep of task.dependencies) {
                const pred = taskMap.get(dep.targetId);
                if (!pred) continue;

                // Default to DataDate if predecessor dates missing (shouldn't happen in valid net)
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
                    case 'FF': // Finish to Finish (Constraint on Finish)
                         // Logic simplified: usually affects EF, not ES directly without duration back-calc
                         // For scaffold, treating as FS for critical path basics
                         constraintDate = addWorkingDays(predFinish, dep.lag, { workingDays: [1,2,3,4,5], holidays: [] }); 
                         break;
                    case 'SF': // Start to Finish
                         constraintDate = addWorkingDays(predStart, dep.lag, { workingDays: [1,2,3,4,5], holidays: [] });
                         break;
                }
                
                if (constraintDate > earlyStart) {
                    earlyStart = constraintDate;
                }
            }
            
            // If task has specific constraints (Start No Earlier Than), apply here
            if (task.primaryConstraint?.type === 'Start No Earlier Than' && task.primaryConstraint.date) {
                const constDate = new Date(task.primaryConstraint.date);
                if (constDate > earlyStart) {
                     earlyStart = constDate;
                     this.log(`Constraint Applied: ${task.wbsCode} pushed to ${constDate.toLocaleDateString()}`);
                }
            }

            task.earlyStart = earlyStart;
            task.earlyFinish = addWorkingDays(earlyStart, Math.max(0, task.duration - 1), { workingDays: [1,2,3,4,5], holidays: [] });
        }

        // 3. Backward Pass (Late Dates & Float)
        // Find project finish date
        let projectFinish = new Date(options.dataDate);
        tasks.forEach(t => {
            if (t.earlyFinish && new Date(t.earlyFinish) > projectFinish) {
                projectFinish = new Date(t.earlyFinish);
            }
        });
        
        this.log(`Calculated Project Finish: ${projectFinish.toLocaleDateString()}`);

        // Reverse iteration
        const reverseTasks = [...sortedTasks].reverse();
        
        for (const task of reverseTasks) {
            if (task.status === TaskStatus.COMPLETED) continue;

            // Initialize Late Finish to Project Finish (or successor constraints)
            let lateFinish = new Date(projectFinish);

            // Find successors (This implies we need a successor map, building implicitly here is slow, ideally built in Init)
            const successors = tasks.filter(t => t.dependencies.some(d => d.targetId === task.id));
            
            if (successors.length > 0) {
                let minLateStart = new Date(8640000000000000); // Max Date
                let hasValidSuccessor = false;

                for (const succ of successors) {
                    const dep = succ.dependencies.find(d => d.targetId === task.id);
                    if (!dep || !succ.lateStart) continue;

                    hasValidSuccessor = true;
                    // Logic for FS Reverse: LS - Lag - 1
                    // Simplified for demo
                    const limitDate = addWorkingDays(new Date(succ.lateStart), -(dep.lag + 1), { workingDays: [1,2,3,4,5], holidays: [] });
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

        // 4. Stats Generation
        const criticalCount = tasks.filter(t => t.critical).length;
        this.log(`Analysis Complete.`);
        this.log(`- Activities Processed: ${tasks.length}`);
        this.log(`- Critical Activities: ${criticalCount}`);
        this.log(`- Percent Critical: ${((criticalCount/tasks.length)*100).toFixed(1)}%`);

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
        // Simplified sort: sort by ID or simple level logic for demo purposes
        // Real topo sort required for complex cyclic dependencies checks
        return tasks.sort((a, b) => {
            // Put dependencies first
            const aDependsOnB = a.dependencies.some(d => d.targetId === b.id);
            const bDependsOnA = b.dependencies.some(d => d.targetId === a.id);
            if (aDependsOnB) return 1;
            if (bDependsOnA) return -1;
            return 0;
        });
    }
}

export const Scheduler = new SchedulingEngine();
