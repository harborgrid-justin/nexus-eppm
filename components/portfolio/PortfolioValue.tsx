
import React, { useMemo } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Star, TrendingUp, DollarSign, Target, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../shared/StatCard';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { ResponsiveContainer, XAxis, YAxis, ZAxis, Tooltip, Scatter, CartesianGrid, ScatterChart } from 'recharts';
import { EmptyGrid } from '../common/EmptyGrid';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const PortfolioValue: React.FC = () => {
  const { projects } = usePortfolioData();
  const theme = useTheme();
  const navigate = useNavigate();

  // Deterministic calculation based on Project Attributes
  const valueData = useMemo(() => projects.map(p => {
      // ROI is roughly (FinancialValue * 10) adjusted by risk
      // NPV is Budget * Financial Factor
      const riskFactor = p.riskScore > 0 ? (100 - p.riskScore) / 100 : 1; 
      
      return {
          name: p.code,
          roi: (p.financialValue * 10 * riskFactor), 
          npv: p.budget * (p.financialValue / 5), // Assumes 5 is baseline value score
          cost: p.budget,
          category: p.category
      };
  }), [projects]);

  const avgROI = valueData.reduce((sum, d) => sum + d.roi, 0) / (valueData.length || 1);
  const totalNPV = valueData.reduce((sum, d) => sum + d.npv, 0);
  const totalBenefits = valueData.filter(d => d.npv > d.cost).reduce((sum, d) => sum + (d.npv - d.cost), 0);

  if (projects.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-12">
              <EmptyGrid 
                title="Value Tracker Inactive"
                description="The portfolio has no active projects to track for financial realization or ROI benchmarking."
                icon={Target}
                actionLabel="Create First Initiative"
                onAdd={() => navigate('/projectList?action=create')}
              />
          </div>
      );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <Star className="text-nexus-600" size={24}/>
                <h2 className={theme.typography.h2}>Value Management & Benefits Realization</h2>
            </div>
            <Button size="sm" icon={Plus}>Add Benefit Tracker</Button>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
            <StatCard title="Total Portfolio NPV" value={formatCurrency(totalNPV)} subtext="Net Present Value" icon={DollarSign} />
            <StatCard title="Average ROI" value={formatPercentage(avgROI)} subtext="Return on Investment" icon={TrendingUp} trend="up" />
            <StatCard title="Benefits Realized" value={formatCurrency(totalBenefits)} subtext="Projected Net Value" icon={Star} />
        </div>

        <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-2xl border ${theme.colors.border} shadow-sm h-[500px] flex flex-col`}>
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-8">Investment Efficiency (ROI vs NPV)</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                        <XAxis type="number" dataKey="roi" name="ROI" unit="%" tick={{fontSize: 10, fontWeight: 'bold'}} label={{ value: 'Return on Investment (%)', position: 'bottom', offset: 0, fontSize: 10, fontWeight: 'bold' }} />
                        <YAxis type="number" dataKey="npv" name="NPV" unit="$" tick={{fontSize: 10, fontWeight: 'bold'}} tickFormatter={(val) => `$${val/1000000}M`} label={{ value: 'Net Present Value', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 'bold' }} />
                        <ZAxis type="number" dataKey="cost" range={[100, 1000]} name="Cost" unit="$" />
                        <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }} 
                            contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Scatter name="Projects" data={valueData} fill="#f59e0b" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};
export default PortfolioValue;
