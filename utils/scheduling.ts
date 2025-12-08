import { Task, ProjectCalendar } from '../types';
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
    
    for (const dep of task.dependencies) {
        const pred = taskMap.get(dep.targetId)!;
        const potentialStart = addWorkingDays(pred.earlyFinish, dep.lag + 1, calendar);
        if(potentialStart > task.earlyStart) {
            task.earlyStart = potentialStart;
        }
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
    task.lateStart = addWorkingDays(task.lateFinish, -(task.duration > 0 ? task.duration -1 : 0), calendar);
    
    for (const dep of task.dependencies) {
        const pred = taskMap.get(dep.targetId)!;
        const potentialFinish = addWorkingDays(task.lateStart, -(dep.lag + 1), calendar);
        if(potentialFinish < pred.lateFinish) {
            pred.lateFinish = potentialFinish;
        }
    }
  }

  // Calculate float
  for (const task of taskMap.values()) {
    task.float = getWorkingDaysDiff(task.earlyStart, task.lateStart, calendar);
    task.critical = task.float <= 0;
  }
  
  return Array.from(taskMap.values()).map(cpmTask => {
    const { earlyStart, earlyFinish, lateStart, lateFinish, float, successors, ...originalTask } = cpmTask;
    return originalTask;
  });
};