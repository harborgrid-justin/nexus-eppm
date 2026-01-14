import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { Globe, Plus, Save, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
// Added missing Card component import
import { Card } from '../ui/Card';

const CurrencyRegistry: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const { t } = useI18n();
    const { exchangeRates, inflationRate } = state.governance;

    return (
        <div className="h-full flex flex-col space-y-6 max-w-4xl mx-auto">
            <div className={`p-6 rounded-2xl bg-white border ${theme.colors.border} flex justify-between items-center shadow-sm`}>
                <div>
                    <h3 className="text-lg font-black uppercase tracking-tighter text-slate-800 flex items-center gap-2"><Globe className="text-blue-500"/> {t('admin.currency_reg', 'Multi-Currency Registry')}</h3>
                    <p className="text-sm text-slate-500 mt-1">{t('admin.currency_subtitle', 'Corporate standardized exchange rates.')}</p>
                </div>
                <Button size="sm" icon={Plus}>{t('common.add', 'Add Currency')}</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fixed missing Card component by adding the import above */}
                <Card className="p-6 border-l-4 border-l-green-500">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-green-600"/> {t('admin.inflation', 'Annual Inflation Target')}</h4>
                    <div className="flex items-center gap-3">
                        <input type="number" className="text-3xl font-black text-slate-900 w-24 border-b-2 border-slate-200 outline-none focus:border-nexus-600" value={(inflationRate * 100).toFixed(1)} readOnly />
                        <span className="text-3xl font-bold text-slate-300">%</span>
                    </div>
                </Card>
                <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-nexus-400 mb-1">{t('admin.base_currency', 'Reporting Base')}</p>
                        <h4 className="text-4xl font-black">{state.governance.organization.currency}</h4>
                        <p className="text-xs text-slate-500 mt-2">{t('admin.base_desc', 'All portfolio results consolidated to this baseline.')}</p>
                    </div>
                    <DollarSign size={120} className="absolute -right-8 -bottom-8 text-white/5 pointer-events-none rotate-12" />
                </div>
            </div>

            <div className={`flex-1 rounded-2xl border ${theme.colors.border} bg-white shadow-sm overflow-hidden flex flex-col`}>
                <div className="p-4 bg-slate-50/50 border-b font-black text-[10px] uppercase text-slate-500 tracking-widest">{t('admin.exchange_rates', 'Standard Rate Matrix')}</div>
                <div className="overflow-auto flex-1">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-white">
                            <tr>
                                <th className={theme.components.table.header}>{t('common.code', 'ISO Code')}</th>
                                <th className={theme.components.table.header}>{t('common.rate', 'Factor vs Base')}</th>
                                <th className={theme.components.table.header}>{t('common.status', 'Status')}</th>
                                <th className={theme.components.table.header}></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {Object.entries(exchangeRates).map(([code, rate]) => (
                                <tr key={code} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-mono font-bold text-sm text-slate-800">{code}</td>
                                    <td className="px-6 py-4 font-mono text-sm text-nexus-700 font-black">{(rate as number).toFixed(4)}</td>
                                    <td className="px-6 py-4"><Badge variant="success">Current</Badge></td>
                                    <td className="px-6 py-4 text-right"><button className="text-slate-300 hover:text-nexus-600 opacity-0 group-hover:opacity-100 transition-all"><Save size={16}/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default CurrencyRegistry;