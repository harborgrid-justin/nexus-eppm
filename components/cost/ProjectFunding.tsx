
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useProjectState } from '../../hooks';
import { Banknote, Plus, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

interface ProjectFundingProps {
    projectId: string;
}

const COLORS = ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e'];

const ProjectFunding: React.FC<ProjectFundingProps> = ({ projectId }) => {
    const { state } = useData();
    const { project } = useProjectState(projectId);

    const fundingData = useMemo(() => {
        return project?.funding?.map(f => {
            const source = state.fundingSources.find(s => s.id === f.fundingSourceId);
            return {
                name: source?.name || 'Unknown Source',
                value: f.amount
            };
        }) || [];
    }, [project, state.fundingSources]);

    const totalFunding = fundingData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
                <h3 className="font-semibold text-slate-700">Project Funding Sources</h3>
                <button className="px-3 py-2 bg-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium">
                    <Plus size={16} /> Assign Fund
                </button>
            </div>

            <div className="flex-1 overflow-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Funding Source</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {fundingData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-800">{item.name}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-right text-slate-600">{formatCurrency(item.value)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-100">
                                <tr>
                                    <td className="px-4 py-2 text-sm font-bold text-slate-800">Total Funding</td>
                                    <td className="px-4 py-2 text-sm font-bold text-right text-slate-800">{formatCurrency(totalFunding)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                 <div className="h-80 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="text-slate-800 font-bold mb-4 flex items-center gap-2"><PieChartIcon size={16} /> Funding Distribution</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={fundingData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
                                {fundingData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ProjectFunding;
