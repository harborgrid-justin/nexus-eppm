import React, { useMemo } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Star, TrendingUp, DollarSign } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../shared/StatCard';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, ZAxis, Tooltip, Scatter, CartesianGrid } from 'recharts';

const PortfolioValue: React.FC = () => {
  const { projects } = usePortfolioData();
  const theme = useTheme();

  // Rule 35: Deterministic First Render
  // Replace Math.random() with deterministic calculation based on Project ID
  const valueData = useMemo(() => projects.map(p => {
      const seed = p.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const randomFactor = (seed % 100) / 100; // 0.0 - 1.0 based on ID
      
      return {
          name: p.code,
          roi: (p.financialValue * 15) + 10, 
          // Deterministic NPV calculation
          npv: p.budget * (randomFactor * 0.5 + 0.1), 
          cost: p.budget
      };
  }), [projects]);

  const avgROI = valueData.reduce((sum, d) => sum + d.roi, 0) / (valueData.length || 1);
  const totalNPV = valueData.reduce((sum, d) => sum + d.npv, 0);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <Star className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Value Management & Benefits Realization</h2>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
            <StatCard title="Total Portfolio NPV" value={formatCurrency(totalNPV)} subtext="Net Present Value" icon={DollarSign} />
            <StatCard title="Average ROI" value={formatPercentage(avgROI)} subtext="Return on Investment" icon={TrendingUp} trend="up" />
            <StatCard title="Benefits Realized" value="$12.5M" subtext="YTD Actuals" icon={Star} />
        </div>

        <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm h-[500px]`}>
            <h3 className="font-bold text-slate-800 mb-4">Investment Efficiency (ROI vs NPV)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="roi" name="ROI" unit="%" label={{ value: 'Return on Investment (%)', position: 'bottom', offset: 0 }} />
                    <YAxis type="number" dataKey="npv" name="NPV" unit="$" tickFormatter={(val) => `$${val/1000000}M`} label={{ value: 'Net Present Value', angle: -90, position: 'insideLeft' }} />
                    <ZAxis type="number" dataKey="cost" range={[100, 1000]} name="Cost" unit="$" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Projects" data={valueData} fill="#f59e0b" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default PortfolioValue;