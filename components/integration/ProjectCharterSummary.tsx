
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Project, EVMMetrics } from '../../types';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { BookOpen } from 'lucide-react';

interface ProjectCharterSummaryProps {
    project: Project;
    financials: { totalPlanned: number; revisedBudget: number };
}

export const ProjectCharterSummary: React.FC<ProjectCharterSummaryProps> = ({ project, financials }) => {
    const { state } = useData();
    const pmName = useMemo(() => state.resources.find(r => r.id === project.managerId)?.name || 'Unassigned', [project, state.resources]);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold flex items-center gap-2"><BookOpen size={18} /> High-Level Charter</h3>
            </div>
            <div className="p-6">
                <dl className="space-y-4">
                    <div className="flex justify-between pb-3"><dt className="text-xs uppercase">Manager</dt><dd className="text-sm font-bold">{pmName}</dd></div>
                    <div className="flex justify-between pb-3"><dt className="text-xs uppercase">Start</dt><dd className="text-sm font-semibold">{formatDate(project.startDate)}</dd></div>
                    <div className="flex justify-between pb-3"><dt className="text-xs uppercase">Completion</dt><dd className="text-sm font-semibold">{formatDate(project.endDate)}</dd></div>
                    <div className="flex justify-between pt-1"><dt className="text-xs uppercase">Working Budget</dt><dd className="text-base font-mono font-black">{formatCurrency(financials.revisedBudget)}</dd></div>
                </dl>
            </div>
        </div>
    );
};