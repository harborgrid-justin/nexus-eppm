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
import { EmptyGrid } from '../common/EmptyGrid';

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

  const handleReadinessUpdate = (change: IntegratedChangeRequest) => {
    setSelectedChange(change);
    setReadinessScores(JSON.parse(JSON.stringify(change.readinessImpact))); 
    setPanelMode('readiness');
  };

  const saveReadiness = () => {
    if (selectedChange) {
        const updatedChange = { ...selectedChange, readinessImpact: readinessScores };
        dispatch({ type: 'GOVERNANCE_UPDATE_INTEGRATED_CHANGE', payload: updatedChange });
        setPanelMode(null);
        setSelectedChange(null);
    }
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300 scrollbar-thin`}>
        <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Integrated Change Control (OCM)</h2>
        </div>

        {integratedChanges.length > 0 ? (
            <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
                {integratedChanges.map(change => (
                    <div key={change.id} className={`${theme.colors.surface} rounded-[2.5rem] border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col group hover:border-nexus-300 transition-all`}>
                        <div className={`p-6 border-b ${theme.colors.border} bg-slate-50/50 flex justify-between items-start`}>
                            <div>
                                <h3 className={`font-black text-slate-800 text-lg uppercase tracking-tight`}>{change.title}</h3>
                                <p className={`text-xs text-slate-500 mt-1 font-bold`}>{change.description}</p>
                            </div>
                            <Badge variant={change.severity === 'High' ? 'danger' : 'warning'}>{change.type}</Badge>
                        </div>

                        <div className="p-6 flex-1">
                            <h4 className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2`}>
                                <BarChart2 size={14} className="text-nexus-600"/> Readiness Assessment (ADKAR)
                            </h4>
                            <div className="h-56 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={change.readinessImpact} layout="vertical" margin={{ left: 40 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.charts.grid} />
                                        <XAxis type="number" domain={[0, 100]} hide />
                                        <YAxis type="category" dataKey="stakeholderGroup" width={100} tick={{fontSize: 10, fontWeight: 'bold'}} />
                                        <Tooltip contentStyle={theme.charts.tooltip} />
                                        <Bar dataKey="awareness" fill="#94a3b8" stackId="a" />
                                        <Bar dataKey="desire" fill="#facc15" stackId="a" />
                                        <Bar dataKey="knowledge" fill="#60a5fa" stackId="a" />
                                        <Bar dataKey="ability" fill="#4ade80" stackId="a" />
                                        <Bar dataKey="reinforcement" fill="#818cf8" stackId="a" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className={`p-6 bg-slate-50/30 border-t ${theme.colors.border} flex justify-between items-center`}>
                            <span className={`text-[9px] font-mono font-bold text-slate-400 uppercase`}>Record: {change.id}</span>
                            <button 
                                onClick={() => handleReadinessUpdate(change)} 
                                className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-nexus-600 hover:border-nexus-200 shadow-sm transition-all active:scale-95"
                            >
                                Update Assessment
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex-1 flex flex-col justify-center">
                 <EmptyGrid 
                    title="Change Matrix Neutral"
                    description="No organizational change artifacts have been synchronized for this program period. Establish an integrated change plan to monitor stakeholder readiness."
                    icon={RefreshCw}
                    actionLabel="Submit Impact Analysis"
                    onAdd={() => {}}
                />
            </div>
        )}

        <SidePanel
            isOpen={panelMode === 'readiness' && !!selectedChange}
            onClose={() => setPanelMode(null)}
            width="md:w-[600px]"
            title="Stakeholder Readiness Update"
            footer={<><Button variant="secondary" onClick={() => setPanelMode(null)}>Cancel</Button><Button onClick={saveReadiness}>Save Assessment</Button></>}
        >
             <div className="space-y-6">
                {readinessScores.map((group, idx) => (
                    <div key={group.stakeholderGroup} className={`p-6 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-inner`}>
                        <h4 className={`font-black text-slate-800 text-sm uppercase tracking-wider mb-6 border-b border-slate-200 pb-2`}>{group.stakeholderGroup}</h4>
                        <div className="space-y-6">
                            {(['awareness', 'desire', 'knowledge', 'ability', 'reinforcement'] as const).map((dim) => (
                                <div key={dim}>
                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                        <span>{dim}</span>
                                        <span className="font-mono text-nexus-600">{group[dim]}%</span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="100" value={group[dim]} 
                                        onChange={(e) => {
                                            const newScores = [...readinessScores];
                                            newScores[idx] = { ...newScores[idx], [dim]: parseInt(e.target.value) };
                                            setReadinessScores(newScores);
                                        }}
                                        className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-nexus-600 shadow-inner"
                                    />
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