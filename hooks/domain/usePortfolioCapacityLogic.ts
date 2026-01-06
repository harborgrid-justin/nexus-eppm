import { useState, useMemo, useTransition } from 'react';
import { useData } from '../../context/DataContext';

export const usePortfolioCapacityLogic = () => {
    const { state } = useData();
    const [viewHorizon, setViewHorizon] = useState(6); // Months
    const [viewMode, setViewMode] = useState<'chart' | 'heatmap'>('chart');
    const [roleFilter, setRoleFilter] = useState('All');
    
    // Pattern 1: startTransition for heavy recalculation triggers
    const [isPending, startTransition] = useTransition();

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

    const displayResources = useMemo(() => state.resources.filter(r => 
        r.status === 'Active' && (roleFilter === 'All' || r.role === roleFilter)
    ), [state.resources, roleFilter]);

    const roles = useMemo(() => Array.from(new Set(state.resources.map(r => r.role))), [state.resources]);

    // Helpers
    const changeHorizon = (h: number) => startTransition(() => setViewHorizon(h));
    const changeViewMode = (m: 'chart' | 'heatmap') => setViewMode(m);
    const changeRoleFilter = (r: string) => setRoleFilter(r);

    return {
        isPending,
        viewHorizon,
        viewMode,
        roleFilter,
        monthBuckets,
        chartData,
        resourceMatrix,
        roleAggregates,
        conflicts,
        displayResources,
        roles,
        changeHorizon,
        changeViewMode,
        changeRoleFilter
    };
};