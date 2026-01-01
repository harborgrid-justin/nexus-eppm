


import { useMemo } from 'react';
// FIX: Corrected import path for types to resolve module resolution errors.
import { QualityReport, NonConformanceReport } from '../types/index';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';

export const useQualityData = () => {
    const { qualityReports, nonConformanceReports } = useProjectWorkspace();

    const metrics = useMemo(() => {
        const totalReports = qualityReports.length;
        const passRate = totalReports > 0 ? (qualityReports.filter(r => r.status === 'Pass').length / totalReports) * 100 : 100;
        const openDefects = nonConformanceReports.filter(d => d.status === 'Open').length;

        return { passRate, openDefects };
    }, [qualityReports, nonConformanceReports]);

    return {
        qualityReports,
        nonConformanceReports,
        metrics
    };
};