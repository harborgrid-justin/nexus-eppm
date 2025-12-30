
import React, { useState } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useData } from '../../context/DataContext';
import { RefreshCw, Users, Database, Layers, BarChart2, Activity, Settings, Network } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { IntegratedChangeRequest } from '../../types';

interface ProgramIntegratedChangeProps {
  programId: string;
}

const ProgramIntegratedChange: React.FC<ProgramIntegratedChangeProps> = ({ programId }) => {
  const { integratedChanges } = useProgramData(programId);
  const { dispatch } = useData();
  const theme = useTheme();

  const [selectedChange, setSelectedChange] = useState<IntegratedChangeRequest | null>(null);
  const [panelMode, setPanelMode] = useState<'impact' | 'readiness' | null>(null);
  
  const [readinessScores, setReadinessScores] = useState<IntegratedChangeRequest['readinessImpact']>([]);

  const openImpactPanel = (change: IntegratedChangeRequest) => {
    setSelectedChange(change);
    setPanelMode('impact');
  };

  const openReadinessPanel = (change: IntegratedChangeRequest) => {
    setSelectedChange(change);
    setReadinessScores(JSON.parse(JSON.stringify(change.readinessImpact))); // Deep copy
    setPanelMode('readiness');
  };

  const closePanel = () => {
    setSelectedChange(null);
    setPanelMode(null);
    setReadinessScores([]);
  };

  const saveReadiness = () => {
    if (selectedChange) {
        const updatedChange = { ...selectedChange, readinessImpact: readinessScores };
        dispatch({ type: 'UPDATE_INTEGRATED_CHANGE', payload: updatedChange });
        closePanel();
    }
  };

  const updateScore = (groupIndex: number, field: 'awareness' | 'desire' | 'knowledge' | 'ability' | 'reinforcement', value: number) => {
      const newScores = [...readinessScores];
      if (newScores[groupIndex]) {
          newScores[groupIndex] = { ...newScores[groupIndex], [field]: value };
          setReadinessScores(newScores);
      }
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Integrated Change Management (OCM + Technical)</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integratedChanges.map(change => (
                <div key={change.id} className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">{change.title}</h3>
                            <p className="text-sm text-slate-500 mt-1">{change.description}</p>
                        </div>
                        <Badge variant={change.severity === 'High' ? 'danger' : 'warning'}>{change.type}</Badge>
                    </div>

                    <div className="p-4 border-b border-slate-100 flex gap-2 overflow-x-auto">
                        {change.impactAreas.map(area => (
                            <span key={area} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 whitespace-nowrap">
                                {area === 'Roles' ? <Users size={12}/> : 
                                 area === 'Data' ? <Database size={12}/> :
                                 <Layers size={12}/>
                                }
                                {area}
                            </span>
                        ))}
                    </div>

                    <div className="p-4 flex-1">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <BarChart2 size={14}/> ADKAR Readiness Assessment
                        </h4>
                        
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={change.readinessImpact} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" domain={[0, 100]} hide />
                                    <YAxis type="category" dataKey="stakeholderGroup" width={100} tick={{fontSize: 10}} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="awareness" fill="#94a3b8" stackId="a" name="Awareness" />
                                    <Bar dataKey="desire" fill="#facc15" stackId="a" name="Desire" />
                                    <Bar dataKey="knowledge" fill="#60a5fa" stackId="a" name="Knowledge" />
                                    <Bar dataKey="ability" fill="#4ade80" stackId="a" name="Ability" />
                                    <Bar dataKey="reinforcement" fill="#818cf8" stackId="a" name="Reinforcement" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-mono">ID: {change.id}</span>
                        <div className="flex gap-2">
                            <button onClick={() => openImpactPanel(change)} className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium hover:bg-slate-50">View Impact Analysis</button>
                            <button onClick={() => openReadinessPanel(change)} className="px-3 py-1.5 bg-nexus-600 text-white rounded text-xs font-medium hover:bg-nexus-700">Update Readiness</button>
                        </div>
                    </div>
                </div>
            ))}
            
            {integratedChanges.length === 0 && (
                 <div className="col-span-2 text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                     <RefreshCw size={48} className="mx-auto text-slate-300 mb-4" />
                     <p className="text-slate-500">No integrated change requests found for this program.</p>
                 </div>
            )}
        </div>

        {/* Impact Analysis Panel */}
        <SidePanel
            isOpen={panelMode === 'impact' && !!selectedChange}
            onClose={closePanel}
            width="md:w-[700px]"
            title={`Impact Analysis: ${selectedChange?.title}`}
            footer={<Button onClick={closePanel}>Close</Button>}
        >
            {selectedChange && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                             <h4 className="text-blue-900 font-bold mb-2 flex items-center gap-2"><Settings size={16}/> Systems</h4>
                             <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
                                 <li>Legacy ERP (Decommission)</li>
                                 <li>SAP S/4HANA (New Implementation)</li>
                                 <li>Data Warehouse (Interface Update)</li>
                             </ul>
                        </div>
                        <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                             <h4 className="text-purple-900 font-bold mb-2 flex items-center gap-2"><Activity size={16}/> Processes</h4>
                             <ul className="text-sm text-purple-800 list-disc list-inside space-y-1">
                                 <li>Month-End Close (Modified)</li>
                                 <li>Procure-to-Pay (Re-engineered)</li>
                                 <li>Inventory Valuation (Automated)</li>
                             </ul>
                        </div>
                         <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                             <h4 className="text-orange-900 font-bold mb-2 flex items-center gap-2"><Network size={16}/> Data & Roles</h4>
                             <ul className="text-sm text-orange-800 list-disc list-inside space-y-1">
                                 <li>Customer Master Data (Migration)</li>
                                 <li>Finance Controller (Role Change)</li>
                                 <li>AP Clerk (New Responsibilities)</li>
                             </ul>
                        </div>
                    </div>
                    
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-4">Risk Severity Matrix</h4>
                        <div className="w-full h-8 bg-gradient-to-r from-green-300 via-yellow-300 to-red-400 rounded-full relative">
                            <div 
                                className="absolute top-0 bottom-0 w-1 bg-black border-2 border-white shadow-lg transform -translate-x-1/2" 
                                style={{left: selectedChange.severity === 'High' ? '85%' : selectedChange.severity === 'Medium' ? '50%' : '15%'}}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                    Current: {selectedChange.severity}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                            <span>Low Impact</span>
                            <span>Medium Impact</span>
                            <span>Critical Impact</span>
                        </div>
                    </div>
                </div>
            )}
        </SidePanel>

        {/* Readiness Assessment Panel */}
        <SidePanel
            isOpen={panelMode === 'readiness' && !!selectedChange}
            onClose={closePanel}
            width="md:w-[700px]"
            title={`Update Readiness: ${selectedChange?.title}`}
            footer={
                <>
                    <Button variant="secondary" onClick={closePanel}>Cancel</Button>
                    <Button onClick={saveReadiness}>Save Assessment</Button>
                </>
            }
        >
            <div className="space-y-6">
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
                    Adjust the <strong>ADKAR</strong> scores (0-100) for each stakeholder group based on recent surveys, focus groups, and interviews.
                </p>
                
                {readinessScores.map((group, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">{group.stakeholderGroup}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {(['awareness', 'desire', 'knowledge', 'ability', 'reinforcement'] as const).map((dim) => (
                                <div key={dim} className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase block">{dim}</label>
                                    <input 
                                        type="range" 
                                        min="0" max="100" 
                                        value={group[dim]} 
                                        onChange={(e) => updateScore(idx, dim, parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-nexus-600"
                                    />
                                    <div className={`text-center font-mono font-bold ${group[dim] < 50 ? 'text-red-500' : 'text-slate-700'}`}>
                                        {group[dim]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </SidePanel>
    </div>
  );
};

export default ProgramIntegratedChange;
