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
    Activity, DollarSign, TrendingUp, TrendingDown, AlertTriangle, MoreHorizontal, Clock, CheckSquare, PieChart, Target, ArrowUpRight, Plus, Layers, Calendar, BarChart2, Filter, RefreshCw, ChevronDown, Check, Briefcase, User 
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