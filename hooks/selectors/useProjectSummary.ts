
import { useMemo } from 'react';
// FIX: Correctly import Project and TaskStatus types.
import { Project, TaskStatus } from '../../types';

export const useProjectSummary = (project: Project | undefined) => {
  return useMemo(() => {
    if (!project) return null;
    
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    const delayedTasks = project.tasks.filter(t => t.status === TaskStatus.DELAYED).length;
    
    const totalDuration = project.tasks.reduce((acc, t) => acc + t.duration, 0);
    const completedDuration = project.tasks.reduce((acc, t) => acc + (t.duration * (t.progress / 100)), 0);
    const overallProgress = totalDuration > 0 ? Math.round((completedDuration / totalDuration) * 100) : 0;

    return { totalTasks, completedTasks, delayedTasks, overallProgress };
  }, [project]);
};