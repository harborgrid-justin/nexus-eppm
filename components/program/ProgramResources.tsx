
import React from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Users, AlertTriangle, Briefcase } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

interface ProgramResourcesProps {
  programId: string;
}

const ProgramResources: React.FC<ProgramResourcesProps> = ({ programId }) => {
  const { projects } = useProgramData(programId);
  const { state } = useData();
  const theme = useTheme();

  const programProjectIds = projects.map(p => p.id);
  const programResources = state.resources.filter(r =>
    state.resourceAssignments.some(a => programProjectIds.includes(a.projectId) && a.resourceId === r.id)
  );

  const roleDistribution = programResources.reduce((acc, resource) => {
    const assignments = state.resourceAssignments.filter(a =>
      programProjectIds.includes(a.projectId) && a.resourceId === resource.id
    );
    const totalDemand = assignments.reduce((sum, a) => sum + (a.allocation || 0), 0);

    const existing = acc.find(r => r.role === resource.role);
    if (existing) {
      existing.demand += totalDemand;
    } else {
      const demand = totalDemand;
      const capacity = resource.capacity;
      const utilizationRate = capacity > 0 ? demand / capacity : 0;
      const status = utilizationRate > 1.1 ? 'Critical' :
                    utilizationRate > 0.9 ? 'Overloaded' : 'Healthy';
      acc.push({ role: resource.role, demand, capacity, status });
    }
    return acc;
  }, [] as Array<{ role: string; demand: number; capacity: number; status: string }>);

  const criticalResources = programResources.filter(r => r.allocated > r.capacity * 1.1).slice(0, 5);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <Users className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Program Resource Management</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shared Capabilities Heatmap */}
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Briefcase size={18}/> Shared Capabilities</h3>
                <div className="space-y-4">
                    {roleDistribution.map(role => (
                        <div key={role.role} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-slate-700">{role.role}</span>
                                <span className={`font-bold ${
                                    role.status === 'Critical' ? 'text-red-600' : 
                                    role.status === 'Overloaded' ? 'text-orange-500' : 'text-green-600'
                                }`}>
                                    {Math.round((role.demand / role.capacity) * 100)}%
                                </span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${
                                        role.status === 'Critical' ? 'bg-red-500' : 
                                        role.status === 'Overloaded' ? 'bg-orange-400' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.min((role.demand / role.capacity) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Demand: {role.demand}h</span>
                                <span>Cap: {role.capacity}h</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Inter-Project Conflicts */}
            <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
                <div className="p-4 border-b border-slate-200 bg-red-50">
                    <h3 className="font-bold text-red-900 flex items-center gap-2"><AlertTriangle size={18}/> Resource Conflicts</h3>
                </div>
                <div className="flex-1 overflow-auto p-4">
                    {criticalResources.length > 0 ? (
                        <ul className="space-y-3">
                            {criticalResources.map(res => (
                                <li key={res.id} className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                                        {res.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{res.name}</p>
                                        <p className="text-xs text-slate-500">{res.role}</p>
                                        <div className="mt-1 text-xs text-red-600 font-semibold">
                                            Over-allocated across P1001 & P1002
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-slate-500 text-sm italic py-8">No critical resource conflicts detected.</p>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProgramResources;
