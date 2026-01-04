
import React, { useState } from 'react';
import { Landmark, TrendingUp, Shield, Zap, Truck, DollarSign, Activity, Globe, Scale, Users, Layers } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency } from '../../utils/formatters';
import { useData } from '../../context/DataContext';

type Department = 'Treasury' | 'Defense' | 'Energy' | 'Transportation';

const FedGovSuite: React.FC = () => {
  const theme = useTheme();
  const { state } = useData();
  const [activeDept, setActiveDept] = useState<Department>('Treasury');

  // Load from state.extensionData.government
  const { treasuryStats, acquisitionPrograms, appropriations, fundsFlow, defenseStats, energyStats } = state.extensionData.government;

  const renderTreasury = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="National Debt" value="$34.5T" subtext="Held by Public" icon={Scale} trend="down" />
            <StatCard title="Tax Revenue (YTD)" value="$2.1T" subtext="Fiscal Year 2024" icon={DollarSign} trend="up" />
            <StatCard title="Deficit" value="$1.2T" subtext="Projected FY24" icon={TrendingUp} />
            <StatCard title="Interest Rates" value="5.25%" subtext="Fed Funds Rate" icon={Activity} />
        </div>

        <div className={`${theme.components.card} p-6 h-[400px]`}>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Landmark size={18} className="text-green-700"/> Federal Receipts vs Outlays (Trillions)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={treasuryStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(val: number) => `$${val}T`} />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#10b981" name="Revenue" />
                    <Area type="monotone" dataKey="outlay" stackId="2" stroke="#ef4444" fill="#ef4444" name="Outlays" fillOpacity={0.6}/>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );

  const renderDefense = () => (
    <div className="space-y-6">
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
                            <tr><td colSpan={3} className="py-4 text-center text-slate-400">No acquisition programs found.</td></tr>
                        )}
                    </tbody>
                </table>
            </Card>
            
            <div className={`${theme.colors.background} rounded-xl border border-slate-200 flex items-center justify-center p-6 text-slate-400`}>
                <Globe size={48} className="mr-4 opacity-50"/>
                <div>
                    <h4 className="font-bold">Global Force Disposition Map</h4>
                    <p className="text-xs">Secure connection required to view live assets.</p>
                </div>
            </div>
        </div>
    </div>
  );

  const renderEnergy = () => (
      <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Grid Load" value={energyStats.gridLoad} subtext={`${energyStats.capacity} Capacity`} icon={Zap} />
              <StatCard title="Strategic Reserve" value={energyStats.reserve} subtext="Petroleum" icon={Layers} trend="down" />
              <StatCard title="Renewable Gen" value={`${energyStats.renewablePercent}%`} subtext={`Target: ${energyStats.renewableTarget}% by 2030`} icon={Activity} trend="up" />
              <StatCard title="Nuclear Plants" value="93" subtext="Operating Units" icon={Shield} />
          </div>
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
      </div>
  );

  const renderTransportation = () => (
      <div className="p-12 text-center text-slate-500">
          <Truck size={64} className="mx-auto mb-4 text-slate-300"/>
          <h3 className="text-xl font-bold text-slate-700">Department of Transportation</h3>
          <p className="max-w-md mx-auto mt-2">Integrating FAA airspace data, FHWA highway project trackers, and FRA rail safety metrics. Module currently initializing.</p>
      </div>
  );

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className={theme.typography.h1}>
                    <Landmark className="text-blue-800" /> Federal Government Platform
                </h1>
                <p className={theme.typography.small}>Executive Branch Management System</p>
            </div>
            <div className={`flex ${theme.colors.surface} border border-slate-200 rounded-lg p-1`}>
                <button onClick={() => setActiveDept('Treasury')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${activeDept === 'Treasury' ? 'bg-green-50 text-green-700 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>
                    <DollarSign size={14}/> Treasury
                </button>
                <button onClick={() => setActiveDept('Defense')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${activeDept === 'Defense' ? 'bg-slate-800 text-white font-bold' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Shield size={14}/> Defense
                </button>
                <button onClick={() => setActiveDept('Energy')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${activeDept === 'Energy' ? 'bg-yellow-50 text-yellow-700 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Zap size={14}/> Energy
                </button>
                <button onClick={() => setActiveDept('Transportation')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${activeDept === 'Transportation' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Truck size={14}/> DOT
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {activeDept === 'Treasury' && renderTreasury()}
            {activeDept === 'Defense' && renderDefense()}
            {activeDept === 'Energy' && renderEnergy()}
            {activeDept === 'Transportation' && renderTransportation()}
        </div>
    </div>
  );
};

export default FedGovSuite;
