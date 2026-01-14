import React from 'react';
import { useTheme } from '../../context/ThemeContext';
// Added RefreshCw and TrendingUp to the main lucide-react import to fix "Cannot find name" errors
import { LayoutGrid, BarChart2, Activity, Filter, Layers, RefreshCw, TrendingUp } from 'lucide-react';
import { usePortfolioCapacityLogic } from '../../hooks/domain/usePortfolioCapacityLogic';
import { CapacityHeatmap } from './capacity/CapacityHeatmap';
import { EmptyGrid } from '../common/EmptyGrid';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatCompactCurrency } from '../../utils/formatters';

const PortfolioCapacity: React.FC = () => {
    const theme = useTheme();
    const { 
        isPending, viewMode, monthBuckets, resourceMatrix, 
        displayResources, chartData, changeViewMode, roles, changeRoleFilter, roleFilter
    } = usePortfolioCapacityLogic();

    if (displayResources.length === 0) {
        return (
            <div className="h-full flex items-center justify-center p-12">
                <EmptyGrid 
                    title="Capacity Model Isolated"
                    description="No active resources found in the organization pool to analyze demand patterns."
                    icon={Activity}
                    actionLabel="Provision Resources"
                    onAdd={() => {}} // Navigation to resource pool
                />
            </div>
        );
    }

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-500 scrollbar-thin`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                <div>
                    <h2 className={theme.typography.h2}>Portfolio Capacity Matrix</h2>
                    <p className={theme.typography.small}>Multi-tenant resource loading and bottleneck detection.</p>
                </div>
                <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                    <div className="flex gap-1 pr-3 border-r border-slate-100">
                        <button onClick={() => changeViewMode('chart')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${viewMode === 'chart' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><BarChart2 size={14}/> Chart</button>
                        <button onClick={() => changeViewMode('heatmap')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${viewMode === 'heatmap' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutGrid size={14}/> Heatmap</button>
                    </div>
                    <div className="px-3 flex items-center gap-2">
                        <Filter size={14} className="text-slate-400"/>
                        <select 
                            className="text-[10px] font-black uppercase bg-transparent outline-none focus:ring-0 cursor-pointer text-slate-700"
                            value={roleFilter}
                            onChange={(e) => changeRoleFilter(e.target.value)}
                        >
                            <option value="All">All Roles</option>
                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative">
                {isPending && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[1px]">
                        <RefreshCw className="animate-spin text-nexus-600 mb-2" size={32}/>
                        <span className="text-[10px] font-black uppercase text-nexus-700 tracking-widest">Aggregating Demand Grid...</span>
                    </div>
                )}
                
                {viewMode === 'heatmap' ? (
                    <CapacityHeatmap resources={displayResources} monthBuckets={monthBuckets} matrix={resourceMatrix} />
                ) : (
                    <div className={`${theme.components.card} p-8 h-full flex flex-col shadow-inner bg-slate-50/50`}>
                        <div className="flex justify-between items-center mb-8">
                             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp size={16} className="text-nexus-600" /> Organizational Utilization Forecast
                             </h3>
                             <div className="flex gap-4 text-[9px] font-black uppercase text-slate-400">
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-200"></div> Total Capacity</span>
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-nexus-500 shadow-[0_0_5px_#0ea5e9]"></div> Demand</span>
                             </div>
                        </div>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                                    <XAxis dataKey="name" tick={{fontSize: 10, fontStyle: 'bold'}} />
                                    <YAxis tickFormatter={(v) => `${v}h`} tick={{fontSize: 10}} />
                                    <Tooltip contentStyle={theme.charts.tooltip} />
                                    <Legend wrapperStyle={{paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold'}} />
                                    <Bar dataKey="Demand" fill={theme.charts.palette[0]} barSize={40} radius={[8,8,0,0]} />
                                    <Line type="stepAfter" dataKey="Capacity" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Pool Limit" dot={false} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="bg-slate-900 rounded-2xl p-4 text-white flex justify-between items-center shadow-xl">
                 <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-slate-400">
                     <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Nominal (&lt;80%)</span>
                     <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Optimal (80-100%)</span>
                     <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div> Saturated (&gt;110%)</span>
                 </div>
                 <div className="flex items-center gap-2 text-nexus-400">
                    <Layers size={14}/>
                    <span className="text-[10px] font-mono font-black">ENT_CAP_V2.4</span>
                 </div>
            </div>
        </div>
    );
};

export default PortfolioCapacity;