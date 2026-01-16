
import React, { useState, useMemo, useTransition } from 'react';
import { Landmark, TrendingUp, Shield, Zap, Truck, DollarSign, Activity, Globe, Scale, Users, Layers } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency } from '../../utils/formatters';
import { useData } from '../../context/DataContext';
import { EmptyGrid } from '../common/EmptyGrid';
import { TabbedLayout } from '../layout/standard/TabbedLayout';
import { NavGroup } from '../common/ModuleNavigation';

const FedGovSuite: React.FC = () => {
  const theme = useTheme();
  const { state } = useData();
  const [activeTab, setActiveTab] = useState('Treasury');
  const [isPending, startTransition] = useTransition();

  // Safely access extension data with fallbacks
  const govData = state.extensionData.government || { 
      treasuryStats: [], 
      acquisitionPrograms: [], 
      defenseStats: { readiness: 'N/A', personnel: '0', budget: '$0', cyberStatus: 'Unknown', logisticsStatus: 'Unknown' },
      energyStats: { gridLoad: '0', capacity: '0', reserve: '0', renewablePercent: 0, renewableTarget: 0, mix: [] }
  };

  const { treasuryStats, acquisitionPrograms, defenseStats, energyStats } = govData;

  const navGroups: NavGroup[] = useMemo(() => [
      { id: 'departments', label: 'Executive Branch', items: [
          { id: 'Treasury', label: 'Treasury', icon: DollarSign },
          { id: 'Defense', label: 'Defense', icon: Shield },
          { id: 'Energy', label: 'Energy', icon: Zap },
          { id: 'Transportation', label: 'DOT', icon: Truck }
      ]}
  ], []);

  const handleTabChange = (id: string) => startTransition(() => setActiveTab(id));

  const renderTreasury = () => {
      if (treasuryStats.length === 0) return <EmptyGrid title="Treasury Data Offline" description="Federal receipt and outlay data stream is currently disconnected." icon={Landmark} />;

      const latest = treasuryStats[treasuryStats.length - 1] || { revenue: 0, outlay: 0 };

      return (
        <div className="space-y-6 animate-nexus-in p-6 h-full overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="National Debt" value="$34.5T" subtext="Held by Public" icon={Scale} trend="down" />
                <StatCard title="Tax Revenue (YTD)" value={formatCompactCurrency(latest.revenue)} subtext="Fiscal Year 2024" icon={DollarSign} trend="up" />
                <StatCard title="Deficit" value={formatCompactCurrency(latest.outlay - latest.revenue)} subtext="Projected FY24" icon={TrendingUp} />
                <StatCard title="Interest Rates" value="5.25%" subtext="Fed Funds Rate" icon={Activity} />
            </div>

            <div className={`${theme.components.card} p-6 h-[400px]`}>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Landmark size={18} className="text-green-700"/> Federal Receipts vs Outlays (Trillions)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={treasuryStats}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(val: number) => formatCompactCurrency(val)} />
                        <Legend />
                        <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#10b981" name="Revenue" />
                        <Area type="monotone" dataKey="outlay" stackId="2" stroke="#ef4444" fill="#ef4444" name="Outlays" fillOpacity={0.6}/>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      );
  };

  const renderDefense = () => (
    <div className="space-y-6 animate-nexus-in p-6 h-full overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Global Readiness</p>
                        <h3 className="text-3xl font-bold mt-1">{defenseStats.readiness}</h3>
                    </div>
                    <Shield size={32} className="text-blue-400" />
                </div>
                <div className="mt-4 flex gap-2">
                    <span className="bg-green-600 px-2 py-1 text-xs rounded font-bold">Cyber: {defenseStats.cyberStatus}</span>
                    <span className="bg-yellow-600 px-2 py-1 text-xs rounded font-bold">Logistics: {defenseStats.logisticsStatus}</span>
                </div>
            </div>
            <StatCard title="Active Personnel" value={defenseStats.personnel} subtext="Across all branches" icon={Users} />
            <StatCard title="Procurement Budget" value={defenseStats.budget} subtext="FY24 Authorized" icon={DollarSign} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
                <h3 className="font-bold text-slate-800 mb-4">Major Acquisition Programs (ACAT I)</h3>
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 text-left text-slate-500">
                            <th className="pb-2">Program</th>
                            <th className="pb-2">Milestone</th>
                            <th className="pb-2 text-right">Cost Variance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {acquisitionPrograms && acquisitionPrograms.length > 0 ? acquisitionPrograms.map((prog, i) => (
                            <tr key={i} className="group hover:bg-slate-50">
                                <td className="py-3 font-medium text-slate-800">{prog.name}</td>
                                <td className="py-3 text-slate-600">{prog.milestone}</td>
                                <td className={`py-3 text-right font-bold ${prog.costVariance > 0 ? 'text-red-600' : prog.costVariance < 0 ? 'text-green-600' : 'text-slate-600'}`}>
                                    {prog.costVariance > 0 ? `+${prog.costVariance}%` : prog.costVariance < 0 ? `${prog.costVariance}%` : 'On Budget'}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={3} className="py-4 text-center text-slate-400">No active acquisition programs.</td></tr>
                        )}
                    </tbody>
                </table>
            </Card>
            
            <div className={`${theme.colors.background} rounded-xl border border-slate-200 flex items-center justify-center p-6 text-slate-400 bg-slate-50`}>
                <div className="text-center">
                    <Globe size={48} className="mx-auto mb-4 opacity-50"/>
                    <h4 className="font-bold">Global Force Disposition Map</h4>
                    <p className="text-xs">Secure connection required to view live assets.</p>
                </div>
            </div>
        </div>
    </div>
  );

  const renderEnergy = () => (
      <div className="space-y-6 animate-nexus-in p-6 h-full overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Grid Load" value={energyStats.gridLoad} subtext={`${energyStats.capacity} Capacity`} icon={Zap} />
              <StatCard title="Strategic Reserve" value={energyStats.reserve} subtext="Petroleum" icon={Layers} trend="down" />
              <StatCard title="Renewable Gen" value={`${energyStats.renewablePercent}%`} subtext={`Target: ${energyStats.renewableTarget}% by 2030`} icon={Activity} trend="up" />
              <StatCard title="Nuclear Plants" value="93" subtext="Operating Units" icon={Shield} />
          </div>
          {energyStats.mix.length > 0 ? (
              <div className={`${theme.components.card} p-6 h-[400px]`}>
                  <h3 className="font-bold text-slate-800 mb-4">Energy Mix Transition</h3>
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={energyStats.mix}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="source" />
                          <YAxis unit="%" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="output" name="Current Output %" fill="#64748b" />
                          <Bar dataKey="target" name="2030 Target %" fill="#22c55e" />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          ) : (
             <EmptyGrid title="Grid Telemetry Missing" description="No energy mix data available from DOE feeds." icon={Zap} />
          )}
      </div>
  );

  const renderTransportation = () => (
      <div className="h-full flex items-center justify-center">
          <EmptyGrid 
            title="Department of Transportation"
            description="Integrating FAA airspace data, FHWA highway project trackers, and FRA rail safety metrics. Module currently initializing."
            icon={Truck}
            actionLabel="Connect DOT Data Feed"
            onAdd={() => {}}
          />
      </div>
  );

  return (
    <TabbedLayout
        title="Federal Government Platform"
        subtitle="Executive Branch Management System"
        icon={Landmark}
        navGroups={navGroups}
        activeGroup="departments"
        activeItem={activeTab}
        onGroupChange={() => {}}
        onItemChange={handleTabChange}
    >
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            {activeTab === 'Treasury' && renderTreasury()}
            {activeTab === 'Defense' && renderDefense()}
            {activeTab === 'Energy' && renderEnergy()}
            {activeTab === 'Transportation' && renderTransportation()}
        </div>
    </TabbedLayout>
  );
};

export default FedGovSuite;
