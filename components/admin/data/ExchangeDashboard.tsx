
import React from 'react';
import { Activity, CheckCircle, XCircle, Server, Database, ArrowRight, HardDrive, Cloud, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import StatCard from '../../shared/StatCard';
import { useTheme } from '../../../context/ThemeContext';
import { Badge } from '../../ui/Badge';

const throughputData = [
    { time: '08:00', records: 1200 }, { time: '09:00', records: 3500 },
    { time: '10:00', records: 4200 }, { time: '11:00', records: 2800 },
    { time: '12:00', records: 1500 }, { time: '13:00', records: 4800 },
    { time: '14:00', records: 5100 }, { time: '15:00', records: 3900 },
];

export const ExchangeDashboard: React.FC = () => {
    const theme = useTheme();

    return (
        <div className="h-full overflow-y-auto space-y-6 pr-2 scrollbar-thin">
            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard title="Total Throughput (24h)" value="1.2M" subtext="Records Processed" icon={Activity} trend="up" />
                <StatCard title="Success Rate" value="99.8%" subtext="14 Failed Jobs" icon={CheckCircle} />
                <StatCard title="Active Connectors" value="8/12" subtext="2 Maintenance Mode" icon={Server} />
                <StatCard title="Avg Latency" value="142ms" subtext="API Response Time" icon={Zap} trend="down" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className={`xl:col-span-2 ${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm flex flex-col h-[400px]`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Activity size={18} className="text-nexus-600"/> Real-Time Ingestion Velocity
                        </h3>
                        <Badge variant="success">System Healthy</Badge>
                    </div>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={throughputData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="records" stroke="#0ea5e9" fill="#e0f2fe" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* System Status */}
                <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm overflow-y-auto h-[400px]`}>
                    <h3 className="font-bold text-slate-800 mb-4">Node Status</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'SAP S/4HANA Gateway', status: 'Online', load: '45%', icon: Database },
                            { name: 'Oracle P6 Adaptor', status: 'Online', load: '12%', icon: Server },
                            { name: 'SharePoint Connector', status: 'Syncing', load: '88%', icon: Cloud },
                            { name: 'Legacy Mainframe Bridge', status: 'Degraded', load: '95%', icon: HardDrive },
                        ].map((node, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${node.status === 'Degraded' ? 'bg-red-100 text-red-600' : 'bg-white border text-slate-500'}`}>
                                        <node.icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">{node.name}</p>
                                        <p className="text-xs text-slate-500">{node.status}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-mono font-bold ${parseInt(node.load) > 90 ? 'text-red-600' : 'text-green-600'}`}>
                                        {node.load}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Recent Alerts</h4>
                        <div className="space-y-2">
                            <div className="text-xs bg-red-50 text-red-700 p-2 rounded border border-red-100 flex gap-2">
                                <XCircle size={14} className="shrink-0 mt-0.5"/> 
                                <span>Failed to parse batch #4921 from SAP. Schema mismatch on 'COST_CENTER'.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
