import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Radio, Activity, MapPin, AlertTriangle, Cpu, Info, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';

interface StreamPoint {
    i: number;
    val: number;
}

export const IoTStream: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const [chartData, setChartData] = useState<StreamPoint[]>([]);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Initial Data Load
    useEffect(() => {
        const throughput = state.systemMonitoring?.throughput || [];
        setChartData(throughput.map((d, i) => ({ i, val: d.records || 0 })));
    }, [state.systemMonitoring?.throughput]);

    // Live Simulation logic
    useEffect(() => {
        const startStream = () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setChartData(prev => {
                    const nextI = prev.length > 0 ? prev[prev.length - 1].i + 1 : 0;
                    const nextVal = Math.floor(Math.random() * 40) + 30;
                    const nextData = [...prev.slice(-29), { i: nextI, val: nextVal }];
                    return nextData;
                });
            }, 2000);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            } else {
                startStream();
            }
        };

        startStream();
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const sensors = useMemo(() => {
        return state.resources
            .filter(r => r.type === 'Equipment')
            .slice(0, 12)
            .map(r => ({
                id: r.id,
                name: r.name,
                location: r.location || 'Site Unset',
                maintenanceStatus: r.maintenanceStatus || 'Unknown',
                load: Math.floor(Math.random() * 40) + 60
            }));
    }, [state.resources]);

    const alerts = useMemo(() => {
        return state.governance.alerts
            .filter(a => a.category === 'Supply Chain' || a.category === 'Risk')
            .slice(0, 4);
    }, [state.governance.alerts]);

    return (
        <div className="h-full bg-slate-950 p-8 text-green-500 font-mono overflow-hidden flex flex-col relative select-none">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
             
             <div className="flex justify-between items-center border-b border-green-900/50 pb-6 mb-8 relative z-10">
                 <div className="flex items-center gap-5">
                    <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                        <Radio className="text-green-500 animate-pulse" size={28}/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black flex items-center gap-3 text-white uppercase tracking-tighter">Field Telemetry Graph</h2>
                        <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] mt-1 text-slate-500">
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div> Node: us-east-1a</span>
                            <span>•</span>
                            <span>S/N: NEX-IOT-4920</span>
                        </div>
                    </div>
                 </div>
                 <div className="flex gap-10 items-center">
                    <div className="text-right">
                         <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Global Ingestion</p>
                         <p className="text-xl font-black text-green-400 tabular-nums">1.2M <span className="text-xs font-medium">pkt/s</span></p>
                    </div>
                    <div className="text-right">
                         <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Aggregate Latency</p>
                         <p className="text-xl font-black text-white tabular-nums">24 <span className="text-xs font-medium text-slate-400">ms</span></p>
                    </div>
                 </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0 relative z-10">
                 {/* Live Feed Chart */}
                 <div className="lg:col-span-3 bg-black/40 border border-green-900/30 rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden shadow-2xl">
                     <div className="flex justify-between items-center mb-8 z-10 relative">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 text-white">
                            <Activity size={18} className="text-green-500"/> System Signal Load (VCO)
                        </h3>
                        <span className="text-[9px] bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 font-black uppercase tracking-widest animate-pulse">STREAM_LIVE</span>
                     </div>
                     
                     <div className="flex-1 min-h-0 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="iotGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(34,197,94,0.05)" />
                                <Area type="monotone" dataKey="val" stroke="#22c55e" strokeWidth={3} fill="url(#iotGrad)" isAnimationActive={false} />
                                <YAxis domain={[0, 100]} hide />
                            </AreaChart>
                        </ResponsiveContainer>
                     </div>
                     
                     {/* CRT Scanline Mask */}
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
                 </div>

                 {/* Sensor Registry */}
                 <div className="bg-black/20 border border-green-900/20 rounded-[2.5rem] p-6 overflow-hidden flex flex-col shadow-xl">
                     <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3 text-slate-400 border-b border-green-900/30 pb-4">
                        <Zap size={16}/> Active Nodes
                     </h3>
                     <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-green-900/20 scrollbar-track-transparent">
                         {sensors.length > 0 ? sensors.map(s => (
                             <div key={s.id} className="bg-white/5 p-4 rounded-2xl border border-green-900/10 flex justify-between items-center group hover:bg-green-500/10 hover:border-green-500/30 transition-all cursor-default shadow-inner">
                                 <div className="min-w-0">
                                     <div className="text-[11px] font-black text-white group-hover:text-green-400 transition-colors uppercase truncate">{s.name}</div>
                                     <div className="text-[9px] text-slate-500 mt-1 flex items-center gap-1"><MapPin size={10} className="opacity-50"/> {s.location}</div>
                                 </div>
                                 <div className="text-right">
                                     <div className={`text-sm font-black ${s.maintenanceStatus === 'Good' ? 'text-green-500' : 'text-red-500'}`}>
                                         {s.load}%
                                     </div>
                                     <div className="text-[8px] text-slate-600 font-mono tracking-tighter">{s.id}</div>
                                 </div>
                             </div>
                         )) : (
                             <div className="text-center text-slate-600 text-[10px] uppercase font-black tracking-widest py-10">No Hardware Detected</div>
                         )}
                     </div>
                 </div>
             </div>

             {/* Footer Event Stream */}
             <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                 {alerts.length > 0 ? alerts.map(alert => (
                     <div key={alert.id} className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4 group hover:bg-red-500/10 transition-colors">
                         <AlertTriangle className="text-red-500 animate-pulse" size={20}/>
                         <div className="min-w-0">
                             <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">{alert.title}</p>
                             <p className="text-[9px] text-red-300/50 truncate font-medium mt-0.5">{alert.message}</p>
                         </div>
                     </div>
                 )) : (
                     <div className="col-span-4 bg-white/5 border border-green-900/20 p-4 rounded-2xl flex items-center justify-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                         <ShieldCheck size={18} className="text-green-900/50"/>
                         Telemetry Logic: Nominal State Verified
                     </div>
                 )}
             </div>
        </div>
    );
};
import { ShieldCheck } from 'lucide-react';