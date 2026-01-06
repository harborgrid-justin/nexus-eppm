import { Task, ProjectCalendar } from '../types/index';
import { addWorkingDays, maxDate, minDate, getWorkingDaysDiff } from './dateUtils';

interface CPMTask extends Task {
  earlyStart: Date;
  earlyFinish: Date;
  lateStart: Date;
  lateFinish: Date;
  float: number;
}

export const calculateCriticalPath = (tasks: Task[], calendar: ProjectCalendar = { id: 'default', name: 'Standard', workingDays: [1,2,3,4,5], holidays: [] }): Task[] => {
  if (!tasks || tasks.length === 0) return [];

  // --- 1. Graph Representation ---
  const taskMap: Map<string, CPMTask> = new Map(tasks.map(task => [task.id, {
    ...JSON.parse(JSON.stringify(task)), // Deep clone to avoid mutation
    earlyStart: new Date(-8640000000000000), earlyFinish: new Date(-8640000000000000),
    lateStart: new Date(8640000000000000), lateFinish: new Date(8640000000000000),
    float: 0
  }]));
  
  const predecessors = new Map<string, string[]>();
  const successors = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  tasks.forEach(task => {
    predecessors.set(task.id, []);
    successors.set(task.id, []);
    inDegree.set(task.id, 0);
  });

  tasks.forEach(task => {
    task.dependencies.forEach(dep => {
      // Ensure dependency exists to prevent errors
      if (taskMap.has(dep.targetId)) {
        successors.get(dep.targetId)?.push(task.id);
        predecessors.get(task.id)?.push(dep.targetId);
        inDegree.set(task.id, (inDegree.get(task.id) || 0) + 1);
      }
    });
  });

  // --- 2. Topological Sort (Kahn's Algorithm) ---
  const queue: string[] = [];
  inDegree.forEach((degree, taskId) => {
    if (degree === 0) queue.push(taskId);
  });

  const sortedTasks: string[] = [];
  while(queue.length > 0) {
    const u = queue.shift()!;
    sortedTasks.push(u);
    successors.get(u)?.forEach(v => {
      inDegree.set(v, (inDegree.get(v) || 0) - 1);
      if (inDegree.get(v) === 0) queue.push(v);
    });
  }
  
  if (sortedTasks.length !== tasks.length) {
    console.error("Cycle detected in network logic. CPM calculation aborted.");
    return tasks.map(t => ({...t, critical: false})); // Return original tasks without marking critical
  }

  // --- 3. Forward Pass ---
  for (const taskId of sortedTasks) {
    const task = taskMap.get(taskId)!;
    
    let maxPredFinish = new Date(task.startDate); // Honor task start date if it's a constraint
    
    predecessors.get(taskId)?.forEach(predId => {
        const pred = taskMap.get(predId)!;
        const dep = task.dependencies.find(d => d.targetId === predId)!;
        // Simplified FS + lag logic for now. A full engine would handle all PDM types.
        const potentialStart = addWorkingDays(pred.earlyFinish, dep.lag + 1, calendar);
        if (potentialStart > maxPredFinish) {
            maxPredFinish = potentialStart;
        }
    });
    
    task.earlyStart = maxPredFinish;
    task.earlyFinish = addWorkingDays(task.earlyStart, Math.max(0, task.duration - 1), calendar);
  }
  
  // --- 4. Backward Pass ---
  let projectEndDate = new Date(0);
  taskMap.forEach(task => {
    if (task.earlyFinish > projectEndDate) projectEndDate = task.earlyFinish;
  });

  const reversedSortedTasks = [...sortedTasks].reverse();
  for (const taskId of reversedSortedTasks) {
    const task = taskMap.get(taskId)!;

    let minSuccStart = new Date(projectEndDate);

    const succs = successors.get(taskId) || [];
    if (succs.length > 0) {
       succs.forEach(succId => {
           const succ = taskMap.get(succId)!;
           const dep = succ.dependencies.find(d => d.targetId === taskId)!;
           // Reverse FS + lag logic
           const potentialFinish = addWorkingDays(succ.lateStart, -(dep.lag + 1), calendar);
           if (potentialFinish < minSuccStart) {
               minSuccStart = potentialFinish;
           }
       });
    }

    task.lateFinish = minSuccStart;
    task.lateStart = addWorkingDays(task.lateFinish, -Math.max(0, task.duration - 1), calendar);
  }
  
  // --- 5. Calculate Float and Criticality ---
  for (const task of taskMap.values()) {
    task.float = getWorkingDaysDiff(task.earlyStart, task.lateStart, calendar);
    task.critical = task.float <= 0;
  }
  
  return Array.from(taskMap.values()).map(cpmTask => {
    const { earlyStart, earlyFinish, lateStart, lateFinish, float, ...originalTask } = cpmTask;
    return originalTask as Task;
  });
};
