import { useMemo } from 'react';
import { useProjectState } from './useProjectState';
import { NonConformanceReport, QualityReport } from '../types';

export const useQualityData = (projectId: string) => {
  const { project, qualityProfile, qualityReports, nonConformanceReports } = useProjectState(projectId);

  const paretoData = useMemo(() => {
    if (!nonConformanceReports) return [];

    const categoryCounts = nonConformanceReports.reduce((acc: Record<string, number>, defect: NonConformanceReport) => {
        acc[defect.category] = (acc[defect.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const sorted = Object.entries(categoryCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .map(([name, count]) => ({ name, count: count as number }));

    const total = sorted.reduce((sum, item) => sum + item.count, 0);
    let cumulative = 0;
    return sorted.map(item => {
        cumulative += item.count;
        return { ...item, cumulative: total > 0 ? (cumulative / total) * 100 : 0 };
    });
  }, [nonConformanceReports]);

  const trendData = useMemo(() => {
    if (!qualityReports) return [];

    const monthly = qualityReports.reduce((acc: Record<string, { month: string; Pass: number; Fail: number }>, report: QualityReport) => {
        const month = new Date(report.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!acc[month]) acc[month] = { month, Pass: 0, Fail: 0 };
        if (report.status === 'Pass') acc[month].Pass++;
        if (report.status === 'Fail') acc[month].Fail++;
        return acc;
    }, {} as Record<string, { month: string; Pass: number; Fail: number }>);

    const monthlyValues = Object.values(monthly) as Array<{ month: string; Pass: number; Fail: number }>;
    return monthlyValues.sort((a, b) => {
        return new Date(a.month).getTime() - new Date(b.month).getTime();
    });
  }, [qualityReports]);


  return {
    project,
    qualityProfile,
    qualityReports,
    nonConformanceReports,
    paretoData,
    trendData,
  };
};