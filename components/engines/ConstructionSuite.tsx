
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { HardHat, Clipboard, CloudRain, Truck, Box, FileText, AlertTriangle, Hammer, Ruler, Map } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import StatCard from '../shared/StatCard';
import { Viewer3DRenderer } from './renderers/Viewer3DRenderer';
import { MapRenderer } from './renderers/MapRenderer';

const ConstructionSuite: React.FC = () => {
  const theme = useTheme();
  const { state } = useData();
  const [activeTab, setActiveTab] = useState<'field' | 'submittals' | 'bim' | 'gis'>('field');

  // Derive Safety Stats from real data in Phase 6
  const safetyStats = useMemo(() => {
      const counts: Record<string, number> = {};
      state.safetyIncidents.forEach(inc => {
          counts[inc.type] = (counts[inc.type] || 0) + 1;
      });
      return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [state.safetyIncidents]);

  const { submittals } = state.extensionData.construction;

  // Use real DailyLogs if available, otherwise aggregate for demo
  const dailyLogs = useMemo(() => {
     // Aggregate real logs from state.dailyLogs
     return state.dailyLogs.slice(0, 3).map(log => ({
         id: log.id,
         date: log.date,
         weather: `${log.weather.condition}, ${log.weather.temperature}`,
         workers: log.workLogs.reduce((sum, w) => sum + w.headcount, 0),
         hours: log.workLogs.reduce((sum, w) => sum + w.hours, 0),
         incidents: state.safetyIncidents.filter(i => i.date === log.date).length
     }));
  }, [state.dailyLogs, state.safetyIncidents]);

  const openRFIsCount = state.communicationLogs.filter(c => c.type === 'RFI' && c.status === 'Open').length;

  // --- RENDERERS ---

  const renderFieldManagement = () => (
    <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Manpower on Site" value="142" subtext="Across 12 Subcontractors" icon={HardHat} />
            <StatCard title="Open RFIs" value={openRFIsCount} subtext="Critical Priority" icon={FileText} trend="down" />
            <StatCard title="Safety Incidents" value={state.safetyIncidents.length} subtext="Total Recorded" icon={AlertTriangle} />
            <StatCard title="Equipment Active" value="24" subtext="Heavy Machinery" icon={Truck} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Log Feed */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clipboard size={18} className="text-nexus-600"/> Daily Site Logs</h3>
                <div className="space-y-4">
                    {dailyLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
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
                    {dailyLogs.length === 0 && <p className="text-sm text-slate-400 italic">No logs recorded.</p>}
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
                <button onClick={() => setActiveTab('bim')} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${activeTab === 'bim' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}><Box size={14}/> BIM</button>
                <button onClick={() => setActiveTab('gis')} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${activeTab === 'gis' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}><Map size={14}/> GIS</button>
            </div>
        </div>

        <div className="flex-1 overflow-hidden relative rounded-xl border border-slate-200 shadow-sm bg-white">
            <div className="absolute inset-0 overflow-y-auto">
                {activeTab === 'field' && <div className="p-6">{renderFieldManagement()}</div>}
                
                {activeTab === 'bim' && <Viewer3DRenderer extensionVersion="4.2" />}
                
                {activeTab === 'gis' && <MapRenderer extensionName="Construction Site Map" />}

                {activeTab === 'submittals' && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {submittals.map(d => (
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
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ConstructionSuite;
