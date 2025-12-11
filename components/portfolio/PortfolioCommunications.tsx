
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Users, Layout, ShieldAlert, Calendar, FileText } from 'lucide-react';
import { Badge } from '../ui/Badge';

const PortfolioCommunications: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const [activeAudience, setActiveAudience] = useState<'Executive' | 'PMO' | 'Team'>('Executive');

    // Filter stakeholders to simulate portfolio-level key players
    const keyStakeholders = state.stakeholders.filter(s => s.influence === 'High');

    // Mock Communication Plan Data
    const commPlan = [
        { item: 'Portfolio Performance Report', audience: 'Executive', freq: 'Monthly', channel: 'Dashboard / Meeting', owner: 'Portfolio Mgr' },
        { item: 'Resource Utilization Review', audience: 'PMO', freq: 'Bi-Weekly', channel: 'Meeting', owner: 'Resource Mgr' },
        { item: 'Benefits Realization Update', audience: 'Executive', freq: 'Quarterly', channel: 'Report (PDF)', owner: 'Sponsor' },
        { item: 'Dependency & Risk Sync', audience: 'Team', freq: 'Weekly', channel: 'Workshop', owner: 'Program Mgr' },
    ];

    // Mock Escalations
    const escalations = state.risks.filter(r => r.score > 15).slice(0, 3);

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className={theme.typography.h2}>Portfolio Communications</h2>
                    <p className={theme.typography.small}>Tailored reporting and stakeholder engagement management.</p>
                </div>
                <div className="flex bg-slate-200 p-1 rounded-lg">
                    {['Executive', 'PMO', 'Team'].map((aud) => (
                        <button
                            key={aud}
                            onClick={() => setActiveAudience(aud as any)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                activeAudience === aud ? 'bg-white shadow text-nexus-700' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            {aud} View
                        </button>
                    ))}
                </div>
            </div>

            {/* Dynamic View based on Audience */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Primary Dashboard Content Area */}
                    <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Layout size={18} className="text-nexus-600"/> 
                            {activeAudience} Focus Area
                        </h3>
                        
                        {activeAudience === 'Executive' && (
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                                    <h4 className="font-bold text-green-900 mb-1">✓ Strategic Alignment</h4>
                                    <p className="text-sm text-green-800">Portfolio is 92% aligned with FY24 goals. Value delivery is on track.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-slate-900">$12.5M</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Value Realized YTD</div>
                                    </div>
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-red-700">3</div>
                                        <div className="text-xs text-red-600 uppercase tracking-wide">Critical Escalations</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeAudience === 'PMO' && (
                            <div className="space-y-4">
                                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                                    <h4 className="font-bold text-yellow-900 mb-1">⚠ Resource Constraints</h4>
                                    <p className="text-sm text-yellow-800">Engineering capacity is at 115% for Q3. Prioritization decision required.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-slate-900">0.92</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Portfolio SPI</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-slate-900">0.98</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Portfolio CPI</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeAudience === 'Team' && (
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                                    <h4 className="font-bold text-blue-900 mb-1">ℹ Upcoming Decisions</h4>
                                    <p className="text-sm text-blue-800">Phase 2 Scope Freeze is scheduled for next Friday. Submit final change requests.</p>
                                </div>
                                <ul className="space-y-2 text-sm text-slate-700">
                                    <li className="flex items-center gap-2"><Calendar size={14}/> <strong>Next Review:</strong> Monday, 10:00 AM</li>
                                    <li className="flex items-center gap-2"><FileText size={14}/> <strong>Dependencies:</strong> 5 Cross-project blockers identified.</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Communication Plan Table */}
                    <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-sm">Standard Communication Plan</h3>
                        </div>
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Comm Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Frequency</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Channel</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Owner</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {commPlan.filter(c => c.audience === activeAudience).map((plan, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{plan.item}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{plan.freq}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{plan.channel}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{plan.owner}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar: Key Stakeholders & Escalations */}
                <div className="space-y-6">
                    <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm p-6`}>
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Users size={18} className="text-nexus-600"/> Key Stakeholders
                        </h3>
                        <div className="space-y-4">
                            {keyStakeholders.map(s => (
                                <div key={s.id} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                        {s.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{s.name}</p>
                                        <p className="text-xs text-slate-500">{s.role}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{s.engagementStrategy}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm p-6`}>
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ShieldAlert size={18} className="text-red-600"/> Risk Escalations
                        </h3>
                        <div className="space-y-3">
                            {escalations.map(risk => (
                                <div key={risk.id} className="p-3 bg-red-50 border border-red-100 rounded-lg">
                                    <div className="flex justify-between items-start mb-1">
                                        <Badge variant="danger">Score: {risk.score}</Badge>
                                        <span className="text-xs text-red-400">{risk.id}</span>
                                    </div>
                                    <p className="text-sm font-medium text-red-900 leading-tight">{risk.description}</p>
                                    <div className="mt-2 text-xs text-red-700 flex gap-2">
                                        <span className="font-bold">Owner:</span> {risk.owner}
                                    </div>
                                </div>
                            ))}
                            {escalations.length === 0 && <p className="text-sm text-slate-500 italic">No active escalations.</p>}
                        </div>
                        <button className="w-full mt-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
                            View All Risks
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioCommunications;
