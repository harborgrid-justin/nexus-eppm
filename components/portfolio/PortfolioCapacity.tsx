import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, Area 
} from 'recharts';
import { Users, AlertTriangle, ArrowRight, LayoutGrid, BarChart2, Filter } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';
import { formatCompactCurrency } from '../../utils/formatters';

const PortfolioCapacity: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const [viewHorizon, setViewHorizon] = useState(6); // Months
    const [viewMode, setViewMode] = useState<'chart' | 'heatmap'>('chart');
    const [roleFilter, setRoleFilter] = useState('All');

    // --- 1. Date & Bucket Generation ---
    const monthBuckets = useMemo(() => {
        const buckets = [];
        const start = new Date();
        start.setDate(1); // Start of current month

        for (let i = 0; i < viewHorizon; i++) {
            const d = new Date(start);
            d.setMonth(d.getMonth() + i);
            buckets.push({
                date: d,
                label: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
                key: d.toISOString().slice(0, 7) // YYYY-MM
            });
        }
        return buckets;
    }, [viewHorizon]);

    // --- 2. Core Calculation Engine ---
    const { chartData, resourceMatrix, roleAggregates, conflicts } = useMemo(() => {
        // Data Structures
        const resData: Record<string, Record<string, number>> = {}; // resId -> monthKey -> hours
        const roleData: Record<string, { capacity: number; demand: number }> = {};
        const chartAgg: Record<string, { capacity: number; demand: number }> = {};
        
        // Initialize aggregation structures
        monthBuckets.forEach(m => {
            chartAgg[m.key] = { capacity: 0, demand: 0 };
        });

        // Initialize Resource Capacities
        state.resources.forEach(r => {
            if (r.status !== 'Active') return;
            
            resData[r.id] = {};
            // Initialize Role Data if new
            if (!roleData[r.role]) roleData[r.role] = { capacity: 0, demand: 0 };

            monthBuckets.forEach(m => {
                // Monthly Capacity = Resource Capacity (e.g. 160h)
                const monthlyCap = r.capacity || 160; 
                
                // Add to aggregates
                chartAgg[m.key].capacity += monthlyCap;
                roleData[r.role].capacity += monthlyCap;
                
                // Init individual demand to 0
                resData[r.id][m.key] = 0;
            });
        });

        // Process Task Demand
        state.projects.forEach(p => {
            // Skip projects that are closed/archived if necessary
            // if (p.status === 'Closed') return;

            p.tasks.forEach(t => {
                if (!t.startDate || !t.endDate || !t.assignments) return;

                const start = new Date(t.startDate);
                const end = new Date(t.endDate);
                
                // Optimization: Skip tasks outside horizon
                const horizonEnd = new Date(monthBuckets[viewHorizon - 1].date);
                horizonEnd.setMonth(horizonEnd.getMonth() + 1);
                if (end < monthBuckets[0].date || start >= horizonEnd) return;

                t.assignments.forEach(assign => {
                    if (!resData[assign.resourceId]) return; // Resource not active or filtered out
                    
                    const dailyLoad = 8 * (assign.units / 100);
                    
                    // Iterate task duration day-by-day
                    let curr = new Date(start);
                    while (curr <= end) {
                        // Check if curr is within horizon
                        if (curr >= monthBuckets[0].date && curr < horizonEnd) {
                            const mKey = curr.toISOString().slice(0, 7);
                            
                            if (resData[assign.resourceId][mKey] !== undefined) {
                                resData[assign.resourceId][mKey] += dailyLoad;
                                
                                // Update Aggregates
                                chartAgg[mKey].demand += dailyLoad;
                                
                                const res = state.resources.find(r => r.id === assign.resourceId);
                                if (res) {
                                    roleData[res.role].demand += dailyLoad;
                                }
                            }
                        }
                        curr.setDate(curr.getDate() + 1);
                    }
                });
            });
        });

        // Format Chart Data
        const finalChartData = monthBuckets.map(m => ({
            name: m.label,
            Capacity: Math.round(chartAgg[m.key].capacity),
            Demand: Math.round(chartAgg[m.key].demand),
            Utilization: chartAgg[m.key].capacity > 0 
                ? Math.round((chartAgg[m.key].demand / chartAgg[m.key].capacity) * 100) 
                : 0
        }));

        // Format Role Data
        const finalRoleData = Object.entries(roleData).map(([role, data]) => ({
            role,
            capacity: data.capacity,
            demand: Math.round(data.demand),
            utilization: data.capacity > 0 ? (data.demand / data.capacity) * 100 : 0
        })).sort((a,b) => b.utilization - a.utilization);

        // Detect Conflicts (Individual Resources > 100% in a month)
        const finalConflicts: any[] = [];
        state.resources.forEach(r => {
            if (r.status !== 'Active') return;
            const mKey = monthBuckets.find(m => {
                const demand = resData[r.id][m.key];
                const capacity = r.capacity || 160;
                return demand > capacity;
            });
            
            if (mKey) {
                const demand = resData[r.id][mKey.key];
                const capacity = r.capacity || 160;
                finalConflicts.push({
                    resource: r.name,
                    role: r.role,
                    month: mKey.label,
                    utilization: Math.round((demand / capacity) * 100),
                    excessHours: Math.round(demand - capacity)
                });
            }
        });

        return { 
            chartData: finalChartData, 
            resourceMatrix: resData, 
            roleAggregates: finalRoleData, 
            conflicts: finalConflicts 
        };

    }, [state.projects, state.resources, viewHorizon, monthBuckets]);


    // --- Helper for Heatmap Colors ---
    const getCellColor = (demand: number, capacity: number) => {
        const util = capacity > 0 ? (demand / capacity) * 100 : 0;
        if (util === 0) return 'bg-slate-50 text-slate-300';
        if (util < 80) return 'bg-green-50 text-green-700';
        if (util <= 100) return 'bg-blue-50 text-blue-700';
        if (util <= 115) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-700 font-bold';
    };

    const roles = Array.from(new Set(state.resources.map(r => r.role)));
    
    // Filtered resources for heatmap
    const displayResources = state.resources.filter(r => 
        r.status === 'Active' && (roleFilter === 'All' || r.role === roleFilter)
    );

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className={theme.typography.h2}>Resource Capacity Planning</h2>
                    <p className={theme.typography.small}>Balance portfolio demand against enterprise resource constraints.</p>
                </div>
                
                <div className="flex flex-wrap gap-2 items-center">
                     {/* View Horizon */}
                     <div className="bg-white border border-slate-200 rounded-lg p-1 flex text-xs font-medium">
                        {[3, 6, 12].map(m => (
                             <button 
                                key={m}
                                onClick={() => setViewHorizon(m)} 
                                className={`px-3 py-1.5 rounded transition-colors ${viewHorizon === m ? 'bg-nexus-100 text-nexus-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                {m} Mo
                            </button>
                        ))}
                    </div>

                    {/* View Mode */}
                    <div className="bg-white border border-slate-200 rounded-lg p-1 flex text-xs font-medium">
                        <button 
                            onClick={() => setViewMode('chart')} 
                            className={`flex items-center gap-1 px-3 py-1.5 rounded transition-colors ${viewMode === 'chart' ? 'bg-nexus-100 text-nexus-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <BarChart2 size={14}/> Chart
                        </button>
                        <button 
                            onClick={() => setViewMode('heatmap')} 
                            className={`flex items-center gap-1 px-3 py-1.5 rounded transition-colors ${viewMode === 'heatmap' ? 'bg-nexus-100 text-nexus-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <LayoutGrid size={14}/> Heatmap
                        </button>
                    </div>
                </div>
            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap} h-[500px]`}>
                {/* Main Visualization Area (2/3) */}
                <div className={`lg:col-span-2 ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm flex flex-col overflow-hidden`}>
                    
                    {viewMode === 'chart' ? (
                        <div className="flex-1 p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Users size={18} className="text-nexus-600"/> Portfolio Demand vs. Capacity
                                </h3>
                                <div className="flex gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-100 border border-blue-300"></div> Capacity</span>
                                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-500"></div> Demand</span>
                                    <span className="flex items-center gap-1"><div className="w-3 h-1 bg-yellow-500"></div> Utilization %</span>
                                </div>
                            </div>
                            <div className="flex-1 min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis yAxisId="left" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                                        <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 150]} />
                                        <Tooltip 
                                            labelStyle={{fontWeight:'bold'}}
                                            contentStyle={{borderRadius:'8px', border:'1px solid #e2e8f0'}}
                                        />
                                        <Area yAxisId="left" type="monotone" dataKey="Capacity" fill="#e0f2fe" stroke="#38bdf8" fillOpacity={0.6} />
                                        <Bar yAxisId="left" dataKey="Demand" fill="#64748b" barSize={32} radius={[4,4,0,0]} />
                                        <Line yAxisId="right" type="monotone" dataKey="Utilization" stroke="#eab308" strokeWidth={3} dot={{r:4}} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col">
                            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <LayoutGrid size={18} className="text-nexus-600"/> Resource Utilization Heatmap
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Filter size={14} className="text-slate-400"/>
                                    <select 
                                        value={roleFilter} 
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-nexus-500"
                                    >
                                        <option value="All">All Roles</option>
                                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto">
                                <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                                    <thead className="bg-slate-50 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200 sticky left-0 z-20 w-48 shadow-[1px_0_0_0_#e2e8f0]">Resource</th>
                                            {monthBuckets.map(m => (
                                                <th key={m.key} className="px-2 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200 min-w-[60px]">{m.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-100">
                                        {displayResources.map(r => (
                                            <tr key={r.id}>
                                                <td className="px-4 py-3 text-sm font-medium text-slate-700 bg-white border-r border-slate-100 sticky left-0 z-10 shadow-[1px_0_0_0_#f1f5f9]">
                                                    <div className="truncate w-40" title={r.name}>{r.name}</div>
                                                    <div className="text-xs text-slate-400 truncate w-40">{r.role}</div>
                                                </td>
                                                {monthBuckets.map(m => {
                                                    const demand = resourceMatrix[r.id]?.[m.key] || 0;
                                                    const capacity = r.capacity || 160;
                                                    const util = Math.round((demand / capacity) * 100);
                                                    return (
                                                        <td key={m.key} className="p-1">
                                                            <div 
                                                                className={`w-full h-full min-h-[32px] rounded flex items-center justify-center text-xs ${getCellColor(demand, capacity)}`}
                                                                title={`${Math.round(demand)}h / ${capacity}h (${util}%)`}
                                                            >
                                                                {util > 0 ? `${util}%` : '-'}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar: Role Breakdown & Conflicts (1/3) */}
                <div className="flex flex-col gap-6 h-full overflow-hidden">
                    {/* Role Utilization */}
                    <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm flex-1 flex flex-col overflow-hidden`}>
                        <h3 className="font-bold text-slate-800 mb-4 text-sm flex-shrink-0">Role Utilization (Avg)</h3>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                            {roleAggregates.map(role => (
                                <div key={role.role} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="font-medium text-slate-700">{role.role}</span>
                                        <span className={`font-bold ${role.utilization > 100 ? 'text-red-600' : role.utilization > 85 ? 'text-yellow-600' : 'text-green-600'}`}>
                                            {Math.round(role.utilization)}%
                                        </span>
                                    </div>
                                    <ProgressBar 
                                        value={role.utilization} 
                                        max={120} // Visual cap
                                        thresholds
                                        size="sm"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                        <span>Dem: {formatCompactCurrency(role.demand).replace('$','')}h</span>
                                        <span>Cap: {formatCompactCurrency(role.capacity).replace('$','')}h</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Conflicts Alert */}
                    <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex-shrink-0 max-h-[40%]`}>
                        <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex justify-between items-center">
                            <h3 className="font-bold text-red-900 text-xs flex items-center gap-2">
                                <AlertTriangle size={14}/> Over-Allocation Alerts
                            </h3>
                            <span className="bg-white text-red-700 text-[10px] px-2 py-0.5 rounded-full border border-red-200 font-bold">{conflicts.length}</span>
                        </div>
                        <div className="overflow-y-auto max-h-[150px]">
                            {conflicts.length > 0 ? (
                                <table className="min-w-full divide-y divide-slate-100">
                                    <tbody className="bg-white">
                                        {conflicts.map((c, idx) => (
                                            <tr key={idx} className="group">
                                                <td className="px-4 py-2">
                                                    <div className="text-xs font-bold text-slate-800">{c.resource}</div>
                                                    <div className="text-[10px] text-slate-500">{c.role}</div>
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <div className="text-xs font-bold text-red-600">{c.utilization}%</div>
                                                    <div className="text-[10px] text-red-400">{c.month}</div>
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <button className="text-[10px] font-bold text-nexus-600 hover:text-nexus-800 opacity-0 group-hover:opacity-100 transition-opacity">Resolve</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-4 text-center text-xs text-slate-400 italic">
                                    No critical conflicts detected in this horizon.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioCapacity;