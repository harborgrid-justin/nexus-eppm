import { Project, Task, TaskStatus } from '../types/index';
import { topologicalSort } from './scheduling/GraphLogic';
import { calculateEarlyDates, calculateLateDates } from './scheduling/CPMPass';
import { getWorkingDaysDiff } from '../utils/dateUtils';

// FIX: Added ScheduleResult interface to fix missing export error in hooks/useGantt.ts
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
    // FIX: Updated return type to Promise<ScheduleResult> to match consumer expectations.
    public async schedule(project: Project, options: any): Promise<ScheduleResult> {
        const tasks = JSON.parse(JSON.stringify(project.tasks)) as Task[];
        const taskMap = new Map(tasks.map(t => [t.id, t]));
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

        const calendar = { workingDays: [1,2,3,4,5], holidays: [] };

        // Forward Pass
        sorted.forEach(t => {
            if (t.status === TaskStatus.COMPLETED) return;
            const preds = t.dependencies.map(d => taskMap.get(d.targetId)).filter(Boolean) as Task[];
            const { earlyStart, earlyFinish } = calculateEarlyDates(t, preds, options.dataDate);
            t.earlyStart = earlyStart; t.earlyFinish = earlyFinish;
            t.startDate = earlyStart.toISOString().split('T')[0];
            t.endDate = earlyFinish.toISOString().split('T')[0];
        });

        const projectFinish = new Date(Math.max(...tasks.map(t => new Date(t.endDate).getTime())));
        
        // Backward Pass
        [...sorted].reverse().forEach(t => {
            if (t.status === TaskStatus.COMPLETED) return;
            const succs = tasks.filter(ot => ot.dependencies.some(d => d.targetId === t.id))
                               .map(ot => ({ task: ot, lag: ot.dependencies.find(d => d.targetId === t.id)!.lag }));
            const { lateStart, lateFinish } = calculateLateDates(t, succs, projectFinish);
            t.lateStart = lateStart; t.lateFinish = lateFinish;
            t.totalFloat = getWorkingDaysDiff(t.earlyStart!, t.lateStart!, calendar);
            t.critical = t.totalFloat <= 0;
        });

        return { 
            tasks, 
            success: true, 
            log: "Schedule calculation successful. Critical path and float values updated.",
            stats: { 
                criticalTasksCount: tasks.filter(t => t.critical).length,
                criticalPathLength: Math.ceil(getWorkingDaysDiff(new Date(project.startDate), projectFinish, calendar)),
                openEnds: tasks.filter(t => t.dependencies.length === 0).length
            } 
        };
    }
}
export const Scheduler = new SchedulingEngine();