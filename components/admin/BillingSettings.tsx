import React from 'react';
import { CreditCard, Users, Database, Zap, Download, ExternalLink, ShieldCheck, DollarSign } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

const BillingSettings: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const billing = state.governance.billing;
    const seatCount = state.users.length;
    // Mock storage usage calculation based on documents count
    const storageUsed = state.documents.length * 0.5; // Avg 0.5 GB per doc for mock

    return (
        <div className={`h-full flex flex-col ${theme.layout.sectionSpacing} animate-in fade-in duration-300 pb-20`}>
            {/* Top Level Summary */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${theme.layout.gridGap}`}>
                <div className={`bg-white ${theme.layout.cardPadding} rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6`}>
                    <div className="p-4 bg-nexus-50 text-nexus-600 rounded-2xl border border-nexus-100 shadow-sm shrink-0">
                        <Zap size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entitlement Tier</p>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{billing.licenseType}</h4>
                        <p className="text-xs text-slate-500 mt-2 font-medium">Renewal: <span className="font-bold text-slate-800">{billing.renewalDate || 'Dec 31, 2024'}</span></p>
                    </div>
                </div>

                <div className={`bg-white ${theme.layout.cardPadding} rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between`}>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Users size={12}/> Seat Allocation</p>
                        <span className="text-xs font-black text-slate-900">{seatCount} / {billing.seatLimit}</span>
                    </div>
                    <ProgressBar value={seatCount} max={billing.seatLimit} thresholds size="sm" />
                    <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-tight">Active Seats: Healthy</p>
                </div>

                <div className={`bg-white ${theme.layout.cardPadding} rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between`}>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Database size={12}/> Data Retention</p>
                        <span className="text-xs font-black text-slate-900">{storageUsed.toFixed(1)} / {billing.storageLimitGB} GB</span>
                    </div>
                    <ProgressBar value={storageUsed} max={billing.storageLimitGB} thresholds size="sm" />
                    <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-tight">Cloud Storage: Nominal</p>
                </div>
            </div>

            {/* Financial Ledger Section */}
            <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col`}>
                <div className={`p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50`}>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Financial Ledger & Artifacts</h3>
                        <p className="text-sm text-slate-500">Immutable transaction history for enterprise licensing and overages.</p>
                    </div>
                    <button className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                        <CreditCard size={14} className="text-nexus-600"/> Update Card
                    </button>
                </div>
                
                <div className="overflow-x-auto flex-1">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry ID</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Post Date</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Total</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Docs</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                            {billing.history.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-400 tracking-tighter uppercase whitespace-nowrap">{inv.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600 whitespace-nowrap">{inv.date}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 min-w-[200px]">{inv.description}</td>
                                    <td className="px-6 py-4 text-right text-sm font-mono font-black text-nexus-700 whitespace-nowrap">{formatCurrency(inv.amount)}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Pending' ? 'warning' : 'danger'}>{inv.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <button className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-nexus-100 hover:text-nexus-600 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100" title="Download Statement">
                                            <Download size={14}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {billing.history.length === 0 && (
                                <tr><td colSpan={6} className="p-12 text-center text-slate-400 italic font-medium">No transaction history recorded.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Support Tier Section */}
            <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-10 shadow-2xl border border-white/5">
                <div className="relative z-10 space-y-4 text-center lg:text-left w-full">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest mx-auto lg:mx-0 shadow-inner">
                        <ShieldCheck size={14} className="text-nexus-400"/> Enterprise Success Tier
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">Concierge Support for <br className="hidden lg:block"/>Billion-Dollar Teams.</h3>
                    <p className="text-slate-400 text-lg max-w-lg leading-relaxed mx-auto lg:mx-0">Direct access to PMO Engineering for custom ETL mapping, private cloud deployments, and 15-minute response SLAs.</p>
                    <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button className="px-10 py-4 bg-nexus-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-nexus-500 transition-all shadow-xl active:scale-95">
                            Speak to an Engineer <ExternalLink size={16}/>
                        </button>
                    </div>
                </div>
                {/* Visual Accent */}
                <div className="relative h-64 w-64 hidden lg:block z-10 shrink-0">
                    <div className="absolute inset-0 bg-nexus-500/10 rounded-full animate-pulse blur-3xl"></div>
                    <DollarSign size={120} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5" />
                </div>
                <div className="absolute -right-20 -bottom-20 w-[600px] h-[600px] bg-nexus-600/5 rounded-full blur-[120px] pointer-events-none"></div>
            </div>
        </div>
    );
};

export default BillingSettings;