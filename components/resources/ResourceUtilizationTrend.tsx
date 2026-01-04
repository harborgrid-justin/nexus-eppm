
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getDaysDiff } from '../../utils/dateUtils';

export const ResourceUtilizationTrend: React.FC = () => {
  const { state } = useData();
  const theme = useTheme();

  const utilizationTrend = useMemo(() => {
     // 1. Setup Time Horizon (Next 6 Months)
     const today = new Date();
     const months = [];
     for (let i = 0; i < 6; i++) {
         const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
         months.push({
             date: d,
             name: d.toLocaleString('default', { month: 'short' }),
             totalHours: 0,
             capacity: 0
         });
     }

     // 2. Calculate Total Capacity (Denominator)
     // Sum of all active resources capacity per month
     const totalMonthlyCapacity = state.resources
        .filter(r => r.status === 'Active')
        .reduce((sum, r) => sum + (r.capacity || 160), 0);

     months.forEach(m => m.capacity = totalMonthlyCapacity);

     // 3. Calculate Demand (Numerator) - Iterate ALL Projects/Tasks
     state.projects.forEach(p => {
         p.tasks.forEach(t => {
             if (t.status === 'Completed' || !t.assignments || t.assignments.length === 0) return;

             const start = new Date(t.startDate);
             const end = new Date(t.endDate);

             // For each assignment on this task
             t.assignments.forEach(assign => {
                 // Calculate daily load: (Units / 100) * 8 hours
                 const dailyLoad = (assign.units / 100) * 8;

                 // Check overlap with each month in horizon
                 months.forEach(month => {
                     const monthStart = new Date(month.date.getFullYear(), month.date.getMonth(), 1);
                     const monthEnd = new Date(month.date.getFullYear(), month.date.getMonth() + 1, 0);

                     const overlapStart = start > monthStart ? start : monthStart;
                     const overlapEnd = end < monthEnd ? end : monthEnd;

                     if (overlapStart <= overlapEnd) {
                         const days = getDaysDiff(overlapStart, overlapEnd) + 1;
                         // Add hours to that month's bucket
                         month.totalHours += (days * dailyLoad);
                     }
                 });
             });
         });
     });
     
     // 4. Transform to Chart Data
     return months.map(m => {
         const util = m.capacity > 0 ? (m.totalHours / m.capacity) * 100 : 0;
         return { 
             month: m.name, 
             util: Math.round(Math.min(100, Math.max(0, util))),
             hours: Math.round(m.totalHours),
             cap: m.capacity
         }; 
     });

  }, [state.projects, state.resources]);

  return (
    <div className={`${theme.components.card} ${theme.layout.cardPadding} h-full flex flex-col`}>
        <div className="flex justify-between items-center mb-6">
            <h3 className={`${theme.typography.h3} flex items-center gap-2`}>
                <Activity size={18} className="text-green-600"/> Utilization Trend (6 Mo)
            </h3>
            <div className="text-xs text-slate-500 font-mono">
                Avg: {Math.round(utilizationTrend.reduce((a,b)=>a+b.util,0)/utilizationTrend.length)}%
            </div>
        </div>
        <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={utilizationTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                    <XAxis dataKey="month" tick={{fontSize: 12}} />
                    <YAxis unit="%" domain={[0, 100]} tick={{fontSize: 12}} />
                    <Tooltip 
                        contentStyle={theme.charts.tooltip}
                        formatter={(val: number, name: string, props: any) => {
                            if (name === 'util') return [`${val}%`, 'Utilization'];
                            return [val, name];
                        }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="util" 
                        stroke={theme.charts.palette[1]} 
                        fill={theme.colors.semantic.success.bg.replace('bg-', 'fill-')} 
                        strokeWidth={2} 
                        fillOpacity={0.4}
                        name="util" 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};
