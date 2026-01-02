
import React, { useTransition, useDeferredValue, useMemo, Suspense } from 'react';
import { Activity, CheckCircle, XCircle, Server, Database, ArrowRight, HardDrive, Cloud, Zap, Loader2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import StatCard from '../../shared/StatCard';
import { useTheme } from '../../../context/ThemeContext';
import { Badge } from '../../ui/Badge';

const THROUGHPUT_DATA = [
    { time: '08:00', records: 1200 }, { time: '10:00', records: 4200 },
    { time: '12:00', records: 1500 }, { time: '14:00', records: 5100 },
    { time: '16:00', records: 3900 },
];

export const ExchangeDashboard: React.FC = () => {
    const theme = useTheme();
    // Pattern 22: startTransition for dashboard specific view toggles
    const [isPending, startTransition] = useTransition();
    const [metricRange, setMetricRange] = React.useState('24h');
    
    // Pattern 23: useDeferredValue for chart data re-shaping
    const deferredData = useDeferredValue(THROUGHPUT_DATA);

    return (
        <div className="h-full overflow-y-auto space-y-6 pr-2 scrollbar-thin animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Portfolio Ingestion" value="1.2M" subtext="24h Volume" icon={Activity} trend="up" />
                <StatCard title="API Integrity" value="99.8%" subtext="14 Faults Logged" icon={CheckCircle} />
                <StatCard title="Active Sockets" value="8/12" subtext="Healthy Handshake" icon={Server} />
                <StatCard title="Sync Latency" value="142ms" subtext="Avg Payload Wait" icon={Zap} trend="down" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm flex flex-col h-[400px]`}>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                                <Activity size={16} className="text-nexus-600"/> Ingestion Velocity
                            </h3>
                            {isPending && <span className="text-[10px] text-nexus-500 animate-pulse font-bold">Querying Log Lake...</span>}
                        </div>
                        <div className="bg-slate-100 p-1 rounded-lg flex text-[10px] font-black uppercase tracking-tight">
                            {['24h', '7d', '30d'].map(r => (
                                <button key={r} onClick={() => startTransition(() => setMetricRange(r))} className={`px-2 py-1 rounded transition-all ${metricRange === r ? 'bg-white shadow-sm text-nexus-700' : 'text-slate-400'}`}>{r}</button>
                            ))}
                        </div>
                    </div>
                    <div className={`flex-1 min-h-0 transition-opacity duration-300 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                        <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-slate-50 rounded-xl animate-pulse"><Loader2 className="animate-spin text-slate-200" size={32}/></div>}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={deferredData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                                    <XAxis dataKey="time" tick={{fontSize: 10, fontWeight: 'bold'}} />
                                    <YAxis tick={{fontSize: 10, fontWeight: 'bold'}} />
                                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                    <Area type="monotone" dataKey="records" stroke={theme.charts.palette[0]} fill={`${theme.charts.palette[0]}20`} strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Suspense>
                    </div>
                </div>

                <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm overflow-y-auto h-[400px] flex flex-col`}>
                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-6">Service Health Registry</h3>
                    <div className="space-y-4 flex-1">
                        {[
                            { name: 'SAP Finance Gateway', status: 'Healthy', load: '45%', icon: Database, color: 'text-green-500' },
                            { name: 'Primavera SOAP Adaptor', status: 'Healthy', load: '12%', icon: Server, color: 'text-green-500' },
                            { name: 'SharePoint OCM Bridge', status: 'Syncing', load: '88%', icon: Cloud, color: 'text-blue-500' },
                            { name: 'Legacy Mainframe ETL', status: 'Warning', load: '95%', icon: HardDrive, color: 'text-orange-500' },
                        ].map((node, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:shadow-sm transition-all group cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl transition-colors ${node.status === 'Warning' ? 'bg-orange-50 text-orange-600' : 'bg-white border shadow-sm text-slate-400 group-hover:text-nexus-600'}`}>
                                        <node.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{node.name}</p>
                                        <p className={`text-[10px] font-black uppercase ${node.color}`}>{node.status}</p>
                                    </div>
                                </div>
                                <span className={`font-mono text-xs font-black ${parseInt(node.load) > 90 ? 'text-red-500' : 'text-slate-400'}`}>{node.load}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
