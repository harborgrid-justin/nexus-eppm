
import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';
import { Users, AlertTriangle, ArrowRight } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

const PortfolioCapacity: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const [viewHorizon, setViewHorizon] = useState(6); // Months

    // --- 1. Calculate Aggregate Supply & Demand ---
    const capacityData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        
        const data = [];
        
        for (let i = 0; i < viewHorizon; i++) {
            const monthIndex = (currentMonth + i) % 12;
            const monthName = months[monthIndex];
            
            // Supply: Sum of all active resource capacities (in hours/month approx 160)
            const totalSupplyHours = state.resources
                .filter(r => r.status === 'Active')
                .reduce((sum, r) => sum + (r.capacity * 4), 0); // Weekly cap * 4

            // Demand: Sum of all task assignments active in this month
            const totalDemandHours = state.projects.reduce((projSum, proj) => {
                const baseLoad = proj.tasks.length * 20; 
                const randomVar = Math.sin(i + proj.id.length) * 50; 
                return projSum + baseLoad + Math.abs(randomVar);
            }, 0);

            data.push({
                name: monthName,
                Capacity: totalSupplyHours,
                Demand: Math.round(totalDemandHours),
                Utilization: Math.round((totalDemandHours / totalSupplyHours) * 100)
            });
        }
        return data;
    }, [state.resources, state.projects, viewHorizon]);

    // --- 2. Role-based Bottlenecks ---
    const roleAnalysis = useMemo(() => {
        const roles = Array.from(new Set(state.resources.map(r => r.role)));
        return roles.map(role => {
            const roleResources = state.resources.filter(r => r.role === role);
            const totalCap = roleResources.reduce((sum, r) => sum + r.capacity, 0);
            const totalAlloc = roleResources.reduce((sum, r) => sum + r.allocated, 0);
            return {
                role,
                capacity: totalCap,
                allocated: totalAlloc,
                utilization: totalCap > 0 ? (totalAlloc / totalCap) * 100 : 0
            };
        }).sort((a, b) => b.utilization - a.utilization);
    }, [state.resources]);

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in duration-300`}>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className={theme.typography.h2}>Resource Capacity & Demand Management</h2>
                    <p className={theme.typography.small}>Ensure resource availability aligns with portfolio demand.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-1 flex text-xs font-medium">
                    <button onClick={() => setViewHorizon(6)} className={`px-3 py-1 rounded ${viewHorizon === 6 ? 'bg-nexus-100 text-nexus-700' : 'text-slate-600'}`}>6 Months</button>
                    <button onClick={() => setViewHorizon(12)} className={`px-3 py-1 rounded ${viewHorizon === 12 ? 'bg-nexus-100 text-nexus-700' : 'text-slate-600'}`}>12 Months</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Supply/Demand Chart */}
                <div className={`lg:col-span-2 ${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm h-[400px]`}>
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Users size={18} className="text-nexus-600"/> Portfolio Demand vs. Capacity
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={capacityData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                            <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 150]} />
                            <Tooltip />
                            <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="Capacity" fill="#e0f2fe" stroke="#0ea5e9" fillOpacity={0.4} />
                            <Bar yAxisId="left" dataKey="Demand" fill="#64748b" barSize={30} />
                            <Line yAxisId="right" type="monotone" dataKey="Utilization" stroke="#f59e0b" strokeWidth={2} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Role Bottlenecks */}
                <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-orange-500"/> Critical Roles
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {roleAnalysis.map((role) => (
                            <div key={role.role} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-slate-700">{role.role}</span>
                                    <span className={`font-bold ${role.utilization > 100 ? 'text-red-600' : role.utilization > 85 ? 'text-yellow-600' : 'text-green-600'}`}>
                                        {Math.round(role.utilization)}%
                                    </span>
                                </div>
                                <ProgressBar 
                                    value={role.utilization} 
                                    max={100} // Allow overflow visual in component logic
                                    thresholds 
                                />
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Alloc: {role.allocated}h</span>
                                    <span>Cap: {role.capacity}h</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <button className="w-full py-2 text-sm text-nexus-600 font-medium bg-nexus-50 hover:bg-nexus-100 rounded-lg flex items-center justify-center gap-2">
                            Re-balance Resources <ArrowRight size={14}/>
                        </button>
                    </div>
                </div>
            </div>

            {/* Over-Allocation Alerts */}
            <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
                <div className="bg-red-50 px-6 py-3 border-b border-red-100 flex justify-between items-center">
                    <h3 className="font-bold text-red-900 text-sm">Detected Over-Allocations</h3>
                    <span className="bg-white text-red-700 text-xs px-2 py-0.5 rounded-full border border-red-200 font-bold">3 Conflicts</span>
                </div>
                <table className="min-w-full divide-y divide-slate-200">
                    <tbody className="bg-white divide-y divide-slate-100">
                        {[
                            { res: 'Sarah Chen', role: 'Project Manager', impact: '120% in Aug', action: 'Shift P1002 Start Date' },
                            { res: 'Mike Ross', role: 'Civil Engineer', impact: '115% in Sep', action: 'Request Contractor Support' },
                            { res: 'Excavator EX-250', role: 'Heavy Equipment', impact: 'Conflict: P1001 & P1003', action: 'Sequence Activities' }
                        ].map((item, idx) => (
                            <tr key={idx}>
                                <td className="px-6 py-3 text-sm font-medium text-slate-900">{item.res}</td>
                                <td className="px-6 py-3 text-sm text-slate-500">{item.role}</td>
                                <td className="px-6 py-3 text-sm text-red-600 font-medium">{item.impact}</td>
                                <td className="px-6 py-3 text-sm text-slate-700">
                                    <span className="font-semibold text-slate-500 mr-2">Suggestion:</span> 
                                    {item.action}
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <button className="text-xs text-nexus-600 font-bold hover:underline">Resolve</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PortfolioCapacity;
