
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
      // Mock baseline comparison
      if (!project) return [];
      return project.tasks.map(t => ({
          name: t.name,
          variance: Math.floor(Math.random() * 10) - 2 // -2 to +8 days variance
      })).filter(t => t.variance !== 0).slice(0, 5);
  }, [project]);

  return { lookahead, varianceAnalysis };
};