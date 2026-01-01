


// FIX: Corrected import path for types to resolve module resolution errors.
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

export const calculateCriticalPath = (tasks: Task[], calendar: ProjectCalendar): Task[] => {
  if (!tasks || tasks.length === 0) return [];

  const taskMap: Map<string, CPMTask> = new Map();
  tasks.forEach(task => {
    taskMap.set(task.id, {
      ...task,
      earlyStart: new Date(-8640000000000000),
      earlyFinish: new Date(-8640000000000000),
      lateStart: new Date(8640000000000000),
      lateFinish: new Date(8640000000000000),
      float: 0,
      successors: []
    });
  });

  // Build successor links
  for (const task of taskMap.values()) {
    for (const dep of task.dependencies) {
      const predecessor = taskMap.get(dep.targetId);
      if (predecessor) {
        predecessor.successors.push(task.id);
      }
    }
  }

  // Forward Pass
  for (const task of taskMap.values()) {
    if (task.dependencies.length === 0) {
      task.earlyStart = new Date(task.startDate);
    }
    
    let maxPredFinish = new Date(-8640000000000000);
    for (const dep of task.dependencies) {
        const pred = taskMap.get(dep.targetId)!;
        maxPredFinish = maxDate(maxPredFinish, addWorkingDays(pred.earlyFinish, dep.lag, calendar));
    }
    if(task.dependencies.length > 0) {
      task.earlyStart = addWorkingDays(maxPredFinish, 1, calendar);
    }
    task.earlyFinish = addWorkingDays(task.earlyStart, task.duration > 0 ? task.duration - 1 : 0, calendar);
  }

  let projectEndDate = new Date(-8640000000000000);
  for (const task of taskMap.values()) {
    if (task.successors.length === 0) {
      projectEndDate = maxDate(projectEndDate, task.earlyFinish);
    }
  }

  // Backward Pass
  const reversedTasks = Array.from(taskMap.values()).reverse();
  for (const task of reversedTasks) {
    if (task.successors.length === 0) {
      task.lateFinish = projectEndDate;
    }
    
    let minSuccStart = new Date(8640000000000000);
    for(const succId of task.successors) {
        const succ = taskMap.get(succId)!;
        const dep = succ.dependencies.find(d => d.targetId === task.id)!;
        minSuccStart = minDate(minSuccStart, addWorkingDays(succ.lateStart, -dep.lag, calendar));
    }

    if(task.successors.length > 0) {
        task.lateFinish = addWorkingDays(minSuccStart, -1, calendar);
    }

    task.lateStart = addWorkingDays(task.lateFinish, -(task.duration > 0 ? task.duration - 1 : 0), calendar);
  }

  // Calculate float
  for (const task of taskMap.values()) {
    task.float = getWorkingDaysDiff(task.earlyStart, task.lateStart, calendar);
    task.critical = task.float <= 0;
  }
  
  return Array.from(taskMap.values()).map(cpmTask => {
    const { earlyStart, earlyFinish, lateStart, lateFinish, float, successors, ...originalTask } = cpmTask;
    return originalTask as Task;
  });
};