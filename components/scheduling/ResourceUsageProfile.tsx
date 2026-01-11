import React, { useMemo, useState } from 'react';
import { Project } from '../../types';
import { useData } from '../../context/DataContext';
import { getDaysDiff } from '../../utils/dateUtils';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Users, Filter } from 'lucide-react';

interface ResourceUsageProfileProps {
  project: Project;
  startDate: Date;
  endDate: Date;
}

const ResourceUsageProfile: React.FC<ResourceUsageProfileProps> = ({ project, startDate, endDate }) => {
  const { state } = useData();
  const [filterRole, setFilterRole] = useState('All');

  // Generate timeline data
  const data = useMemo(() => {
    const timePoints = [];
    const totalDays = getDaysDiff(startDate, endDate);
    
    // Group by Week
    const weeks = Math.ceil(totalDays / 7);
    
    // 1. Filter Resources
    const relevantResources = state.resources.filter(r => 
        (filterRole === 'All' || r.role === filterRole) &&
        (project.tasks.some(t => t.assignments.some(a => a.resourceId === r.id)))
    );

    // 2. Aggregate Capacity & Demand
    for (let w = 0; w <= weeks; w++) {
        const weekStart = new Date(startDate);
        weekStart.setDate(weekStart.getDate() + (w * 7));
        const weekLabel = `W${w+1}`;
        
        // FIX: Derive capacity from actual resource definitions instead of hardcoded 40h/week.
        const totalCapacity = relevantResources.reduce((sum, r) => sum + ((r.capacity || 160) / 4), 0);

        // Demand: Sum of task assignments active in this week
        let totalDemand = 0;
        
        project.tasks.forEach(task => {
            const taskStart = new Date(task.startDate);
            const taskEnd = new Date(task.endDate);
            
            // Check intersection with week
            if (taskStart <= new Date(weekStart.getTime() + 6 * 86400000) && taskEnd >= weekStart) {
                // Task is active this week
                task.assignments.forEach(assign => {
                    const res = relevantResources.find(r => r.id === assign.resourceId);
                    if (res) {
                        // FIX: Calculate effort based on assignment units relative to resource standard work week.
                        const effortHours = (assign.units / 100) * (state.governance.resourceDefaults.defaultWorkHoursPerDay || 8) * 5;
                        totalDemand += (effortHours / 5); // Distributed daily avg for the week
                    }
                });
            }
        });

        timePoints.push({
            name: weekLabel,
            Capacity: Math.round(totalCapacity),
            Demand: Math.round(totalDemand * 5), // Scale back up to weekly for chart representation
            OverAllocation: Math.max(0, Math.round((totalDemand * 5) - totalCapacity))
        });
    }

    return timePoints;
  }, [project, startDate, endDate, state.resources, filterRole, state.governance.resourceDefaults]);

  const roles = Array.from(new Set(state.resources.map(r => r.role)));

  return (
    <div className="h-64 bg-white border-t border-slate-200 flex flex-col">
        <div className="flex justify-between items-center px-4 py-2 border-b border-slate-100 bg-slate-50">
            <h3 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2">
                <Users size={14}/> Resource Usage Profile
            </h3>
            <div className="flex items-center gap-2">
                <Filter size={12} className="text-slate-400"/>
                <select 
                    value={filterRole} 
                    onChange={e => setFilterRole(e.target.value)}
                    className="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:border-nexus-500"
                >
                    <option value="All">All Roles</option>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>
        </div>
        <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 10}} />
                    <YAxis tick={{fontSize: 10}} label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: {fontSize: 10} }}/>
                    <Tooltip 
                        contentStyle={{fontSize: '12px'}}
                        formatter={(val: number) => `${val}h`}
                    />
                    <Legend iconSize={10} wrapperStyle={{fontSize: '10px'}} />
                    <Bar dataKey="Demand" stackId="a" fill="#3b82f6" barSize={20} name="Demand" />
                    <Bar dataKey="OverAllocation" stackId="a" fill="#ef4444" barSize={20} name="Overload" />
                    <Line type="step" dataKey="Capacity" stroke="#10b981" strokeWidth={2} dot={false} name="Limit" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default ResourceUsageProfile;
