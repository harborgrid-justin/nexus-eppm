
import React, { useMemo } from 'react';
import { EnrichedStakeholder } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../shared/StatCard';
import { Users, Target, AlertTriangle, MessageSquare } from 'lucide-react';
import { PowerInterestGrid } from './PowerInterestGrid';
import { Badge } from '../ui/Badge';

interface StakeholderDashboardProps {
    stakeholders: EnrichedStakeholder[];
}

export const StakeholderDashboard: React.FC<StakeholderDashboardProps> = ({ stakeholders }) => {
    const theme = useTheme();
    const metrics = useMemo(() => ({
        total: stakeholders.length,
        highPower: stakeholders.filter(s => s.power > 7).length,
        gapCount: stakeholders.filter(s => s.engagement.current !== s.engagement.desired).length,
    }), [stakeholders]);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Stakeholders" value={metrics.total} icon={Users} />
                <StatCard title="Key Influencers" value={metrics.highPower} icon={Target} />
                <StatCard title="Engagement Gaps" value={metrics.gapCount} icon={AlertTriangle} trend={metrics.gapCount > 0 ? 'down' : 'up'} />
                <StatCard title="Avg Sentiment" value="Positive" icon={MessageSquare} trend="up" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-6 rounded-xl border h-[400px] ${theme.colors.surface} ${theme.colors.border}`}>
                    <h3 className="font-bold text-slate-800 mb-4">Power / Interest Grid</h3>
                    <PowerInterestGrid stakeholders={stakeholders} />
                </div>
                <div className={`p-6 rounded-xl border ${theme.colors.surface} ${theme.colors.border}`}>
                    <h3 className="font-bold text-slate-800 mb-4">Top Concerns & Issues</h3>
                    <div className="space-y-4">
                        {[ { topic: 'Budget Cuts', by: 'Finance', prio: 'High' } ].map((issue, i) => (
                        <div key={i} className={`p-3 rounded-lg border flex justify-between items-center ${theme.colors.background} ${theme.colors.border}`}>
                            <div>
                                <p className="font-bold text-sm text-slate-800">{issue.topic}</p>
                                <p className="text-xs text-slate-500">Raised by: {issue.by}</p>
                            </div>
                            <Badge variant={issue.prio === 'High' ? 'danger' : 'warning'}>{issue.prio}</Badge>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
