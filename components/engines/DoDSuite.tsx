
import React, { useState } from 'react';
import { Shield, Target, Activity, AlertTriangle, FileText, BarChart2, Layers } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useData } from '../../context/DataContext';

const DoDSuite: React.FC = () => {
  const theme = useTheme();
  const { state } = useData();
  const [activeTab, setActiveTab] = useState<'acquisition' | 'evms' | 'risk'>('acquisition');

  const { milestones, phases, evmsData } = state.extensionData.dod;

  // --- RENDERERS ---

  const renderAcquisitionLifecycle = () => (
    <div className="space-y-8">
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
                    {idx < 3 && (
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
                  <li className="flex justify-between"><span>Design Review:</span> <span className="text-slate-600">12 Nov 24</span></li>
                  <li className="flex justify-between"><span>Proto Flight:</span> <span className="text-slate-600">15 Mar 25</span></li>
                  <li className="flex justify-between"><span>IOC:</span> <span className="text-slate-600">01 Jan 27</span></li>
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

  const renderEVMS = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-bold">CPI (Cost Efficiency)</p>
                <p className="text-2xl font-mono font-bold text-red-500">0.82</p>
                <p className="text-xs text-red-600">Over Budget</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-bold">SPI (Schedule Efficiency)</p>
                <p className="text-2xl font-mono font-bold text-yellow-500">0.90</p>
                <p className="text-xs text-yellow-600">Behind Schedule</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-bold">TCPI (To Complete)</p>
                <p className="text-2xl font-mono font-bold text-blue-600">1.15</p>
                <p className="text-xs text-slate-500">Required Efficiency</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-bold">VAC (Variance)</p>
                <p className="text-2xl font-mono font-bold text-red-500">($4.2M)</p>
                <p className="text-xs text-red-600">Negative Variance</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart2 size={18}/> ANSI/EIA-748 Performance Trends</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evmsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
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
                        <th className="px-4 py-2 text-left">WBS</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-right">CV</th>
                        <th className="px-4 py-2 text-right">SV</th>
                        <th className="px-4 py-2">Root Cause</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    <tr>
                        <td className="px-4 py-2 font-mono">1.2.4</td>
                        <td className="px-4 py-2">Propulsion Integration</td>
                        <td className="px-4 py-2 text-right text-red-600">($1.2M)</td>
                        <td className="px-4 py-2 text-right text-yellow-600">($0.4M)</td>
                        <td className="px-4 py-2 text-slate-600">Supplier delay on fuel pumps requiring expedite fees.</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 font-mono">1.3.1</td>
                        <td className="px-4 py-2">Software Build 4</td>
                        <td className="px-4 py-2 text-right text-green-600">$0.2M</td>
                        <td className="px-4 py-2 text-right text-red-600">($0.8M)</td>
                        <td className="px-4 py-2 text-slate-600">Staffing shortage; fewer hours burned but scope not completed.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  );

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className={theme.typography.h1}>
                    <Shield className="text-nexus-600" /> DoD Program Management
                </h1>
                <p className={theme.typography.small}>Advanced Defense Acquisition & EVMS Compliance Engine</p>
            </div>
            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                <button onClick={() => setActiveTab('acquisition')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'acquisition' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Acquisition Lifecycle</button>
                <button onClick={() => setActiveTab('evms')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'evms' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>EVMS Compliance</button>
                <button onClick={() => setActiveTab('risk')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'risk' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Defense Risk (5x5)</button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {activeTab === 'acquisition' && renderAcquisitionLifecycle()}
            {activeTab === 'evms' && renderEVMS()}
            {activeTab === 'risk' && <div className="p-10 text-center text-slate-500 italic">DoD 5x5 Matrix Module Loading... (Use Standard Risk Module for now)</div>}
        </div>
    </div>
  );
};

export default DoDSuite;
