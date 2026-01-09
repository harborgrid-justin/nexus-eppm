
import { Project, Task, TaskStatus, ProjectCalendar } from '../types/index';
import { topologicalSort } from './scheduling/GraphLogic';
import { calculateEarlyDates, calculateLateDates } from './scheduling/CPMPass';
import { getWorkingDaysDiff } from '../utils/dateUtils';

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
     * Respects Project-specific calendars and data dates.
     */
    // Fix: Updated options type to include useRetainedLogic and honorConstraints to resolve TS error in useGantt hook
    public async schedule(project: Project, options: { 
        dataDate: Date; 
        calendar?: ProjectCalendar;
        useRetainedLogic?: boolean;
        honorConstraints?: boolean;
    }): Promise<ScheduleResult> {
        if (!project.tasks || project.tasks.length === 0) {
            return { 
                success: true, 
                log: "No activities to schedule.", 
                tasks: [],
                stats: { criticalTasksCount: 0, criticalPathLength: 0, openEnds: 0 }
            };
        }

        const tasks = JSON.parse(JSON.stringify(project.tasks)) as Task[];
        const taskMap = new Map(tasks.map(t => [t.id, t]));
        
        // Use provided calendar or fallback to standard 5-day
        const calendar = options.calendar || { 
            id: 'default', 
            name: 'Standard', 
            workingDays: [1,2,3,4,5], 
            holidays: [] 
        };

        let sorted: Task[];
        try { 
            sorted = topologicalSort(tasks); 
        } catch (e) { 
            return { 
                success: false, 
                log: "Cycle detected in schedule network logic. Calculation aborted.", 
                tasks: [],
                stats: { criticalTasksCount: 0, criticalPathLength: 0, openEnds: 0 }
            }; 
        }

        // --- Forward Pass ---
        sorted.forEach(t => {
            if (t.status === TaskStatus.COMPLETED) return;
            
            const predecessors = t.dependencies
                .map(d => taskMap.get(d.targetId))
                .filter((p): p is Task => !!p);
            
            const { earlyStart, earlyFinish } = calculateEarlyDates(t, predecessors, options.dataDate, calendar);
            
            t.earlyStart = earlyStart;
            t.earlyFinish = earlyFinish;
            t.startDate = earlyStart.toISOString().split('T')[0];
            t.endDate = earlyFinish.toISOString().split('T')[0];
        });

        const projectFinish = new Date(Math.max(...tasks.map(t => new Date(t.endDate).getTime())));
        
        // --- Backward Pass ---
        [...sorted].reverse().forEach(t => {
            if (t.status === TaskStatus.COMPLETED) return;
            
            const successors = tasks
                .filter(ot => ot.dependencies.some(d => d.targetId === t.id))
                .map(ot => ({ 
                    task: ot, 
                    lag: ot.dependencies.find(d => d.targetId === t.id)!.lag 
                }));
            
            const { lateStart, lateFinish } = calculateLateDates(t, successors, projectFinish, calendar);
            
            t.lateStart = lateStart;
            t.lateFinish = lateFinish;
            
            // Calculate Total Float
            const float = getWorkingDaysDiff(t.earlyStart!, t.lateStart!, calendar);
            t.totalFloat = float;
            t.critical = float <= 0;
        });

        const criticalTasks = tasks.filter(t => t.critical);

        return { 
            tasks, 
            success: true, 
            log: `Schedule calculation successful at ${new Date().toLocaleTimeString()}. Path length: ${getWorkingDaysDiff(options.dataDate, projectFinish, calendar)} days.`,
            stats: { 
                criticalTasksCount: criticalTasks.length,
                criticalPathLength: Math.ceil(getWorkingDaysDiff(new Date(project.startDate), projectFinish, calendar)),
                openEnds: tasks.filter(t => t.dependencies.length === 0).length
            } 
        };
    }
}
export const Scheduler = new SchedulingEngine();
