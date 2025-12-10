import React, { useMemo } from 'react';
import { useProjectState } from '../../hooks';
import { calculateProjectProgress } from '../../utils/calculations';
import { getDaysDiff } from '../../utils/dateUtils';
import { BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../shared/StatCard';

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

    // Planned Value (PV) - Budgeted cost of work scheduled as of today
    const pv = (daysElapsed / totalProjectDays) * project.originalBudget;
    
    // Earned Value (EV) - Budgeted cost of work performed
    const ev = project.originalBudget * (calculateProjectProgress(project) / 100);

    // Actual Cost (AC)
    const ac = project.spent;
    
    const sv = ev - pv; // Schedule Variance
    const cv = ev - ac; // Cost Variance
    const spi = pv > 0 ? (ev / pv).toFixed(2) : '1.00'; // Schedule Performance Index
    const cpi = ac > 0 ? (ev / ac).toFixed(2) : '1.00'; // Cost Performance Index
    
    const bac = project.originalBudget; // Budget at Completion
    const eac = cpi !== '0.00' && parseFloat(cpi) > 0 ? (bac / parseFloat(cpi)) : Infinity; // Estimate at Completion
    const etc = eac - ac; // Estimate to Complete
    const vac = bac - eac; // Variance at Completion

    return { pv, ev, ac, sv, cv, spi, cpi, bac, eac, etc, vac };
  }, [project]);

  if (!evm) return null;
  const { pv, ev, ac, sv, cv, spi, cpi, bac, eac, etc, vac } = evm;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="SPI" value={spi} subtext="Schedule Performance" trend={parseFloat(spi) >= 1 ? 'up' : 'down'} icon={BarChart2}/>
          <StatCard title="CPI" value={cpi} subtext="Cost Performance" trend={parseFloat(cpi) >= 1 ? 'up' : 'down'} icon={BarChart2}/>
          <StatCard title="Schedule Variance" value={`$${(sv / 1000).toFixed(0)}k`} subtext="EV - PV" trend={sv >= 0 ? 'up' : 'down'} icon={BarChart2}/>
          <StatCard title="Cost Variance" value={`$${(cv / 1000).toFixed(0)}k`} subtext="EV - AC" trend={cv >= 0 ? 'up' : 'down'} icon={BarChart2}/>
       </div>

       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <h3 className="font-bold text-slate-800 mb-4">Core EVM Metrics (S-Curve)</h3>
         <div className="h-64">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={[{name: project.startDate, pv: 0, ev: 0, ac: 0}, {name: 'Today', pv, ev, ac}, {name: project.endDate, pv: bac, ev: null, ac: null}]}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} />
               <XAxis dataKey="name" tick={{fontSize: 12}} />
               <YAxis tickFormatter={v => `$${v/1000}k`} />
               <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
               <Legend />
               <Line type="monotone" dataKey="pv" name="Planned Value" stroke="#94a3b8" strokeWidth={2} dot={false} />
               <Line type="monotone" dataKey="ev" name="Earned Value" stroke="#22c55e" strokeWidth={2} />
               <Line type="monotone" dataKey="ac" name="Actual Cost" stroke="#ef4444" strokeWidth={2} />
             </LineChart>
           </ResponsiveContainer>
         </div>
       </div>

       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Forecasting</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="BAC" value={`$${(bac / 1000).toFixed(0)}k`} subtext="Budget at Completion" icon={BarChart2}/>
              <StatCard title="EAC" value={isFinite(eac) ? `$${(eac / 1000).toFixed(0)}k` : 'N/A'} subtext="Estimate at Completion" icon={BarChart2}/>
              <StatCard title="ETC" value={isFinite(etc) ? `$${(etc / 1000).toFixed(0)}k` : 'N/A'} subtext="Estimate to Complete" icon={BarChart2}/>
              <StatCard title="VAC" value={isFinite(vac) ? `$${(vac / 1000).toFixed(0)}k` : 'N/A'} subtext="Variance at Completion" trend={!isFinite(vac) || vac >=0 ? 'up' : 'down'} icon={BarChart2}/>
           </div>
       </div>
    </div>
  );
};

export default EarnedValue;
