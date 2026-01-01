import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { ChartPlaceholder } from '../charts/ChartPlaceholder';
import { 
    Activity, DollarSign, TrendingUp, AlertTriangle, MoreHorizontal, Clock, CheckSquare, PieChart, Target, ArrowUpRight, Plus, Layers, Calendar, BarChart2, Filter, RefreshCw, ChevronDown, Check, Briefcase, User, Sun, Cloud, CloudRain, Users, HardHat, Save 
} from 'lucide-react';
import StatCard from '../shared/StatCard';
import { ProgressBar } from '../common/ProgressBar';

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

const TemplatePlaceholder: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center justify-center h-full bg-slate-50 text-slate-400">
        <div className="text-center">
            <h3 className="font-bold text-slate-600">{title}</h3>
            <p className="text-xs">Component not implemented.</p>
        </div>
    </div>
);

export const PredictiveForecastTmpl: React.FC = () => <TemplatePlaceholder title="Predictive Forecast" />;
export const PortfolioOptimizerTmpl: React.FC = () => <TemplatePlaceholder title="Portfolio Optimizer" />;
export const VarianceDeepDiveTmpl: React.FC = () => <TemplatePlaceholder title="Variance Deep Dive" />;
export const TrendAnalysisTmpl: React.FC = () => <TemplatePlaceholder title="Trend Analysis" />;
export const HealthScorecardTmpl: React.FC = () => <TemplatePlaceholder title="Health Scorecard" />;
export const InvoiceProcessingTmpl: React.FC = () => <TemplatePlaceholder title="Invoice Processing" />;
export const CashFlowModelingTmpl: React.FC = () => <TemplatePlaceholder title="Cash Flow Modeling" />;

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
export const InventoryGridTmpl: React.FC = () => <TemplatePlaceholder title="Inventory Grid" />;
export const EquipmentTrackerTmpl: React.FC = () => <TemplatePlaceholder title="Equipment Tracker" />;
