
import React, { useState, useMemo, useTransition } from 'react';
import { Shield, Activity, AlertTriangle, FileText, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { useData } from '../../context/DataContext';
import { EmptyGrid } from '../common/EmptyGrid';
import { formatCompactCurrency } from '../../utils/formatters';
import { TabbedLayout } from '../layout/standard/TabbedLayout';
import { NavGroup } from '../common/ModuleNavigation';

const DoDSuite: React.FC = () => {
  const theme = useTheme();
  const { state } = useData();
  const [activeTab, setActiveTab] = useState('acquisition');
  const [isPending, startTransition] = useTransition();

  const { milestones, phases, evmsData } = state.extensionData.dod || { milestones: [], phases: [], evmsData: [] };

  const navGroups: NavGroup[] = useMemo(() => [
      { id: 'framework', label: 'DoD 5000.02', items: [
          { id: 'acquisition', label: 'Acquisition Lifecycle', icon: Shield },
          { id: 'evms', label: 'EVMS Compliance', icon: BarChart2 },
          { id: 'risk', label: 'Defense Risk (5x5)', icon: AlertTriangle }
      ]}
  ], []);

  const handleTabChange = (id: string) => startTransition(() => setActiveTab(id));

  // --- RENDERERS ---

  const renderAcquisitionLifecycle = () => {
    if (phases.length === 0) return <EmptyGrid title="Acquisition Cycle Undefined" description="Initialize DoDI 5000.02 framework phases." icon={Shield} />;

    return (
      <div className="space-y-8 animate-nexus-in">
        <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-xl shadow-md">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2"><Shield className="text-nexus-500" /> Defense Acquisition System (DAS)</h2>
            <p className="text-slate-400 text-sm mt-1">DoDI 5000.02 Adaptive Acquisition Framework</p>
          </div>
          <div className="flex gap-4">
              <div className="text-center">
                  <p className="text-xs text-slate-400 uppercase tracking-widest">ACAT Level</p>
                  <p className="font-mono text-xl font-bold text-yellow-400">ACAT I</p>
              </div>
              <div className="text-center">
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Phase</p>
                  <p className="font-mono text-xl font-bold text-blue-400">TMRR</p>
              </div>
          </div>
        </div>

        {/* Chevron Process Flow */}
        <div className="relative pt-8 pb-4 overflow-x-auto">
          <div className="flex min-w-[1000px]">
              {phases.map((phase, idx) => (
                  <div key={idx} className="flex-1 relative group">
                      <div className={`h-12 flex items-center justify-center text-sm font-bold text-white clip-chevron pr-4 pl-8 transition-all hover:brightness-110 cursor-pointer
                          ${phase.status === 'Complete' ? 'bg-green-700' : phase.status === 'In Progress' ? 'bg-blue-600' : 'bg-slate-400'}
                      `} style={{ marginLeft: idx === 0 ? 0 : '-20px' }}>
                          {phase.name}
                      </div>
                      <div className="mt-2 text-center text-xs text-slate-500 font-mono">{phase.duration}</div>
                      
                      {/* Milestone Markers */}
                      {idx < milestones.length && (
                          <div className="absolute -top-6 right-0 translate-x-1/2 flex flex-col items-center z-10">
                              <div className={`w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] ${milestones[idx].status === 'Complete' ? 'border-t-green-600' : 'border-t-yellow-500'}`}></div>
                              <span className="text-[10px] font-bold text-slate-700 mt-1">MS {milestones[idx].id}</span>
                          </div>
                      )}
                  </div>
              ))}
          </div>
        </div>

        {/* Quad Chart View (Mini) */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-6">
            <Card className="p-4">
                <h4 className="font-bold text-slate-700 mb-2 border-b pb-1">Operational Performance</h4>
                <ul className="text-sm space-y-1">
                    <li className="flex justify-between"><span>Speed:</span> <span className="font-mono text-green-600">Mach 2.0 (Obj)</span></li>
                    <li className="flex justify-between"><span>Range:</span> <span className="font-mono text-yellow-600">450nm (Thr)</span></li>
                    <li className="flex justify-between"><span>Payload:</span> <span className="font-mono text-green-600">2000lb</span></li>
                </ul>
            </Card>
            <Card className="p-4">
                <h4 className="font-bold text-slate-700 mb-2 border-b pb-1">Schedule & Milestones</h4>
                <ul className="text-sm space-y-1">
                    {milestones.slice(0,3).map(m => (
                        <li key={m.id} className="flex justify-between"><span>{m.name}:</span> <span className="text-slate-600">{m.date}</span></li>
                    ))}
                </ul>
            </Card>
            <Card className="p-4">
                <h4 className="font-bold text-slate-700 mb-2 border-b pb-1">Unit Cost & Budget</h4>
                <ul className="text-sm space-y-1">
                    <li className="flex justify-between"><span>PAUC:</span> <span className="font-mono">$85M</span></li>
                    <li className="flex justify-between"><span>APUC:</span> <span className="font-mono">$72M</span></li>
                    <li className="flex justify-between"><span>FY24 Funding:</span> <span className="font-mono text-green-600">98% Obligated</span></li>
                </ul>
            </Card>
            <Card className="p-4">
                <h4 className="font-bold text-slate-700 mb-2 border-b pb-1">Technical Maturity</h4>
                <ul className="text-sm space-y-1">
                    <li className="flex justify-between"><span>TRL:</span> <span className="font-mono bg-green-100 text-green-800 px-1 rounded">Level 6</span></li>
                    <li className="flex justify-between"><span>MRL:</span> <span className="font-mono bg-yellow-100 text-yellow-800 px-1 rounded">Level 4</span></li>
                    <li className="flex justify-between"><span>S/W Lines:</span> <span className="font-mono">1.2M SLOC</span></li>
                </ul>
            </Card>
        </div>
      </div>
    );
  };

  const renderEVMS = () => {
    if (evmsData.length === 0) return <EmptyGrid title="No EVMS Data" description="ANSI-748 Earned Value data not populated." icon={Activity} />;

    const latest = evmsData[evmsData.length - 1];
    const cv = latest.BCWP - latest.ACWP;
    const sv = latest.BCWP - latest.BCWS;
    const cpi = latest.ACWP > 0 ? latest.BCWP / latest.ACWP : 1;
    const spi = latest.BCWS > 0 ? latest.BCWP / latest.BCWS : 1;

    return (
      <div className="space-y-6 animate-nexus-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-bold">CPI (Cost Efficiency)</p>
                <p className={`text-2xl font-mono font-bold ${cpi < 1 ? 'text-red-500' : 'text-green-500'}`}>{cpi.toFixed(2)}</p>
                <p className="text-xs text-slate-400">{cpi < 1 ? 'Over Budget' : 'Under Budget'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-bold">SPI (Schedule Efficiency)</p>
                <p className={`text-2xl font-mono font-bold ${spi < 1 ? 'text-yellow-500' : 'text-green-500'}`}>{spi.toFixed(2)}</p>
                <p className="text-xs text-slate-400">{spi < 1 ? 'Behind Schedule' : 'Ahead of Schedule'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-bold">Cost Variance (CV)</p>
                <p className={`text-2xl font-mono font-bold ${cv < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {formatCompactCurrency(cv)}
                </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-bold">Schedule Variance (SV)</p>
                <p className={`text-2xl font-mono font-bold ${sv < 0 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {formatCompactCurrency(sv)}
                </p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart2 size={18}/> ANSI/EIA-748 Performance Trends</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evmsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis tickFormatter={(val) => formatCompactCurrency(val)}/>
                    <Tooltip formatter={(val: number) => formatCompactCurrency(val)} />
                    <Legend />
                    <Line type="monotone" dataKey="BCWS" name="Planned Value (BCWS)" stroke="#94a3b8" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="BCWP" name="Earned Value (BCWP)" stroke="#22c55e" strokeWidth={2} />
                    <Line type="monotone" dataKey="ACWP" name="Actual Cost (ACWP)" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><FileText size={16}/> Variance Analysis Reports (VARs)</h4>
            <table className="min-w-full text-sm">
                <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                    <tr>
                        <th className="px-4 py-2 text-left">Period</th>
                        <th className="px-4 py-2 text-right">CV</th>
                        <th className="px-4 py-2 text-right">SV</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {evmsData.slice(-3).reverse().map((d, i) => (
                        <tr key={i}>
                            <td className="px-4 py-2 font-mono">{d.period}</td>
                            <td className={`px-4 py-2 text-right font-bold ${d.BCWP - d.ACWP < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCompactCurrency(d.BCWP - d.ACWP)}</td>
                            <td className={`px-4 py-2 text-right font-bold ${d.BCWP - d.BCWS < 0 ? 'text-yellow-600' : 'text-green-600'}`}>{formatCompactCurrency(d.BCWP - d.BCWS)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
  };

  return (
    <TabbedLayout
        title="DoD Program Management"
        subtitle="Advanced Defense Acquisition & EVMS Compliance Engine"
        icon={Shield}
        navGroups={navGroups}
        activeGroup="framework"
        activeItem={activeTab}
        onGroupChange={() => {}}
        onItemChange={handleTabChange}
    >
        <div className={`flex-1 overflow-y-auto p-6 transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            {activeTab === 'acquisition' && renderAcquisitionLifecycle()}
            {activeTab === 'evms' && renderEVMS()}
            {activeTab === 'risk' && <div className="h-full flex items-center justify-center"><EmptyGrid title="DoD 5x5 Matrix Offline" description="Defense risk module is not initialized." icon={AlertTriangle}/></div>}
        </div>
    </TabbedLayout>
  );
};

export default DoDSuite;
