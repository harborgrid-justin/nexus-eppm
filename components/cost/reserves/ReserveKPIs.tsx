
import React from 'react';
import StatCard from '../../shared/StatCard';
import { ShieldCheck, TrendingDown, DollarSign, AlertTriangle, Activity } from 'lucide-react';
import { formatCompactCurrency } from '../../../utils/formatters';
import { ReserveAnalysisData } from '../../../types/index';
import { useTheme } from '../../../context/ThemeContext';

export const ReserveKPIs: React.FC<{ data: ReserveAnalysisData }> = ({ data }) => {
    const theme = useTheme();
    return (
        <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap} animate-nexus-in`}>
            <StatCard title="Total Fiscal Reserves" value={formatCompactCurrency(data.totalReserves)} icon={ShieldCheck} subtext="Authorized for current phase" />
            <StatCard title="Unmitigated Exposure" value={formatCompactCurrency(data.currentRiskExposure)} icon={AlertTriangle} trend={data.coverageRatio < 1 ? 'down' : 'up'} subtext="Aggregated Risk EMV" />
            <StatCard title="Reserve Coverage" value={`0${data.coverageRatio.toFixed(2)}`} icon={TrendingDown} trend={data.coverageRatio >= 1.2 ? 'up' : data.coverageRatio < 1 ? 'down' : undefined} subtext="Reserve / Exposure Index" />
            <StatCard title="Capital Drawdown" value={formatCompactCurrency(data.drawdowns.contingency + data.drawdowns.management)} icon={Activity} subtext="Lifecycle approved deltas" />
        </div>
    );
};
