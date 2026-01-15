
import React, { useMemo, useState } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
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
import { useData } from '../../context/DataContext';
import { EmptyGrid } from '../common/EmptyGrid';
import { useI18n } from '../../context/I18nContext';

export const BudgetLog: React.FC = () => {
    const { project } = useProjectWorkspace();
    const { dispatch } = useData();
    const { t } = useI18n();
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
        return { approvedChanges, pendingChanges, currentBudget };
    }, [project]);

    const getStatusBadge = (status: BudgetLogItem['status']) => {
        switch(status) {
            case 'Approved': return <Badge variant="success" icon={CheckCircle}>{t('status.approved', 'Approved')}</Badge>;
            case 'Pending': return <Badge variant="warning" icon={Clock}>{t('status.pending', 'Pending')}</Badge>;
            case 'Not Approved': return <Badge variant="danger" icon={XCircle}>{t('status.rejected', 'Rejected')}</Badge>;
        }
    };

    const handleSaveLog = () => {
        if (!newItem.description || !newItem.amount) return;
        const logItem: BudgetLogItem = {
            id: generateId('BL'),
            projectId: project.id,
            date: new Date().toISOString().split('T')[0],
            description: newItem.description || '',
            amount: newItem.amount || 0,
            status: newItem.status || 'Pending',
            source: newItem.source || 'Standard',
            submitterId: user?.id || 'User'
        };
        
        dispatch({ type: 'ADD_PROJECT_BUDGET_LOG', payload: { projectId: project.id, logItem } });
        setIsPanelOpen(false);
        setNewItem({ description: '', amount: 0, source: 'Management Reserve', status: 'Pending' });
    };

    const hasTransactions = project.budgetLog && project.budgetLog.length > 0;

    return (
        <div className={`h-full flex flex-col ${theme.colors.background}/30`}>
            <div className={`p-6 border-b ${theme.colors.border} grid grid-cols-1 md:grid-cols-3 gap-6 ${theme.colors.surface} shadow-sm flex-shrink-0`}>
                <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border}`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Baseline Authority</p>
                    <p className="text-xl font-black text-slate-900 font-mono">{formatCurrency(project.originalBudget)}</p>
                </div>
                 <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border}`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Approved Delta</p>
                    <p className={`text-xl font-black font-mono ${budgetSummary?.approvedChanges! >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {budgetSummary?.approvedChanges! > 0 ? '+' : ''}{formatCurrency(budgetSummary?.approvedChanges!)}
                    </p>
                </div>
                 <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border}`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Working Budget</p>
                    <p className="text-xl font-black text-nexus-700 font-mono">{formatCurrency(budgetSummary?.currentBudget!)}</p>
                </div>
            </div>

            <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.surface} flex-shrink-0 z-10`}>
                 <div className="flex items-center gap-2">
                    <History size={18} className="text-nexus-600" />
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">Financial Transaction Journal</h3>
                 </div>
                 {canWriteBudget ? (
                    <Button onClick={() => setIsPanelOpen(true)} icon={Plus} size="sm">Record Adjustment</Button>
                 ) : (
                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${theme.colors.text.tertiary} ${theme.colors.background} px-3 py-1.5 rounded-lg border ${theme.colors.border}`}>
                        <Lock size={12} /> Registry Locked
                    </div>
                 )}
            </div>

            <div className={`flex-1 overflow-auto bg-white relative`}>
                {!hasTransactions ? (
                    <EmptyGrid 
                        title="Transaction Log Clear"
                        description="No budgetary adjustments or baseline snapshots have been recorded for this fiscal period. All spend is tracking against initial authorization."
                        onAdd={canWriteBudget ? () => setIsPanelOpen(true) : undefined}
                        actionLabel="Adjust Project Budget"
                        icon={History}
                    />
                ) : (
                    <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                        <thead className={`${theme.colors.background} sticky top-0 z-20 shadow-sm`}>
                            <tr>
                                <th className={theme.components.table.header}>Post Date</th>
                                <th className={theme.components.table.header}>Narrative</th>
                                <th className={theme.components.table.header}>Source Pool</th>
                                <th className={`${theme.components.table.header} text-center`}>Status</th>
                                <th className={`${theme.components.table.header} text-right`}>Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                            {project.budgetLog?.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-400">{item.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-800">{item.description}</div>
                                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-tighter">Auth: {item.submitterId}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200 tracking-tight">
                                            <Landmark size={10} className="text-slate-400"/> {item.source || 'Standard'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {getStatusBadge(item.status)}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-mono font-black ${item.amount < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                                        {item.amount > 0 ? '+' : ''}{formatCurrency(item.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title="Log Fiscal Adjustment"
                width="md:w-[500px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveLog} icon={Save}>Commit Record</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Funding Allocation</label>
                        <select 
                            className="w-full p-3 border border-slate-300 rounded-xl text-sm bg-slate-50 font-bold focus:ring-2 focus:ring-nexus-500 outline-none"
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
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Transaction Narrative</label>
                        <Input 
                            value={newItem.description} 
                            onChange={e => setNewItem({...newItem, description: e.target.value})}
                            placeholder="Reason for adjustment..."
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Delta Amount ($)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">$</span>
                            <input 
                                type="number" 
                                className="w-full pl-8 pr-4 py-4 border border-slate-300 rounded-xl text-xl font-mono font-black focus:ring-4 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none bg-white transition-all shadow-inner"
                                value={newItem.amount}
                                onChange={e => setNewItem({...newItem, amount: parseFloat(e.target.value)})}
                            />
                        </div>
                        <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-tight">Positive values increase budget; negative values represent a reduction.</p>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};
