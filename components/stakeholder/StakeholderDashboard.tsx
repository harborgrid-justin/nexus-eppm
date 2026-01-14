import React, { useMemo, useState } from 'react';
import { EnrichedStakeholder, Stakeholder } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../shared/StatCard';
import { Users, Target, AlertTriangle, MessageSquare, Plus, ShieldCheck } from 'lucide-react';
import { PowerInterestGrid } from './PowerInterestGrid';
import { Badge } from '../ui/Badge';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { Button } from '../ui/Button';
import { SidePanel } from '../ui/SidePanel';
import { Input } from '../ui/Input';
import { useData } from '../../context/DataContext';
import { generateId } from '../../utils/formatters';
import { FieldPlaceholder } from '../common/FieldPlaceholder';
import { Card } from '../ui/Card';

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

    // Aggregate real high-priority issues from state to show as stakeholder concerns
    const stakeholderConcerns = useMemo(() => 
        (issues || [])
            .filter(i => i.priority === 'High' || i.priority === 'Critical')
            .slice(0, 5), 
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
        <div className="space-y-8 animate-in fade-in h-full flex flex-col">
            <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
                <StatCard title="Total Stakeholders" value={metrics.total} icon={Users} />
                <StatCard title="Key Influencers" value={metrics.highPower} icon={Target} />
                <StatCard title="Engagement Gaps" value={metrics.gapCount} icon={AlertTriangle} trend={metrics.gapCount > 0 ? 'down' : 'up'} />
                <StatCard title="Authority Check" value="92%" icon={ShieldCheck} subtext="Financial linkage" />
            </div>
            
            <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap} flex-1 min-h-0`}>
                <Card className={`p-8 h-[450px] flex flex-col shadow-sm border-slate-200`} >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                             <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Power / Interest Matrix</h3>
                             <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Salience Model Distribution</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setIsAddPanelOpen(true)}>Register</Button>
                    </div>
                    <div className="flex-1 min-h-0">
                        {stakeholders.length > 0 ? (
                            <PowerInterestGrid stakeholders={stakeholders} />
                        ) : (
                            <FieldPlaceholder 
                                label="No stakeholders registered." 
                                onAdd={() => setIsAddPanelOpen(true)} 
                                icon={Target} 
                            />
                        )}
                    </div>
                </Card>

                <Card className={`p-8 h-[450px] flex flex-col shadow-sm border-slate-200`} >
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Active Concerns & Escalations</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin">
                        {stakeholderConcerns.length > 0 ? stakeholderConcerns.map((issue) => (
                            <div key={issue.id} className={`p-4 rounded-xl border flex justify-between items-center bg-slate-50/50 border-slate-100 hover:border-nexus-200 transition-all group cursor-default shadow-sm`}>
                                <div className="min-w-0 flex-1 pr-4">
                                    <p className="font-bold text-sm text-slate-800 line-clamp-1">{issue.description}</p>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight mt-1">Ref: {issue.id} • Assigned: {issue.assigneeId}</p>
                                </div>
                                <Badge variant={issue.priority === 'Critical' ? 'danger' : issue.priority === 'High' ? 'warning' : 'info'}>{issue.priority}</Badge>
                            </div>
                        )) : (
                            <FieldPlaceholder 
                                label="No high-priority stakeholder concerns." 
                                placeholderLabel="All salience concerns are currently mitigated."
                                onAdd={() => {}} 
                                icon={MessageSquare}
                            />
                        )}
                    </div>
                </Card>
            </div>

            <SidePanel
                isOpen={isAddPanelOpen}
                onClose={() => setIsAddPanelOpen(false)}
                title="Identify Project Stakeholder"
                width="md:w-[450px]"
                footer={<><Button variant="secondary" onClick={() => setIsAddPanelOpen(false)}>Cancel</Button><Button onClick={handleSaveStakeholder}>Add Stakeholder</Button></>}
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Identity</label>
                        <Input value={newStakeholder.name} onChange={e => setNewStakeholder({...newStakeholder, name: e.target.value})} placeholder="e.g. Alexandra Hamilton" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Functional Designation</label>
                        <Input value={newStakeholder.role} onChange={e => setNewStakeholder({...newStakeholder, role: e.target.value})} placeholder="e.g. Chief Legal Officer" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Interest Level</label>
                            <select className="w-full p-2.5 border border-slate-300 rounded-xl text-sm bg-slate-50 font-bold focus:ring-2 focus:ring-nexus-500" value={newStakeholder.interest} onChange={e => setNewStakeholder({...newStakeholder, interest: e.target.value as any})}><option>High</option><option>Medium</option><option>Low</option></select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Influence Power</label>
                            <select className="w-full p-2.5 border border-slate-300 rounded-xl text-sm bg-slate-50 font-bold focus:ring-2 focus:ring-nexus-500" value={newStakeholder.influence} onChange={e => setNewStakeholder({...newStakeholder, influence: e.target.value as any})}><option>High</option><option>Medium</option><option>Low</option></select>
                        </div>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};