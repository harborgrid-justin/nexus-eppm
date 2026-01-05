
import { useMemo } from 'react';
import { QualityReport, NonConformanceReport } from '../../types/index';

export const useProjectQuality = (qualityReports: QualityReport[], nonConformanceReports: NonConformanceReport[]) => {
  return useMemo(() => {
    const totalReports = qualityReports.length;
    const failedReports = qualityReports.filter(r => r.status === 'Fail').length;
    const passRate = totalReports > 0 ? ((totalReports - failedReports) / totalReports) * 100 : 100;
    
    const openDefects = nonConformanceReports.filter(d => d.status === 'Open' || d.status === 'In Progress').length;
    const totalDefects = nonConformanceReports.length;

    return { totalReports, failedReports, passRate, openDefects, totalDefects };
  }, [qualityReports, nonConformanceReports]);
};
