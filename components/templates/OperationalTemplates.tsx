
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { 
    Cloud, Sun, Thermometer, Users, Clock, AlertTriangle, Hammer, Clipboard, CheckCircle, 
    Truck, Box, Server, Activity, Wifi, Shield, ArrowRight, MapPin, Wrench
} from 'lucide-react';

const TemplateHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
);

export const DailyLogEntryTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader title="Daily Site Journal" subtitle="Superintendent's daily report" />
            <div className="max-w-4xl mx-auto space-y-6">
                <Card className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 border-r border-slate-100 pr-6">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Cloud className="text-nexus-500"/> Site Conditions</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Weather</label>
                                <select className="w-full p-2 border rounded bg-slate-50 text-sm"><option>Sunny</option><option>Cloudy</option><option>Rain</option></select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Temp (F)</label>
                                <Input type="number" defaultValue="72" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Site Status</label>
                                <Badge variant="success">Open</Badge>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 space-y-6">
                         <div>
                             <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Users size={16}/> Work Force</h4>
                             <div className="grid grid-cols-3 gap-4">
                                 <div className="p-3 bg-slate-50 rounded border text-center">
                                     <div className="text-2xl font-black text-slate-900">42</div>
                                     <div className="text-xs text-slate-500 uppercase font-bold">Workers</div>
                                 </div>
                                 <div className="p-3 bg-slate-50 rounded border text-center">
                                     <div className="text-2xl font-black text-slate-900">320</div>
                                     <div className="text-xs text-slate-500 uppercase font-bold">Hours</div>
                                 </div>
                                 <div className="p-3 bg-slate-50 rounded border text-center">
                                     <div className="text-2xl font-black text-slate-900">4</div>
                                     <div className="text-xs text-slate-500 uppercase font-bold">Subs</div>
                                 </div>
                             </div>
                         </div>
                         <div>
                             <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Clipboard size={16}/> Notes</h4>
                             <textarea className="w-full p-3 border rounded-lg text-sm bg-white h-32" placeholder="Enter daily observations..."></textarea>
                         </div>
                    </div>
                </Card>
                <div className="flex justify-end gap-3">
                    <Button variant="secondary">Save Draft</Button>
                    <Button icon={CheckCircle}>Submit Report</Button>
                </div>
            </div>
        </div>
    );
};

export const InventoryGridTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader title="Material Inventory" subtitle="Stock levels and reorder points" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4,5,6,7,8].map(i => (
                    <Card key={i} className="flex flex-col group hover:border-nexus-300 transition-all">
                        <div className="h-32 bg-slate-100 relative rounded-t-lg overflow-hidden flex items-center justify-center">
                            <Box size={48} className="text-slate-300 group-hover:scale-110 transition-transform"/>
                            <div className="absolute top-2 right-2">
                                <Badge variant={i % 3 === 0 ? 'danger' : 'success'}>{i % 3 === 0 ? 'Low Stock' : 'In Stock'}</Badge>
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h4 className="font-bold text-slate-900">Structural Steel W12</h4>
                            <p className="text-xs text-slate-500 mb-4">SKU: STL-W12-00{i}</p>
                            
                            <div className="mt-auto space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-600">
                                    <span>Quantity</span>
                                    <span>{i % 3 === 0 ? 12 : 450} / 500</span>
                                </div>
                                <ProgressBar value={i % 3 === 0 ? 5 : 90} colorClass={i % 3 === 0 ? 'bg-red-500' : 'bg-green-500'} size="sm"/>
                                <div className="pt-3 border-t border-slate-100 flex gap-2">
                                    <Button size="sm" variant="outline" className="flex-1">History</Button>
                                    <Button size="sm" className="flex-1">Order</Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const EquipmentTrackerTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader title="Fleet Management" subtitle="Equipment location and maintenance status" />
            <Card className="overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Asset</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Location</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Utilization</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Maintenance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {[1,2,3,4,5].map(i => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded text-slate-600"><Truck size={18}/></div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">Excavator {100+i}</p>
                                            <p className="text-xs text-slate-500 font-mono">CAT-320-X{i}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-sm text-slate-600">
                                        <MapPin size={14} className="text-nexus-500"/> Zone {String.fromCharCode(65+i)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${i===2 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${i===2 ? 'bg-red-600' : 'bg-green-600'}`}></div>
                                        {i===2 ? 'Down' : 'Active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 w-48">
                                    <div className="flex items-center gap-2">
                                        <ProgressBar value={Math.random() * 100} size="sm" />
                                        <span className="text-xs font-mono">84%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right text-xs text-slate-500">
                                    {i===2 ? <span className="text-red-600 font-bold flex items-center justify-end gap-1"><Wrench size={12}/> Service Req</span> : 'Due in 120h'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export const SystemHealthTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader title="Platform Health" subtitle="Operational status of core services" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    {['Database Shards', 'API Gateway', 'Auth Service', 'Notification Engine', 'Storage Blob'].map((svc, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${i===3 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                                    <Server size={20}/>
                                </div>
                                <span className="font-bold text-slate-800">{svc}</span>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${i===3 ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                                    {i===3 ? 'Degraded' : 'Operational'}
                                </span>
                                <p className="text-[10px] text-slate-400 mt-1 font-mono">99.9% Uptime</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <Card className="p-6 flex flex-col justify-center items-center text-center">
                     <div className="w-32 h-32 relative flex items-center justify-center mb-6">
                         <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
                         <div className="absolute inset-0 border-8 border-green-500 rounded-full border-t-transparent animate-[spin_3s_linear_infinite]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
                         <Activity size={48} className="text-green-500"/>
                     </div>
                     <h3 className="text-3xl font-black text-slate-900">All Systems Nominal</h3>
                     <p className="text-slate-500 mt-2 max-w-xs">No critical incidents reported in the last 24 hours.</p>
                     <div className="grid grid-cols-3 gap-8 mt-8 w-full border-t pt-6">
                         <div><p className="text-2xl font-bold text-slate-800">24ms</p><p className="text-xs uppercase text-slate-400 font-bold">Latency</p></div>
                         <div><p className="text-2xl font-bold text-slate-800">0.01%</p><p className="text-xs uppercase text-slate-400 font-bold">Error Rate</p></div>
                         <div><p className="text-2xl font-bold text-slate-800">420</p><p className="text-xs uppercase text-slate-400 font-bold">RPS</p></div>
                     </div>
                </Card>
            </div>
        </div>
    );
};
