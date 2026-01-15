
import React, { useState, useEffect } from 'react';
import { Cpu, Server, Activity, Wifi, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useData } from '../../context/DataContext';

interface MetricHistoryPoint {
    time: number;
    cpu: number;
    mem: number;
    net: number;
}

interface MetricCardProps {
    title: string;
    value: number;
    unit: string;
    icon: React.ElementType;
    color: string;
    data: MetricHistoryPoint[];
    dataKey: keyof MetricHistoryPoint;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, icon: Icon, color, data, dataKey }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col h-48 backdrop-blur-sm relative overflow-hidden group hover:border-slate-600 transition-colors">
        <div className="flex justify-between items-start z-10">
            <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">{title}</p>
                <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-3xl font-black ${color}`}>{value}</span>
                    <span className="text-sm text-slate-500 font-bold">{unit}</span>
                </div>
            </div>
            <div className={`p-2 rounded-lg bg-white/5 ${color} opacity-80 shadow-inner`}>
                <Icon size={20} />
            </div>
        </div>
        <div className="flex-1 mt-4 -mx-4 -mb-4 opacity-50 z-0 group-hover:opacity-70 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="currentColor" className={color.replace('text-', 'text-')} stopOpacity={0.4}/>
                            <stop offset="100%" stopColor="currentColor" className={color.replace('text-', 'text-')} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area 
                        type="monotone" 
                        dataKey={dataKey} 
                        stroke="currentColor" 
                        className={color} 
                        fill={`url(#grad-${dataKey})`} 
                        strokeWidth={2} 
                        isAnimationActive={false} 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export const ServerHealthMonitor: React.FC = () => {
    const { state } = useData();
    const [localHistory, setLocalHistory] = useState<MetricHistoryPoint[]>([]);

    useEffect(() => {
        // Hydrate initial history from system monitoring state if available
        if (state.systemMonitoring?.throughput?.length > 0) {
            const mapped: MetricHistoryPoint[] = state.systemMonitoring.throughput.map((d, i) => ({
                time: i,
                cpu: Math.min(100, Math.max(0, d.records / 100)),
                mem: Math.min(100, Math.max(0, d.records / 150)),
                net: Math.min(100, Math.max(0, d.records / 50))
            }));
            setLocalHistory(mapped);
        } else {
             // Fallback initialization
             setLocalHistory(Array.from({ length: 20 }, (_, i) => ({
                time: i,
                cpu: 45,
                mem: 60,
                net: 25
            })));
        }
    }, [state.systemMonitoring]);

    // Live update simulation (Client-side effect for "Alive" feel)
    useEffect(() => {
        const interval = setInterval(() => {
            setLocalHistory(prev => {
                if (prev.length === 0) return prev;
                const last = prev[prev.length - 1];
                const nextTime = last.time + 1;
                
                // Random walk
                const nextCpu = Math.max(10, Math.min(90, last.cpu + (Math.random() - 0.5) * 10));
                const nextMem = Math.max(20, Math.min(80, last.mem + (Math.random() - 0.5) * 5));
                const nextNet = Math.max(0, Math.min(100, last.net + (Math.random() - 0.5) * 20));

                const next = [...prev.slice(1)];
                next.push({
                    time: nextTime,
                    cpu: Math.round(nextCpu), 
                    mem: Math.round(nextMem), 
                    net: Math.round(nextNet)
                });
                return next;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const current = localHistory[localHistory.length - 1] || { cpu: 0, mem: 0, net: 0 };
    const services = state.systemMonitoring.services || [];

    return (
        <div className="h-full bg-slate-950 p-6 md:p-8 flex flex-col overflow-y-auto">
             <div className="flex justify-between items-center mb-8">
                 <div>
                     <h2 className="text-2xl font-black text-white flex items-center gap-3">
                         <Activity className="text-green-500 animate-pulse" /> Infrastructure Operations
                     </h2>
                     <p className="text-slate-400 text-sm mt-1 font-mono">Cluster: us-east-1a • Uptime: 99.98%</p>
                 </div>
                 <div className="flex gap-4">
                     <div className="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                         <Wifi size={14}/> Systems Nominal
                     </div>
                     <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                         <RefreshCw size={20} />
                     </button>
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <MetricCard title="CPU Load" value={current.cpu} unit="%" icon={Cpu} color="text-blue-400" data={localHistory} dataKey="cpu" />
                 <MetricCard title="Memory Usage" value={current.mem} unit="%" icon={Server} color="text-purple-400" data={localHistory} dataKey="mem" />
                 <MetricCard title="Network I/O" value={current.net} unit="Mbps" icon={Activity} color="text-orange-400" data={localHistory} dataKey="net" />
             </div>

             {/* Server List */}
             <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex-1 flex flex-col shadow-2xl">
                 <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
                     <h3 className="font-bold text-slate-300 text-sm uppercase tracking-widest">Active Instances</h3>
                     <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700 font-mono">{services.length} Online</span>
                 </div>
                 <div className="flex-1 overflow-auto">
                     <table className="w-full text-left border-collapse">
                         <thead className="bg-slate-950 text-slate-500 text-xs font-bold uppercase tracking-widest sticky top-0">
                             <tr>
                                 <th className="p-4 border-b border-slate-800">Hostname</th>
                                 <th className="p-4 border-b border-slate-800">Role</th>
                                 <th className="p-4 border-b border-slate-800">Latency</th>
                                 <th className="p-4 border-b border-slate-800 text-right">Status</th>
                             </tr>
                         </thead>
                         <tbody className="text-slate-300 text-sm divide-y divide-slate-800/50">
                             {services.map((server, i) => (
                                 <tr key={server.id || i} className="hover:bg-white/5 transition-colors">
                                     <td className="p-4 font-mono text-nexus-400">{server.name}</td>
                                     <td className="p-4 text-slate-400">Service Node</td>
                                     <td className="p-4 font-mono text-slate-500">{server.latency}</td>
                                     <td className="p-4 text-right">
                                         <div className={`flex items-center justify-end gap-2 text-xs font-bold uppercase ${server.status === 'Operational' ? 'text-green-400' : 'text-yellow-400'}`}>
                                             <div className={`w-2 h-2 rounded-full ${server.status === 'Operational' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-yellow-500'}`}></div>
                                             {server.status}
                                         </div>
                                     </td>
                                 </tr>
                             ))}
                             {services.length === 0 && (
                                 <tr><td colSpan={4} className="p-8 text-center text-slate-500 italic">No services monitored. Add via Dashboard.</td></tr>
                             )}
                         </tbody>
                     </table>
                 </div>
             </div>
        </div>
    );
};
