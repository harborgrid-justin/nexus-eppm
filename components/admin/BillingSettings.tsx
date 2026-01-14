import React from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { CreditCard, Users, Database, Zap, DollarSign, ShieldCheck } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../common/ProgressBar';

const BillingSettings: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const { t } = useI18n();
    const billing = state.governance.billing;

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in">
            <div className={`grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
                <div className={`p-6 rounded-2xl border ${theme.colors.border} ${theme.colors.surface} shadow-sm flex items-center gap-6`}>
                    <div className="p-4 bg-nexus-50 text-nexus-600 rounded-xl border border-nexus-100 shadow-inner"><Zap size={32} /></div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('billing.tier', 'Entitlement Tier')}</p>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{billing.licenseType}</h4>
                        <p className="text-xs text-slate-500 mt-1">{t('billing.renewal', 'Renewal')}: <span className="font-bold">{billing.renewalDate || '2024-12-31'}</span></p>
                    </div>
                </div>
                <div className={`p-6 rounded-2xl border ${theme.colors.border} ${theme.colors.surface} shadow-sm`}>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Users size={12}/> {t('billing.seats', 'Seat Allocation')}</p>
                        <span className="text-xs font-black">{state.users.length} / {billing.seatLimit}</span>
                    </div>
                    <ProgressBar value={state.users.length} max={billing.seatLimit} thresholds size="sm" />
                </div>
                <div className={`p-6 rounded-2xl border ${theme.colors.border} ${theme.colors.surface} shadow-sm`}>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Database size={12}/> {t('billing.storage', 'Data Retention')}</p>
                        <span className="text-xs font-black">42 / {billing.storageLimitGB} GB</span>
                    </div>
                    <ProgressBar value={42} max={billing.storageLimitGB} thresholds size="sm" />
                </div>
            </div>

            <div className={`flex-1 overflow-hidden flex flex-col ${theme.colors.surface} rounded-2xl border ${theme.colors.border} shadow-sm`}>
                <div className="p-5 border-b flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">{t('billing.ledger', 'Financial Ledger & Artifacts')}</h3>
                    <button className="text-xs font-bold text-nexus-600 hover:underline">{t('billing.update_card', 'Update Payment Method')}</button>
                </div>
                <div className="overflow-auto flex-1">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-white">
                            <tr>
                                <th className={theme.components.table.header}>{t('common.id', 'Entry ID')}</th>
                                <th className={theme.components.table.header}>{t('common.date', 'Post Date')}</th>
                                <th className={theme.components.table.header}>{t('common.desc', 'Description')}</th>
                                <th className={theme.components.table.header + " text-right"}>{t('common.total', 'Net Total')}</th>
                                <th className={theme.components.table.header + " text-center"}>{t('common.status', 'Status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {billing.history.map(inv => (
                                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-400 uppercase">{inv.id}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{inv.date}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{inv.description}</td>
                                    <td className="px-6 py-4 text-right font-mono font-bold">{formatCurrency(inv.amount)}</td>
                                    <td className="px-6 py-4 text-center"><Badge variant={inv.status === 'Paid' ? 'success' : 'warning'}>{inv.status}</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default BillingSettings;