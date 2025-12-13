
import React from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { RefreshCw, Users, Database, Layers, BarChart2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface ProgramIntegratedChangeProps {
  programId: string;
}

const ProgramIntegratedChange: React.FC<ProgramIntegratedChangeProps> = ({ programId }) => {
  const { integratedChanges } = useProgramData(programId);
  const theme = useTheme();

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
                            <p className="text-sm text-slate-500">{change.description}</p>
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
                            <button className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium hover:bg-slate-50">View Impact Analysis</button>
                            <button className="px-3 py-1.5 bg-nexus-600 text-white rounded text-xs font-medium hover:bg-nexus-700">Update Readiness</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default ProgramIntegratedChange;
