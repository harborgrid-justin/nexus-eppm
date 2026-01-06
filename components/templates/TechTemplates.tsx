
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { ToggleLeft, ToggleRight, Search, Terminal, Code, Activity, BarChart2, PieChart, Layers, Map, Filter, Plus, Save, Trash2, Edit2, RefreshCw, Check } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Treemap } from 'recharts';

const TemplateHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
);

// --- Analytics & AI ---

export const SentimentAnalysisTmpl: React.FC = () => {
    const theme = useTheme();
    const data = [
        { name: 'Positive', value: 65, color: '#22c55e' },
        { name: 'Neutral', value: 25, color: '#94a3b8' },
        { name: 'Negative', value: 10, color: '#ef4444' },
    ];
    
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader title="Stakeholder Sentiment Analysis" subtitle="NLP analysis of communication logs" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Sentiment Distribution</h3>
                    <div className="flex items-center gap-4 mb-6">
                        {data.map(d => (
                            <div key={d.name} className="flex-1 text-center p-3 rounded-lg border border-slate-200">
                                <div className="text-2xl font-black" style={{ color: d.color }}>{d.value}%</div>
                                <div className="text-xs text-slate-500 uppercase font-bold">{d.name}</div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full h-4 rounded-full flex overflow-hidden">
                        {data.map(d => (
                            <div key={d.name} style={{ width: `${d.value}%`, backgroundColor: d.color }} title={d.name}></div>
                        ))}
                    </div>
                </Card>
                <Card className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Key Topics</h3>
                    <div className="flex flex-wrap gap-2">
                        {['Budget (High)', 'Schedule (Medium)', 'Quality (Low)', 'Safety (High)', 'Vendor Performance'].map((tag, i) => (
                            <span key={i} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${i % 2 === 0 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-2">Latest Flagged Comment</p>
                        <blockquote className="text-sm text-slate-600 italic border-l-4 border-red-400 pl-4 py-1 bg-red-50 rounded-r">
                            "The delay in steel delivery is going to push the critical path by at least 2 weeks. We need to escalate this."
                        </blockquote>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export const SupplyChainMapTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <TemplateHeader title="Global Supply Chain Map" subtitle="Logistics visualization" />
            <div className="flex-1 bg-slate-900 rounded-xl relative overflow-hidden shadow-inner border border-slate-800 group">
                <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-contain bg-no-repeat bg-center"></div>
                
                {/* Mock Nodes */}
                {[
                    { x: '20%', y: '40%', label: 'US Hub' },
                    { x: '50%', y: '30%', label: 'EU Supplier' },
                    { x: '80%', y: '50%', label: 'APAC Mfg' }
                ].map((node, i) => (
                    <div key={i} className="absolute flex flex-col items-center group/node cursor-pointer" style={{ left: node.x, top: node.y }}>
                        <div className="w-4 h-4 bg-nexus-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.8)] animate-pulse"></div>
                        <div className="mt-2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover/node:opacity-100 transition-opacity">
                            {node.label}
                        </div>
                    </div>
                ))}
                
                {/* Connecting Lines (Simulated with simple divs or SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
                    <path d="M 250 300 Q 500 100 900 350" stroke="#0ea5e9" strokeWidth="2" fill="none" strokeDasharray="5 5" className="animate-[dash_5s_linear_infinite]"/>
                </svg>

                <div className="absolute bottom-6 left-6 bg-slate-800/90 backdrop-blur p-4 rounded-xl border border-slate-700 text-white w-64">
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><Map size={16}/> Logistics Status</h4>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between"><span>In Transit</span><span className="font-mono text-green-400">14 Containers</span></div>
                        <div className="flex justify-between"><span>Customs Hold</span><span className="font-mono text-yellow-400">2 Containers</span></div>
                        <div className="flex justify-between"><span>At Port</span><span className="font-mono text-blue-400">5 Containers</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const HeatmapGridTmpl: React.FC = () => {
    const theme = useTheme();
    // 7 days x 24 hours mock
    const hours = Array.from({length: 24}, (_, i) => i);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader title="Activity Heatmap" subtitle="System usage intensity" />
            <Card className="p-6 overflow-auto">
                <div className="min-w-[800px]">
                    <div className="flex">
                        <div className="w-16"></div>
                        <div className="flex-1 grid grid-cols-24 gap-1 mb-2">
                            {hours.map(h => <div key={h} className="text-[10px] text-center text-slate-400">{h}</div>)}
                        </div>
                    </div>
                    {days.map(d => (
                        <div key={d} className="flex items-center mb-1">
                            <div className="w-16 text-xs font-bold text-slate-500">{d}</div>
                            <div className="flex-1 grid grid-cols-24 gap-1">
                                {hours.map(h => {
                                    // Generate random intensity
                                    const intensity = Math.random();
                                    let bg = 'bg-slate-100';
                                    if (intensity > 0.8) bg = 'bg-nexus-700';
                                    else if (intensity > 0.6) bg = 'bg-nexus-500';
                                    else if (intensity > 0.4) bg = 'bg-nexus-300';
                                    else if (intensity > 0.2) bg = 'bg-nexus-100';
                                    
                                    return <div key={h} className={`h-8 rounded-sm ${bg} hover:ring-2 ring-slate-400 transition-all cursor-pointer`} title={`${d} ${h}:00 - Activity: ${(intensity*100).toFixed(0)}%`}></div>
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end items-center gap-4 mt-6 text-xs text-slate-500">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-4 h-4 bg-slate-100 rounded-sm"></div>
                        <div className="w-4 h-4 bg-nexus-100 rounded-sm"></div>
                        <div className="w-4 h-4 bg-nexus-300 rounded-sm"></div>
                        <div className="w-4 h-4 bg-nexus-500 rounded-sm"></div>
                        <div className="w-4 h-4 bg-nexus-700 rounded-sm"></div>
                    </div>
                    <span>More</span>
                </div>
            </Card>
        </div>
    );
};

// --- Config & Admin ---

export const FeatureFlagManagerTmpl: React.FC = () => {
    const theme = useTheme();
    const [flags, setFlags] = useState([
        { id: 'beta_ai', label: 'Beta AI Features', enabled: true, env: 'Prod' },
        { id: 'new_gantt', label: 'V2 Gantt Chart', enabled: false, env: 'Dev' },
        { id: 'dark_mode_v2', label: 'Enhanced Dark Mode', enabled: true, env: 'Staging' },
    ]);

    const toggle = (id: string) => {
        setFlags(flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
    };

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader title="Feature Flags" subtitle="Runtime feature toggles" />
            <Card className="overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Feature Key</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Description</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Environment</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">State</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {flags.map(f => (
                            <tr key={f.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-sm text-nexus-700 font-bold">{f.id}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-900">{f.label}</td>
                                <td className="px-6 py-4"><Badge variant="neutral">{f.env}</Badge></td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => toggle(f.id)} className="text-nexus-600 focus:outline-none">
                                        {f.enabled ? <ToggleRight size={32}/> : <ToggleLeft size={32} className="text-slate-300"/>}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export const ApiUsageAnalyticsTmpl: React.FC = () => {
    const theme = useTheme();
    const data = Array.from({length: 12}, (_, i) => ({ time: `${i*2}:00`, requests: Math.floor(Math.random() * 5000) + 1000 }));

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader title="API Usage" subtitle="Throughput and latency metrics" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="p-6 h-[400px]">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Activity size={18}/> Request Volume (24h)</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="requests" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card className="p-6">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Error Rate</h4>
                        <div className="text-4xl font-black text-slate-900 mb-2">0.04%</div>
                        <div className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded inline-block">Within SLA</div>
                    </Card>
                    <Card className="p-6">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">P99 Latency</h4>
                        <div className="text-4xl font-black text-slate-900 mb-2">142ms</div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[60%]"></div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export const LogExplorerTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <TemplateHeader title="Log Explorer" subtitle="System events and error tracing" />
            <div className={`flex-1 flex flex-col ${theme.components.card} overflow-hidden border border-slate-200`}>
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-2">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg" placeholder="Search logs..." defaultValue='level:error service:"api-gateway"'/>
                    </div>
                    <Button variant="secondary" icon={Filter}>Filter</Button>
                    <Button icon={RefreshCw} className="w-10 px-0 flex justify-center"></Button>
                </div>
                <div className="flex-1 overflow-auto bg-slate-900 p-4 font-mono text-xs text-slate-300">
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className="mb-1 hover:bg-slate-800 p-1 rounded cursor-pointer">
                            <span className="text-slate-500 mr-3">2024-10-12 14:20:{10+i}</span>
                            <span className={`font-bold mr-3 ${i % 3 === 0 ? 'text-red-500' : 'text-blue-400'}`}>{i % 3 === 0 ? 'ERROR' : 'INFO'}</span>
                            <span className="text-purple-400 mr-3">[PaymentService]</span>
                            <span>{i % 3 === 0 ? 'Transaction timeout waiting for gateway response (ID: tx_9921)' : 'Processing webhook event type=charge.succeeded'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const MultiStepConfigTmpl: React.FC = () => {
    const theme = useTheme();
    const [step, setStep] = useState(1);
    
    return (
        <div className={`h-full flex items-center justify-center bg-slate-50 ${theme.layout.pagePadding}`}>
            <Card className="w-full max-w-2xl overflow-hidden">
                <div className="bg-slate-900 p-8 text-white">
                    <h2 className="text-2xl font-bold">Integration Setup</h2>
                    <p className="text-slate-400 mt-2">Connect your enterprise ERP system.</p>
                    <div className="flex gap-2 mt-6">
                        {[1,2,3].map(s => (
                            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-nexus-500' : 'bg-slate-700'}`}></div>
                        ))}
                    </div>
                </div>
                <div className="p-8 min-h-[300px]">
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <h3 className="font-bold text-lg text-slate-900">1. Authentication</h3>
                            <Input label="Client ID" />
                            <Input label="Client Secret" type="password" />
                        </div>
                    )}
                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <h3 className="font-bold text-lg text-slate-900">2. Endpoint Configuration</h3>
                            <Input label="Base URL" defaultValue="https://api.erp.corp/v1" />
                            <div className="p-4 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-100">
                                Webhook callbacks will be sent to <strong>https://nexus.ppm/hooks/erp</strong>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 flex flex-col items-center justify-center h-full pt-10">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <Check size={32}/>
                            </div>
                            <h3 className="font-bold text-xl text-slate-900">Ready to Connect</h3>
                            <p className="text-slate-500 text-center">Click finish to verify handshake.</p>
                        </div>
                    )}
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between">
                    <Button variant="ghost" onClick={() => setStep(s => Math.max(1, s-1))} disabled={step === 1}>Back</Button>
                    <Button onClick={() => setStep(s => Math.min(3, s+1))}>{step === 3 ? 'Finish' : 'Next'}</Button>
                </div>
            </Card>
        </div>
    );
};

export const InlineEditingGridTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader title="Inline Editing Grid" subtitle="Rapid data entry" />
            <Card className="overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase w-12">#</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Item</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-50