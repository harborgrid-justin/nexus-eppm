
import React, { useState } from 'react';
import { Banknote, Calendar, Layers, FileText, ArrowRight, PieChart } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Sankey } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCompactCurrency } from '../../utils/formatters';

const GovBudgetSuite: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'ppbe' | 'funds' | 'forms'>('ppbe');

  const fundsFlow = [
    { name: 'Appropriated', value: 0 },
    { name: 'Apportioned', value: 0 },
    { name: 'Allotted', value: 0 },
    { name: 'Committed', value: 0 },
    { name: 'Obligated', value: 0 },
    { name: 'Expended', value: 0 },
  ];

  const fiscalYears = [
    { year: 'FY24', phase: 'Planning', status: 'Pending', color: 'bg-slate-400' },
    { year: 'FY25', phase: 'Planning', status: 'Pending', color: 'bg-slate-400' },
    { year: 'FY26', phase: 'Planning', status: 'Pending', color: 'bg-slate-400' },
    { year: 'FY27', phase: 'Planning', status: 'Pending', color: 'bg-slate-400' },
  ];

  const renderPPBECalendar = () => (
    <div className="space-y-8">
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><Calendar className="text-nexus-500" /> PPBE Calendar View</h2>
                <p className="text-slate-400 text-sm mt-1">Planning, Programming, Budgeting & Execution Cycle</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-slate-400 uppercase">Current Fiscal Year</p>
                <p className="text-2xl font-mono font-bold">FY2024</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {fiscalYears.map(fy => (
                <div key={fy.year} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${fy.color}`}></div>
                    <h3 className="font-bold text-lg text-slate-800">{fy.year}</h3>
                    <div className="mt-2">
                        <p className="text-xs text-slate-500 uppercase font-bold">Phase</p>
                        <p className="text-sm font-medium">{fy.phase}</p>
                    </div>
                    <div className="mt-2">
                        <p className="text-xs text-slate-500 uppercase font-bold">Status</p>
                        <Badge variant="neutral">{fy.status}</Badge>
                    </div>
                </div>
            ))}
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Color of Money (Appropriation Status)</h3>
            <div className="space-y-4">
                {[
                    { type: '3010 - Aircraft Procurement', years: '3 Year', exp: 'FY26', available: 12500000 },
                    { type: '3600 - RDT&E', years: '2 Year', exp: 'FY25', available: 4500000 },
                    { type: '3400 - O&M', years: '1 Year', exp: 'FY24', available: 800000 },
                ].map((approp, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div>
                            <p className="font-bold text-sm text-slate-800">{approp.type}</p>
                            <p className="text-xs text-slate-500">{approp.years} Money • Expires {approp.exp}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-bold text-green-700">{formatCompactCurrency(approp.available)}</p>
                            <p className="text-xs text-slate-400">Unobligated Balance</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderFundsControl = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 border-t-4 border-t-blue-500">
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Total Authority</h3>
                <p className="text-3xl font-bold text-slate-900">$50.0M</p>
                <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-full"></div>
                </div>
            </Card>
            <Card className="p-6 border-t-4 border-t-green-500">
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Obligated</h3>
                <p className="text-3xl font-bold text-slate-900">$25.0M</p>
                <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full w-[50%]"></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">50% Execution Rate</p>
            </Card>
            <Card className="p-6 border-t-4 border-t-purple-500">
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Expended (Outlays)</h3>
                <p className="text-3xl font-bold text-slate-900">$12.0M</p>
                <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full w-[24%]"></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">24% Liquidation Rate</p>
            </Card>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Layers size={18}/> Funds Flow Waterfall</h3>
            <div className="relative h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fundsFlow} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip formatter={(val: number) => formatCompactCurrency(val)} cursor={{fill: '#f8fafc'}} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} label={{ position: 'right', fill: '#64748b', fontSize: 12, formatter: (val: number) => formatCompactCurrency(val) }} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className={theme.typography.h1}>
                    <Banknote className="text-nexus-600" /> US Government Budget Lifecycle
                </h1>
                <p className={theme.typography.small}>Federal PPBE Cycle & Funds Control Management</p>
            </div>
            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                <button onClick={() => setActiveTab('ppbe')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'ppbe' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>PPBE Calendar</button>
                <button onClick={() => setActiveTab('funds')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'funds' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Funds Control</button>
                <button onClick={() => setActiveTab('forms')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'forms' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Budget Forms</button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {activeTab === 'ppbe' && renderPPBECalendar()}
            {activeTab === 'funds' && renderFundsControl()}
            {activeTab === 'forms' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 cursor-pointer hover:border-nexus-400 border-2 border-transparent">
                        <FileText size={32} className="text-slate-400 mb-4"/>
                        <h3 className="font-bold text-slate-800">DD Form 1391</h3>
                        <p className="text-sm text-slate-500 mt-1">Military Construction Project Data</p>
                    </Card>
                    <Card className="p-6 cursor-pointer hover:border-nexus-400 border-2 border-transparent">
                        <FileText size={32} className="text-slate-400 mb-4"/>
                        <h3 className="font-bold text-slate-800">R-Docs (R-1)</h3>
                        <p className="text-sm text-slate-500 mt-1">Research, Development, Test & Eval</p>
                    </Card>
                    <Card className="p-6 cursor-pointer hover:border-nexus-400 border-2 border-transparent">
                        <FileText size={32} className="text-slate-400 mb-4"/>
                        <h3 className="font-bold text-slate-800">P-Docs (P-1)</h3>
                        <p className="text-sm text-slate-500 mt-1">Procurement Programs</p>
                    </Card>
                </div>
            )}
        </div>
    </div>
  );
};

export default GovBudgetSuite;
