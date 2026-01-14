import React, { Suspense } from 'react';
import { Activity, CheckCircle, Server, Zap, Loader2, Plus, Globe } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import StatCard from '../../shared/StatCard';
import { useTheme } from '../../../context/ThemeContext';
import { useExchangeDashboardLogic } from '../../../hooks/domain/useExchangeDashboardLogic';
import { useLazyLoad } from '../../../hooks/useLazyLoad';
import { EmptyGrid } from '../../common/EmptyGrid';

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

    const { containerRef, isVisible } = useLazyLoad();

    return (
        <div className="h-full overflow-y-auto space-y-8 p-1 scrollbar-thin animate-in fade-in duration-500">
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
                <StatCard title="Ingestion Threads" value="1.2M" subtext="24h Aggregate Volume" icon={Activity} trend="up" />
                <StatCard title="Schema Integrity" value="99.8%" subtext="14 Faults Logged" icon={CheckCircle} />
                <StatCard title="Healthy Sockets" value={`${services.filter(s => s.status === 'Operational').length}/${services.length || 1}`} subtext="API Handshake Status" icon={Server} />
                <StatCard title="Handshake Latency" value="142ms" subtext="Avg Payload Transfer" icon={Zap} trend="down" />
            </div>

            <div className={`grid grid-cols-1 xl:grid-cols-3 ${theme.layout.gridGap}`}>
                <div className={`${theme.components.card} p-10 rounded-[2.5rem] flex flex-col h-[450px] shadow-sm`} ref={containerRef}>
                    <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-4">
                        <div>
                            <h3 className={`font-black ${theme.colors.text.primary} text-sm uppercase tracking-widest flex items-center gap-2`}>
                                <Activity size={18} className="text-nexus-600"/> Ingestion Velocity Curve
                            </h3>
                            {isPending && <span className="text-[10px] text-nexus-500 animate-pulse font-bold">Querying Transmission Lake...</span>}
                        </div>
                        <div className={`${theme.colors.background} p-1 rounded-xl flex text-[10px] font-black uppercase tracking-tight border ${theme.colors.border} shadow-inner`}>
                            {['24h', '7d', '30d'].map(r => (
                                <button key={r} onClick={() => changeMetricRange(r)} className={`px-4 py-1.5 rounded-lg transition-all ${metricRange === r ? `${theme.colors.surface} shadow-md text-nexus-700` : `${theme.colors.text.tertiary} hover:text-nexus-600`}`}>{r}</button>
                            ))}
                        </div>
                    </div>
                    <div className={`flex-1 min-h-0 transition-opacity duration-300 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                        {isVisible ? (
                            <Suspense fallback={<div className={`h-full w-full nexus-empty-pattern rounded-2xl animate-pulse flex items-center justify-center`}><Loader2 className="animate-spin text-slate-200" size={32}/></div>}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={deferredData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                                        <XAxis dataKey="time" tick={{fontSize: 10, fontWeight: 'black', fill: theme.colors.text.tertiary}} axisLine={false} tickLine={false} />
                                        <YAxis tick={{fontSize: 10, fontWeight: 'black', fill: theme.colors.text.tertiary}} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={theme.charts.tooltip} cursor={{stroke: theme.colors.border}} />
                                        <Area type="monotone" dataKey="records" stroke={theme.charts.palette[0]} fill={`${theme.charts.palette[0]}15`} strokeWidth={4} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Suspense>
                        ) : (
                            <div className="h-full w-full nexus-empty-pattern rounded-[2rem] flex items-center justify-center">
                                <Loader2 className="animate-spin text-slate-200" size={32}/>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`${theme.components.card} p-10 rounded-[2.5rem] overflow-hidden h-[450px] flex flex-col shadow-sm`}>
                    <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-4">
                        <h3 className={`font-black ${theme.colors.text.primary} text-sm uppercase tracking-widest`}>Handshake Health Registry</h3>
                        <button onClick={handleAddService} className={`p-2 ${theme.colors.background} border border-slate-200 rounded-xl text-slate-400 hover:text-nexus-600 transition-all hover:bg-white hover:shadow-md active:scale-95`} title="Register Node">
                            <Plus size={18}/>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                        {services.length > 0 ? services.map((node, i) => {
                            const Icon = getServiceIcon(node.name);
                            return (
                                <div key={i} className={`flex items-center justify-between p-5 ${theme.colors.background} border border-slate-100 rounded-2xl hover:shadow-md hover:border-nexus-200 transition-all group cursor-default`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl transition-all ${theme.colors.surface} border shadow-sm ${theme.colors.text.tertiary} group-hover:text-nexus-600 ${theme.colors.border} group-hover:scale-110`}>
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-black ${theme.colors.text.primary} uppercase tracking-tight`}>{node.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className={`w-2 h-2 rounded-full ${node.status === 'Operational' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`}></div>
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${getStatusColor(node.status)}`}>{node.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`font-mono text-xs font-black text-slate-800 block`}>{node.latency}</span>
                                        <span className={`text-[9px] font-black uppercase text-slate-400 tracking-tighter`}>UP: {node.uptime}</span>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="h-full py-8">
                                <EmptyGrid title="No Nodes Registered" description="Global transmission nodes are currently unmapped." icon={Globe} onAdd={handleAddService} actionLabel="Provision Service Node" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};