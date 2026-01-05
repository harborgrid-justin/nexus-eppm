
import React from 'react';
import { Radio, Activity, MapPin, AlertTriangle, Cpu, Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';
import { useIoTStreamLogic } from '../../hooks/domain/useIoTStreamLogic';

export const IoTStream: React.FC = () => {
    const theme = useTheme();
    const { chartData, sensors, alerts } = useIoTStreamLogic();

    // Preserve dark theme for this specific dashboard component regardless of global theme
    // but use theme variables where appropriate if we wanted consistency. 
    // Here we force dark mode styles for the "Command Center" feel.

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
                     {sensors.length > 0 ? sensors.map(s => (
                         <div key={s.id} className="bg-black/40 p-3 rounded-lg border border-green-900/20 flex justify-between items-center group hover:border-green-500/50 transition-colors cursor-default">
                             <div>
                                 <div className="text-xs font-bold text-white group-hover:text-green-400">{s.name}</div>
                                 <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1"><MapPin size={8}/> {s.location || 'Unknown'}</div>
                             </div>
                             <div className="text-right">
                                 <div className="text-lg font-bold">{s.maintenanceStatus === 'Good' ? 'OK' : 'ERR'}</div>
                                 <div className="text-[10px] text-slate-500">{s.id}</div>
                             </div>
                         </div>
                     )) : (
                         <div className="text-center text-slate-500 text-xs italic">No devices connected.</div>
                     )}
                 </div>
             </div>

             {/* Footer Alerts */}
             <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                 {alerts.length > 0 ? alerts.map(alert => (
                     <div key={alert.id} className="bg-red-900/20 border border-red-900/50 p-3 rounded-lg flex items-center gap-3">
                         <AlertTriangle className="text-red-500" size={20}/>
                         <div>
                             <p className="text-xs text-red-400 font-bold">{alert.title}</p>
                             <p className="text-[10px] text-red-300 truncate w-48">{alert.message}</p>
                         </div>
                     </div>
                 )) : (
                     <div className="col-span-3 bg-slate-900/30 border border-slate-800 p-3 rounded-lg flex items-center justify-center gap-3 text-slate-500 text-xs italic">
                         <Info size={16} className="text-slate-600"/>
                         No active supply chain alerts detected in stream.
                     </div>
                 )}
             </div>
        </div>
    );
};
