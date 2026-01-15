
import { useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';

export const useRiskDashboardLogic = () => {
  const { risks } = useProjectWorkspace();

  const metrics = useMemo(() => {
    if (!risks || risks.length === 0) {
        return { categoryData: [], avgRiskScore: "0.0", openRisksCount: 0, mitigatedCount: 0, totalRisks: 0, hasData: false };
    }
    const riskCategories = Array.from(new Set(risks.map(r => r.category)));
    const categoryData = riskCategories.map(cat => ({
        name: cat, count: risks.filter(r => r.category === cat).length
    }));
    const avgRiskScore = (risks.reduce((acc, r) => acc + r.score, 0) / risks.length).toFixed(1);
    const openRisksCount = risks.filter(r => r.status === 'Open').length;
    const mitigatedCount = risks.filter(r => r.status !== 'Open').length;
    return { categoryData, avgRiskScore, openRisksCount, mitigatedCount, totalRisks: risks.length, hasData: true };
  }, [risks]);

  const topRisks = useMemo(() => {
      if (!risks) return [];
      return [...risks].sort((a,b) => b.score - a.score).slice(0, 5);
  }, [risks]);

  return { risks, ...metrics, topRisks };
};
