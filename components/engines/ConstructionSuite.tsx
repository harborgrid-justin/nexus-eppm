
import React, { useState } from 'react';
import { HardHat, Clipboard, CloudRain, Truck, Box, FileText, AlertTriangle, Hammer, Ruler, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import StatCard from '../shared/StatCard';

const ConstructionSuite: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'field' | 'submittals' | 'bim'>('field');

  // --- MOCK DATA ---
  const safetyStats = [
    { type: 'Near Miss', count: 12 },
    { type: 'First Aid', count: 4 },
    { type: 'Medical Only', count: 1 },
    { type: 'Lost Time', count: 0 },
  ];

  const submittalData = [
    { status: 'Open', count: 45 },
    { status: 'In Review', count: 12 },
    { status: 'Approved', count: 88 },
    { status: 'Rejected', count: 5 },
  ];

  const dailyLogs = [
    { date: 'Today', weather: 'Sunny, 72°F', workers: 142, hours: 1136, incidents: 0 },
    { date: 'Yesterday', weather: 'Cloudy, 68°F', workers: 138, hours: 1104, incidents: 0 },
    { date: '2 days ago', weather: 'Rain, 62°F', workers: 95, hours: 760, incidents: 1 },
  ];

  // --- RENDERERS ---

  const renderFieldManagement = () => (
    <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Manpower on Site" value="142" subtext="Across 12 Subcontractors" icon={HardHat} />
            <StatCard title="Open RFIs" value="8" subtext="3 Critical Priority" icon={FileText} trend="down" />
            <StatCard title="Safety Incidents" value="0" subtext="Days since last incident: 145" icon={AlertTriangle} />
            <StatCard title="Equipment Active" value="24" subtext="Heavy Machinery" icon={Truck} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Log Feed */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clipboard size={18} className="text-nexus-600"/> Daily Site Logs</h3>
                <div className="space-y-4">
                    {dailyLogs.map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <p className="font-bold text-sm text-slate-900">{log.date}</p>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                    <span className="flex items-center gap-1"><CloudRain size={12}/> {log.weather}</span>
                                    <span className="flex items-center gap-1"><Hammer size={12}/> {log.workers} Workers</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${log.incidents === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {log.incidents} Incidents
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">View Full Log History</button>
            </div>

            {/* Safety Stats */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-orange-500"/> Safety Observations (YTD)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={safetyStats} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="type" width={100} tick={{fontSize: 12}} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>
  );

  const renderBIM = () => (
      <div className="flex flex-col h-[600px] bg-slate-900 rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 grid grid-cols-12 gap-px opacity-20 pointer-events-none">
              {[...Array(144)].map((_, i) => <div key={i} className="border border-nexus-500/30"></div>)}
          </div>
          <div className="absolute top-4 left-4 z-10 bg-slate-800/80 backdrop-blur p-4 rounded-lg border border-slate-700 text-white">
              <h3 className="font-bold flex items-center gap-2"><Box size={18} className="text-nexus-400"/> 3D Model Viewer</h3>
              <p className="text-xs text-slate-400 mt-1">Federated Model v4.2 (Arch + Struct + MEP)</p>
              <div className="mt-4 space-y-2">
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input type="checkbox" checked readOnly className="rounded border-slate-600 bg-slate-700 text-nexus-500" /> Architectural
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input type="checkbox" checked readOnly className="rounded border-slate-600 bg-slate-700 text-nexus-500" /> Structural
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-nexus-500" /> MEP
                  </label>
              </div>
          </div>
          <div className="flex-1 flex items-center justify-center text-slate-500">
              <div className="text-center">
                  <Box size={64} className="mx-auto mb-4 opacity-50 animate-pulse"/>
                  <p>WebGL BIM Engine Initialized</p>
                  <p className="text-xs mt-2">Loading model geometry...</p>
              </div>
          </div>
      </div>
  );

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className={theme.typography.h1}>
                    <HardHat className="text-orange-500" /> Construction Platform
                </h1>
                <p className={theme.typography.small}>Field Management, Safety & BIM Coordination</p>
            </div>
            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                <button onClick={() => setActiveTab('field')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'field' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Field Mgmt</button>
                <button onClick={() => setActiveTab('submittals')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'submittals' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Submittals & RFIs</button>
                <button onClick={() => setActiveTab('bim')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'bim' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>BIM Viewer</button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {activeTab === 'field' && renderFieldManagement()}
            {activeTab === 'bim' && renderBIM()}
            {activeTab === 'submittals' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {submittalData.map(d => (
                        <Card key={d.status} className="p-4 text-center">
                            <h4 className="text-slate-500 text-xs font-bold uppercase">{d.status}</h4>
                            <p className="text-3xl font-bold text-slate-800 mt-2">{d.count}</p>
                        </Card>
                    ))}
                    <div className="col-span-full mt-4 p-8 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400">
                        <Ruler size={32} className="mb-2"/>
                        <p>Detailed Submittal Log & Spec Section View</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default ConstructionSuite;
