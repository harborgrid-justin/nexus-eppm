
import React, { useState, useMemo, useTransition } from 'react';
import { useData } from '../../context/DataContext';
import { HardHat, Clipboard, CloudRain, Truck, Box, FileText, AlertTriangle, Hammer, Ruler, Map, Plus } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import StatCard from '../shared/StatCard';
import { Viewer3DRenderer } from './renderers/Viewer3DRenderer';
import { MapRenderer } from './renderers/MapRenderer';
import { EmptyGrid } from '../common/EmptyGrid';
import { Button } from '../ui/Button';
import { TabbedLayout } from '../layout/standard/TabbedLayout';
import { NavGroup } from '../common/ModuleNavigation';

const ConstructionSuite: React.FC = () => {
  const theme = useTheme();
  const { state } = useData();
  const [activeTab, setActiveTab] = useState('field');
  const [isPending, startTransition] = useTransition();

  // Navigation Structure
  const navGroups: NavGroup[] = useMemo(() => [
      { id: 'management', label: 'Management', items: [
          { id: 'field', label: 'Field Mgmt', icon: HardHat },
          { id: 'submittals', label: 'Submittals & RFIs', icon: FileText }
      ]},
      { id: 'technical', label: 'Technical', items: [
          { id: 'bim', label: 'BIM Model', icon: Box },
          { id: 'gis', label: 'GIS Map', icon: Map }
      ]}
  ], []);

  const handleTabChange = (id: string) => {
      startTransition(() => setActiveTab(id));
  };

  // Derive Safety Stats from real data
  const safetyStats = useMemo(() => {
      const counts: Record<string, number> = {};
      state.safetyIncidents.forEach(inc => {
          counts[inc.type] = (counts[inc.type] || 0) + 1;
      });
      return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [state.safetyIncidents]);

  const { submittals } = state.extensionData.construction || { submittals: [] };

  // Dynamic Aggregations
  const dailyLogs = useMemo(() => {
     return state.dailyLogs.slice(0, 5).map(log => ({
         id: log.id,
         date: log.date,
         weather: `${log.weather.condition}, ${log.weather.temperature}`,
         workers: log.workLogs.reduce((sum, w) => sum + w.headcount, 0),
         hours: log.workLogs.reduce((sum, w) => sum + w.hours, 0),
         incidents: state.safetyIncidents.filter(i => i.date === log.date).length
     }));
  }, [state.dailyLogs, state.safetyIncidents]);

  const manpowerTotal = useMemo(() => state.dailyLogs.reduce((acc, log) => acc + log.workLogs.reduce((wAcc, w) => wAcc + w.headcount, 0), 0), [state.dailyLogs]);
  const activeEquipmentCount = useMemo(() => state.resources.filter(r => r.type === 'Equipment' && r.status === 'Active').length, [state.resources]);
  const openRFIsCount = useMemo(() => state.communicationLogs.filter(c => c.type === 'RFI' && c.status === 'Open').length, [state.communicationLogs]);
  const totalIncidents = state.safetyIncidents.length;

  const handleCreateLog = () => {
      alert("Redirecting to Field Management to create new Daily Log...");
  };

  // --- RENDERERS ---

  const renderFieldManagement = () => (
    <div className={`space-y-6 p-6 h-full overflow-y-auto ${theme.colors.background}/20`}>
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Manpower on Site" value={manpowerTotal} subtext="Aggregated Headcount" icon={HardHat} />
            <StatCard title="Open RFIs" value={openRFIsCount} subtext="Critical Priority" icon={FileText} trend={openRFIsCount > 5 ? "down" : undefined} />
            <StatCard title="Safety Incidents" value={totalIncidents} subtext="Total Recorded" icon={AlertTriangle} trend={totalIncidents === 0 ? "up" : "down"} />
            <StatCard title="Equipment Active" value={activeEquipmentCount} subtext="Heavy Machinery" icon={Truck} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Log Feed */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clipboard size={18} className="text-nexus-600"/> Daily Site Logs</h3>
                {dailyLogs.length > 0 ? (
                    <div className="space-y-4 flex-1 overflow-y-auto scrollbar-thin">
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
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
                        <p className="text-sm text-slate-400 italic mb-4">No daily logs recorded.</p>
                        <Button size="sm" icon={Plus} onClick={handleCreateLog}>Create Log</Button>
                    </div>
                )}
            </div>

            {/* Safety Stats */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px] flex flex-col">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-orange-500"/> Safety Observations (YTD)</h3>
                <div className="flex-1 min-h-0">
                    {safetyStats.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={safetyStats} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="type" width={100} tick={{fontSize: 12}} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 italic">
                            No safety incidents recorded.
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <TabbedLayout
        title="Construction Platform"
        subtitle="Field Management, Safety & BIM Coordination"
        icon={HardHat}
        navGroups={navGroups}
        activeGroup="management" // Simplified group logic for this flat list
        activeItem={activeTab}
        onGroupChange={() => {}}
        onItemChange={handleTabChange}
    >
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            {activeTab === 'field' && renderFieldManagement()}
            {activeTab === 'bim' && <div className="h-full bg-slate-900"><Viewer3DRenderer extensionVersion="4.2" /></div>}
            {activeTab === 'gis' && <MapRenderer extensionName="Construction Site Map" />}
            {activeTab === 'submittals' && (
                <div className="p-6 h-full overflow-y-auto">
                    {submittals.length > 0 ? (
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
                    ) : (
                        <EmptyGrid 
                            title="Submittal Log Empty"
                            description="No specification submittals or transmittals have been registered for this project."
                            icon={FileText}
                            onAdd={() => {}}
                            actionLabel="Create Submittal Package"
                        />
                    )}
                </div>
            )}
        </div>
    </TabbedLayout>
  );
};

export default ConstructionSuite;
