
import { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

export const useSystemicRiskLogic = () => {
  const { state } = useData();
  const theme = useTheme();

  const metrics = useMemo(() => {
    const projectRisks = state.risks.map(r => ({ ...r, context: 'Project', financialImpact: r.financialImpact || 0 }));
    const portfolioRisks = state.portfolioRisks.map(r => ({ ...r, context: 'Portfolio', financialImpact: r.financialImpact || 0 }));
    const programRisks = state.programRisks.map(r => ({ ...r, context: 'Program', financialImpact: r.financialImpact || 0 }));
    const allRisks = [...projectRisks, ...portfolioRisks, ...programRisks];

    const totalRisks = allRisks.length;
    const criticalRisks = allRisks.filter(r => r.score >= 15).length;
    const totalExposure = allRisks.reduce((sum, r) => sum + r.financialImpact, 0);
    const avgScore = totalRisks > 0 ? allRisks.reduce((sum, r) => sum + r.score, 0) / totalRisks : 0;

    const byCategory = allRisks.reduce((acc, r) => { acc[r.category] = (acc[r.category] || 0) + 1; return acc; }, {} as Record<string, number>);
    const categoryData = Object.entries(byCategory).map(([name, value], i) => ({ name, value, color: theme.charts.palette[i % theme.charts.palette.length] })).sort((a, b) => (Number(b.value) - Number(a.value)));
    const byContext = [{ name: 'Project', value: projectRisks.length }, { name: 'Program', value: programRisks.length }, { name: 'Portfolio', value: portfolioRisks.length }];
    const topRisks = [...allRisks].sort((a,b) => b.score - a.score).slice(0, 5);

    return { totalRisks, criticalRisks, totalExposure, avgScore, categoryData, byContext, topRisks };
  }, [state.risks, state.portfolioRisks, state.programRisks, theme.charts.palette]);
  
  return { metrics, projects: state.projects };
};
