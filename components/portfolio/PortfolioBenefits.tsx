import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Star, DollarSign, CheckCircle, Clock, Plus, Target } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { usePortfolioBenefitsLogic } from '../../hooks/domain/usePortfolioBenefitsLogic';
import { EmptyGrid } from '../common/EmptyGrid';
import { Button } from '../ui/Button';

const PortfolioBenefits: React.FC = () => {
    const theme = useTheme();
    const { benefits, isEmpty } = usePortfolioBenefitsLogic();

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'Realized': return <Badge variant="success" icon={CheckCircle}>Realized</Badge>;
            case 'In Progress': return <Badge variant="info" icon={Clock}>In Progress</Badge>;
            default: return <Badge variant="neutral">{status}</Badge>;
        }
    };

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300 scrollbar-thin`}>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className={theme.typography.h2}>Benefits Realization Register</h2>
                    <p className={theme.typography.small}>Tracking planned vs. harvested value across the enterprise portfolio.</p>
                </div>
                {!isEmpty && <Button variant="primary" icon={Plus} size="md">Identify Benefit</Button>}
            </div>

             <div className={`flex-1 flex flex-col overflow-hidden`}>
                {isEmpty ? (
                    <div className="flex-1 flex h-full">
                        <EmptyGrid 
                            title="Benefits Pipeline Null" 
                            description="No strategic or operational benefits have been registered. Quantifying value realization is required for portfolio ROI analysis." 
                            icon={Star} 
                            actionLabel="Register Strategic Benefit"
                            onAdd={() => {}}
                        />
                    </div>
                ) : (
                    <div className={`${theme.components.card} overflow-hidden shadow-sm`}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                                <thead className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10 shadow-sm border-b">
                                    <tr>
                                        <th className={theme.components.table.header + " py-6 px-8"}>Strategic Benefit</th>
                                        <th className={theme.components.table.header}>Origin Component</th>
                                        <th className={theme.components.table.header}>Value Classification</th>
                                        <th className={theme.components.table.header + " text-right"}>Target Realization</th>
                                        <th className={theme.components.table.header}>Maturity Date</th>
                                        <th className={theme.components.table.header + " text-center"}>Harvest Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 bg-white">
                                    {benefits.map(benefit => (
                                        <tr key={benefit.id} className="nexus-table-row group transition-colors hover:bg-slate-50/50">
                                            <td className="px-8 py-4">
                                                <div className={`font-black text-sm text-slate-800 uppercase tracking-tight`}>{benefit.description}</div>
                                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">REF: {benefit.id}</div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{benefit.componentName}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                                    benefit.type === 'Financial' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-100'
                                                }`}>
                                                    {benefit.type === 'Financial' ? <DollarSign size={12}/> : <Star size={12}/>}
                                                    {benefit.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="font-mono font-black text-sm text-slate-900">
                                                    {benefit.type === 'Financial' ? formatCurrency(benefit.value) : `${benefit.value} ${benefit.metric}`}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-mono font-bold text-slate-400">{formatDate(benefit.targetDate)}</td>
                                            <td className="px-6 py-4 text-center">{getStatusBadge(benefit.status)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
             </div>
        </div>
    );
};

export default PortfolioBenefits;