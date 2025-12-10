import React, { useMemo } from 'react';
import { useProjectState } from '../../hooks/useProjectState';
import { Plus, CheckCircle, Clock, XCircle } from 'lucide-react';
import { BudgetLogItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface BudgetLogProps {
    projectId: string;
}

const BudgetLog: React.FC<BudgetLogProps> = ({ projectId }) => {
    const { project } = useProjectState(projectId);

    const budgetSummary = useMemo(() => {
        if (!project) return null;
        const approvedChanges = project.budgetLog?.filter(i => i.status === 'Approved' && i.source !== 'Initial').reduce((sum, i) => sum + i.amount, 0) || 0;
        const pendingChanges = project.budgetLog?.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0) || 0;
        const currentBudget = project.originalBudget + approvedChanges;
        const proposedBudget = currentBudget + pendingChanges;
        return { approvedChanges, pendingChanges, currentBudget, proposedBudget };
    }, [project]);

    const getStatusIcon = (status: BudgetLogItem['status']) => {
        switch(status) {
            case 'Approved': return <CheckCircle size={14} className="text-green-500" />;
            case 'Pending': return <Clock size={14} className="text-yellow-500" />;
            case 'Not Approved': return <XCircle size={14} className="text-red-500" />;
        }
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
                 <button className="px-3 py-2 bg-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium">
                    <Plus size={16} /> Log Budget Change
                </button>
            </div>
            <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
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
                                <td className="px-6 py-4 text-sm text-slate-500">{item.submittedBy}</td>
                                <td className="px-6 py-4 text-sm text-center">
                                    <span className="flex items-center justify-center gap-2">
                                        {getStatusIcon(item.status)} {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-right text-slate-800">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BudgetLog;