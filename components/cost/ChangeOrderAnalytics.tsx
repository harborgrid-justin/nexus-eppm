import React from 'react';
import { ChangeOrder } from '../../types/index';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useTheme } from '../../context/ThemeContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BarChart2, PieChart as PieIcon, TrendingUp, DollarSign } from 'lucide-react';
import { formatCompactCurrency } from '../../utils/formatters';

const ChangeOrderAnalytics: React.FC = () => {
    const { changeOrders } = useProjectWorkspace();
    const theme = useTheme();

    const categoryData = React.useMemo(() => {
        const dist: Record<string, number> = {};
        changeOrders.forEach(co => dist[co.category] = (dist[co.category] || 0) + 1);
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    }, [changeOrders]);

    const budgetData = React.useMemo(() => {
        return changeOrders.map(co => ({
            name: co.id,
            val: co.amount,
            status: co.status
        })).slice(0, 10);
    }, [changeOrders]);

    if (changeOrders.length === 0) {
        return (
            <div className="h-full flex items-center justify-center p-12 text-slate-400 nexus-empty-pattern rounded-[2.5rem] border-2 border-dashed m-6">
                <div className="text-center">
                    <BarChart2 size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="font-black uppercase tracking-widest text-xs">Analytics Buffer Offline</p>
                    <p className="text-[10px] mt-1 font-bold">Requires approved change order artifacts.</p>
                </div>
            </div>
        );
    }

    return (
      <div className={`h-full overflow-y-auto p-10 space-y-10 animate-nexus-in scrollbar-thin ${theme.colors.background}/30`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className={`${theme.components.card} p-8 rounded-[2.5rem] bg-white border-slate-100 shadow-sm h-[400px] flex flex-col`}>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-50 pb-3 flex items-center gap-2">
                    <PieIcon size={16} className="text-purple-600"/> Variance Root Causes
                  </h3>
                  <div className="flex-1 min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                                  {categoryData.map((e, i) => <Cell key={`c-${i}`} fill={theme.charts.palette[i % theme.charts.palette.length]} stroke="rgba(0,0,0,0)" />)}
                              </Pie>
                              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold' }} />
                          </PieChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              <div className={`${theme.components.card} p-8 rounded-[2.5rem] bg-white border-slate-100 shadow-sm h-[400px] flex flex-col`}>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-50 pb-3 flex items-center gap-2">
                    <DollarSign size={16} className="text-green-600"/> Value Distribution
                  </h3>
                  <div className="flex-1 min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={budgetData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                              <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                              <YAxis tickFormatter={(v) => formatCompactCurrency(v)} tick={{fontSize: 10, fontWeight: 'bold'}} axisLine={false} />
                              <Tooltip formatter={(v: number) => formatCompactCurrency(v)} contentStyle={theme.charts.tooltip} />
                              <Bar dataKey="val" fill={theme.charts.palette[0]} radius={[8, 8, 0, 0]} barSize={20} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>
          
          <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-32 bg-nexus-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-nexus-500/20 transition-colors duration-1000"></div>
               <div className="relative z-10">
                   <h4 className="font-black text-xs uppercase tracking-[0.3em] text-nexus-400 mb-4 flex items-center gap-3">
                       <TrendingUp size={20} /> Cumulative Fiscal Drift
                   </h4>
                   <p className="text-slate-400 max-w-xl text-sm leading-relaxed font-medium uppercase tracking-tight">
                        Aggregate unapproved exposure represents <span className="text-white font-black">12.4%</span> of the original baseline. Continued drift without reconciliation threatens target completion reliability.
                   </p>
               </div>
               <div className="text-right shrink-0 relative z-10">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Exposure (All Types)</p>
                   <p className="text-4xl font-black font-mono tracking-tighter text-white">
                        {formatCompactCurrency(changeOrders.reduce((s,c)=>s+c.amount,0))}
                   </p>
               </div>
          </div>
      </div>
    );
};
export default ChangeOrderAnalytics;