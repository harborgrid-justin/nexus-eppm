
import { useState, useMemo } from 'react';
import { useProjectState } from './useProjectState';
import { NonConformanceReport, QualityReport } from '../types';

export const useQualityData = (projectId: string) => {
  const { project, qualityProfile, qualityReports, nonConformanceReports } = useProjectState(projectId);

  const paretoData = useMemo(() => {
    if (!nonConformanceReports) return [];
    // FIX: Add explicit type to the accumulator in reduce to ensure correct type inference for `acc`.
    const categoryCounts = nonConformanceReports.reduce((acc: Record<string, number>, defect: NonConformanceReport) => {
        acc[defect.category] = (acc[defect.category] || 0) + 1;
        return acc;
    }, {});

    const sorted = Object.entries(categoryCounts)
        // FIX: Simplified sort syntax for clarity.
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count }));

    const total = sorted.reduce((sum, item) => sum + item.count, 0);
    let cumulative = 0;
    return sorted.map(item => {
        cumulative += item.count;
        return { ...item, cumulative: total > 0 ? (cumulative / total) * 100 : 0 };
    });
  }, [nonConformanceReports]);

  const trendData = useMemo(() => {
    if (!qualityReports) return [];
    // FIX: Add explicit type to the accumulator in reduce to ensure correct type inference for `acc`.
    const monthly = qualityReports.reduce((acc: Record<string, { month: string; Pass: number; Fail: number }>, report: QualityReport) => {
        const month = new Date(report.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!acc[month]) acc[month] = { month, Pass: 0, Fail: 0 };
        if (report.status === 'Pass') acc[month].Pass++;
        if (report.status === 'Fail') acc[month].Fail++;
        return acc;
    }, {});
    
    return Object.values(monthly).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
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