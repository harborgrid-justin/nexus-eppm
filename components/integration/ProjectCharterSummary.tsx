
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Project } from '../../types';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { BookOpen } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ProjectCharterSummaryProps {
    project: Project;
    financials: { revisedBudget: number; };
}

export const ProjectCharterSummary: React.FC<ProjectCharterSummaryProps> = ({ project, financials }) => {
    const { state } = useData();
    const theme = useTheme();
    const pmName = useMemo(() => {
        if (!project.managerId || project.managerId === 'Unassigned') return 'Unassigned';
        return state.resources.find(r => r.id === project.managerId)?.name || project.managerId;
    }, [project, state.resources]);

    return (
        <div className={`${theme.colors.surface} rounded-2xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
            <div className={`px-6 py-5 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.background}/50`}>
                <h3 className={`font-bold ${theme.colors.text.primary} flex items-center gap-2`}><BookOpen size={18} /> High-Level Charter</h3>
            </div>
            <div className="p-6">
                <dl className="space-y-4">
                    <div className={`flex justify-between pb-3 border-b ${theme.colors.border.replace('border-', 'border-b-')}50`}>
                        <dt className={`text-xs ${theme.colors.text.tertiary} uppercase font-bold tracking-wider`}>Manager</dt>
                        <dd className={`text-sm font-bold ${theme.colors.text.primary}`}>{pmName}</dd>
                    </div>
                    <div className={`flex justify-between pb-3 border-b ${theme.colors.border.replace('border-', 'border-b-')}50`}>
                        <dt className={`text-xs ${theme.colors.text.tertiary} uppercase font-bold tracking-wider`}>Start</dt>
                        <dd className={`text-sm font-semibold ${theme.colors.text.secondary}`}>{formatDate(project.startDate)}</dd>
                    </div>
                    <div className={`flex justify-between pb-3 border-b ${theme.colors.border.replace('border-', 'border-b-')}50`}>
                        <dt className={`text-xs ${theme.colors.text.tertiary} uppercase font-bold tracking-wider`}>Completion</dt>
                        <dd className={`text-sm font-semibold ${theme.colors.text.secondary}`}>{formatDate(project.endDate)}</dd>
                    </div>
                    <div className="flex justify-between pt-1">
                        <dt className={`text-xs ${theme.colors.text.tertiary} uppercase font-bold tracking-wider`}>Working Budget</dt>
                        <dd className="text-base font-mono font-black text-nexus-700">{formatCurrency(financials.revisedBudget)}</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};
