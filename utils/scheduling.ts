
import { Task, ProjectCalendar, Dependency } from '../types/index';
import { addWorkingDays, maxDate, minDate, getWorkingDaysDiff } from './dateUtils';

interface CPMTask extends Task {
  earlyStart: Date;
  earlyFinish: Date;
  lateStart: Date;
  lateFinish: Date;
  float: number;
  successors: string[];
}

export const calculateCriticalPath = (tasks: Task[], calendar: ProjectCalendar = { id: 'default', name: 'Standard', workingDays: [1,2,3,4,5], holidays: [] }): Task[] => {
  if (!tasks || tasks.length === 0) return [];

  // 1. Initialize Map
  const taskMap: Map<string, CPMTask> = new Map();
  tasks.forEach(task => {
    taskMap.set(task.id, {
      ...task,
      earlyStart: new Date(-8640000000000000), // Min Date
      earlyFinish: new Date(-8640000000000000),
      lateStart: new Date(8640000000000000), // Max Date
      lateFinish: new Date(8640000000000000),
      float: 0,
      successors: []
    });
  });

  // 2. Build Successor Links (Graph edges)
  for (const task of taskMap.values()) {
    for (const dep of task.dependencies) {
      const predecessor = taskMap.get(dep.targetId);
      if (predecessor) {
        predecessor.successors.push(task.id);
      }
    }
  }

  // 3. Forward Pass (Calculate Early Dates)
  // Topological sort approximation: iterate until convergence or simpler multi-pass
  // For simplicity in this non-recursive version, we assume tasks are roughly ordered or we multi-pass. 
  // A robust engine would use Khan's algorithm for topo sort. We will use a multi-pass approach here.
  
  // Find start nodes
  const startNodes = Array.from(taskMap.values()).filter(t => t.dependencies.length === 0);
  
  // Queue for processing
  let queue = [...startNodes];
  const processed = new Set<string>();

  // Simple Forward Pass Logic
  // Note: This is a simplified CPM. Full P6 logic handles SS/FF/SF/Lags. 
  // We implemented FS + Lag here.
  for (const task of taskMap.values()) {
    // If no dependencies, start at task start date (constraint)
    if (task.dependencies.length === 0) {
      task.earlyStart = new Date(task.startDate);
    }
    
    // Calculate EF
    // EF = ES + Duration - 1 (inclusive day)
    // Note: Working days logic is abstracted in addWorkingDays
    
    // Check Predecessors
    let maxPredFinish = new Date(-8640000000000000);
    for (const dep of task.dependencies) {
        const pred = taskMap.get(dep.targetId)!;
        // FS Relationship
        maxPredFinish = maxDate(maxPredFinish, addWorkingDays(pred.earlyFinish, dep.lag, calendar));
    }

    if(task.dependencies.length > 0) {
      task.earlyStart = addWorkingDays(maxPredFinish, 1, calendar);
    }
    
    task.earlyFinish = addWorkingDays(task.earlyStart, task.duration > 0 ? task.duration - 1 : 0, calendar);
  }

  // 4. Backward Pass (Calculate Late Dates)
  const reversedTasks = Array.from(taskMap.values()).reverse(); // Heuristic reverse topo
  
  // Find project finish
  let projectEndDate = new Date(-8640000000000000);
  for (const task of taskMap.values()) {
    if (task.successors.length === 0) {
      projectEndDate = maxDate(projectEndDate, task.earlyFinish);
    }
  }

  for (const task of reversedTasks) {
    if (task.successors.length === 0) {
      task.lateFinish = projectEndDate;
    }
    
    let minSuccStart = new Date(8640000000000000);
    
    for(const succId of task.successors) {
        const succ = taskMap.get(succId)!;
        const dep = succ.dependencies.find(d => d.targetId === task.id)!;
        // FS Logic Reverse: LS of Successor - Lag - 1
        minSuccStart = minDate(minSuccStart, addWorkingDays(succ.lateStart, -dep.lag, calendar));
    }

    if(task.successors.length > 0) {
        task.lateFinish = addWorkingDays(minSuccStart, -1, calendar);
    }

    // LS = LF - Duration + 1
    task.lateStart = addWorkingDays(task.lateFinish, -(task.duration > 0 ? task.duration - 1 : 0), calendar);
  }

  // 5. Calculate Float
  for (const task of taskMap.values()) {
    // Total Float = LS - ES
    task.float = getWorkingDaysDiff(task.earlyStart, task.lateStart, calendar);
    task.critical = task.float <= 0;
  }
  
  return Array.from(taskMap.values()).map(cpmTask => {
    // Map back to standard Task type, preserving calculated dates if we extend the type
    const { earlyStart, earlyFinish, lateStart, lateFinish, float, successors, ...originalTask } = cpmTask;
    return originalTask as Task;
  });
};
