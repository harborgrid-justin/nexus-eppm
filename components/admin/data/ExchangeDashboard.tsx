
import React, { Suspense } from 'react';
import { Activity, CheckCircle, Server, Zap, Loader2, Plus } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import StatCard from '../../shared/StatCard';
import { useTheme } from '../../../context/ThemeContext';
import { useExchangeDashboardLogic } from '../../../hooks/domain/useExchangeDashboardLogic';

export const ExchangeDashboard: React.FC = () => {
    const theme = useTheme();
    const {
        isPending,
        metricRange,
        changeMetricRange,
        deferredData,
        services,
        getServiceIcon,
        getStatusColor,
        handleAddService
    } = useExchangeDashboardLogic();

    return (
        <div className="h-full overflow-y-auto space-y-6 pr-2 scrollbar-thin animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Portfolio Ingestion" value="1.2M" subtext="24h Volume" icon={Activity} trend="up" />
                <StatCard title="API Integrity" value="99.8%" subtext="14 Faults Logged" icon={CheckCircle} />
                <StatCard title="Active Sockets" value={`${services.filter(s => s.status === 'Operational').length}/${services.length || 12}`} subtext="Healthy Handshake" icon={Server} />
                <StatCard title="Sync Latency" value="142ms" subtext="Avg Payload Wait" icon={Zap} trend="down" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className={`${theme.components.card} ${theme.layout.cardPadding} flex flex-col h-[400px]`}>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className={`font-black ${theme.colors.text.primary} text-sm uppercase tracking-widest flex items-center gap-2`}>
                                <Activity size={16} className="text-nexus-600"/> Ingestion Velocity
                            </h3>
                            {isPending && <span className="text-[10px] text-nexus-500 animate-pulse font-bold">Querying Log Lake...</span>}
                        </div>
                        <div className={`${theme.colors.background} p-1 rounded-lg flex text-[10px] font-black uppercase tracking-tight`}>
                            {['24h', '7d', '30d'].map(r => (
                                <button key={r} onClick={() => changeMetricRange(r)} className={`px-2 py-1 rounded transition-all ${metricRange === r ? `${theme.colors.surface} shadow-sm text-nexus-700` : `${theme.colors.text.secondary}`}`}>{r}</button>
                            ))}
                        </div>
                    </div>
                    <div className={`flex-1 min-h-0 transition-opacity duration-300 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                        <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-slate-50 rounded-xl animate-pulse"><Loader2 className="animate-spin text-slate-200" size={32}/></div>}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={deferredData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                                    <XAxis dataKey="time" tick={{fontSize: 10, fontWeight: 'bold', fill: theme.colors.text.secondary}} />
                                    <YAxis tick={{fontSize: 10, fontWeight: 'bold', fill: theme.colors.text.secondary}} />
                                    <Tooltip contentStyle={theme.charts.tooltip} />
                                    <Area type="monotone" dataKey="records" stroke={theme.charts.palette[0]} fill={`${theme.charts.palette[0]}20`} strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Suspense>
                    </div>
                </div>

                <div className={`${theme.components.card} ${theme.layout.cardPadding} overflow-y-auto h-[400px] flex flex-col`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`font-black ${theme.colors.text.primary} text-sm uppercase tracking-widest`}>Service Health Registry</h3>
                        <button onClick={handleAddService} className={`${theme.colors.text.secondary} hover:text-nexus-600 transition-colors`} title="Register Service">
                            <Plus size={16}/>
                        </button>
                    </div>
                    <div className="space-y-4 flex-1">
                        {services.length > 0 ? services.map((node, i) => {
                            const Icon = getServiceIcon(node.name);
                            return (
                                <div key={i} className={`flex items-center justify-between p-4 ${theme.colors.background} border ${theme.colors.border} rounded-xl hover:shadow-sm transition-all group cursor-default`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-colors ${theme.colors.surface} border shadow-sm ${theme.colors.text.tertiary} group-hover:text-nexus-600`}>
                                            <Icon size={18} />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${theme.colors.text.primary}`}>{node.name}</p>
                                            <p className={`text-[10px] font-black uppercase ${getStatusColor(node.status)}`}>{node.status}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`font-mono text-xs font-black ${theme.colors.text.tertiary} block`}>Latency: {node.latency}</span>
                                        <span className={`text-[10px] ${theme.colors.text.secondary}`}>Up: {node.uptime}</span>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className={`flex flex-col items-center justify-center h-full ${theme.colors.text.tertiary} border-2 border-dashed ${theme.colors.border} rounded-xl p-4`}>
                                <Server size={32} className="mb-2 opacity-30"/>
                                <p className="text-xs font-medium text-center">No external services monitored.</p>
                                <button onClick={handleAddService} className="mt-4 text-xs font-bold text-nexus-600 bg-nexus-50 px-3 py-1.5 rounded-lg hover:bg-nexus-100 transition-colors">
                                    Register Service Endpoint
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
