import React, { useMemo } from 'react';
import { useProjectState } from '../../hooks';
import { calculateProjectProgress } from '../../utils/calculations';
import { getDaysDiff } from '../../utils/dateUtils';
import { BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency } from '../../utils/formatters';

interface EarnedValueProps {
  projectId: string;
}

const EarnedValue: React.FC<EarnedValueProps> = ({ projectId }) => {
  const { project } = useProjectState(projectId);

  const evm = useMemo(() => {
    if (!project) return null;
    
    const today = new Date();
    const projectStart = new Date(project.startDate);
    const totalProjectDays = getDaysDiff(projectStart, new Date(project.endDate));
    const daysElapsed = getDaysDiff(projectStart, today);

    const pv = totalProjectDays > 0 ? (daysElapsed / totalProjectDays) * project.originalBudget : 0;
    const ev = project.originalBudget * (calculateProjectProgress(project) / 100);
    const ac = project.spent;
    
    const sv = ev - pv;
    const cv = ev - ac;
    const spi = pv > 0 ? (ev / pv) : 1;
    const cpi = ac > 0 ? (ev / ac) : 1;
    
    const bac = project.originalBudget;
    const eac = cpi > 0 ? (bac / cpi) : Infinity;
    const etc = eac - ac;
    const vac = bac - eac;

    return { pv, ev, ac, sv, cv, spi: spi.toFixed(2), cpi: cpi.toFixed(2), bac, eac, etc, vac };
  }, [project]);

   const chartData = useMemo(() => {
    if (!project || !evm) return [];

    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    const today = new Date();
    const bac = project.originalBudget;
    const totalDays = getDaysDiff(startDate, endDate);
    if (totalDays <= 0) return [];

    const data = [];
    
    // Generate points for PV curve
    for (let i = 0; i <= totalDays; i += 30) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const pv = (i / totalDays) * bac;
      data.push({ date: date.toISOString().split('T')[0], pv });
    }
    if (getDaysDiff(startDate, endDate) % 30 !== 0) {
        data.push({ date: endDate.toISOString().split('T')[0], pv: bac });
    }

    // Merge EV and AC points
    const daysElapsed = getDaysDiff(startDate, today);
    const finalData = data.map(d => {
        const pointDate = new Date(d.date);
        if (pointDate > today) {
            return { ...d, ev: null, ac: null };
        }
        const pointDaysElapsed = getDaysDiff(startDate, pointDate);
        const timeRatio = daysElapsed > 0 ? pointDaysElapsed / daysElapsed : 0;
        return {
            ...d,
            ev: evm.ev * timeRatio,
            ac: evm.ac * timeRatio,
        };
    }).map(d => ({...d, date: new Date(d.date).toLocaleDateString('en-US', {month: 'short'})}));

    return finalData;
  }, [project, evm]);

  if (!evm) return null;
  const { sv, cv, spi, cpi, bac, eac, etc, vac } = evm;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="SPI" value={spi} subtext="Schedule Performance" trend={parseFloat(spi) >= 1 ? 'up' : 'down'} icon={BarChart2}/>
          <StatCard title="CPI" value={cpi} subtext="Cost Performance" trend={parseFloat(cpi) >= 1 ? 'up' : 'down'} icon={BarChart2}/>
          <StatCard title="Schedule Variance" value={formatCompactCurrency(sv)} subtext="EV - PV" trend={sv >= 0 ? 'up' : 'down'} icon={BarChart2}/>
          <StatCard title="Cost Variance" value={formatCompactCurrency(cv)} subtext="EV - AC" trend={cv >= 0 ? 'up' : 'down'} icon={BarChart2}/>
       </div>

       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <h3 className="font-bold text-slate-800 mb-4">Core EVM Metrics (S-Curve)</h3>
         <div className="h-64">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={chartData}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} />
               <XAxis dataKey="date" tick={{fontSize: 12}} />
               <YAxis tickFormatter={v => formatCompactCurrency(v)} />
               <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
               <Legend />
               <Line type="monotone" dataKey="pv" name="Planned Value" stroke="#94a3b8" strokeWidth={2} dot={false} connectNulls />
               <Line type="monotone" dataKey="ev" name="Earned Value" stroke="#22c55e" strokeWidth={2} connectNulls />
               <Line type="monotone" dataKey="ac" name="Actual Cost" stroke="#ef4444" strokeWidth={2} connectNulls />
             </LineChart>
           </ResponsiveContainer>
         </div>
       </div>

       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Forecasting</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="BAC" value={formatCompactCurrency(bac)} subtext="Budget at Completion" icon={BarChart2}/>
              <StatCard title="EAC" value={isFinite(eac) ? formatCompactCurrency(eac) : 'N/A'} subtext="Estimate at Completion" icon={BarChart2}/>
              <StatCard title="ETC" value={isFinite(etc) ? formatCompactCurrency(etc) : 'N/A'} subtext="Estimate to Complete" icon={BarChart2}/>
              <StatCard title="VAC" value={isFinite(vac) ? formatCompactCurrency(vac) : 'N/A'} subtext="Variance at Completion" trend={!isFinite(vac) || vac >=0 ? 'up' : 'down'} icon={BarChart2}/>
           </div>
       </div>
    </div>
  );
};

export default EarnedValue;
