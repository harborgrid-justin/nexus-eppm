
import React, { useState, useEffect, useMemo } from 'react';
import { Server, Cpu, HardDrive, Activity, Wifi, AlertOctagon, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useData } from '../../context/DataContext';

const MetricCard = ({ title, value, unit, icon: Icon, color, data, dataKey }: any) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col h-48 backdrop-blur-sm relative overflow-hidden">
        <div className="flex justify-between items-start z-10">
            <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">{title}</p>
                <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-3xl font-black ${color}`}>{value}</span>
                    <span className="text-sm text-slate-500 font-bold">{unit}</span>
                </div>
            </div>
            <div className={`p-2 rounded-lg bg-white/5 ${color} opacity-80`}>
                <Icon size={20} />
            </div>
        </div>
        <div className="flex-1 mt-4 -mx-4 -mb-4 opacity-50 z-0">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="currentColor" className={color.replace('text-', 'text-')} stopOpacity={0.4}/>
                            <stop offset="100%" stopColor="currentColor" className={color.replace('text-', 'text-')} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey={dataKey} stroke="currentColor" className={color} fill={`url(#grad-${dataKey})`} strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export const ServerHealthMonitor: React.FC = () => {
    const { state } = useData();
    const [localHistory, setLocalHistory] = useState<any[]>([]);

    // We start with the snapshot from context if available, or generate initial
    useEffect(() => {
        if (state.systemMonitoring.throughput.length > 0) {
            // Map context throughput to local shape for now
            const mapped = state.systemMonitoring.throughput.map((d, i) => ({
                time: i,
                cpu: Math.min(100, Math.max(0, d.records / 100)), // Simulate cpu based on records
                mem: Math.min(100, Math.max(0, d.records / 150)), 
                net: Math.min(100, Math.max(0, d.records / 50))
            }));
            setLocalHistory(mapped);
        } else {
             setLocalHistory(Array.from({ length: 20 }, (_, i) => ({
                time: i,
                cpu: Math.floor(Math.random() * 40) + 20,
                mem: Math.floor(Math.random() * 30) + 40,
                net: Math.floor(Math.random() * 80) + 10
            })));
        }
    }, []);

    // Live update simulation on top of initial data
    useEffect(() => {
        const interval = setInterval(() => {
            setLocalHistory(prev => {
                if (prev.length === 0) return prev;
                const next = [...prev.slice(1)];
                next.push({
                    time: prev[prev.length - 1].time + 1,
                    cpu: Math.floor(Math.random() * 60) + 20, // 20-80%
                    mem: Math.floor(Math.random() * 20) + 50, // 50-70%
                    net: Math.floor(Math.random() * 100) // 0-100 Mbps
                });
                return next;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const current = localHistory[localHistory.length - 1] || { cpu: 0, mem: 0, net: 0 };

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
                     <div className="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2">
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
                     <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">4 Online</span>
                 </div>
                 <div className="flex-1 overflow-auto">
                     <table className="w-full text-left border-collapse">
                         <thead className="bg-slate-900 text-slate-500 text-xs font-bold uppercase tracking-widest sticky top-0">
                             <tr>
                                 <th className="p-4">Hostname</th>
                                 <th className="p-4">Role</th>
                                 <th className="p-4">Region</th>
                                 <th className="p-4">Load</th>
                                 <th className="p-4 text-right">Status</th>
                             </tr>
                         </thead>
                         <tbody className="text-slate-300 text-sm divide-y divide-slate-800/50">
                             {[
                                 { name: 'app-core-01', role: 'API Gateway', region: 'us-east-1a', load: 'Low' },
                                 { name: 'db-master-01', role: 'Database', region: 'us-east-1b', load: 'High' },
                                 { name: 'cache-redis-01', role: 'Cache', region: 'us-east-1a', load: 'Medium' },
                                 { name: 'worker-job-01', role: 'Background', region: 'us-east-1c', load: 'Medium' },
                             ].map((server, i) => (
                                 <tr key={i} className="hover:bg-white/5 transition-colors">
                                     <td className="p-4 font-mono text-nexus-400">{server.name}</td>
                                     <td className="p-4">{server.role}</td>
                                     <td className="p-4 text-slate-500">{server.region}</td>
                                     <td className="p-4">
                                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                             server.load === 'High' ? 'bg-red-500/20 text-red-400' :
                                             server.load === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                             'bg-green-500/20 text-green-400'
                                         }`}>
                                             {server.load}
                                         </span>
                                     </td>
                                     <td className="p-4 text-right">
                                         <div className="flex items-center justify-end gap-2 text-green-400 text-xs font-bold uppercase">
                                             <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                                             Healthy
                                         </div>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>
        </div>
    );
};
