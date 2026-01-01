
import React from 'react';
import { CreditCard, Package, Users, Database, Zap, Download, ExternalLink, ShieldCheck, TrendingUp, DollarSign } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../common/ProgressBar';

const BillingSettings: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-20">
            {/* Top Level Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
                    <div className="p-4 bg-nexus-50 text-nexus-600 rounded-2xl border border-nexus-100 shadow-sm shrink-0">
                        <Zap size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current License</p>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Plus</h4>
                        <p className="text-xs text-slate-500 mt-1">Billed annually • Renewal: Dec 2024</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Users size={12}/> Seat Utilization</p>
                        <span className="text-xs font-bold text-slate-900">142 / 250</span>
                    </div>
                    <ProgressBar value={142} max={250} thresholds size="sm" />
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">Provisioning rate is healthy.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Database size={12}/> Data Storage</p>
                        <span className="text-xs font-bold text-slate-900">642 GB / 1.0 TB</span>
                    </div>
                    <ProgressBar value={642} max={1000} thresholds size="sm" />
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">BIM & Document storage within limits.</p>
                </div>
            </div>

            {/* Financial Ledger Section */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-black text-slate-900">Billing History & Artifacts</h3>
                        <p className="text-sm text-slate-500">Audit-ready ledger of all corporate platform investments.</p>
                    </div>
                    <button className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                        <CreditCard size={16} className="text-nexus-600"/> Modify Payment Method
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Ref ID</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Service Description</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Net Total</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Artifact</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                            {[
                                { id: 'INV-4021', date: 'Jun 01, 2024', desc: 'Enterprise Portfolio Plan (Annual)', amt: 12500, status: 'Paid' },
                                { id: 'INV-3982', date: 'May 12, 2024', desc: 'Add-on: AI Insights Pack (50 users)', amt: 2500, status: 'Paid' },
                                { id: 'INV-3810', date: 'Apr 01, 2024', desc: 'Seat Expansion Pack (+100)', amt: 4500, status: 'Paid' },
                            ].map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-400 tracking-tighter uppercase whitespace-nowrap">{inv.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600 whitespace-nowrap">{inv.date}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 min-w-[200px]">{inv.desc}</td>
                                    <td className="px-6 py-4 text-right text-sm font-mono font-black text-nexus-700 whitespace-nowrap">{formatCurrency(inv.amt)}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <Badge variant="success">Cleared</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <button className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-nexus-100 hover:text-nexus-600 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100" title="Download PDF">
                                            <Download size={14}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Strategic Partner Section */}
            <div className="bg-indigo-900 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-10 shadow-2xl">
                <div className="relative z-10 space-y-4 text-center lg:text-left w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest mx-auto lg:mx-0">
                        <ShieldCheck size={12} className="text-nexus-400"/> Dedicated Support Tier
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">Your Success is our <br className="hidden lg:block"/>Portfolio Standard.</h3>
                    <p className="text-indigo-200 max-w-lg leading-relaxed mx-auto lg:mx-0">As an Enterprise Plus member, you have a dedicated Account Executive and priority access to our PMO Engineering team for custom data migrations.</p>
                    <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-xl active:scale-95">
                            Consult PMO Engineering <ExternalLink size={16}/>
                        </button>
                        <button className="px-8 py-4 bg-transparent text-white border-2 border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/5 transition-all">
                            View Plan Details
                        </button>
                    </div>
                </div>
                {/* Visual Accent */}
                <div className="relative h-48 w-48 md:h-64 md:w-64 hidden lg:block z-10 shrink-0">
                    <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse"></div>
                    <div className="absolute inset-4 border-4 border-dashed border-white/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
                    <DollarSign size={80} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" />
                </div>
                <Zap size={300} className="absolute -right-20 -bottom-20 md:-right-40 md:-bottom-40 text-blue-400/5 transform rotate-45 pointer-events-none" />
            </div>
        </div>
    );
};

export default BillingSettings;
