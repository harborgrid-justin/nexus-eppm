
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { ExecutiveView } from './communications/ExecutiveView';
import { PmoView } from './communications/PmoView';
import { TeamView } from './communications/TeamView';
import { StakeholderSidebar } from './communications/StakeholderSidebar';

const PortfolioCommunications: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const [activeAudience, setActiveAudience] = useState<'Executive' | 'PMO' | 'Team'>('Executive');

    const commPlan = [
        { id: '1', item: 'Performance Report', audience: 'Executive', freq: 'Monthly', channel: 'Dashboard', owner: 'Portfolio Mgr' },
        { id: '2', item: 'Resource Review', audience: 'PMO', freq: 'Bi-Weekly', channel: 'Meeting', owner: 'Resource Mgr' },
        { id: '3', item: 'Benefits Update', audience: 'Executive', freq: 'Quarterly', channel: 'Report', owner: 'Sponsor' },
        { id: '4', item: 'Risk Sync', audience: 'Team', freq: 'Weekly', channel: 'Workshop', owner: 'Program Mgr' },
    ];
    
    const audiencePlan = commPlan.filter(c => c.audience === activeAudience);

    return (
        <div className={`h-full overflow-y-auto p-6 space-y-6 animate-in fade-in`}>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className={theme.typography.h2}>Portfolio Communications</h2>
                    <p className={theme.typography.small}>Tailored reporting and stakeholder engagement.</p>
                </div>
                <div className="flex bg-slate-200 p-1 rounded-lg">
                    {['Executive', 'PMO', 'Team'].map((aud) => (
                        <button key={aud} onClick={() => setActiveAudience(aud as any)} className={`px-4 py-2 text-sm font-medium rounded-md ${activeAudience === aud ? 'bg-white shadow' : ''}`}>
                            {aud}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6`}>
                <div className="lg:col-span-2 space-y-6">
                    {activeAudience === 'Executive' && <ExecutiveView plan={audiencePlan} />}
                    {activeAudience === 'PMO' && <PmoView plan={audiencePlan} />}
                    {activeAudience === 'Team' && <TeamView plan={audiencePlan} />}
                </div>
                <StakeholderSidebar />
            </div>
        </div>
    );
};

export default PortfolioCommunications;
