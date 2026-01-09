
import React, { useMemo } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Users, AlertTriangle, Briefcase } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { EmptyGrid } from '../common/EmptyGrid';

interface ProgramResourcesProps {
  programId: string;
}

const ProgramResources: React.FC<ProgramResourcesProps> = ({ programId }) => {
  const { projects } = useProgramData(programId);
  const { state } = useData();
  const theme = useTheme();

  // Dynamic calculation of resource load aggregation
  const roleDistribution = useMemo(() => {
    const roleStats: Record<string, { demand: number; capacity: number }> = {};
    
    // 1. Calculate Capacity by Role
    state.resources.forEach(r => {
        if (!roleStats[r.role]) roleStats[r.role] = { demand: 0, capacity: 0 };
        roleStats[r.role].capacity += (r.capacity || 160);
    });

    // 2. Calculate Demand from Program Projects
    projects.forEach(p => {
        p.tasks.forEach(t => {
            // Only count active/future demand
            if (t.status !== 'Completed') {
                t.assignments.forEach(a => {
                    const res = state.resources.find(r => r.id === a.resourceId);
                    if (res) {
                        // Assignment units (percentage) * 160h (monthly base)
                        const demandHours = (a.units / 100) * 160; 
                        if (roleStats[res.role]) {
                            roleStats[res.role].demand += demandHours;
                        }
                    }
                });
            }
        });
    });

    // 3. Transform to array and determine status
    const results = Object.entries(roleStats).map(([role, stats]) => {
        const util = stats.capacity > 0 ? stats.demand / stats.capacity : 0;
        let status = 'Healthy';
        if (util > 1.1) status = 'Critical';
        else if (util > 0.9) status = 'Overloaded';
        
        return { role, demand: Math.round(stats.demand), capacity: stats.capacity, status };
    });

    // Return top 5 roles by demand
    return results.sort((a,b) => b.demand - a.demand).slice(0, 5); 
  }, [state.resources, projects]);

  const criticalResources = useMemo(() => {
    // Filter resources allocated to this program that are over-allocated
    const programResourceIds = new Set<string>();
    projects.forEach(p => p.tasks.forEach(t => t.assignments.forEach(a => programResourceIds.add(a.resourceId))));

    return state.resources
        .filter(r => programResourceIds.has(r.id) && r.allocated > r.capacity * 1.1)
        .slice(0, 5);
  }, [state.resources, projects]);

  if (projects.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-8">
              <EmptyGrid 
                title="Resource Demand Pool Empty"
                description="Link projects to this program to aggregate resource requirements."
                icon={Users}
              />
          </div>
      );
  }

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
                    {roleDistribution.length === 0 && (
                        <div className="p-8 text-center text-slate-400 italic text-sm">No active resource assignments found in program.</div>
                    )}
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
                                            Over-allocated ({Math.round(res.allocated/res.capacity*100)}%)
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
                            <AlertTriangle size={32} className="opacity-20 mb-2"/>
                            <p className="text-sm italic">No critical resource conflicts detected.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProgramResources;
