
import React from 'react';
import { formatCompactCurrency } from '../../../utils/formatters';
import StatCard from '../../shared/StatCard';
import { DollarSign, AlertOctagon, Calendar, FileText } from 'lucide-react';

interface ChangeOrderHeaderProps {
    stats: {
        totalVolume: number;
        approvedAmount: number;
        pendingExposure: number;
        scheduleDrift: number;
    };
}

export const ChangeOrderHeader: React.FC<ChangeOrderHeaderProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 pb-2">
            <StatCard 
                title="Approved Changes" 
                value={formatCompactCurrency(stats.approvedAmount)} 
                icon={DollarSign} 
                subtext="Committed Budget Delta"
            />
            <StatCard 
                title="Pending Exposure" 
                value={formatCompactCurrency(stats.pendingExposure)} 
                icon={AlertOctagon} 
                trend={stats.pendingExposure > 0 ? "down" : undefined}
                subtext="Current Unapproved Pipeline"
            />
            <StatCard 
                title="Schedule Drift" 
                value={`+${stats.scheduleDrift} Days`} 
                icon={Calendar} 
                trend={stats.scheduleDrift > 0 ? 'down' : 'up'}
                subtext="Aggregated Critical Path Impact"
            />
            <StatCard 
                title="Total Volume" 
                value={stats.totalVolume} 
                icon={FileText} 
                subtext="Total Lifecycle Requests"
            />
        </div>
    );
};
