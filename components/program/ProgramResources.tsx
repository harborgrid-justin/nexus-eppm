import React, { useMemo } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Users, AlertTriangle, Briefcase, TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { EmptyGrid } from '../common/EmptyGrid';
import { FieldPlaceholder } from '../common/FieldPlaceholder';

interface ProgramResourcesProps {
  programId: string;
}

const ProgramResources: React.FC<ProgramResourcesProps> = ({ programId }) => {
  const { projects } = useProgramData(programId);
  const { state } = useData();
  const theme = useTheme();

  // Dynamic calculation of resource load aggregation from the live ledger
  const roleDistribution = useMemo(() => {
    const roleStats: Record<string, { demand: number; capacity: number }> = {};
    
    // 1. Calculate Capacity by Role
    state.resources.forEach(r => {
        if (r.status !== 'Active') return;
        if (!roleStats[r.role]) roleStats[r.role] = { demand: 0, capacity: 0 };
        roleStats[r.role].capacity += (r.capacity || 160);
    });

    // 2. Calculate Demand from Program Projects
    projects.forEach(p => {
        p.tasks.forEach(t => {
            // Only count active/future demand to prevent historical noise
            if (t.status !== 'Completed') {
                t.assignments.forEach(a => {
                    const res = state.resources.find(r => r.id === a.resourceId);
                    if (res && res.status === 'Active') {
                        // Effort = (Units/100) * duration (approx monthly slice)
                        // This logic is optimized for the program view granularity
                        const demandHours = (a.units / 100) * 160; 
                        if (roleStats[res.role]) {
                            roleStats[res.role].demand += demandHours;
                        }
                    }
                });
            }
        });
    });

    return Object.entries(roleStats).map(([role, stats]) => {
        const util = stats.capacity > 0 ? stats.demand / stats.capacity : 0;
        let status = 'Healthy';
        if (util > 1.1) status = 'Critical';
        else if (util > 0.9) status = 'Overloaded';
        
        return { role, demand: Math.round(stats.demand), capacity: stats.capacity, status };
    }).sort((a,b) => b.demand - a.demand).slice(0, 8); 
  }, [state.resources, projects]);

  const criticalResources = useMemo(() => {
    const programResourceIds = new Set<string>();
    projects.forEach(p => p.tasks.forEach(t => t.assignments.forEach(a => programResourceIds.add(a.resourceId))));

    // Threshold: >110% allocation defines a critical conflict
    return state.resources
        .filter(r => programResourceIds.has(r.id) && r.status === 'Active' && r.allocated > r.capacity * 1.1)
        .slice(0, 10);
  }, [state.resources, projects]);

  if (projects.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-8">
              <EmptyGrid 
                title="Resource Demand Pool Empty"
                description="Link projects to this program to aggregate resource requirements and analyze shared capability utilization."
                icon={Users}
              />
          </div>
      );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300 scrollbar-thin`}>
        <div className="flex items-center gap-2 mb-2">
            <Users className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Program Resource Management</h2>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            {/* Shared Capabilities Heatmap */}
            <div className={`${theme.colors.surface} rounded-[2rem] border ${theme.colors.border} shadow-sm p-8 flex flex-col`}>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                             <TrendingUp size={16} className="text-nexus-600"/> Shared Capabilities
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Aggregated demand heatmap by role</p>
                    </div>
                </div>
                <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-thin">
                    {roleDistribution.length > 0 ? roleDistribution.map(role => (
                        <div key={role.role} className="space-y-2 group">
                            <div className="flex justify-between text-xs items-end">
                                <span className="font-black text-slate-700 uppercase tracking-tight group-hover:text-nexus-700 transition-colors">{role.role}</span>
                                <span className={`font-black font-mono ${
                                    role.status === 'Critical' ? 'text-red-600' : 
                                    role.status === 'Overloaded' ? 'text-orange-500' : 'text-green-600'
                                }`}>
                                    {Math.round((role.demand / role.capacity) * 100)}%
                                </span>
                            </div>
                            <div className={`w-full h-3 ${theme.colors.background} rounded-full overflow-hidden border ${theme.colors.border} shadow-inner`}>
                                <div 
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                                        role.status === 'Critical' ? 'bg-red-500' : 
                                        role.status === 'Overloaded' ? 'bg-orange-400' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.min((role.demand / role.capacity) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                <span>Projected Demand: {role.demand}h</span>
                                <span>Regional Cap: {role.capacity}h</span>
                            </div>
                        </div>
                    )) : (
                        <FieldPlaceholder 
                            label="No active resource assignments found in program." 
                            onAdd={() => {}} 
                            icon={Briefcase}
                        />
                    )}
                </div>
            </div>

            {/* Inter-Project Conflicts */}
            <div className={`${theme.colors.surface} rounded-[2rem] border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
                <div className="p-6 border-b border-slate-200 bg-red-50/30 flex justify-between items-center">
                    <div>
                        <h3 className="font-black text-red-900 text-sm uppercase tracking-widest flex items-center gap-2">
                             <AlertTriangle size={16} className="text-red-500"/> Allocation Conflicts
                        </h3>
                        <p className="text-[10px] text-red-700 font-bold uppercase mt-1">Resources exceeded threshold (&gt;110%)</p>
                    </div>
                    <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{criticalResources.length} ALERTS</span>
                </div>
                <div className="flex-1 overflow-auto p-6 scrollbar-thin">
                    {criticalResources.length > 0 ? (
                        <div className="space-y-4">
                            {criticalResources.map(res => (
                                <div key={res.id} className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-red-300 transition-all cursor-default group">
                                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white shadow-lg group-hover:scale-105 transition-transform">
                                        {res.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-slate-800 text-sm uppercase tracking-tight truncate">{res.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{res.role}</p>
                                        <div className="mt-3 flex items-center gap-3">
                                             <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                 <div className="bg-red-500 h-full" style={{ width: `${Math.min(100, (res.allocated/res.capacity)*100)}%` }}></div>
                                             </div>
                                             <span className="text-[10px] font-mono font-black text-red-600 whitespace-nowrap">{Math.round((res.allocated/res.capacity)*100)}% LOAD</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center nexus-empty-pattern border-2 border-dashed border-slate-100 rounded-2xl">
                            <ShieldCheck size={48} className="text-green-500 mb-4 opacity-40"/>
                            <p className="text-xs font-black uppercase text-slate-400 tracking-widest text-center">No critical resource conflicts detected.<br/>Workforce is balanced.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
import { ShieldCheck } from 'lucide-react';
export default ProgramResources;