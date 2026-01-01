
import { NonConformanceReport } from '../../types';

export const canCompleteTask = (taskId: string, nonConformanceReports: NonConformanceReport[]): { canComplete: boolean, blockingNCRs: NonConformanceReport[] } => {
  const blockingNCRs = nonConformanceReports.filter(ncr => ncr.linkedTaskId === taskId && ncr.status !== 'Closed' && ncr.severity === 'Critical');
  return { canComplete: blockingNCRs.length === 0, blockingNCRs };
};
