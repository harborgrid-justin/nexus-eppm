
import React, { useMemo, useState } from 'react';
import { EnrichedStakeholder, Stakeholder } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../shared/StatCard';
import { Users, Target, AlertTriangle, MessageSquare, Plus } from 'lucide-react';
import { PowerInterestGrid } from './PowerInterestGrid';
import { Badge } from '../ui/Badge';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { Button } from '../ui/Button';
import { SidePanel } from '../ui/SidePanel';
import { Input } from '../ui/Input';
import { useData } from '../../context/DataContext';
import { generateId } from '../../utils/formatters';

interface StakeholderDashboardProps {
    stakeholders: EnrichedStakeholder[];
}

export const StakeholderDashboard: React.FC<StakeholderDashboardProps> = ({ stakeholders }) => {
    const theme = useTheme();
    const { issues, project } = useProjectWorkspace();
    const { dispatch } = useData();
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [newStakeholder, setNewStakeholder] = useState<Partial<Stakeholder>>({
        name: '', role: '', interest: 'Medium', influence: 'Medium', engagementStrategy: ''
    });

    const metrics = useMemo(() => ({
        total: stakeholders.length,
        highPower: stakeholders.filter(s => s.power > 7).length,
        gapCount: stakeholders.filter(s => s.engagement.current !== s.engagement.desired).length,
    }), [stakeholders]);

    const topIssues = useMemo(() => 
        (issues || [])
            .filter(i => i.priority === 'High' || i.priority === 'Critical')
            .slice(0, 3), 
    [issues]);

    const handleSaveStakeholder = () => {
        if (!newStakeholder.name || !project) return;
        
        const stakeholder: Stakeholder = {
            id: generateId('SH'),
            projectId: project.id,
            name: newStakeholder.name,
            role: newStakeholder.role || '',
            interest: newStakeholder.interest as any,
            influence: newStakeholder.influence as any,
            engagementStrategy: newStakeholder.engagementStrategy || 'Monitor',
        };

        dispatch({ type: 'PROJECT_ADD_STAKEHOLDER', payload: stakeholder });
        
        setIsAddPanelOpen(false);
        setNewStakeholder({ name: '', role: '', interest: 'Medium', influence: 'Medium', engagementStrategy: '' });
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-end">
                <Button size="sm" icon={Plus} onClick={() => setIsAddPanelOpen(true)}>Register Stakeholder</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Stakeholders" value={metrics.total} icon={Users} />
                <StatCard title="Key Influencers" value={metrics.highPower} icon={Target} />
                <StatCard title="Engagement Gaps" value={metrics.gapCount} icon={AlertTriangle} trend={metrics.gapCount > 0 ? 'down' : 'up'} />
                <StatCard title="Avg Sentiment" value="Positive" icon={MessageSquare} trend="up" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-6 rounded-xl border h-[400px] ${theme.colors.surface} ${theme.colors.border} flex flex-col`}>
                    <h3 className="font-bold text-slate-800 mb-4">Power / Interest Grid</h3>
                    <div className="flex-1 min-h-0">
                        <PowerInterestGrid stakeholders={stakeholders} />
                    </div>
                </div>
                <div className={`p-6 rounded-xl border ${theme.colors.surface} ${theme.colors.border}`}>
                    <h3 className="font-bold text-slate-800 mb-4">Top Concerns & Issues</h3>
                    <div className="space-y-4">
                        {topIssues.length > 0 ? topIssues.map((issue) => (
                        <div key={issue.id} className={`p-3 rounded-lg border flex justify-between items-center ${theme.colors.background} ${theme.colors.border}`}>
                            <div>
                                <p className="font-bold text-sm text-slate-800">{issue.description}</p>
                                <p className="text-xs text-slate-500">Raised by: {issue.assigneeId}</p>
                            </div>
                            <Badge variant={issue.priority === 'High' ? 'danger' : 'warning'}>{issue.priority}</Badge>
                        </div>
                        )) : (
                            <div className="text-center text-sm text-slate-400 p-8 italic border-2 border-dashed border-slate-100 rounded-lg">
                                No high-priority issues logged.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <SidePanel
                isOpen={isAddPanelOpen}
                onClose={() => setIsAddPanelOpen(false)}
                title="Identify Stakeholder"
                width="md:w-[400px]"
                footer={<><Button variant="secondary" onClick={() => setIsAddPanelOpen(false)}>Cancel</Button><Button onClick={handleSaveStakeholder}>Add</Button></>}
            >
                <div className="space-y-4">
                    <Input label="Name" value={newStakeholder.name} onChange={e => setNewStakeholder({...newStakeholder, name: e.target.value})} placeholder="e.g. John Smith" />
                    <Input label="Role" value={newStakeholder.role} onChange={e => setNewStakeholder({...newStakeholder, role: e.target.value})} placeholder="e.g. Regulator" />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Interest</label>
                            <select className="w-full p-2 border rounded" value={newStakeholder.interest} onChange={e => setNewStakeholder({...newStakeholder, interest: e.target.value as any})}><option>High</option><option>Medium</option><option>Low</option></select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Influence</label>
                            <select className="w-full p-2 border rounded" value={newStakeholder.influence} onChange={e => setNewStakeholder({...newStakeholder, influence: e.target.value as any})}><option>High</option><option>Medium</option><option>Low</option></select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Engagement Strategy</label>
                        <textarea className="w-full p-2 border rounded h-24" value={newStakeholder.engagementStrategy} onChange={e => setNewStakeholder({...newStakeholder, engagementStrategy: e.target.value})} placeholder="Plan to manage expectation..." />
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};
