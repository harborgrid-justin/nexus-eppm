
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { ChartPlaceholder } from '../charts/ChartPlaceholder';
import { ProgressBar } from '../common/ProgressBar';
import { 
    Activity, DollarSign, TrendingUp, AlertTriangle, MoreHorizontal, Clock, CheckSquare, PieChart, Target, ArrowUpRight, Plus, Layers, Calendar, BarChart2, Filter, RefreshCw, ChevronDown, Check, Briefcase, User, Sun, Cloud, CloudRain, Users, HardHat, Save, TrendingDown, FileText, Search, Truck, Box, Wrench, Download, CheckCircle, Server
} from 'lucide-react';
import StatCard from '../shared/StatCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, LineChart, Line, ScatterChart, Scatter, ZAxis, ComposedChart, ReferenceLine } from 'recharts';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';

const TemplateHeader = ({ number, title, subtitle }: { number: string, title: string, subtitle?: string }) => (
    <div className="flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono text-lg font-bold shadow-lg shadow-slate-200 shrink-0">
            {number}
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
        </div>
    </div>
);

// ... (PredictiveForecastTmpl, PortfolioOptimizerTmpl, VarianceDeepDiveTmpl, TrendAnalysisTmpl, HealthScorecardTmpl, InvoiceProcessingTmpl, CashFlowModelingTmpl, DailyLogEntryTmpl, InventoryGridTmpl, EquipmentTrackerTmpl remain unchanged) ...
export const PredictiveForecastTmpl: React.FC = () => {
    const theme = useTheme();
    const data = [
        { month: 'Jan', actual: 4000, forecast: 4100, lower: 3800, upper: 4400 },
        { month: 'Feb', actual: 3000, forecast: 3200, lower: 2900, upper: 3500 },
        { month: 'Mar', actual: 2000, forecast: 2400, lower: 2100, upper: 2700 },
        { month: 'Apr', actual: 2780, forecast: 2900, lower: 2600, upper: 3200 },
        { month: 'May', actual: 1890, forecast: 2100, lower: 1800, upper: 2400 },
        { month: 'Jun', forecast: 2500, lower: 2000, upper: 3000 },
        { month: 'Jul', forecast: 2700, lower: 2100, upper: 3300 },
    ];

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader number="31" title="Predictive AI Forecast" subtitle="Monte Carlo probability bands with historical actuals" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <Card className="p-6 h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800">Forecast vs Actuals (Confidence Interval)</h3>
                            <div className="flex gap-2 text-xs font-bold text-slate-500">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-nexus-600"></div> Actual</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Forecast</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-200"></div> 95% CI</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="upper" stroke="none" fill="#e9d5ff" />
                                <Area type="monotone" dataKey="lower" stroke="none" fill="#fff" />
                                <Line type="monotone" dataKey="actual" stroke="#0284c7" strokeWidth={3} />
                                <Line type="monotone" dataKey="forecast" stroke="#a855f7" strokeWidth={3} strokeDasharray="5 5" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
                <div className="space-y-6">
                    <StatCard title="Confidence Score" value="89%" icon={Target} subtext="High reliability" trend="up"/>
                    <StatCard title="Projected Variance" value="-4.2%" icon={TrendingDown} subtext="Under budget trend" trend="up"/>
                    <div className="bg-slate-900 text-white p-6 rounded-2xl">
                        <h4 className="font-bold text-lg mb-2">AI Insight</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Pattern analysis suggests a seasonal dip in July. Recommended to defer non-critical spend to Q3.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PortfolioOptimizerTmpl: React.FC = () => {
    const theme = useTheme();
    const data = Array.from({length: 20}, (_, i) => ({
        x: Math.random() * 100, y: Math.random() * 100, z: Math.random() * 1000, name: `Proj ${i}`
    }));

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader number="32" title="Portfolio Optimizer" subtitle="Efficient Frontier Analysis" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                <Card className="lg:col-span-2 p-6 flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-4">Risk vs Return Landscape</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="x" name="Risk" unit="%" label={{ value: 'Risk Exposure', position: 'bottom', offset: 0 }} />
                            <YAxis type="number" dataKey="y" name="Return" unit="%" label={{ value: 'ROI', angle: -90, position: 'insideLeft' }} />
                            <ZAxis type="number" dataKey="z" range={[50, 400]} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter name="Projects" data={data} fill="#0ea5e9" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </Card>
                <div className="space-y-6 overflow-y-auto">
                    <Card className="p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Constraints</h3>
                        <div className="space-y-4">
                            <div><label className="text-xs font-bold text-slate-500 uppercase">Budget Cap</label><Input defaultValue="$50,000,000" className="mt-1"/></div>
                            <div><label className="text-xs font-bold text-slate-500 uppercase">Risk Tolerance</label><select className="w-full p-2 border rounded mt-1 text-sm"><option>Moderate</option></select></div>
                            <Button className="w-full" icon={RefreshCw}>Run Solver</Button>
                        </div>
                    </Card>
                    <Card className="p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Optimal Selection</h3>
                        <div className="space-y-2">
                            {['Project Alpha', 'Project Beta', 'Project Gamma'].map((p,i) => (
                                <div key={i} className="flex justify-between text-sm p-2 bg-green-50 text-green-800 rounded border border-green-200">
                                    <span>{p}</span><Check size={16}/>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export const VarianceDeepDiveTmpl: React.FC = () => {
    const theme = useTheme();
    const data = [
        { category: 'Labor', planned: 120000, actual: 110000 },
        { category: 'Materials', planned: 80000, actual: 95000 },
        { category: 'Subs', planned: 45000, actual: 42000 },
        { category: 'Equip', planned: 30000, actual: 35000 },
    ];

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader number="33" title="Variance Deep Dive" subtitle="Cost Breakdown Structure (CBS) Analysis" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 h-[400px]">
                    <h3 className="font-bold text-slate-800 mb-6">Planned vs Actuals by Cost Code</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                            <XAxis type="number" />
                            <YAxis dataKey="category" type="category" width={80} />
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="planned" fill="#cbd5e1" name="Baseline" barSize={20} />
                            <Bar dataKey="actual" fill="#0ea5e9" name="Actuals" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <div className="space-y-4">
                     {data.map((item, i) => {
                         const variance = item.actual - item.planned;
                         const isPositive = variance <= 0;
                         return (
                             <Card key={i} className="p-4 flex items-center justify-between">
                                 <div>
                                     <h4 className="font-bold text-slate-800">{item.category}</h4>
                                     <p className="text-xs text-slate-500">GL Code: 10-{200+i}</p>
                                 </div>
                                 <div className="text-right">
                                     <p className="font-mono font-bold text-slate-900">{formatCurrency(variance)}</p>
                                     <Badge variant={isPositive ? 'success' : 'danger'}>{isPositive ? 'Under Run' : 'Over Run'}</Badge>
                                 </div>
                             </Card>
                         )
                     })}
                </div>
            </div>
        </div>
    );
};

export const TrendAnalysisTmpl: React.FC = () => {
    const theme = useTheme();
    const data = [
        { month: 'Jan', spi: 0.9, cpi: 0.95 },
        { month: 'Feb', spi: 0.92, cpi: 0.94 },
        { month: 'Mar', spi: 0.95, cpi: 0.98 },
        { month: 'Apr', spi: 1.0, cpi: 1.01 },
        { month: 'May', spi: 1.02, cpi: 1.03 },
        { month: 'Jun', spi: 0.98, cpi: 1.01 },
    ];

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader number="34" title="Performance Trend Analysis" subtitle="SPI & CPI Evolution over time" />
            <Card className="p-6 h-[500px]">
                <h3 className="font-bold text-slate-800 mb-6">Performance Indices</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0.5, 1.5]} />
                        <Tooltip />
                        <Legend />
                        <ReferenceLine y={1} stroke="red" strokeDasharray="3 3" label="Baseline" />
                        <Line type="monotone" dataKey="spi" stroke="#f59e0b" strokeWidth={3} name="Schedule (SPI)" />
                        <Line type="monotone" dataKey="cpi" stroke="#10b981" strokeWidth={3} name="Cost (CPI)" />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export const HealthScorecardTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader number="35" title="Program Health Scorecard" subtitle="Multi-dimensional KPI status" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[
                    { title: 'Project Alpha', score: 92, status: 'Healthy', budget: 'On Track', schedule: 'Ahead', risk: 'Low' },
                    { title: 'Project Beta', score: 75, status: 'Warning', budget: 'Over', schedule: 'On Track', risk: 'Medium' },
                    { title: 'Project Gamma', score: 45, status: 'Critical', budget: 'Critical', schedule: 'Delayed', risk: 'High' },
                    { title: 'Project Delta', score: 88, status: 'Healthy', budget: 'On Track', schedule: 'On Track', risk: 'Low' },
                    { title: 'Project Epsilon', score: 62, status: 'Warning', budget: 'Under', schedule: 'Delayed', risk: 'High' },
                    { title: 'Project Zeta', score: 95, status: 'Healthy', budget: 'On Track', schedule: 'Ahead', risk: 'Low' },
                ].map((p, i) => (
                    <Card key={i} className="p-6 flex flex-col gap-4 relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-2 h-full ${p.status === 'Healthy' ? 'bg-green-500' : p.status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <div className="flex justify-between items-start pl-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{p.title}</h3>
                                <p className="text-xs text-slate-500">ID: PRJ-00{i+1}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center font-black text-slate-700 bg-white shadow-sm">
                                {p.score}
                            </div>
                        </div>
                        <div className="pl-4 grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                            <div><p className="text-[10px] text-slate-400 uppercase font-bold">Budget</p><p className={`text-sm font-bold ${p.budget === 'Critical' || p.budget === 'Over' ? 'text-red-600' : 'text-slate-700'}`}>{p.budget}</p></div>
                            <div><p className="text-[10px] text-slate-400 uppercase font-bold">Schedule</p><p className={`text-sm font-bold ${p.schedule === 'Delayed' ? 'text-red-600' : 'text-slate-700'}`}>{p.schedule}</p></div>
                            <div><p className="text-[10px] text-slate-400 uppercase font-bold">Risk</p><p className={`text-sm font-bold ${p.risk === 'High' ? 'text-red-600' : 'text-slate-700'}`}>{p.risk}</p></div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const InvoiceProcessingTmpl: React.FC = () => {
    const theme = useTheme();
    const columns = [
        { id: 'new', label: 'Received', color: 'border-blue-500' },
        { id: 'review', label: 'In Review', color: 'border-yellow-500' },
        { id: 'approved', label: 'Approved', color: 'border-green-500' },
        { id: 'paid', label: 'Paid', color: 'border-slate-500' },
    ];
    const invoices = [
        { id: 'INV-001', vendor: 'Acme Corp', amount: 12500, status: 'new' },
        { id: 'INV-002', vendor: 'Globex', amount: 4500, status: 'review' },
        { id: 'INV-003', vendor: 'Soylent', amount: 8200, status: 'approved' },
        { id: 'INV-004', vendor: 'Initech', amount: 3100, status: 'paid' },
    ];

    return (
        <div className={`h-full overflow-hidden flex flex-col ${theme.layout.pagePadding}`}>
            <div className="flex justify-between items-center mb-6">
                <TemplateHeader number="36" title="Invoice Processing" subtitle="AP Workflow Board" />
                <Button icon={Plus}>Upload Invoice</Button>
            </div>
            <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
                {columns.map(col => (
                    <div key={col.id} className="flex-1 min-w-[280px] bg-slate-100 rounded-xl flex flex-col">
                        <div className={`p-4 font-bold text-slate-700 border-t-4 ${col.color} bg-white rounded-t-xl shadow-sm mb-2`}>{col.label}</div>
                        <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                            {invoices.filter(i => i.status === col.id).map(inv => (
                                <Card key={inv.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-slate-800">{inv.vendor}</span>
                                        <span className="font-mono font-bold text-nexus-700">{formatCurrency(inv.amount)}</span>
                                    </div>
                                    <div className="text-xs text-slate-500 flex justify-between">
                                        <span>{inv.id}</span>
                                        <span>Due: Oct 15</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const CashFlowModelingTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader number="37" title="Cash Flow Modeling" subtitle="Inflow/Outflow Scenarios" />
            <Card className="p-6 h-[500px]">
                <h3 className="font-bold text-slate-800 mb-6">Net Cash Position Forecast</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={[
                        { month: 'Jan', in: 5000, out: 4000, net: 1000 },
                        { month: 'Feb', in: 6000, out: 4500, net: 1500 },
                        { month: 'Mar', in: 5500, out: 6000, net: -500 },
                        { month: 'Apr', in: 7000, out: 5000, net: 2000 },
                        { month: 'May', in: 6500, out: 5500, net: 1000 },
                    ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="in" name="Inflow" fill="#10b981" />
                        <Bar dataKey="out" name="Outflow" fill="#ef4444" />
                        <Line type="monotone" dataKey="net" name="Net Position" stroke="#3b82f6" strokeWidth={3} />
                    </ComposedChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export const DailyLogEntryTmpl: React.FC = () => {
    const theme = useTheme();
    const [date, setDate] = useState('');
    useEffect(() => {
        setDate(new Date().toISOString().split('T')[0]);
    }, []);

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} bg-slate-50`}>
            <div className="max-w-4xl mx-auto">
                <TemplateHeader number="38" title="Daily Field Report" subtitle="Capture daily progress, conditions, and events from the job site." />
                
                <Card className="p-0 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className={theme.typography.label + " block mb-2"}>Report Date</label>
                                <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                            </div>
                             <div>
                                <label className={theme.typography.label + " block mb-2"}>Foreman</label>
                                <Input value="Mike Ross" disabled />
                            </div>
                            <div>
                                <label className={theme.typography.label + " block mb-2"}>Status</label>
                                <div className="p-2.5 bg-slate-100 rounded-lg text-sm font-medium border border-slate-200">
                                    Draft
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-white border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><CloudRain size={16}/> Weather & Site Conditions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Input label="Temperature (°F)" placeholder="e.g. 72" />
                            <Input label="Wind (MPH)" placeholder="e.g. 5" />
                            <Input label="Precipitation (in)" placeholder="e.g. 0.0" />
                            <Input label="Site Conditions" placeholder="e.g. Dry" />
                        </div>
                    </div>

                    <div className="p-6 bg-white border-b border-slate-100">
                         <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Users size={16}/> Manpower Log</h3>
                         <div className="space-y-3">
                             <div className="grid grid-cols-4 gap-4 items-center">
                                 <Input label="Contractor" defaultValue="Acme Concrete" className="col-span-2" />
                                 <Input label="Headcount" type="number" defaultValue="12" />
                                 <Input label="Hours" type="number" defaultValue="96" />
                             </div>
                              <div className="grid grid-cols-4 gap-4 items-center">
                                 <Input label="Contractor" defaultValue="Steel Erectors Inc." className="col-span-2" />
                                 <Input label="Headcount" type="number" defaultValue="8" />
                                 <Input label="Hours" type="number" defaultValue="64" />
                             </div>
                             <Button variant="outline" size="sm" icon={Plus}>Add Contractor</Button>
                         </div>
                    </div>

                     <div className="p-6 bg-white border-b border-slate-100">
                         <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><HardHat size={16}/> Work Performed</h3>
                         <textarea className="w-full border border-slate-200 rounded-lg p-3 text-sm h-32 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-nexus-500 outline-none" placeholder="Describe work completed today..."></textarea>
                    </div>

                    <div className="p-6 bg-white">
                         <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><AlertTriangle size={16} className="text-orange-500"/> Delays or Safety Notes</h3>
                         <textarea className="w-full border border-slate-200 rounded-lg p-3 text-sm h-24 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-nexus-500 outline-none" placeholder="Record any disruptions, safety incidents, or observations..."></textarea>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                        <Button variant="secondary">Save Draft</Button>
                        <Button icon={Save}>Submit Daily Report</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export const InventoryGridTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <div className="flex justify-between items-center mb-6">
                <TemplateHeader number="39" title="Inventory Management" subtitle="Material stock tracking" />
                <div className="flex gap-2">
                    <Input isSearch placeholder="Search SKU..." className="w-64" />
                    <Button icon={Filter} variant="secondary">Filter</Button>
                    <Button icon={Plus}>Add Item</Button>
                </div>
            </div>
            <Card className="overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Item Name</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Location</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Quantity</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[1, 2, 3, 4, 5].map(i => (
                            <tr key={i} className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-sm font-mono text-slate-600">MAT-00{i}</td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-800">Construction Material {i}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">Warehouse A - Row {i}</td>
                                <td className="px-6 py-4 text-sm text-right font-mono">1,{i}00</td>
                                <td className="px-6 py-4 text-center"><Badge variant={i % 2 === 0 ? 'success' : 'warning'}>{i % 2 === 0 ? 'In Stock' : 'Low Stock'}</Badge></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export const EquipmentTrackerTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader number="40" title="Equipment Fleet Tracker" subtitle="Asset location and maintenance status" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <Card key={i} className="p-4 group hover:border-nexus-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded text-slate-600"><Truck size={24}/></div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Excavator {i}</h4>
                                    <p className="text-xs text-slate-500 font-mono">CAT-320-{100+i}</p>
                                </div>
                            </div>
                            <Badge variant={i === 2 ? 'danger' : 'success'}>{i === 2 ? 'Service Req' : 'Active'}</Badge>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex justify-between"><span>Location:</span> <span className="font-bold">Site {i}</span></div>
                            <div className="flex justify-between"><span>Hours:</span> <span className="font-mono">1,2{i}0 hrs</span></div>
                            <div className="flex justify-between"><span>Next Service:</span> <span>Oct {10+i}</span></div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                            <Button size="sm" variant="secondary" className="flex-1">Log Usage</Button>
                            <Button size="sm" variant="outline" className="flex-1">View Map</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const SystemHealthTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const { metrics, services } = state.systemMonitoring;

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader number="56" title="System Health" subtitle="Operational metrics & status" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {metrics.map((m, i) => (
                    <Card key={i} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase">{m.name}</p>
                                <h4 className={`text-3xl font-black ${m.value > m.threshold ? 'text-red-500' : 'text-slate-800'}`}>
                                    {m.value}<span className="text-lg font-medium text-slate-400 ml-1">{m.unit}</span>
                                </h4>
                            </div>
                            <div className={`p-2 rounded-full ${m.value > m.threshold ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                {m.value > m.threshold ? <AlertTriangle size={20}/> : <CheckCircle size={20}/>}
                            </div>
                        </div>
                        <div className="h-16 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={m.trend.map((v, idx) => ({ idx, val: v }))}>
                                    <Area type="monotone" dataKey="val" stroke={m.value > m.threshold ? '#ef4444' : '#10b981'} fill={m.value > m.threshold ? '#fecaca' : '#d1fae5'} strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <Server size={18}/> Service Status
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 text-green-600 font-bold"><div className="w-2 h-2 rounded-full bg-green-500"></div> Operational</span>
                        <span className="flex items-center gap-1 text-yellow-600 font-bold"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Degraded</span>
                        <span className="flex items-center gap-1 text-red-600 font-bold"><div className="w-2 h-2 rounded-full bg-red-500"></div> Down</span>
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    {services.map((svc, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${svc.status === 'Operational' ? 'bg-green-500' : svc.status === 'Degraded' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                <span className="font-bold text-slate-800 text-sm">{svc.name}</span>
                            </div>
                            <div className="flex gap-8 text-xs text-slate-500 font-mono">
                                <span>UPTIME: {svc.uptime}</span>
                                <span className={svc.status === 'Degraded' ? 'text-yellow-600 font-bold' : ''}>LATENCY: {svc.latency}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
