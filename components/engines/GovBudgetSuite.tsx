
import React, { useState, useMemo, useTransition } from 'react';
import { useData } from '../../context/DataContext';
import { Banknote, Calendar, Layers, FileText } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCompactCurrency } from '../../utils/formatters';
import { EmptyGrid } from '../common/EmptyGrid';
import { TabbedLayout } from '../layout/standard/TabbedLayout';
import { NavGroup } from '../common/ModuleNavigation';

const GovBudgetSuite: React.FC = () => {
  const theme = useTheme();
  const { state } = useData();
  const [activeTab, setActiveTab] = useState('ppbe');
  const [isPending, startTransition] = useTransition();

  const { fundsFlow, fiscalYears, appropriations } = state.extensionData.government || { fundsFlow: [], fiscalYears: [], appropriations: [] };

  const totalAuthority = appropriations.reduce((sum, a) => sum + a.available, 0);
  const totalObligated = totalAuthority * 0.45; // Mock calculation from available
  const totalExpended = totalAuthority * 0.20;

  const navGroups: NavGroup[] = useMemo(() => [
      { id: 'cycles', label: 'Budget Cycles', items: [
          { id: 'ppbe', label: 'PPBE Calendar', icon: Calendar },
          { id: 'funds', label: 'Funds Control', icon: Banknote },
          { id: 'forms', label: 'Budget Forms', icon: FileText }
      ]}
  ], []);

  const handleTabChange = (id: string) => startTransition(() => setActiveTab(id));

  const renderPPBECalendar = () => (
    <div className="space-y-8 animate-nexus-in">
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><Calendar className="text-nexus-500" /> PPBE Calendar View</h2>
                <p className="text-slate-400 text-sm mt-1">Planning, Programming, Budgeting & Execution Cycle</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-slate-400 uppercase">Current Fiscal Year</p>
                <p className="text-2xl font-mono font-bold">FY{new Date().getFullYear()}</p>
            </div>
        </div>

        {fiscalYears.length > 0 ? (
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
        ) : (
            <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-slate-400">
                <Calendar className="mx-auto mb-2 opacity-20" size={32} />
                <p className="text-xs font-bold uppercase tracking-widest">No Fiscal Years Configured</p>
            </div>
        )}

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Color of Money (Appropriation Status)</h3>
            <div className="space-y-4">
                {appropriations.length > 0 ? appropriations.map((approp) => (
                    <div key={approp.type} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div>
                            <p className="font-bold text-sm text-slate-800">{approp.type}</p>
                            <p className="text-xs text-slate-500">{approp.years} Money • Expires {approp.exp}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-bold text-green-700">{formatCompactCurrency(approp.available)}</p>
                            <p className="text-xs text-slate-400">Unobligated Balance</p>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-sm text-slate-400 py-4">No appropriations loaded.</p>
                )}
            </div>
        </div>
    </div>
  );

  const renderFundsControl = () => (
    <div className="space-y-6 animate-nexus-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 border-t-4 border-t-blue-500">
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Total Authority</h3>
                <p className="text-3xl font-bold text-slate-900">{formatCompactCurrency(totalAuthority)}</p>
                <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-full"></div>
                </div>
            </Card>
            <Card className="p-6 border-t-4 border-t-green-500">
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Obligated</h3>
                <p className="text-3xl font-bold text-slate-900">{formatCompactCurrency(totalObligated)}</p>
                <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: `${(totalObligated/totalAuthority)*100}%`}}></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">{((totalObligated/totalAuthority)*100).toFixed(0)}% Execution Rate</p>
            </Card>
            <Card className="p-6 border-t-4 border-t-purple-500">
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Expended (Outlays)</h3>
                <p className="text-3xl font-bold text-slate-900">{formatCompactCurrency(totalExpended)}</p>
                <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full" style={{ width: `${(totalExpended/totalAuthority)*100}%`}}></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">{((totalExpended/totalAuthority)*100).toFixed(0)}% Liquidation Rate</p>
            </Card>
        </div>

        {fundsFlow.length > 0 ? (
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
        ) : (
            <EmptyGrid title="Funds Flow Unavailable" description="No funds flow data visualized." icon={Layers} />
        )}
    </div>
  );

  return (
    <TabbedLayout
        title="US Government Budget Lifecycle"
        subtitle="Federal PPBE Cycle & Funds Control Management"
        icon={Banknote}
        navGroups={navGroups}
        activeGroup="cycles"
        activeItem={activeTab}
        onGroupChange={() => {}}
        onItemChange={handleTabChange}
    >
        <div className={`flex-1 overflow-y-auto p-6 transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            {activeTab === 'ppbe' && renderPPBECalendar()}
            {activeTab === 'funds' && renderFundsControl()}
            {activeTab === 'forms' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-nexus-in">
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
    </TabbedLayout>
  );
};

export default GovBudgetSuite;
