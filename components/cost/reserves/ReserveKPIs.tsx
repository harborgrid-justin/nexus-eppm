
import React from 'react';
import StatCard from '../../shared/StatCard';
import { ShieldCheck, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';
import { formatCompactCurrency } from '../../../utils/formatters';
import { ReserveAnalysisData } from '../../../types/index';

export const ReserveKPIs: React.FC<{ data: ReserveAnalysisData }> = ({ data }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Reserves" value={formatCompactCurrency(data.totalReserves)} icon={ShieldCheck} />
            <StatCard title="Risk Exposure" value={formatCompactCurrency(data.currentRiskExposure)} icon={AlertTriangle} subtext="Quantified Risk Value" />
            <StatCard title="Coverage Ratio" value={data.coverageRatio.toFixed(2)} icon={TrendingDown} trend={data.coverageRatio >= 1 ? 'up' : 'down'} />
            <StatCard title="Drawdown (YTD)" value={formatCompactCurrency(data.drawdowns.contingency + data.drawdowns.management)} icon={DollarSign} />
        </div>
    );
};
