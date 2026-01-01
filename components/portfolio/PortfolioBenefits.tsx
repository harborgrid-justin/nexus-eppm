import React from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Star, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '../ui/Badge';

const PortfolioBenefits: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();

    const componentsMap = new Map([...state.projects, ...state.programs].map(item => [item.id, item.name]));

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'Realized': return <Badge variant="success" icon={CheckCircle}>Realized</Badge>;
            case 'In Progress': return <Badge variant="info" icon={Clock}>In Progress</Badge>;
            default: return <Badge variant="neutral">{status}</Badge>;
        }
    };

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className={theme.typography.h2}>Portfolio Benefits Register</h2>
                    <p className={theme.typography.small}>Track planned vs. realized value from all portfolio components.</p>
                </div>
            </div>

             <div className={`${theme.components.card} overflow-hidden`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Benefit Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Component</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Target Value</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Target Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {state.benefits.map(benefit => (
                                <tr key={benefit.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{benefit.description}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{componentsMap.get(benefit.componentId) || benefit.componentId}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${
                                            benefit.type === 'Financial' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                                        }`}>
                                            {benefit.type === 'Financial' ? <DollarSign size={12}/> : <Star size={12}/>}
                                            {benefit.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                                        {benefit.type === 'Financial' ? formatCurrency(benefit.value) : `${benefit.value} ${benefit.metric}`}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(benefit.targetDate)}</td>
                                    <td className="px-6 py-4">{getStatusBadge(benefit.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
    );
};

export default PortfolioBenefits;