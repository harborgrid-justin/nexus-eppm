
import React from 'react';
import { EnrichedStakeholder } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatters';
import { DollarSign, Shield, UserCheck, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface FinancialAuthorityProps {
    stakeholders: EnrichedStakeholder[];
}

export const FinancialAuthority: React.FC<FinancialAuthorityProps> = ({ stakeholders }) => {
    const theme = useTheme();
    const totalCapacity = stakeholders.reduce((sum, s) => sum + s.financialAuthority.limit, 0);
    const ccbMembers = stakeholders.filter(s => s.financialAuthority.ccbMember).length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border flex items-center gap-4"><div className="p-3 bg-green-100 rounded-full"><DollarSign size={24}/></div><div><p className="text-sm">Total Capacity</p><p className="text-2xl font-bold">{formatCurrency(totalCapacity)}</p></div></div>
                <div className="bg-white p-5 rounded-xl border flex items-center gap-4"><div className="p-3 bg-purple-100 rounded-full"><Shield size={24}/></div><div><p className="text-sm">CCB Members</p><p className="text-2xl font-bold">{ccbMembers}</p></div></div>
                <div className="bg-white p-5 rounded-xl border flex items-center gap-4"><div className="p-3 bg-blue-100 rounded-full"><UserCheck size={24}/></div><div><p className="text-sm">Budget Owners</p><p className="text-2xl font-bold">3</p></div></div>
            </div>

            <div className={`rounded-xl border overflow-hidden ${theme.colors.surface} ${theme.colors.border}`}>
                <div className="p-4 border-b bg-slate-50"><h3 className="font-bold">Financial Authority Register</h3></div>
                <table className="min-w-full divide-y">
                    <thead><tr>
                        <th className="px-6 py-3 text-left text-xs uppercase">Stakeholder</th><th className="px-6 py-3 text-left text-xs uppercase">Cost Influence</th>
                        <th className="px-6 py-3 text-right text-xs uppercase">Limit</th><th className="px-6 py-3 text-center text-xs uppercase">CCB</th>
                    </tr></thead>
                    <tbody className="divide-y">
                    {stakeholders.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4"><div className="font-bold text-sm">{s.name}</div></td>
                        <td className="px-6 py-4"><Badge variant={s.financialAuthority.costInfluence === 'High' ? 'danger' : 'neutral'}>{s.financialAuthority.costInfluence}</Badge></td>
                        <td className="px-6 py-4 text-right font-mono text-sm font-bold">{formatCurrency(s.financialAuthority.limit)}</td>
                        <td className="px-6 py-4 text-center">{s.financialAuthority.ccbMember && <CheckCircle size={14} className="text-green-500" />}</td>
                    </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
