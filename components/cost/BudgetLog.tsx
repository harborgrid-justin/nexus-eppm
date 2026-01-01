
import React, { useMemo, useState } from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { BudgetLogItem } from '../../types/index';
import { Plus, CheckCircle, Clock, XCircle, Lock, Save, Landmark, History } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { usePermissions } from '../../hooks/usePermissions';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../context/ThemeContext';


export const BudgetLog: React.FC = () => {
    const { project } = useProjectWorkspace();
    const projectId = project.id;
    const { hasPermission, user } = usePermissions();
    const theme = useTheme();
    const canWriteBudget = hasPermission('financials:write');
    
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [newItem, setNewItem] = useState<Partial<BudgetLogItem>>({
        description: '',
        amount: 0,
        source: 'Management Reserve',
        status: 'Pending'
    });

    const budgetSummary = useMemo(() => {
        if (!project) return null;
        const approvedChanges = project.budgetLog?.filter(i => i.status === 'Approved' && i.source !== 'Initial').reduce((sum, i) => sum + i.amount, 0) || 0;
        const pendingChanges = project.budgetLog?.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0) || 0;
        const currentBudget = project.originalBudget + approvedChanges;
        const proposedBudget = currentBudget + pendingChanges;
        return { approvedChanges, pendingChanges, currentBudget, proposedBudget };
    }, [project]);

    const getStatusBadge = (status: BudgetLogItem['status']) => {
        switch(status) {
            case 'Approved': return <Badge variant="success" icon={CheckCircle}>Approved</Badge>;
            case 'Pending': return <Badge variant="warning" icon={Clock}>Pending</Badge>;
            case 'Not Approved': return <Badge variant="danger" icon={XCircle}>Rejected</Badge>;
        }
    };

    const handleSaveLog = () => {
        if (!newItem.description || !newItem.amount) return;
        const logItem: BudgetLogItem = {
            id: generateId('BL'),
            projectId,
            date: new Date().toISOString().split('T')[0],
            description: newItem.description || '',
            amount: newItem.amount || 0,
            status: newItem.status || 'Pending',
            source: newItem.source,
            submitterId: user?.id || 'User'
        };
        console.log("Saving budget log:", logItem);
        setIsPanelOpen(false);
        setNewItem({ description: '', amount: 0, source: 'Management Reserve', status: 'Pending' });
    };

    if (!project || !budgetSummary) return <div>Loading budget...</div>;

    return (
        <div className={`h-full flex flex-col ${theme.colors.background}/30`}>
            <div className={`p-6 border-b ${theme.colors.border} grid grid-cols-1 md:grid-cols-4 gap-4 ${theme.colors.surface} shadow-sm flex-shrink-0`}>
                <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border}`}>
                    <p className={`text-[10px] font-bold ${theme.colors.text.tertiary} uppercase tracking-widest mb-1`}>Baseline Budget</p>
                    <p className={`text-xl font-black ${theme.colors.text.primary} font-mono`}>{formatCurrency(project.originalBudget)}</p>
                </div>
                 <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border}`}>
                    <p className={`text-[10px] font-bold ${theme.colors.text.tertiary} uppercase tracking-widest mb-1`}>Total Approved Delta</p>
                    <p className={`text-xl font-black font-mono ${budgetSummary.approvedChanges >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {budgetSummary.approvedChanges > 0 ? '+' : ''}{formatCurrency(budgetSummary.approvedChanges)}
                    </p>
                </div>
                 <div className={`p-4 ${theme.colors.semantic.info.bg} rounded-xl border ${theme.colors.semantic.info.border}`}>
                    <p className={`text-[10px] font-bold ${theme.colors.semantic.info.text} uppercase tracking-widest mb-1`}>Working Budget</p>
                    <p className={`text-xl font-black ${theme.colors.semantic.info.text} font-mono`}>{formatCurrency(budgetSummary.currentBudget)}</p>
                </div>
                 <div className={`p-4 ${theme.colors.semantic.warning.bg} rounded-xl border ${theme.colors.semantic.warning.border}`}>
                    <p className={`text-[10px] font-bold ${theme.colors.semantic.warning.text} uppercase tracking-widest mb-1`}>Unapproved Exposure</p>
                    <p className={`text-xl font-black ${theme.colors.semantic.warning.text} font-mono`}>{formatCurrency(budgetSummary.pendingChanges)}</p>
                </div>
            </div>

            <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.surface} flex-shrink-0`}>
                 <div className="flex items-center gap-2">
                    <History size={18} className={theme.colors.text.tertiary} />
                    <h3 className={`font-bold ${theme.colors.text.primary} text-sm`}>Budget Transaction Log</h3>
                 </div>
                 {canWriteBudget ? (
                    <Button onClick={() => setIsPanelOpen(true)} icon={Plus} size="sm">Adjust Budget</Button>
                 ) : (
                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${theme.colors.text.tertiary} ${theme.colors.background} px-3 py-1.5 rounded-lg border ${theme.colors.border}`}>
                        <Lock size={12} /> Registry Locked
                    </div>
                 )}
            </div>

            <div className={`flex-1 overflow-auto ${theme.colors.surface}`}>
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm`}>
                        <tr>
                            <th className={theme.components.table.header}>Post Date</th>
                            <th className={theme.components.table.header}>Narrative</th>
                            <th className={theme.components.table.header}>Source Pool</th>
                            <th className={`${theme.components.table.header} text-center`}>Status</th>
                            <th className={`${theme.components.table.header} text-right`}>Amount</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')} ${theme.colors.surface}`}>
                        {project.budgetLog?.map(item => (
                            <tr 
                                key={item.id} 
                                className={theme.components.table.row}
                                tabIndex={0}
                            >
                                <td className={`${theme.components.table.cell} text-xs font-mono font-bold ${theme.colors.text.tertiary}`}>{item.date}</td>
                                <td className={theme.components.table.cell}>
                                    <div className={`text-sm font-bold ${theme.colors.text.primary}`}>{item.description}</div>
                                    <div className={`text-[10px] ${theme.colors.text.tertiary} font-mono mt-0.5 uppercase tracking-tighter`}>Auth: {item.submitterId}</div>
                                </td>
                                <td className={theme.components.table.cell}>
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${theme.colors.text.secondary} ${theme.colors.background} px-2 py-0.5 rounded border ${theme.colors.border}`}>
                                        <Landmark size={10} className={theme.colors.text.tertiary}/> {item.source || 'Standard'}
                                    </span>
                                </td>
                                <td className={`${theme.components.table.cell} text-center`}>
                                    {getStatusBadge(item.status)}
                                </td>
                                <td className={`${theme.components.table.cell} text-right font-black font-mono ${item.amount < 0 ? theme.colors.semantic.danger.text : theme.colors.text.primary}`}>
                                    {item.amount > 0 ? '+' : ''}{formatCurrency(item.amount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title="Post Budget Transaction"
                width="md:w-[500px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveLog} icon={Save}>Commit Entry</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div>
                        <label className={`${theme.typography.label} block mb-1.5`}>Source Pool / Allocation</label>
                        <select 
                            className={`w-full p-3 border ${theme.colors.border} rounded-xl text-sm ${theme.colors.surface} font-bold ${theme.colors.text.primary} outline-none focus:ring-2 focus:ring-nexus-500`}
                            value={newItem.source}
                            onChange={e => setNewItem({...newItem, source: e.target.value})}
                        >
                            <option>Management Reserve</option>
                            <option>Contingency Drawdown</option>
                            <option>Strategic Re-allocation</option>
                            <option>Contract Scope Change</option>
                        </select>
                    </div>
                    <div>
                        <label className={`${theme.typography.label} block mb-1.5`}>Transaction Narrative</label>
                        <Input 
                            value={newItem.description} 
                            onChange={e => setNewItem({...newItem, description: e.target.value})}
                            placeholder="Reason for adjustment..."
                        />
                    </div>
                    <div>
                        <label className={`${theme.typography.label} block mb-1.5`}>Delta Amount ($)</label>
                        <div className="relative">
                            <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.colors.text.secondary} font-bold`}>$</span>
                            <input 
                                type="number" 
                                className={`w-full pl-8 pr-4 py-3 border ${theme.colors.border} rounded-xl text-lg font-mono font-black focus:ring-2 focus:ring-nexus-500 outline-none`}
                                value={newItem.amount}
                                onChange={e => setNewItem({...newItem, amount: parseFloat(e.target.value)})}
                                placeholder="0.00"
                            />
                        </div>
                        <p className={`text-[10px] ${theme.colors.text.tertiary} mt-2 font-medium`}>Positive values increase the budget; negative values represent a reduction.</p>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};
