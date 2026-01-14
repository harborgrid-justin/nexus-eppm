import React, { useMemo } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Star, TrendingUp, DollarSign, Target, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import StatCard from '../shared/StatCard';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { ResponsiveContainer, XAxis, YAxis, ZAxis, Tooltip, Scatter, CartesianGrid, ScatterChart, Cell } from 'recharts';
import { EmptyGrid } from '../common/EmptyGrid';
import { Button } from '../ui/Button';

const PortfolioValue: React.FC = () => {
  const { projects } = usePortfolioData();
  const theme = useTheme();
  const { t } = useI18n();

  const valueData = useMemo(() => projects.map(p => ({
      name: p.code, fullName: p.name, roi: p.financialValue * 8, npv: p.budget * (p.financialValue / 6),
      cost: p.budget, category: p.category, risk: p.riskScore
  })), [projects]);

  if (projects.length === 0) {
      return <EmptyGrid title={t('portfolio.val_empty', 'Investment Logic Isolated')} description={t('portfolio.val_empty_desc', 'No active initiatives found to track ROI benchmarking.')} icon={Target} onAdd={() => {}} actionLabel={t('portfolio.val_action', 'Establish Investment Case')} />;
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in`}>
        <div className="flex items-center justify-between">
            <div>
                <h2 className={theme.typography.h2}>{t('portfolio.val_title', 'Portfolio Value Analytics')}</h2>
                <p className={theme.typography.small}>{t('portfolio.val_subtitle', 'Tracking planned vs. harvested value across the organization.')}</p>
            </div>
            <Button size="sm" icon={Plus}>{t('portfolio.benefit_tracker', 'Define Benefit Tracker')}</Button>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
            <StatCard title={t('portfolio.npv', 'Portfolio NPV')} value={formatCurrency(valueData.reduce((s, d) => s + d.npv, 0))} icon={DollarSign} />
            <StatCard title={t('portfolio.weighted_roi', 'Weighted ROI')} value={formatPercentage(valueData.length ? valueData.reduce((s,d)=>s+d.roi,0)/valueData.length : 0, 1)} icon={TrendingUp} trend="up" />
            <StatCard title={t('portfolio.value_harvest', 'Realized Benefits')} value={formatCurrency(0)} icon={Star} />
        </div>

        <div className={`bg-white p-8 rounded-[2rem] border ${theme.colors.border} shadow-sm h-[500px] flex flex-col`}>
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-8">{t('portfolio.grid_title', 'Investment Efficiency Grid')}</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                        <XAxis type="number" dataKey="roi" name="ROI" unit="%" tick={{fontSize: 10}} label={{ value: 'Projected ROI (%)', position: 'bottom', offset: 20 }} />
                        <YAxis type="number" dataKey="npv" name="NPV" unit="$" tick={{fontSize: 10}} tickFormatter={(val) => `$${(val/1000000).toFixed(1)}M`} />
                        <ZAxis type="number" dataKey="cost" range={[150, 1500]} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="Projects" data={valueData}>
                             {valueData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.roi > 25 ? '#22c55e' : entry.roi > 15 ? '#3b82f6' : '#ef4444'} />)}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};
export default PortfolioValue;