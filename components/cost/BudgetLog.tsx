
import React, { useMemo, useState } from 'react';
import { useProjectState } from '../../hooks';
import { Plus, CheckCircle, Clock, XCircle, Lock, Save } from 'lucide-react';
import { BudgetLogItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { usePermissions } from '../../hooks/usePermissions';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';

interface BudgetLogProps {
    projectId: string;
}

const BudgetLog: React.FC<BudgetLogProps> = ({ projectId }) => {
    const { project } = useProjectState(projectId);
    const { hasPermission, user } = usePermissions();
    const canWriteBudget = hasPermission('financials:write');

    // Panel State
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

    const getStatusIcon = (status: BudgetLogItem['status']) => {
        switch (status) {
            case 'Approved': return <CheckCircle size={14} className="text-green-500" />;
            case 'Pending': return <Clock size={14} className="text-yellow-500" />;
            case 'Not Approved': return <XCircle size={14} className="text-red-500" />;
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
            submittedBy: user?.name || 'User'
        };
        // In real app, dispatch to store
        console.log("Saving budget log:", logItem);
        setIsPanelOpen(false);
        setNewItem({ description: '', amount: 0, source: 'Management Reserve', status: 'Pending' });
    };

    if (!project || !budgetSummary) return <div>Loading budget...</div>;

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 grid grid-cols-4 gap-4 bg-slate-50/50">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <p className="text-xs font-medium text-slate-500">Original Budget</p>
                    <p className="text-lg font-bold text-slate-800">{formatCurrency(project.originalBudget)}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <p className="text-xs font-medium text-slate-500">Net Changes</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(budgetSummary.approvedChanges)}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <p className="text-xs font-medium text-slate-500">Current Budget</p>
                    <p className="text-lg font-bold text-slate-800">{formatCurrency(budgetSummary.currentBudget)}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs font-medium text-yellow-700">Proposed Budget</p>
                    <p className="text-lg font-bold text-yellow-800">{formatCurrency(budgetSummary.proposedBudget)}</p>
                </div>
            </div>
            <div className="p-4 border-b border-slate-200 flex justify-end items-center">
                {canWriteBudget ? (
                    <button
                        onClick={() => setIsPanelOpen(true)}
                        className="px-3 py-2 bg-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium"
                    >
                        <Plus size={16} /> Log Budget Change
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                        <Lock size={14} /> Budget Log Locked
                    </div>
                )}
            </div>
            <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Source</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted By</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {project.budgetLog?.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-800">{item.description}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{item.source || 'Manual Entry'}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{item.submittedBy}</td>
                                <td className="px-6 py-4 text-sm text-center">
                                    <span className="flex items-center justify-center gap-2">
                                        {getStatusIcon(item.status)} {item.status}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 text-sm font-semibold text-right ${item.amount < 0 ? 'text-red-600' : 'text-slate-800'}`}>
                                    {formatCurrency(item.amount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title="Log Budget Change"
                width="md:w-[500px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveLog} icon={Save}>Save Entry</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Change Type / Source</label>
                        <select
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                            value={newItem.source}
                            onChange={e => setNewItem({ ...newItem, source: e.target.value })}
                        >
                            <option>Management Reserve</option>
                            <option>Contingency Drawdown</option>
                            <option>Scope Change</option>
                            <option>Transfer</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <Input
                            value={newItem.description}
                            onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                            placeholder="Reason for budget adjustment..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <input
                                type="number"
                                className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg text-sm"
                                value={newItem.amount}
                                onChange={e => setNewItem({ ...newItem, amount: parseFloat(e.target.value) })}
                                placeholder="0.00"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Use negative values for reductions.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                            value={newItem.status}
                            onChange={e => setNewItem({ ...newItem, status: e.target.value as any })}
                        >
                            <option value="Pending">Pending Approval</option>
                            <option value="Approved">Approved (Immediate)</option>
                        </select>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default BudgetLog;
