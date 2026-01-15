import { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Risk, PortfolioRisk, ProgramRisk } from '../../types';

export const useSystemicRiskLogic = () => {
  const { state } = useData();
  const theme = useTheme();

  const metrics = useMemo(() => {
    // Normalize risks into a common shape for analysis
    const projectRisks = state.risks.map(r => ({ ...r, context: 'Project', financialImpact: r.financialImpact || 0 }));
    const portfolioRisks = state.portfolioRisks.map(r => ({ ...r, context: 'Portfolio', financialImpact: r.financialImpact || 0 }));
    const programRisks = state.programRisks.map(r => ({ ...r, context: 'Program', financialImpact: r.financialImpact || 0 }));
    
    const allRisks = [...projectRisks, ...portfolioRisks, ...programRisks];

    const totalRisks = allRisks.length;
    const criticalRisks = allRisks.filter(r => r.score >= 15).length;
    const totalExposure = allRisks.reduce((sum, r) => sum + r.financialImpact, 0);
    const avgScore = totalRisks > 0 ? allRisks.reduce((sum, r) => sum + r.score, 0) / totalRisks : 0;

    // Group by Category
    const byCategory = allRisks.reduce((acc, r) => {
        acc[r.category] = (acc[r.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const palette = theme.charts.palette || [];
    const len = palette.length > 0 ? palette.length : 1;
    
    const categoryData = Object.entries(byCategory)
        .map(([name, value], i) => {
             const colorIndex = i % len;
             return { name, value, color: palette[colorIndex] || '#000000' };
        })
        .sort((a, b) => (Number(b.value) - Number(a.value)));

    // Group by Context (Project vs Program vs Portfolio)
    const byContext = [
        { name: 'Project Level', value: allRisks.filter(r => r.context === 'Project').length },
        { name: 'Program Level', value: allRisks.filter(r => r.context === 'Program').length },
        { name: 'Portfolio Level', value: allRisks.filter(r => r.context === 'Portfolio').length },
    ];
    
    // Top critical risks
    const topRisks = [...allRisks].sort((a,b) => b.score - a.score).slice(0, 5);

    return { totalRisks, criticalRisks, totalExposure, avgScore, categoryData, byContext, topRisks };
  }, [state.risks, state.portfolioRisks, state.programRisks, theme]);
  
  return {
      metrics,
      projects: state.projects // needed for lookup in UI
  };
};