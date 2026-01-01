
import React, { useMemo } from 'react';
import { formatCompactCurrency } from '../../../utils/formatters';
import StatCard from '../../shared/StatCard';
import { DollarSign, AlertOctagon, Calendar, FileText } from 'lucide-react';
import { ChangeOrder } from '../../../types';

interface ChangeOrderHeaderProps {
    orders: ChangeOrder[];
}

export const ChangeOrderHeader: React.FC<ChangeOrderHeaderProps> = ({ orders }) => {
    const stats = useMemo(() => {
        const pending = orders.filter(c => c.status === 'Pending Approval');
        const approvedCost = orders.filter(c => c.status === 'Approved').reduce((s, c) => s + c.amount, 0);
        const pendingCost = pending.reduce((s, c) => s + c.amount, 0);
        const scheduleDrift = orders.filter(c => c.status === 'Approved').reduce((s, c) => s + (c.scheduleImpactDays || 0), 0);
        return { total: orders.length, pending: pending.length, approvedCost, pendingCost, scheduleDrift };
    }, [orders]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 pb-0">
            <StatCard title="Approved Changes" value={formatCompactCurrency(stats.approvedCost)} icon={DollarSign} />
            <StatCard title="Pending Exposure" value={formatCompactCurrency(stats.pendingCost)} icon={AlertOctagon} trend="down" />
            <StatCard title="Schedule Drift" value={`+${stats.scheduleDrift} Days`} icon={Calendar} trend={stats.scheduleDrift > 10 ? 'down' : 'up'} />
            <StatCard title="Total Volume" value={stats.total} icon={FileText} />
        </div>
    );
};
