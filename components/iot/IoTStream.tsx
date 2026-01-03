
import React, { useState, useEffect } from 'react';
import { Radio, Activity, Truck, AlertTriangle, Cpu, MapPin, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';

export const IoTStream: React.FC = () => {
    const theme = useTheme();
    const [dataPoints, setDataPoints] = useState<number[]>(new Array(20).fill(0));

    // Simulate real-time stream
    useEffect(() => {
        const interval = setInterval(() => {
            setDataPoints(prev => [...prev.slice(1), Math.floor(Math.random() * 100)]);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const chartData = dataPoints.map((val, i) => ({ i, val }));

    return (
        <div className="h-full bg-slate-950 p-6 text-green-500 font-mono overflow-hidden flex flex-col">
             <div className="flex justify-between items-center border-b border-green-900/50 pb-4 mb-6">
                 <h2 className="text-xl font-bold flex items-center gap-3 text-white">
                     <Radio className="text-green-500 animate-pulse"/> Field Telemetry Hub
                 </h2>
                 <div className="flex gap-6 text-xs font-bold">
                     <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> ONLINE</span>
                     <span className="text-slate-500">Latency: 24ms</span>
                     <span className="text-slate-500">Packets: 1.2M/s</span>
                 </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                 {/* Live Feed Chart */}
                 <div className="lg:col-span-2 bg-slate-900/50 border border-green-900/30 rounded-xl p-4 flex flex-col">
                     <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-white"><Activity size={16}/> Aggregate Load</h3>
                     <div className="flex-1 min-h-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <Line type="monotone" dataKey="val" stroke="#22c55e" strokeWidth={2} dot={false} isAnimationActive={false} />
                                <YAxis domain={[0, 100]} hide />
                            </LineChart>
                        </ResponsiveContainer>
                        {/* Scanline */}
                        <div className="absolute inset-0 bg-green-500/5 pointer-events-none animate-[scan_3s_linear_infinite]"></div>
                     </div>
                 </div>

                 {/* Device List */}
                 <div className="bg-slate-900/50 border border-green-900/30 rounded-xl p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-green-900">
                     <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-white"><Cpu size={16}/> Active Sensors</h3>
                     {[1,2,3,4,5,6].map(i => (
                         <div key={i} className="bg-black/40 p-3 rounded-lg border border-green-900/20 flex justify-between items-center group hover:border-green-500/50 transition-colors cursor-default">
                             <div>
                                 <div className="text-xs font-bold text-white group-hover:text-green-400">SENSOR-{100+i}</div>
                                 <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1"><MapPin size={8}/> Zone {String.fromCharCode(64+i)}</div>
                             </div>
                             <div className="text-right">
                                 <div className="text-lg font-bold">{Math.floor(Math.random() * 40) + 60}°C</div>
                                 <div className="text-[10px] text-slate-500">Temp</div>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>

             {/* Footer Alerts */}
             <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="bg-red-900/20 border border-red-900/50 p-3 rounded-lg flex items-center gap-3">
                     <AlertTriangle className="text-red-500" size={20}/>
                     <div>
                         <p className="text-xs text-red-400 font-bold">CRITICAL ALERT</p>
                         <p className="text-[10px] text-red-300">Vibration spike detected on CRANE-02</p>
                     </div>
                 </div>
                 <div className="bg-yellow-900/20 border border-yellow-900/50 p-3 rounded-lg flex items-center gap-3">
                     <Zap className="text-yellow-500" size={20}/>
                     <div>
                         <p className="text-xs text-yellow-400 font-bold">POWER WARNING</p>
                         <p className="text-[10px] text-yellow-300">Generator fuel low (Site B)</p>
                     </div>
                 </div>
                 <div className="bg-blue-900/20 border border-blue-900/50 p-3 rounded-lg flex items-center gap-3">
                     <Truck className="text-blue-500" size={20}/>
                     <div>
                         <p className="text-xs text-blue-400 font-bold">LOGISTICS</p>
                         <p className="text-[10px] text-blue-300">Concrete delivery en route (ETA 10m)</p>
                     </div>
                 </div>
             </div>
        </div>
    );
};
