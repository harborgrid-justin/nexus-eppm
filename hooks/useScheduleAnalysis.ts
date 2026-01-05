
import { useMemo } from 'react';
import { Project, Task } from '../../types/index';
import { getDaysDiff } from '../../utils/dateUtils';

export const useScheduleAnalysis = (project: Project) => {
  const lookahead = useMemo(() => {
    if (!project) return [];
    const today = new Date();
    const fourWeeksLater = new Date();
    fourWeeksLater.setDate(today.getDate() + 28);

    return project.tasks.filter(t => {
        const start = new Date(t.startDate);
        return start >= today && start <= fourWeeksLater;
    }).sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [project]);

  const varianceAnalysis = useMemo(() => {
      // Calculate real variance from baselines if available
      if (!project || !project.baselines || project.baselines.length === 0) return [];
      
      // Use the active or first baseline for comparison
      const baseline = project.baselines[0];
      if (!baseline || !baseline.taskBaselines) return [];

      return project.tasks.map(t => {
          const blTask = baseline.taskBaselines[t.id];
          if (!blTask) return null;

          // Variance = Baseline Finish - Current Finish (Negative means delay)
          // Display logic usually shows delay as positive number in "Variance" charts or negative depending on convention.
          // Here we calculate slip: Current - Baseline
          const currentEnd = new Date(t.endDate).getTime();
          const blEnd = new Date(blTask.baselineEndDate).getTime();
          const varianceDays = Math.round((currentEnd - blEnd) / (1000 * 60 * 60 * 24));
          
          if (varianceDays === 0) return null;

          return {
              name: t.name,
              variance: varianceDays 
          };
      }).filter((t): t is {name: string, variance: number} => t !== null).sort((a,b) => b.variance - a.variance).slice(0, 10);
  }, [project]);

  return { lookahead, varianceAnalysis };
};
